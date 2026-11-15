import type {
  Family,
  Session,
  SessionMode,
  SessionPhase,
  SessionSummary,
  Turn,
} from "@/lib/types";
import { assessSafety, SAFETY_FOOTER } from "@/lib/engine/safety";
import { newId } from "@/lib/utils";
import { courseBySlug } from "@/content/courses";

export type DomainKey =
  | "bedtime"
  | "screens"
  | "load"
  | "money"
  | "work"
  | "family"
  | "discipline"
  | "school"
  | "intimacy"
  | "communication"
  | "trust"
  | "childcare"
  | "general";

export type ProblemDomain = {
  key: DomainKey;
  label: string;
  title: string;
  need: string;
  reflection: string;
  agreement: string;
  courseSlug: string;
};

const domains: ProblemDomain[] = [
  {
    key: "bedtime",
    label: "bedtime and routines",
    title: "The bedtime handoff",
    need: "rest, shared noticing, and a handoff that does not require asking",
    reflection:
      "Bedtime is where the day's leftover load tends to land. Underneath the logistics, there is often a wish for rest and for someone to share the noticing, not just the tasks.",
    agreement:
      "By 5pm each day, the parent who owns bedtime confirms the plan in the family chat: bath, books, lights out. The other parent is off duty unless asked.",
    courseSlug: "repair-after-the-storm",
  },
  {
    key: "screens",
    label: "screens and limits",
    title: "The screen-time agreement",
    need: "a shared boundary and relief from being the only “bad guy”",
    reflection:
      "Screens are rarely the whole argument. They often stand in for a disagreement about attention, boundaries, or who has to be the bad guy.",
    agreement:
      "For the next seven days, we protect one device-free window — dinner or the first 20 minutes home — and keep screens out of bedrooms overnight.",
    courseSlug: "screens-boundaries-big-feelings",
  },
  {
    key: "load",
    label: "chores and the mental load",
    title: "The load conversation",
    need: "fairness, recognition, and less invisible work",
    reflection:
      "What I hear is less about the specific task and more about the invisible work of noticing, planning, and reminding — and whether that work is seen.",
    agreement:
      "This week, each of us owns one full domain — including noticing and follow-through — and we review the split for ten minutes on Sunday.",
    courseSlug: "the-fair-load-reset",
  },
  {
    key: "money",
    label: "money and decisions",
    title: "The money conversation",
    need: "security, fairness, and a shared plan",
    reflection:
      "Money conversations carry more than numbers. They often touch security, fairness, and the story each of you learned about what is enough.",
    agreement:
      "We hold a 20-minute money check-in on Sunday. The goal is understanding before deciding; no surprise purchases over an agreed amount.",
    courseSlug: "the-fair-load-reset",
  },
  {
    key: "work",
    label: "work, rest, and re-entry",
    title: "Work, rest, and the handoff",
    need: "rest, understanding, and a softer re-entry",
    reflection:
      "Work stress can make home feel like another performance review. Underneath, there may be a wish for rest and for a teammate who assumes good intent.",
    agreement:
      "On weeknights that begin after a hard workday, we get a ten-minute decompression window before logistics — and we say what we need instead of hinting.",
    courseSlug: "the-weekly-team-huddle",
  },
  {
    key: "family",
    label: "family and in-laws",
    title: "The family-visit boundary",
    need: "loyalty, a united front, and a boundary you both choose",
    reflection:
      "Family-of-origin patterns show up fast. The question is often not who is right about the visit, but which boundary you are both willing to hold together.",
    agreement:
      "Before the next family visit, we agree on one boundary and one exit plan together. We present it as a team, not as one person's rule.",
    courseSlug: "the-weekly-team-huddle",
  },
  {
    key: "discipline",
    label: "discipline and limits",
    title: "One shared limit",
    need: "consistency and a shared script",
    reflection:
      "When two parents hold different limits, children feel the gap. The goal is one shared limit and one shared script — not one parent winning.",
    agreement:
      "We agree on one shared limit and one shared script for the next seven days, and we use the same words even when we are tired.",
    courseSlug: "emotion-coaching-in-90-seconds",
  },
  {
    key: "school",
    label: "school and logistics",
    title: "The school-logistics split",
    need: "relief from being the default project manager",
    reflection:
      "School logistics can turn one parent into the project manager and the other into a helper. That split is worth naming before it becomes resentment.",
    agreement:
      "We split school logistics by domain: one of us owns the calendar and forms, the other owns the daily pack-up and reading. We review Sunday.",
    courseSlug: "the-fair-load-reset",
  },
  {
    key: "intimacy",
    label: "closeness and intimacy",
    title: "Making room for closeness",
    need: "safety, play, and a little unclaimed time",
    reflection:
      "Closeness often goes quiet when logistics take over. Wanting more connection is not another task; it is a bid for safety and play.",
    agreement:
      "We protect one 20-minute reconnection window this week with no logistics talk — a walk, a coffee, or a show, with phones away.",
    courseSlug: "the-weekly-team-huddle",
  },
  {
    key: "communication",
    label: "the way you argue",
    title: "Breaking the loop",
    need: "to be heard without being fixed",
    reflection:
      "The pattern you are describing sounds like a loop: one of you reaches, the other protects, and both end up feeling alone. Naming the loop is the first repair.",
    agreement:
      "When either of us is flooded, we say “pause” and name a return time. We come back within 24 hours; no silent disappearances.",
    courseSlug: "repair-after-the-storm",
  },
  {
    key: "trust",
    label: "trust and repair",
    title: "Rebuilding a small promise",
    need: "consistency, transparency, and time",
    reflection:
      "Trust repairs slowly, through consistency rather than one big conversation. The question is what small promise can be kept this week.",
    agreement:
      "We choose one small promise each and keep it for seven days. We check in Sunday about how it felt, not just whether it happened.",
    courseSlug: "repair-after-the-storm",
  },
  {
    key: "childcare",
    label: "childcare and the schedule",
    title: "Who holds the schedule",
    need: "shared ownership of the invisible schedule",
    reflection:
      "Who holds the schedule is its own job. The visible task is only half of the load.",
    agreement:
      "We write down the full childcare schedule and assign one owner per block. The owner handles the noticing, not just the task.",
    courseSlug: "the-fair-load-reset",
  },
  {
    key: "general",
    label: "the pattern you described",
    title: "Your team check-in",
    need: "to feel like teammates and to know that effort is seen",
    reflection:
      "What I hear underneath the details is a wish to feel like teammates, not opponents — and to know that your effort is seen.",
    agreement:
      "For the next seven days, we name one thing we appreciated before we raise one thing we need. We review it Sunday.",
    courseSlug: "the-weekly-team-huddle",
  },
];

