import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  speakerId: z.string().min(1).max(128),
  text: z.string().trim().min(1).max(4000),
});

const normalize = (value: string) =>
  value.replace(/\s+/g, " ").trim().toLowerCase();

/**
 * The browser receives LiveKit transcriptions for both the parent's STT and
 * Kinora's TTS. It posts final segments here so the app's transcript, memory,
 * and summary stay in sync with the voice agent.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(request, RATE_LIMITS.transcript);
  if (limited) return limited;

  const { id } = await params;
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    const { state, result: session } = await getStore().mutate((state) => {
      const session = state.sessions.find((item) => item.id === id);
      if (!session) throw new Error("Session not found.");
      if (session.status === "completed") {
        throw new Error("This session is already complete.");
      }

      const isKinora =
        parsed.data.speakerId === "kinora" ||
        parsed.data.speakerId.startsWith("agent-");
      const speaker = isKinora
        ? null
        : state.family.members.find(
            (member) => member.id === parsed.data.speakerId,
          );
      if (!isKinora && !speaker) {
        throw new Error("Speaker is not part of this family.");
      }

      const text = parsed.data.text.trim();
      const recent = session.turns.slice(-6);
      const duplicate = recent.some(
        (turn) =>
          (isKinora ? turn.speakerId === "kinora" : turn.speakerId === speaker?.id) &&
          normalize(turn.text) === normalize(text),
      );
      if (duplicate) {
        return session;
      }

      if (session.status === "scheduled") {
        session.status = "active";
        session.startedAt = new Date().toISOString();
      }

      session.turns.push({
        id: newId("turn"),
        speakerId: isKinora ? "kinora" : speaker!.id,
        speakerName: isKinora ? "Kinora" : speaker!.name,
        text,
        at: new Date().toISOString(),
        kind: "reflection",
        phase: session.phase,
      });

      syncMemory(state);
      return session;
    });

    return NextResponse.json(
      { ...stateView(state), session },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not save the transcript.",
      error instanceof Error && error.message.includes("not found") ? 404 : 400,
    );
  }
}
