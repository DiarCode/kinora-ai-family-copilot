import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { generateKinoraTurn } from "@/lib/engine/psychologist-service";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  speakerId: z.string().min(1),
  text: z.string().trim().min(1).max(4000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(request, RATE_LIMITS.sessionTurn);
  if (limited) return limited;

  const { id } = await params;
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    // First write: append the parent's turn and return the latest session.
    const { result: sessionAfterParent } = await getStore().mutate(
      (state) => {
        const session = state.sessions.find((item) => item.id === id);
        if (!session) throw new Error("Session not found.");
        if (session.status === "completed") {
          throw new Error("This session is already complete.");
        }
        if (session.safetyFlagged) {
          throw new Error("This session is paused for safety.");
        }

        const speaker = state.family.members.find(
          (member) => member.id === parsed.data.speakerId,
        );
        if (!speaker) throw new Error("Speaker is not part of this family.");
        if (!session.participants.includes(speaker.id)) {
          throw new Error("Speaker is not part of this session.");
        }

        if (session.status === "scheduled") {
          session.status = "active";
          session.startedAt = new Date().toISOString();
        }

        session.turns.push({
          id: newId("turn"),
          speakerId: speaker.id,
          speakerName: speaker.name,
          text: parsed.data.text.trim(),
          at: new Date().toISOString(),
          kind: "reflection",
          phase: session.phase,
        });

        syncMemory(state);
        return { session, family: state.family };
      });

    // The LLM rewrite happens outside the store lock. It never changes the
    // phase/invite/safety decision, only the wording.
    const next = await generateKinoraTurn(
      sessionAfterParent.session,
      sessionAfterParent.family,
    );

    // Second write: append Kinora's reply (deterministic or polished).
    const { state: finalState, result } = await getStore().mutate((state) => {
      const session = state.sessions.find((item) => item.id === id);
      if (!session) throw new Error("Session not found.");

      let reply = null;
      if (next) {
        session.turns.push(next.turn);
        session.phase = next.phase;
        if (next.safetyFlagged) session.safetyFlagged = true;
        reply = next.turn;
      }

      syncMemory(state);
      return { session, reply };
    });

    return NextResponse.json(
      { ...stateView(finalState), ...result },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not add the turn.",
      error instanceof Error && error.message.includes("not found") ? 404 : 400,
    );
  }
}
