import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";
import { ageFromBirthDate, todayKey } from "@/lib/date";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1).max(40),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a birth date in YYYY-MM-DD format."),
  avatarColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex color.")
    .optional(),
});

export async function POST(request: Request) {
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  const { name, birthDate, avatarColor } = parsed.data;
  const age = ageFromBirthDate(birthDate);
  if (age > 18) {
    return jsonError("Kinora is designed for children up to age 18.");
  }
  if (birthDate > todayKey()) {
    return jsonError("A birth date cannot be in the future.");
  }

  const { state, result: child } = await getStore().mutate((state) => {
    const child = {
      id: newId("child"),
      name,
      birthDate,
      avatarColor: avatarColor ?? "#7C9CF5",
      createdAt: new Date().toISOString(),
      assessments: [],
    };
    state.children.push(child);
    syncMemory(state);
    return child;
  });

  return NextResponse.json(
    { ...stateView(state), child },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
