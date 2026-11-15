import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";
import { todayKey } from "@/lib/date";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  memberId: z.string().min(1),
  value: z.enum(["sunny", "cloudy", "rainy"]),
  note: z.string().max(240).optional(),
});

export async function POST(request: Request) {
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;
  const { memberId, value, note } = parsed.data;

  try {
    const { state } = await getStore().mutate((state) => {
      const member = state.family.members.find((item) => item.id === memberId);
      if (!member) throw new Error("Unknown family member.");
      const today = todayKey();
      const existing = state.moods.find(
        (mood) => mood.memberId === memberId && mood.date === today,
      );
      if (existing) {
        existing.value = value;
        existing.note = note ?? existing.note;
        existing.createdAt = new Date().toISOString();
      } else {
        state.moods.push({
          id: newId("mood"),
          memberId,
          date: today,
          value,
          note,
          createdAt: new Date().toISOString(),
        });
      }
      syncMemory(state);
      return true;
    });

    return NextResponse.json(stateView(state), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not save the mood.",
      400,
    );
  }
}
