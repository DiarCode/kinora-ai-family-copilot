import type {
  FamilyState,
  MemoryItem,
  MoodEntry,
  Session,
  Turn,
} from "@/lib/types";
import { birthDateForAge, dateKeyOffset } from "@/lib/date";

const memberIds = {
  michael: "member_michael",
  lucy: "member_lucy",
} as const;

function daysAgoIso(
  days: number,
  hour = 19,
  minute = 30,
  now: Date = new Date(),
): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function seedMoods(now: Date): MoodEntry[] {
  const pattern: Array<{
    day: number;
    michael: MoodEntry["value"] | null;
    lucy: MoodEntry["value"] | null;
  }> = [
    { day: -6, michael: "sunny", lucy: "cloudy" },
    { day: -5, michael: "cloudy", lucy: "rainy" },
    { day: -4, michael: "sunny", lucy: "cloudy" },
    { day: -3, michael: "rainy", lucy: "cloudy" },
    { day: -2, michael: "cloudy", lucy: "sunny" },
    { day: -1, michael: "sunny", lucy: "cloudy" },
    { day: 0, michael: null, lucy: null },
  ];

  const moods: MoodEntry[] = [];
  for (const entry of pattern) {
    const date = dateKeyOffset(entry.day, now);
    if (entry.michael) {
      moods.push({
        id: `seed-mood-michael-${date}`,
        memberId: memberIds.michael,
        date,
        value: entry.michael,
        createdAt: daysAgoIso(Math.abs(entry.day), 7, 40, now),
      });
    }
    if (entry.lucy) {
      moods.push({
        id: `seed-mood-lucy-${date}`,
        memberId: memberIds.lucy,
        date,
        value: entry.lucy,
        note: entry.lucy === "rainy" ? "Long day. Too many meetings." : undefined,
        createdAt: daysAgoIso(Math.abs(entry.day), 8, 5, now),
      });
    }
  }
  return moods;
}

function seedTurns(now: Date): Turn[] {
  return [
    {
      id: "seed-turn-1",
      speakerId: "kinora",
      speakerName: "Kinora",
      text: "Thank you both for making this time. I’m Kinora — I’m here to help you understand what happened at bedtime and find one next step, not to decide who is right. Michael, can you start by describing the last bedtime from your side?",
      at: daysAgoIso(12, 19, 31, now),
      kind: "opening",
      invite: memberIds.michael,
      phase: "story",
    },
    {
      id: "seed-turn-2",
      speakerId: memberIds.michael,
      speakerName: "Michael",
      text: "I get home and Lucy is already frustrated. I try to help, but I feel like anything I do is wrong, so I step back. Then she says I disappear.",
      at: daysAgoIso(12, 19, 32, now),
      kind: "reflection",
      phase: "story",
    },
    {
      id: "seed-turn-3",
      speakerId: memberIds.lucy,
      speakerName: "Lucy",
      text: "By bedtime I have been with Sophie since pick-up. I am touched out. When Michael steps back, it feels like I am the default parent again. I don’t want to have to ask.",
      at: daysAgoIso(12, 19, 33, now),
      kind: "reflection",
      phase: "story",
    },
    {
      id: "seed-turn-4",
      speakerId: "kinora",
      speakerName: "Kinora",
      text: "What I hear underneath the logistics is a shared wish: you both want bedtime to feel calmer, and you both want to feel chosen as a teammate rather than judged. Michael, when Lucy says “I don’t want to have to ask,” what comes up for you?",
      at: daysAgoIso(12, 19, 34, now),
      kind: "reflection",
      invite: memberIds.michael,
      phase: "emotion",
    },
    {
      id: "seed-turn-5",
      speakerId: "kinora",
      speakerName: "Kinora",
      text: "Here is one small agreement that fits what you both said: by 5pm each day, the parent who owns bedtime confirms the plan in the family chat — who does bath, books, and lights out. The other parent is off duty unless asked. And if either of you is flooded, “pause” means twenty minutes, with a return time.",
      at: daysAgoIso(12, 19, 35, now),
      kind: "agreement",
      phase: "agreement",
    },
  ];
}

