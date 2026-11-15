import { describe, expect, it } from "vitest";
import {
  deriveMemory,
  memoryForAssistant,
  syncMemory,
} from "@/lib/engine/memory";
import { createChildProfile } from "@/lib/engine/child-profile";
import { bandForAge } from "@/content/assessments";
import { NOW, seed } from "../helpers";

describe("family memory", () => {
  it("derives readable memory from real state", () => {
    const state = seed();
    const memory = deriveMemory(state, NOW);
    const kinds = new Set(memory.map((item) => item.kind));
    expect(kinds.has("plan")).toBe(true);
    expect(kinds.has("mood")).toBe(true);
    expect(kinds.has("child")).toBe(true);
    expect(kinds.has("session")).toBe(true);
    expect(kinds.has("agreement")).toBe(true);
    expect(kinds.has("course")).toBe(true);
    expect(
      memory.some((item) => item.text.includes("Kinora has not completed")),
    ).toBe(true);
  });

  it("selects labels relevant to the question", () => {
    const state = seed();
    const bedtime = memoryForAssistant(state, "What should we do about bedtime?");
    expect(bedtime.labels).toContain("Last session: The bedtime handoff");

    const child = memoryForAssistant(state, "Tell me about Sophie");
    expect(child.labels).toContain("Sophie (not yet mapped)");
    expect(child.items.some((item) => item.text.includes("Sophie is 6"))).toBe(
      true,
    );
  });

  it("switches the child label after a profile exists", () => {
    const state = seed();
    const child = state.children[0];
    const band = bandForAge(6);
    child.profile = createChildProfile({
      child,
      ageBand: band.id,
      answers: band.questions.map((question) => ({
        questionId: question.id,
        optionIndex: 0,
      })),
      now: NOW,
    }).profile;

    const memory = memoryForAssistant(state, "How is Sophie doing?");
    expect(memory.labels).toContain("Sophie's profile");
    expect(memory.items.some((item) => item.text.includes(child.profile!.archetype))).toBe(
      true,
    );
  });

  it("syncs the stored memory snapshot", () => {
    const state = seed();
    state.memory = [];
    syncMemory(state, NOW);
    expect(state.memory.length).toBeGreaterThan(5);
    expect(state.memory.some((item) => item.kind === "session")).toBe(true);
  });

  it("caps the assistant memory at six cited items", () => {
    const state = seed();
    const memory = memoryForAssistant(state, "Everything about the family", NOW);
    expect(memory.items.length).toBeLessThanOrEqual(6);
    expect(memory.labels.length).toBe(memory.items.length);
  });
});