const domainKeywords: Record<Exclude<DomainKey, "general">, string[]> = {
  bedtime: ["bedtime", "bed time", "sleep", "night", "wake", "morning", "routine", "bath", "lights out"],
  screens: ["screen", "phone", "tablet", "ipad", "video game", "gaming", "tv", "youtube", "tiktok", "fortnite"],
  load: ["chores", "cleaning", "laundry", "dishes", "cook", "dinner", "load", "invisible", "mess", "housework"],
  money: ["money", "finance", "bill", "budget", "spend", "spending", "expensive", "salary", "debt"],
  work: ["work", "job", "overtime", "boss", "career", "meeting", "commute", "tired"],
  family: ["mother", "mom", "father", "dad", "in-law", "in law", "parents", "visit", "holiday", "family"],
  discipline: ["discipline", "punish", "tantrum", "hitting", "shouting", "yelling", "limit", "consequence", "behavior"],
  school: ["school", "teacher", "homework", "class", "pickup", "pick up", "forms", "grade"],
  intimacy: ["intimacy", "sex", "closeness", "affection", "date night", "romance", "touch"],
  communication: ["argue", "argument", "fight", "shout", "yell", "silent", "stonewall", "interrupt", "talk"],
  trust: ["trust", "lie", "lied", "lying", "secret", "hidden", "promise", "betray"],
  childcare: ["childcare", "babysit", "nanny", "daycare", "schedule", "pickup", "drop off", "who does"],
};

export function classifyProblem(problem: string): ProblemDomain {
  const text = problem.toLowerCase();
  let best: { domain: ProblemDomain; score: number } = {
    domain: domains[domains.length - 1],
    score: 0,
  };
  for (const domain of domains) {
    if (domain.key === "general") continue;
    const keywords = domainKeywords[domain.key as Exclude<DomainKey, "general">];
    const score = keywords.reduce(
      (total, keyword) => total + (text.includes(keyword) ? 1 : 0),
      0,
    );
    if (score > best.score) best = { domain, score };
  }
  return best.domain;
}

const pauseAgreement =
  "When either of us is flooded, we say “pause” and name a return time. We come back within 24 hours; no silent disappearances.";