function seedSession(now: Date): Session {
  return {
    id: "seed-session-bedtime",
    status: "completed",
    mode: "text",
    title: "The bedtime handoff",
    problem:
      "Bedtime has become a fight every night. Michael says Lucy takes over; Lucy says Michael disappears. We want a calmer handoff.",
    createdAt: daysAgoIso(12, 19, 30, now),
    startedAt: daysAgoIso(12, 19, 30, now),
    completedAt: daysAgoIso(12, 19, 55, now),
    participants: [memberIds.michael, memberIds.lucy],
    turns: seedTurns(now),
    phase: "close",
    summary: {
      title: "The bedtime handoff",
      whatWeHeard:
        "You both want bedtime to feel calmer, and you both feel unseen in the handoff. The frustration is less about the routine itself and more about who carries the noticing — and whether asking for help feels like a failure or a relief.",
      agreements: [
        "By 5pm each day, the parent who owns bedtime confirms the plan in the family chat: bath, books, lights out.",
        "“Pause” means twenty minutes with a named return time. The other parent protects that time without following up.",
      ],
      nextStep:
        "Try the six-minute course “Repair After the Storm” together this weekend, then repeat the bedtime plan for one week.",
      recommendedCourseSlug: "repair-after-the-storm",
      createdAt: daysAgoIso(12, 19, 56, now),
    },
    acceptedAgreements: [
      "By 5pm each day, the parent who owns bedtime confirms the plan in the family chat: bath, books, lights out.",
      "“Pause” means twenty minutes with a named return time. The other parent protects that time without following up.",
    ],
    recommendedCourseSlug: "repair-after-the-storm",
    roomName: "kinora-seed-bedtime",
  };
}

function seedMemory(session: Session, now: Date): MemoryItem[] {
  const items: MemoryItem[] = [
    {
      id: "seed-memory-child-sophie",
      kind: "child",
      text: "Sophie is 6. Kinora has not completed a discovery profile yet — the family only has a first name, birth date, and everyday observations.",
      sourceId: "seed-child-sophie",
      createdAt: daysAgoIso(40, 10, 0, now),
    },
    {
      id: "seed-memory-mood-lucy",
      kind: "mood",
      text: "Lucy has logged more cloudy and rainy days than sunny ones over the last week. Her note on the rainiest day: “Long day. Too many meetings.”",
      sourceId: "seed-mood-lucy",
      createdAt: daysAgoIso(1, 8, 5, now),
    },
    {
      id: "seed-memory-session-bedtime",
      kind: "session",
      text: `Past session — ${session.summary?.whatWeHeard ?? session.problem}`,
      sourceId: session.id,
      createdAt: session.completedAt ?? session.createdAt,
    },
    {
      id: "seed-memory-course",
      kind: "course",
      text: "“Repair After the Storm” is in progress at slide 2 of 4. It was recommended after the bedtime session.",
      sourceId: "repair-after-the-storm",
      createdAt: daysAgoIso(5, 21, 0, now),
    },
  ];

  for (const agreement of session.summary?.agreements ?? []) {
    items.push({
      id: `seed-memory-agreement-${items.length}`,
      kind: "agreement",
      text: `Agreement from “${session.title}”: ${agreement}`,
      sourceId: session.id,
      createdAt: session.completedAt ?? session.createdAt,
    });
  }

  return items;
}

export function createSeedState(now: Date = new Date()): FamilyState {
  const session = seedSession(now);

  return {
    version: 1,
    family: {
      id: "family_bennett",
      name: "The Bennett Family",
      createdAt: daysAgoIso(120, 10, 0, now),
      plan: "family",
      members: [
        {
          id: memberIds.michael,
          name: "Michael Bennett",
          role: "husband",
          avatarColor: "#8B5CF6",
          pronouns: "he/him",
        },
        {
          id: memberIds.lucy,
          name: "Lucy Bennett",
          role: "wife",
          avatarColor: "#E88AAE",
          pronouns: "she/her",
        },
      ],
    },
    moods: seedMoods(now),
    children: [
      {
        id: "seed-child-sophie",
        name: "Sophie",
        birthDate: birthDateForAge(6, now),
        avatarColor: "#F5B942",
        createdAt: daysAgoIso(40, 10, 0, now),
        assessments: [],
      },
    ],
    sessions: [session],
    courses: [
      {
        slug: "repair-after-the-storm",
        slideIndex: 1,
        startedAt: daysAgoIso(5, 21, 0, now),
      },
    ],
    threads: [],
    memory: seedMemory(session, now),
    settings: {
      assistantName: "Kinora",
    },
  };
}

export const seedMemberIds = memberIds;
