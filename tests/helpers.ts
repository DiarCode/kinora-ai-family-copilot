import type { FamilyState, MoodValue } from "@/lib/types";
import { createSeedState } from "@/lib/store/seed";

export const NOW = new Date("2026-11-14T12:00:00.000Z");
export const TODAY = "2026-11-14";

export function seed(now: Date = NOW): FamilyState {
  return createSeedState(now);
}

export function setTodayMood(
  state: FamilyState,
  memberId: string,
  value: MoodValue,
) {
  const existing = state.moods.find(
    (mood) => mood.memberId === memberId && mood.date === TODAY,
  );
  if (existing) {
    existing.value = value;
    return;
  }
  state.moods.push({
    id: `test-mood-${memberId}-${value}`,
    memberId,
    date: TODAY,
    value,
    createdAt: NOW.toISOString(),
  });
}

export function clearTodayMoods(state: FamilyState) {
  state.moods = state.moods.filter((mood) => mood.date !== TODAY);
}

export const michaelId = "member_michael";
export const lucyId = "member_lucy";
export const sophieId = "seed-child-sophie";
