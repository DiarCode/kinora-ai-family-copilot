import type { FamilyState, MemoryItem } from "@/lib/types";
import { ageFromBirthDate, dateKeyOffset, isProfileStale, todayKey } from "@/lib/date";
import { courses } from "@/content/courses";
import { firstName } from "@/lib/utils";

const moodWords = {
  sunny: "sunny",
  cloudy: "cloudy",
  rainy: "rainy",
} as const;

/**
 * Memory is derived from real state, not from a hidden transcript. It is
 * deliberately readable: the assistant can show exactly which facts it used.
 */
export function deriveMemory(
  state: FamilyState,
  now: Date = new Date(),
): MemoryItem[] {
  const items: MemoryItem[] = [];
  const today = todayKey(now);
  const weekAgo = dateKeyOffset(-7, now);

  const members = state.family.members.map((member) => {
    const todayMood = state.moods.find(
      (mood) => mood.memberId === member.id && mood.date === today,
    );
    const recent = state.moods
      .filter((mood) => mood.memberId === member.id && mood.date >= weekAgo)
      .sort((a, b) => a.date.localeCompare(b.date));
    const counts = recent.reduce(
      (acc, mood) => {
        acc[mood.value] += 1;
        return acc;
      },
      { sunny: 0, cloudy: 0, rainy: 0 },
    );
    return { member, todayMood, recent, counts };
  });

  for (const { member, todayMood, counts } of members) {
    const name = firstName(member.name);
    if (todayMood) {
      items.push({
        id: `memory-mood-today-${member.id}`,
        kind: "mood",
        text: `${name} marked today as ${moodWords[todayMood.value]}${
          todayMood.note ? ` — “${todayMood.note}”` : ""
        }.`,
        sourceId: todayMood.id,
        createdAt: todayMood.createdAt,
      });
    }
    const total = counts.sunny + counts.cloudy + counts.rainy;
    if (total > 0) {
      items.push({
        id: `memory-mood-week-${member.id}`,
        kind: "mood",
        text: `In the last seven days, ${name} logged ${counts.sunny} sunny, ${counts.cloudy} cloudy, and ${counts.rainy} rainy day${counts.rainy === 1 ? "" : "s"}.`,
        sourceId: member.id,
        createdAt: now.toISOString(),
      });
    }
  }

  for (const child of state.children) {
    const age = ageFromBirthDate(child.birthDate, now);
    if (!child.profile) {
      items.push({
        id: `memory-child-${child.id}`,
        kind: "child",
        text: `${child.name} is ${age}. Kinora has not completed a discovery profile for ${child.name} yet — the family only has a first name, birth date, and everyday observations.`,
        sourceId: child.id,
        createdAt: child.createdAt,
      });
    } else {
      const top = Object.entries(child.profile.traits)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([trait]) => trait)
        .join(" and ");
      items.push({
        id: `memory-child-${child.id}`,
        kind: "child",
        text: `${child.name} is ${age}. Discovery profile: ${child.profile.archetype}. Strongest signals: ${top}. Interests: ${child.profile.interests.slice(0, 3).join(", ")}.${
          isProfileStale(child.profile.retakeAfter, now)
            ? " The profile is due for a refresh."
            : ""
        }`,
        sourceId: child.id,
        createdAt: child.profile.completedAt,
      });
    }
  }

  const completed = state.sessions
    .filter((session) => session.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const latest = completed[0];
  if (latest) {
    items.push({
      id: `memory-session-${latest.id}`,
      kind: "session",
      text: `Most recent completed session — “${latest.title}”. ${latest.summary?.whatWeHeard ?? latest.problem}`,
      sourceId: latest.id,
      createdAt: latest.completedAt ?? latest.createdAt,
    });
    if (latest.summary?.agreements.length) {
      items.push({
        id: `memory-agreements-${latest.id}`,
        kind: "agreement",
        text: `Agreements from “${latest.title}”: ${latest.summary.agreements.join(" ")}`,
        sourceId: latest.id,
        createdAt: latest.summary.createdAt,
      });
    }
  }

  const scheduled = state.sessions
    .filter((session) => session.status === "scheduled")
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));
  for (const session of scheduled.slice(0, 2)) {
    items.push({
      id: `memory-scheduled-${session.id}`,
      kind: "session",
      text: `Upcoming session “${session.title}” scheduled for ${session.scheduledFor}.`,
      sourceId: session.id,
      createdAt: session.createdAt,
    });
  }

  for (const progress of state.courses) {
    const course = courses.find((item) => item.slug === progress.slug);
    if (!course) continue;
    items.push({
      id: `memory-course-${progress.slug}`,
      kind: "course",
      text: progress.completedAt
        ? `Completed course “${course.title}” with a score of ${progress.score}/${progress.total}.`
        : `Course “${course.title}” is in progress at slide ${progress.slideIndex + 1} of ${course.slides.length}.`,
      sourceId: progress.slug,
      createdAt: progress.completedAt ?? progress.startedAt,
    });
  }

  items.push({
    id: "memory-family",
    kind: "plan",
    text: `${state.family.name}: ${state.family.members
      .map((member) => firstName(member.name))
      .join(" and ")}. ${state.children.length} child${
      state.children.length === 1 ? "" : "ren"
    } in the family profile. Plan: ${state.family.plan === "plus" ? "Kinora Plus" : "Family"}.`,
    sourceId: state.family.id,
    createdAt: state.family.createdAt,
  });

  return items;
}

