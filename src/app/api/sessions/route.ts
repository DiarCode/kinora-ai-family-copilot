import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { createSession } from "@/lib/engine/psychologist";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";

export const dynamic = "force-dynamic";

const schema = z.object({
  problem: z.string().trim().min(3).max(2000),
  mode: z.enum(["voice", "text"]).default("text"),
  scheduledFor: z.string().datetime().optional(),
});

export async function GET() {
  const { state } = await getStore().read().then((state) => ({ state }));
  const sessions = [...state.sessions].sort((a, b) =>
    (b.startedAt ?? b.scheduledFor ?? b.createdAt).localeCompare(
      a.startedAt ?? a.scheduledFor ?? a.createdAt,
    ),
  );
  return NextResponse.json(
    { sessions, today: stateView(state).today },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, RATE_LIMITS.sessionCreate);
  if (limited) return limited;

  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    const { state, result: session } = await getStore().mutate((state) => {
      const session = createSession({
        family: state.family,
        problem: parsed.data.problem,
        mode: parsed.data.mode,
        scheduledFor: parsed.data.scheduledFor,
      });
      state.sessions.unshift(session);
      syncMemory(state);
      return session;
    });

    return NextResponse.json(
      { ...stateView(state), session },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create the session.",
    );
  }
}
