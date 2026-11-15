import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  buildAssistantWelcome,
} from "@/lib/engine/assistant";
import {
  aiStatus,
  generateAssistantReply,
} from "@/lib/engine/assistant-service";
import type { AssistantMessage, AssistantThread } from "@/lib/types";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  message: z.string().trim().min(1).max(4000).optional(),
  threadId: z.string().min(1).nullable().optional(),
  regenerate: z.boolean().optional(),
});

const titleFor = (message: string) => {
  const clean = message.replace(/\s+/g, " ").trim();
  if (clean.length <= 48) return clean;
  return `${clean.slice(0, 47).trimEnd()}…`;
};

const toMessage = (
  role: "user" | "assistant",
  content: string,
  memoryUsed?: string[],
): AssistantMessage => ({
  id: newId("msg"),
  role,
  content,
  at: new Date().toISOString(),
  memoryUsed,
});

export async function GET() {
  const state = await getStore().read();
  const latest = [...state.threads].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];
  return NextResponse.json(
    {
      thread: latest ?? null,
      welcome: buildAssistantWelcome(state),
      ai: aiStatus(),
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, RATE_LIMITS.assistant);
  if (limited) return limited;

  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;
  const { message, threadId, regenerate } = parsed.data;

  if (!message && !regenerate) {
    return jsonError("A message is required.");
  }

  let prompt = message ?? "";
  let targetThreadId = threadId;

  try {
    const { result: prepared } = await getStore().mutate((state) => {
      if (regenerate) {
        if (!threadId) throw new Error("A thread is required to regenerate.");
        const thread = state.threads.find((item) => item.id === threadId);
        if (!thread) throw new Error("Thread not found.");
        while (
          thread.messages.length > 0 &&
          thread.messages[thread.messages.length - 1].role === "assistant"
        ) {
          thread.messages.pop();
        }
        const lastUser = [...thread.messages]
          .reverse()
          .find((item) => item.role === "user");
        if (!lastUser) throw new Error("There is no message to regenerate.");
        thread.updatedAt = new Date().toISOString();
        return { state, thread, prompt: lastUser.content };
      }

      let thread: AssistantThread | undefined;
      if (threadId) {
        thread = state.threads.find((item) => item.id === threadId);
        if (!thread) throw new Error("Thread not found.");
      } else {
        thread = {
          id: newId("thread"),
          title: titleFor(message ?? "New conversation"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        state.threads.unshift(thread);
      }

      thread.messages.push(toMessage("user", message ?? ""));
      if (thread.messages.length === 1) {
        thread.title = titleFor(message ?? "New conversation");
      }
      thread.updatedAt = new Date().toISOString();
      if (thread.messages.length > 100) {
        thread.messages = thread.messages.slice(-100);
      }
      return { state, thread, prompt: message ?? "" };
    });

    prompt = prepared.prompt;
    targetThreadId = prepared.thread.id;

    const reply = await generateAssistantReply(prepared.state, prompt);

    const { result: saved } = await getStore().mutate((state) => {
      const thread = state.threads.find((item) => item.id === targetThreadId);
      if (!thread) throw new Error("Thread not found.");
      const assistantMessage = toMessage(
        "assistant",
        reply.text,
        reply.memoryUsed,
      );
      thread.messages.push(assistantMessage);
      thread.updatedAt = new Date().toISOString();
      return { thread, assistantMessage };
    });

    return NextResponse.json(
      {
        thread: saved.thread,
        reply: saved.assistantMessage,
        mode: reply.mode,
        memoryUsed: reply.memoryUsed,
        suggestedPrompts: reply.suggestedPrompts,
        ai: aiStatus(),
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not answer right now.",
      error instanceof Error && error.message.includes("not found") ? 404 : 400,
    );
  }
}
