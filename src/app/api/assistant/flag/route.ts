import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  threadId: z.string().min(1),
  messageId: z.string().min(1),
  flagged: z.boolean(),
});

export async function PATCH(request: Request) {
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    const { result } = await getStore().mutate((state) => {
      const thread = state.threads.find((item) => item.id === parsed.data.threadId);
      if (!thread) throw new Error("Thread not found.");
      const message = thread.messages.find(
        (item) => item.id === parsed.data.messageId,
      );
      if (!message) throw new Error("Message not found.");
      message.flagged = parsed.data.flagged;
      return message;
    });
    return NextResponse.json(
      { ok: true, message: result },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not update the message.",
      404,
    );
  }
}
