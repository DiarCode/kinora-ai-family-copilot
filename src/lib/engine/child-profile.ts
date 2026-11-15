import type {
  AgeBand,
  Assessment,
  AssessmentAnswer,
  Child,
  ChildProfile,
  TraitKey,
} from "@/lib/types";
import {
  bandById,
  pickArchetype,
  traitActivitySeeds,
  traitCareerSeeds,
  traitDescriptions,
  traitInterestSeeds,
  traitLabels,
  traitStretchTips,
} from "@/content/assessments";
import { ageFromBirthDate, retakeDateKey } from "@/lib/date";
import { clamp, newId } from "@/lib/utils";

const traitKeys: TraitKey[] = [
  "creativity",
  "analytical",
  "social",
  "emotional",
  "physical",
  "focus",
  "leadership",
];

const traitParentingTips: Record<TraitKey, string> = {
  creativity:
    "Protect unstructured making time. Ask “what are you making?” instead of “what is it?” and let the answer change.",
  analytical:
    "Feed the questions. Try “what do you notice?” before “what is the answer?”, and let them test a theory before you correct it.",
  social:
    "Give them a real role in a group — host, helper, teammate — and debrief gently afterward: what felt easy, what felt hard?",
  emotional:
    "Name feelings out loud, including your own, and praise the naming: “You noticed you were frustrated. That's a useful thing to know.”",
  physical:
    "Offer movement before sitting tasks. A ten-minute run, dance, or climb can do more for attention than a reminder to focus.",
  focus:
    "Protect one longer block of uninterrupted play or work each day. Narrate the effort, not only the result.",
  leadership:
    "Let them own one real family decision this week — a meal, an outing, the plan for Sunday — with a small budget and a clear deadline.",
};

export const traitKeysOrdered = traitKeys;

export type ProfileInput = {
  child: Pick<Child, "id" | "name" | "birthDate">;
  ageBand: AgeBand;
  answers: AssessmentAnswer[];
  now?: Date;
};

export function scoreAssessment({
  ageBand,
  answers,
}: {
  ageBand: AgeBand;
  answers: AssessmentAnswer[];
}): Record<TraitKey, number> {
  const band = bandById(ageBand);
  if (answers.length !== band.questions.length) {
    throw new Error(
      `This discovery has ${band.questions.length} questions; received ${answers.length} answers.`,
    );
  }

  const raw: Record<TraitKey, number> = {
    creativity: 0,
    analytical: 0,
    social: 0,
    emotional: 0,
    physical: 0,
    focus: 0,
    leadership: 0,
  };
  const max: Record<TraitKey, number> = { ...raw };

  for (const answer of answers) {
    const question = band.questions.find((item) => item.id === answer.questionId);
    if (!question) {
      throw new Error(`Unknown question: ${answer.questionId}`);
    }
    const option = question.options[answer.optionIndex];
    if (!option) {
      throw new Error(`Invalid option for question: ${answer.questionId}`);
    }
    for (const trait of traitKeys) {
      const value = option.weights[trait] ?? 0;
      raw[trait] += value;
    }
    for (const trait of traitKeys) {
      const questionMax = Math.max(
        ...question.options.map((item) => item.weights[trait] ?? 0),
      );
      max[trait] += questionMax;
    }
  }

  const traits = {} as Record<TraitKey, number>;
  for (const trait of traitKeys) {
    traits[trait] =
      max[trait] === 0
        ? 45
        : clamp(Math.round(20 + (80 * raw[trait]) / max[trait]), 20, 100);
  }
  return traits;
}

export function createChildProfile({
  child,
  ageBand,
  answers,
  now = new Date(),
}: ProfileInput): { profile: ChildProfile; assessment: Assessment } {
  const traits = scoreAssessment({ ageBand, answers });
  const ordered = [...traitKeys].sort((a, b) => traits[b] - traits[a]);
  const top = ordered.slice(0, 3);
  const bottom = ordered.slice(-2);
  const archetype = pickArchetype(traits);
  const age = ageFromBirthDate(child.birthDate, now);
  const completedAt = now.toISOString();

  const interests = Array.from(
    new Set(top.flatMap((trait) => traitInterestSeeds[trait].slice(0, 2))),
  ).slice(0, 5);

  const careerSeeds = Array.from(
    new Set(top.flatMap((trait) => traitCareerSeeds[trait].slice(0, 1))),
  ).slice(0, 3);

  const activities = top
    .map((trait) => traitActivitySeeds[trait].replaceAll("{name}", child.name))
    .slice(0, 3);

  const parentingTips = [
    traitParentingTips[top[0]],
    traitParentingTips[top[1]],
    `Stretch zone — ${traitLabels[bottom[0]].toLowerCase()}: ${traitStretchTips[bottom[0]]}`,
  ];

  const strengths = top.slice(0, 3).map(
    (trait) => `${traitLabels[trait]} — ${traitDescriptions[trait]}`,
  );

  const growth = bottom.map(
    (trait) =>
      `${traitLabels[trait]} needs a little more room: ${traitStretchTips[trait]}`,
  );

  const summary = `${child.name} is ${Math.max(age, 2)}. The clearest signals in your observations are ${traitLabels[
    top[0]
  ].toLowerCase()} and ${traitLabels[
    top[1]
  ].toLowerCase()}. ${archetype.line} Think of this as a conversation starter, not a label — interests and skills shift, so Kinora will invite a fresh look in about 90 days.`;

  const profile: ChildProfile = {
    archetype: archetype.name,
    archetypeLine: archetype.line,
    summary,
    traits,
    strengths,
    growth,
    interests,
    careerSeeds,
    parentingTips,
    activities,
    completedAt,
    retakeAfter: retakeDateKey(90, now),
    assessmentId: newId("assessment"),
    ageBand,
  };

  const assessment: Assessment = {
    id: profile.assessmentId,
    childId: child.id,
    ageBand,
    answers,
    traits,
    archetype: archetype.name,
    completedAt,
  };

  return { profile, assessment };
}

export function topTraits(traits: Record<TraitKey, number>, count = 2) {
  return [...traitKeys]
    .sort((a, b) => traits[b] - traits[a])
    .slice(0, count)
    .map((trait) => ({ trait, label: traitLabels[trait], value: traits[trait] }));
}
