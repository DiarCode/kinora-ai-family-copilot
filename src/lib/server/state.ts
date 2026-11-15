import { getStore } from "@/lib/store";
import { deriveMemory } from "@/lib/engine/memory";
import { buildNextActions } from "@/lib/engine/actions";
import { aiStatus } from "@/lib/engine/assistant-service";
import { todayKey } from "@/lib/date";
import type { FamilyState, NextAction, StateResponse } from "@/lib/types";

export type StatePayload = StateResponse & {
  ai: { mode: "engine" | "llm"; model: string };
};

export function stateView(state: FamilyState, now: Date = new Date()): StatePayload {
  const view: FamilyState = {
    ...state,
    memory: deriveMemory(state, now),
  };
  const actions: NextAction[] = buildNextActions(view, now);
  return {
    state: view,
    today: todayKey(now),
    actions,
    ai: aiStatus(),
  };
}

export async function readStatePayload(): Promise<StatePayload> {
  const state = await getStore().read();
  return stateView(state);
}