export function syncMemory(state: FamilyState, now: Date = new Date()): void {
  state.memory = deriveMemory(state, now);
}

export type AssistantMemory = {
  items: MemoryItem[];
  labels: string[];
};

const childLabel = (state: FamilyState, childId: string) => {
  const child = state.children.find((item) => item.id === childId);
  if (!child) return "Child profile";
  return child.profile ? `${child.name}'s profile` : `${child.name} (not yet mapped)`;
};

export function memoryForAssistant(
  state: FamilyState,
  query: string,
  now: Date = new Date(),
): AssistantMemory {
  const q = query.toLowerCase();
  const all = deriveMemory(state, now);
  const selected: MemoryItem[] = [];
  const labels: string[] = [];

  const push = (item: MemoryItem | undefined, label: string) => {
    if (!item || labels.includes(label)) return;
    selected.push(item);
    labels.push(label);
  };

  push(all.find((item) => item.id === "memory-family"), "Family profile");

  for (const child of state.children) {
    if (
      q.includes(child.name.toLowerCase()) ||
      q.includes("child") ||
      q.includes("kid") ||
      q.includes("school") ||
      q.includes("bedtime") ||
      selected.length < 2
    ) {
      push(
        all.find((item) => item.id === `memory-child-${child.id}`),
        childLabel(state, child.id),
      );
    }
  }

  if (
    q.includes("session") ||
    q.includes("bedtime") ||
    q.includes("argument") ||
    q.includes("fight") ||
    q.includes("repair") ||
    q.includes("agreement") ||
    q.includes("last time") ||
    selected.length < 4
  ) {
    const session = all.find((item) => item.kind === "session");
    if (session) {
      const title = state.sessions.find((item) => item.id === session.sourceId)?.title;
      push(session, title ? `Last session: ${title}` : "Last session");
    }
    const agreement = all.find((item) => item.kind === "agreement");
    if (agreement && (q.includes("agreement") || q.includes("repair"))) {
      push(agreement, "Saved agreements");
    }
  }

  const moodItems = all.filter((item) => item.kind === "mood");
  if (moodItems.length) {
    const todayItem = moodItems.find((item) => item.id.startsWith("memory-mood-today"));
    push(todayItem ?? moodItems[0], "Today's moods");
    if (q.includes("week") || q.includes("pattern") || q.includes("mood")) {
      const weekItem = moodItems.find((item) => item.id.startsWith("memory-mood-week"));
      push(weekItem, "7-day mood history");
    }
  }

  if (q.includes("course") || q.includes("learn") || q.includes("read") || selected.length < 5) {
    const course = all.find((item) => item.kind === "course");
    if (course) {
      const courseTitle = courses.find((item) => item.slug === course.sourceId)?.title;
      push(course, courseTitle ? `Course: ${courseTitle}` : "Course progress");
    }
  }

  return { items: selected.slice(0, 6), labels: labels.slice(0, 6) };
}
