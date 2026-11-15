import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { bandForAge } from "@/content/assessments";
import { createChildProfile } from "@/lib/engine/child-profile";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";
import { ageFromBirthDate } from "@/lib/date";

export const dynamic = "force-dynamic";

const schema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionIndex: z.number().int().min(0).max(20),
      }),
    )
    .min(1)
    .max(30),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(request, RATE_LIMITS.assessment);
  if (limited) return limited;

  const { id } = await params;
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    const { state, result } = await getStore().mutate((state) => {
      const child = state.children.find((item) => item.id === id);
      if (!child) throw new Error("Child not found.");
      const age = ageFromBirthDate(child.birthDate);
      const band = bandForAge(age);
      const { profile, assessment } = createChildProfile({
        child,
        ageBand: band.id,
        answers: parsed.data.answers,
      });
      child.profile = profile;
      child.assessments.push(assessment);
      syncMemory(state);
      return { profile, assessment };
    });

    return NextResponse.json(
      { ...stateView(state), ...result },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not save the discovery.",
      400,
    );
  }
}
