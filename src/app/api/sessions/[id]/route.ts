import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { buildSessionSummary } from "@/lib/engine/psychologist";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";

export const dynamic = "force-dynamic";

const schema = z.object({
  action: z.enum(["start", "complete", "accept"]),
  agreements: z.array(z.string().min(3).max(500)).max(6).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const state = await getStore().read();
  const session = state.sessions.find((item) => item.id === id);
  if (!session) return jsonError("Session not found.", 404);
  return NextResponse.json({ session });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    const { state, result: session } = await getStore().mutate((state) => {
      const session = state.sessions.find((item) => item.id === id);
      if (!session) throw new Error("Session not found.");
      const now = new Date();

      if (parsed.data.action === "start") {
        if (session.status === "completed") {
          throw new Error("This session is already complete.");
        }
        session.status = "active";
        session.startedAt = session.startedAt ?? now.toISOString();
      }

      if (parsed.data.action === "complete") {
        session.summary = session.summary ?? buildSessionSummary(session, state.family, now);
        session.status = "completed";
        session.completedAt = now.toISOString();
        session.phase = "close";
        session.recommendedCourseSlug = session.summary.recommendedCourseSlug;
      }

      if (parsed.data.action === "accept") {
        if (!session.summary) {
          session.summary = buildSessionSummary(session, state.family, now);
        }
        session.acceptedAgreements =
          parsed.data.agreements?.slice(0, session.summary.agreements.length) ??
          session.summary.agreements;
      }

      syncMemory(state);
      return session;
    });

    return NextResponse.json(
      { ...stateView(state), session },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not update the session.",
      error instanceof Error && error.message.includes("not found") ? 404 : 400,
    );
  }
}