const cleanQuote = (text: string, max = 150) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
};

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

function memberName(family: Family, id: string): string {
  const member = family.members.find((item) => item.id === id);
  return member ? firstName(member.name) : "there";
}

function makeTurn(
  text: string,
  phase: SessionPhase,
  kind: Turn["kind"],
  invite?: string,
  now: Date = new Date(),
): Turn {
  return {
    id: newId("turn"),
    speakerId: "kinora",
    speakerName: "Kinora",
    text,
    at: now.toISOString(),
    kind,
    invite,
    phase,
  };
}

export type CreateSessionInput = {
  family: Family;
  problem: string;
  mode: SessionMode;
  scheduledFor?: string;
  now?: Date;
  id?: string;
};

export function createSession({
  family,
  problem,
  mode,
  scheduledFor,
  now = new Date(),
  id = newId("session"),
}: CreateSessionInput): Session {
  const domain = classifyProblem(problem);
  const safety = assessSafety(problem);
  const participants = family.members.map((member) => member.id);
  const first = family.members[0];
  const title = domain.title;
  const roomName = `kinora-${id}`;

  if (safety.flagged) {
    return {
      id,
      status: scheduledFor ? "scheduled" : "active",
      mode,
      problem,
      title,
      createdAt: now.toISOString(),
      scheduledFor,
      participants,
      turns: [
        makeTurn(
          `${safety.message ?? "Your safety comes first."}\n\nThis session is paused. ${SAFETY_FOOTER}`,
          "safety",
          "safety",
          undefined,
          now,
        ),
      ],
      phase: "safety",
      roomName,
      safetyFlagged: true,
      recommendedCourseSlug: undefined,
    };
  }

  return {
    id,
    status: scheduledFor ? "scheduled" : "active",
    mode,
    problem,
    title,
    createdAt: now.toISOString(),
    scheduledFor,
    participants,
    turns: [
      makeTurn(
        `Thank you both for making this time. I'm Kinora. I'm here to help you understand ${domain.label} and find one next step — not to decide who is right.\n\n${firstName(
          first.name,
        )}, can you start by describing what happened from your side, without solving it yet?`,
        "story",
        "opening",
        first.id,
        now,
      ),
    ],
    phase: "story",
    roomName,
  };
}

export type NextTurnResult = {
  turn: Turn;
  phase: SessionPhase;
  safetyFlagged: boolean;
};

/**
 * Reads a session that already includes the latest parent turn, and produces
 * Kinora's next turn. The coaching arc is deliberately shallow enough to end
 * early: a team can stop after two turns and still receive a useful summary.
 */
