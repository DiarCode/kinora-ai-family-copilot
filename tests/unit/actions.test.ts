import { describe, expect, it } from "vitest";
import { buildNextActions, moodSummary } from "@/lib/engine/actions";
import { createChildProfile } from "@/lib/engine/child-profile";
import { bandForAge } from "@/content/assessments";
import type { Session } from "@/lib/types";
import {
  clearTodayMoods,
  lucyId,
  michaelId,
  NOW,
  seed,
  setTodayMood,
  sophieId,
  TODAY,
} from "../helpers";

describe("next best actions", () => {
  it("surfaces a reset for a rainy parent and a team check-in", () => {
    const state = seed();
    clearTodayMoods(state);
    setTodayMood(state, michaelId, "rainy");
    setTodayMood(state, lucyId, "rainy");

    const actions = buildNextActions(state, NOW);
    expect(actions[0].title).toContain("reset");
    expect(actions.some((action) => action.title.includes("team check-in"))).toBe(
      true,
    );
    expect(actions.every((action) => action.reason.length > 0)).toBe(true);
  });

  it("surfaces the unmapped child and the in-progress course", () => {
    const state = seed();
    clearTodayMoods(state);
    const actions = buildNextActions(state, NOW);
    expect(
      actions.some((action) => action.title.includes("Discover Sophie")),
    ).toBe(true);
    expect(
      actions.some((action) => action.title.includes("Repair After the Storm")),
    ).toBe(true);
    expect(
      actions.some((action) => action.title.includes("fifteen-minute check-in")),
    ).toBe(true);
  });

  it("drops the child action once a profile exists", () => {
    const state = seed();
    const child = state.children[0];
    const band = bandForAge(6);
    const { profile } = createChildProfile({
      child,
      ageBand: band.id,
      answers: band.questions.map((question) => ({
        questionId: question.id,
        optionIndex: 0,
      })),
      now: NOW,
    });
    child.profile = profile;

    const actions = buildNextActions(state, NOW);
    expect(
      actions.some((action) => action.title.includes("Discover Sophie")),
    ).toBe(false);
  });

  it("suggests a refresh for a stale profile", () => {
    const state = seed();
    const child = state.children[0];
    const band = bandForAge(6);
    const { profile } = createChildProfile({
      child,
      ageBand: band.id,
      answers: band.questions.map((question) => ({
        questionId: question.id,
        optionIndex: 0,
      })),
      now: new Date("2026-01-01T12:00:00.000Z"),
    });
    child.profile = profile;
    const actions = buildNextActions(state, NOW);
    expect(
      actions.some((action) => action.title.includes("ready for a refresh")),
    ).toBe(true);
  });

  it("prepares for an upcoming scheduled session", () => {
    const state = seed();
    const scheduled: Session = {
      ...state.sessions[0],
      id: "test-scheduled",
      status: "scheduled",
      scheduledFor: "2026-11-15T19:30:00.000Z",
      completedAt: undefined,
      summary: undefined,
    };
    state.sessions.push(scheduled);
    const actions = buildNextActions(state, NOW);
    expect(actions[0].title).toBe("Prepare for your session");
  });

  it("banks a good day when both parents are sunny", () => {
    const state = seed();
    clearTodayMoods(state);
    setTodayMood(state, michaelId, "sunny");
    setTodayMood(state, lucyId, "sunny");
    const actions = buildNextActions(state, NOW);
    expect(actions.some((action) => action.title === "Bank the good day")).toBe(
      true,
    );
    expect(actions.some((action) => action.icon === "sun")).toBe(true);
  });

  it("summarizes today's moods for both parents", () => {
    const state = seed();
    setTodayMood(state, michaelId, "sunny");
    const summary = moodSummary(state, new Date(`${TODAY}T12:00:00.000Z`));
    expect(summary).toHaveLength(2);
    expect(summary[0].value).toBe("sunny");
    expect(summary[1].value).toBeUndefined();
  });

  it("links every action to a real app page", () => {
    const state = seed();
    const actions = buildNextActions(state, NOW);
    for (const action of actions) {
      expect(action.href.startsWith("/app")).toBe(true);
    }
    expect(sophieId).toBe(state.children[0].id);
  });
});
