import { describe, expect, it } from "vitest";
import {
  buildAssistantWelcome,
  buildEngineReply,
} from "@/lib/engine/assistant";
import { generateAssistantReply } from "@/lib/engine/assistant-service";
import { createChildProfile } from "@/lib/engine/child-profile";
import { bandForAge } from "@/content/assessments";
import { NOW, seed } from "../helpers";

describe("assistant welcome", () => {
  it("greets the user with the real family context", () => {
    const reply = buildAssistantWelcome(seed());
    expect(reply.text).toContain("Hi Michael");
    expect(reply.text).toContain("Sophie");
    expect(reply.text).toContain("last session");
    expect(reply.memoryUsed).toContain("Family profile");
    expect(reply.suggestedPrompts.length).toBeGreaterThan(2);
    expect(reply.mode).toBe("engine");
  });
});

describe("assistant intent routing", () => {
  it("answers a bedtime question from the last session and agreements", () => {
    const reply = buildEngineReply(
      seed(),
      "What did we agree in our last session?",
    );
    expect(reply.text).toContain("The bedtime handoff");
    expect(reply.text).toContain("Your agreements");
    expect(reply.text).toContain("Repair After the Storm");
    expect(reply.memoryUsed).toContain("Last session: The bedtime handoff");
  });

  it("explains the child's unknown state and links to discovery", () => {
    const reply = buildEngineReply(
      seed(),
      "How do we start Sophie's discovery?",
    );
    expect(reply.text).toContain("doesn't have a discovery profile");
    expect(reply.text).toContain("/app/children/seed-child-sophie");
    expect(reply.memoryUsed).toContain("Sophie (not yet mapped)");
  });

  it("uses the profile once the child has been mapped", () => {
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

    const reply = buildEngineReply(
      state,
      "How do I support Sophie's strengths this week?",
    );
    expect(reply.text).toContain(child.profile.archetype);
    expect(reply.text.toLowerCase()).toContain("try this week");
    expect(reply.memoryUsed).toContain("Sophie's profile");
  });

  it("responds to a rainy day with a reset", () => {
    const reply = buildEngineReply(
      seed(),
      "Give us a ten-minute reset for a rainy day.",
    );
    expect(reply.text.toLowerCase()).toContain("weather report");
    expect(reply.text.toLowerCase()).toContain("reset");
  });

  it("redirects one-sided venting into a two-sided session", () => {
    const reply = buildEngineReply(
      seed(),
      "My wife always says I do nothing around the house.",
    );
    expect(reply.text).toContain("not going to decide who's right");
    expect(reply.text).toContain("/app/sessions/new");
    expect(reply.text).toContain("two-sided");
  });

  it("routes crisis language to resources and stops coaching", () => {
    const reply = buildEngineReply(seed(), "I want to kill myself.");
    expect(reply.safety).toBe(true);
    expect(reply.text).toContain("988");
    expect(reply.memoryUsed).toContain("Safety screening");
  });

  it("routes abuse language to the DV hotline", () => {
    const reply = buildEngineReply(seed(), "He hit me and I am scared.");
    expect(reply.safety).toBe(true);
    expect(reply.text).toContain("1-800-799-7233");
  });
});

describe("assistant service", () => {
  it("uses the deterministic engine when the LLM is disabled", async () => {
    const previous = process.env.KINORA_AI_MODE;
    process.env.KINORA_AI_MODE = "engine";
    const reply = await generateAssistantReply(
      seed(),
      "What did we agree last time?",
    );
    expect(reply.mode).toBe("engine");
    expect(reply.text).toContain("bedtime");
    process.env.KINORA_AI_MODE = previous;
  });
});
