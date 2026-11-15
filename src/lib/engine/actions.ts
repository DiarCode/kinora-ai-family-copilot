import type { FamilyState, NextAction, Parent } from "@/lib/types";
import { courses } from "@/content/courses";
import {
  daysSince,
  isProfileStale,
  todayKey,
} from "@/lib/date";
import { firstName } from "@/lib/utils";

const MOOD_LABEL = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
} as const;

function parentFor(state: FamilyState, id: string): Parent | undefined {
  return state.family.members.find((member) => member.id === id);
}

export function buildNextActions(
  state: FamilyState,
  now: Date = new Date(),
): NextAction[] {
  const actions: NextAction[] = [];
  const today = todayKey(now);
  const todaysMoods = state.moods.filter((mood) => mood.date === today);
  const lastSession = [...state.sessions]
    .filter((session) => session.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0];
  const upcoming = [...state.sessions]
    .filter((session) => session.status === "scheduled")
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""))[0];

  const rainy = todaysMoods.filter((mood) => mood.value === "rainy");
  for (const mood of rainy) {
    const parent = parentFor(state, mood.memberId);
    if (!parent) continue;
    actions.push({
      id: `rainy-${parent.id}`,
      title: `A ten-minute reset for ${firstName(parent.name)}`,
      description:
        "Kinora will build a short, doable reset around how much capacity is left today — no fixing required.",
      reason: `${firstName(parent.name)} marked today as Rainy.`,
      href: `/app/assistant?prompt=${encodeURIComponent(
        `I'm having a rainy day. Give me a ten-minute reset I can actually do today, and tell me what to say to my family.`,
      )}`,
      icon: "rain",
      tone: "rain",
      priority: 100,
    });
  }

  const lowWeather = todaysMoods.filter(
    (mood) => mood.value === "cloudy" || mood.value === "rainy",
  );
  if (lowWeather.length >= 2 || (lowWeather.length === 1 && todaysMoods.length < 2)) {
    actions.push({
      id: "team-checkin",
      title: "Book a ten-minute team check-in",
      description:
        "A short, structured conversation while things are calm usually does more than solving it mid-storm.",
      reason:
        lowWeather.length >= 2
          ? "Both of you are running low today."
          : "One of you is running low, and the team can carry it together.",
      href: "/app/sessions/new",
      icon: "calendar",
      tone: "purple",
      priority: 90,
    });
  }

  for (const child of state.children) {
    if (!child.profile) {
      actions.push({
        id: `discover-${child.id}`,
        title: `Discover ${child.name}'s strengths`,
        description:
          "A short, picture-first check-in turns what you already notice into a strengths map and a few things to try.",
        reason: `Kinora has not mapped ${child.name} yet — the profile is a blank page.`,
        href: `/app/children/${child.id}`,
        icon: "user",
        tone: "sun",
        priority: 85,
      });
      continue;
    }
    if (isProfileStale(child.profile.retakeAfter, now)) {
      actions.push({
        id: `retake-${child.id}`,
        title: `${child.name}'s strengths map is ready for a refresh`,
        description:
          "Interests and skills move quickly. A three-minute retake keeps the suggestions honest.",
        reason: `${child.name}'s last discovery is more than 90 days old.`,
        href: `/app/children/${child.id}`,
        icon: "sparkles",
        tone: "sun",
        priority: 70,
      });
    }
  }

  const inProgress = state.courses.find((progress) => !progress.completedAt);
  if (inProgress) {
    const course = courses.find((item) => item.slug === inProgress.slug);
    if (course) {
      actions.push({
        id: `course-${course.slug}`,
        title: `Continue “${course.title}”`,
        description: `${course.minutes} minutes, one practical takeaway, one short quiz.`,
        reason: `You're on slide ${inProgress.slideIndex + 1} of ${course.slides.length}.`,
        href: `/app/courses/${course.slug}`,
        icon: "book",
        tone: "purple",
        priority: 60,
      });
    }
  }

  if (upcoming?.scheduledFor) {
    actions.push({
      id: `upcoming-${upcoming.id}`,
      title: "Prepare for your session",
      description:
        "Write one sentence about what you want to understand — it makes the first minute much easier.",
      reason: `A session is scheduled for ${new Date(upcoming.scheduledFor).toLocaleDateString("en-US", {
        weekday: "long",
        hour: "numeric",
        minute: "2-digit",
      })}.`,
      href: `/app/sessions/${upcoming.id}`,
      icon: "voice",
      tone: "purple",
      priority: 95,
    });
  } else if (lastSession?.completedAt) {
    const gap = daysSince(lastSession.completedAt, now);
    if (gap >= 7) {
      actions.push({
        id: "session-gap",
        title: "A fifteen-minute check-in with Kinora",
        description:
          "Not a crisis conversation — just a tune-up for the team. Bring one small thing that has been circling.",
        reason: `It's been ${gap} days since your last session.`,
        href: "/app/sessions/new",
        icon: "voice",
        tone: "purple",
        priority: 55,
      });
    }
  } else {
    actions.push({
      id: "first-session",
      title: "Try a first session with Kinora",
      description:
        "A calm, structured conversation for the two of you. You can start now or schedule it for later.",
      reason: "Kinora has not heard the two of you together yet.",
      href: "/app/sessions/new",
      icon: "voice",
      tone: "purple",
      priority: 55,
    });
  }

  const allSunny =
    todaysMoods.length === state.family.members.length &&
    todaysMoods.every((mood) => mood.value === "sunny");
  if (allSunny) {
    actions.push({
      id: "sunny-ritual",
      title: "Bank the good day",
      description:
        "Pick one small family ritual for this week — a walk, a meal, a ten-minute game — and put it on the calendar.",
      reason: "Both of you marked today as Sunny.",
      href: "/app/courses/connection-missions-by-age",
      icon: "sun",
      tone: "sun",
      priority: 80,
    });
  }

  const seen = new Set<string>();
  return actions
    .sort((a, b) => b.priority - a.priority)
    .filter((action) => {
      if (seen.has(action.id)) return false;
      seen.add(action.id);
      return true;
    })
    .slice(0, 4);
}

export function moodSummary(state: FamilyState, now: Date = new Date()) {
  const today = todayKey(now);
  const todayMoods = state.moods.filter((mood) => mood.date === today);
  return state.family.members.map((member) => {
    const mood = todayMoods.find((entry) => entry.memberId === member.id);
    return {
      member,
      value: mood?.value,
      label: mood ? MOOD_LABEL[mood.value] : "Not checked in",
    };
  });
}