export function nextKinoraTurn(
  session: Session,
  family: Family,
  now: Date = new Date(),
): NextTurnResult | null {
  if (session.phase === "safety" || session.safetyFlagged) return null;

  const lastParentTurn = [...session.turns]
    .reverse()
    .find((turn) => turn.speakerId !== "kinora");
  if (!lastParentTurn) return null;

  const safety = assessSafety(lastParentTurn.text);
  if (safety.flagged) {
    return {
      phase: "safety",
      safetyFlagged: true,
      turn: makeTurn(
        `${safety.message ?? "Your safety comes first."}\n\nThis session is paused. ${SAFETY_FOOTER}`,
        "safety",
        "safety",
        undefined,
        now,
      ),
    };
  }

  const domain = classifyProblem(session.problem);
  const speaker = memberName(family, lastParentTurn.speakerId);
  const otherId =
    session.participants.find((id) => id !== lastParentTurn.speakerId) ??
    session.participants[0];
  const other = memberName(family, otherId);
  const quote = cleanQuote(lastParentTurn.text);
  const phase = session.phase;
  const parentTurnsInPhase = session.turns.filter(
    (turn) => turn.speakerId !== "kinora" && turn.phase === phase,
  ).length;

  if (phase === "story") {
    if (parentTurnsInPhase < 2) {
      return {
        phase: "story",
        safetyFlagged: false,
        turn: makeTurn(
          `Thank you, ${speaker}. I'm listening for the moment, not the verdict. ${other}, what did that look like from your side — and what did you notice in yourself while it was happening?`,
          "story",
          "reflection",
          otherId,
          now,
        ),
      };
    }
    return {
      phase: "emotion",
      safetyFlagged: false,
      turn: makeTurn(
        `I'm hearing two experiences that can both be true. ${domain.reflection}\n\nUnderneath the frustration, what do you think each of you was protecting? ${speaker}, start with the part that is harder to say out loud.`,
        "emotion",
        "reflection",
        lastParentTurn.speakerId,
        now,
      ),
    };
  }

  if (phase === "emotion") {
    if (parentTurnsInPhase < 2) {
      return {
        phase: "emotion",
        safetyFlagged: false,
        turn: makeTurn(
          `That sounds like it takes a lot to carry. ${other}, when ${speaker} says “${quote}”, what comes up for you — and what do you wish ${speaker} understood?`,
          "emotion",
          "reflection",
          otherId,
          now,
        ),
      };
    }
    return {
      phase: "needs",
      safetyFlagged: false,
      turn: makeTurn(
        `Those are two protective moves, not two different truths. What did each of you need in that moment that you didn't get? ${other}, start with the need under the anger.`,
        "needs",
        "reflection",
        otherId,
        now,
      ),
    };
  }

  if (phase === "needs") {
    if (parentTurnsInPhase < 2) {
      return {
        phase: "needs",
        safetyFlagged: false,
        turn: makeTurn(
          `I hear you. ${speaker}, when you say “${quote}”, what would it have looked like for the need underneath to be met — even a little?`,
          "needs",
          "reflection",
          lastParentTurn.speakerId,
          now,
        ),
      };
    }
    return {
      phase: "common-ground",
      safetyFlagged: false,
      turn: makeTurn(
        `I can hear a shared need here: ${domain.need}. You are both asking for the same thing in different languages. Does that feel fair to each of you? ${speaker}, say what fits and what doesn't.`,
        "common-ground",
        "reflection",
        lastParentTurn.speakerId,
        now,
      ),
    };
  }

  if (phase === "common-ground") {
    return {
      phase: "agreement",
      safetyFlagged: false,
      turn: makeTurn(
        `Here is one small agreement that fits what you both said: ${domain.agreement}\n\nDoes that feel doable? If something needs adjusting, say it now — an agreement you both shape is more likely to survive a hard week.`,
        "agreement",
        "agreement",
        lastParentTurn.speakerId,
        now,
      ),
    };
  }

  if (phase === "agreement") {
    if (parentTurnsInPhase < 2) {
      return {
        phase: "agreement",
        safetyFlagged: false,
        turn: makeTurn(
          `That is a real agreement, not a resolution of everything. I'll put it in your summary with one small next step. ${other}, is there one word you want to add before we close?`,
          "agreement",
          "agreement",
          otherId,
          now,
        ),
      };
    }
    return {
      phase: "close",
      safetyFlagged: false,
      turn: makeTurn(
        `Thank you both. This is not a verdict — it's a plan you can revise. I'll save the summary and the agreements. The next step I'd suggest is the ${courseBySlug(domain.courseSlug)?.minutes ?? 5}-minute course “${courseBySlug(domain.courseSlug)?.title ?? "Repair After the Storm"}”, together.`,
        "close",
        "closing",
        undefined,
        now,
      ),
    };
  }

  return null;
}

export function buildSessionSummary(
  session: Session,
  family: Family,
  now: Date = new Date(),
): SessionSummary {
  if (session.summary) return session.summary;
  const domain = classifyProblem(session.problem);
  const parentTurns = session.turns.filter((turn) => turn.speakerId !== "kinora");
  const quotes = parentTurns
    .slice(-2)
    .map((turn) => `“${cleanQuote(turn.text, 170)}”`)
    .join(" ");
  const course = courseBySlug(domain.courseSlug);
  const names = session.participants
    .map((id) => memberName(family, id))
    .join(" and ");

  return {
    title: domain.title,
    whatWeHeard: `${names} talked about ${domain.label}. ${domain.reflection}${
      quotes ? ` In their own words: ${quotes}` : ""
    } The shared need underneath is ${domain.need}.`,
    agreements: [domain.agreement, pauseAgreement],
    nextStep: course
      ? `Try “${course.title}” (${course.minutes} minutes) together, then review the agreement for ten minutes on Sunday.`
      : "Review the agreement for ten minutes on Sunday and keep the one change that helped.",
    recommendedCourseSlug: domain.courseSlug,
    createdAt: now.toISOString(),
  };
}

export function domainForProblem(problem: string): ProblemDomain {
  return classifyProblem(problem);
}

export const sessionDisclosure =
  "Kinora is a coaching and skills practice, not therapy or crisis care. If you are in danger, call 911. Crisis support: 988. Domestic violence support: 1-800-799-7233.";
