import { describe, expect, it } from "vitest";
import {
  createChildProfile,
  scoreAssessment,
  topTraits,
  traitKeysOrdered,
} from "@/lib/engine/child-profile";
import { bandForAge, pickArchetype } from "@/content/assessments";
import { NOW, seed } from "../helpers";

const child = seed().children[0];

function answersFor(bandId: "early" | "middle" | "teen", optionIndex = 0) {
  const band = bandForAge(bandId === "early" ? 4 : bandId === "middle" ? 8 : 12);
  return band.questions.map((question) => ({
    questionId: question.id,
    optionIndex: Math.min(optionIndex, question.options.length - 1),
  }));
}

describe("child profile engine", () => {
  it("selects the age band from the child's age", () => {
    expect(bandForAge(2).id).toBe("early");
    expect(bandForAge(5).id).toBe("early");
    expect(bandForAge(6).id).toBe("middle");
    expect(bandForAge(9).id).toBe("middle");
    expect(bandForAge(10).id).toBe("teen");
    expect(bandForAge(13).id).toBe("teen");
  });

  it("creates a complete, non-diagnostic profile for a 6-year-old", () => {
    const { profile, assessment } = createChildProfile({
      child,
      ageBand: "middle",
      answers: answersFor("middle"),
      now: NOW,
    });

    expect(profile.archetype.length).toBeGreaterThan(2);
    expect(profile.archetypeLine.length).toBeGreaterThan(10);
    expect(profile.summary).toContain("conversation starter");
    expect(profile.strengths).toHaveLength(3);
    expect(profile.growth).toHaveLength(2);
    expect(profile.interests.length).toBeGreaterThan(2);
    expect(profile.careerSeeds).toHaveLength(3);
    expect(profile.activities).toHaveLength(3);
    expect(profile.parentingTips).toHaveLength(3);
    expect(profile.retakeAfter).toBe("2027-02-12");
    expect(assessment.traits).toEqual(profile.traits);
    for (const trait of traitKeysOrdered) {
      expect(profile.traits[trait]).toBeGreaterThanOrEqual(20);
      expect(profile.traits[trait]).toBeLessThanOrEqual(100);
    }
    expect(topTraits(profile.traits, 2)).toHaveLength(2);
  });

  it("is deterministic for the same observations", () => {
    const first = createChildProfile({
      child,
      ageBand: "middle",
      answers: answersFor("middle"),
      now: NOW,
    });
    const second = createChildProfile({
      child,
      ageBand: "middle",
      answers: answersFor("middle"),
      now: NOW,
    });
    expect(first.profile.traits).toEqual(second.profile.traits);
    expect(first.profile.archetype).toBe(second.profile.archetype);
  });

  it("scores the teen Likert scale at the ceiling when every answer is 'almost always'", () => {
    const traits = scoreAssessment({
      ageBand: "teen",
      answers: answersFor("teen", 3),
    });
    for (const trait of traitKeysOrdered) {
      expect(traits[trait]).toBe(100);
    }
  });

  it("rejects incomplete or invalid answers", () => {
    expect(() =>
      createChildProfile({
        child,
        ageBand: "middle",
        answers: answersFor("middle").slice(0, 3),
        now: NOW,
      }),
    ).toThrow(/10 questions/);

    expect(() =>
      createChildProfile({
        child,
        ageBand: "middle",
        answers: [
          ...answersFor("middle").slice(0, 9),
          { questionId: "not-a-question", optionIndex: 0 },
        ],
        now: NOW,
      }),
    ).toThrow(/Unknown question/);

    expect(() =>
      createChildProfile({
        child,
        ageBand: "middle",
        answers: [
          ...answersFor("middle").slice(0, 9),
          { questionId: bandForAge(8).questions[9].id, optionIndex: 99 },
        ],
        now: NOW,
      }),
    ).toThrow(/Invalid option/);
  });

  it("maps the top two traits to a readable archetype", () => {
    const traits = {
      creativity: 80,
      analytical: 40,
      social: 40,
      emotional: 40,
      physical: 30,
      focus: 40,
      leadership: 90,
    };
    expect(pickArchetype(traits).name).toBe("The Creative Director");
    expect(
      pickArchetype({
        ...traits,
        creativity: 30,
        social: 95,
        emotional: 85,
        leadership: 30,
      }).name,
    ).toBe("The Connector");
  });
});
