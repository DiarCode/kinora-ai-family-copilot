import type { FamilyState } from "@/lib/types";
import { assessSafety } from "@/lib/engine/safety";
import { memoryForAssistant } from "@/lib/engine/memory";
import { buildNextActions } from "@/lib/engine/actions";
import { courses } from "@/content/courses";
import { ageFromBirthDate, isProfileStale, todayKey } from "@/lib/date";
import { firstName } from "@/lib/utils";

export type AssistantReply = {
  text: string;
  memoryUsed: string[];
  suggestedPrompts: string[];
  mode: "engine" | "llm";
  safety?: boolean;
};

const moodLabel = { sunny: "Sunny", cloudy: "Cloudy", rainy: "Rainy" } as const;

const link = (href: string, label: string) => `[${label}](${href})`;

const firstNameOf = (name: string) => firstName(name);

function todaysMoodLines(state: FamilyState) {
  const today = todayKey();
  return state.family.members.map((member) => {
    const mood = state.moods.find(
      (entry) => entry.memberId === member.id && entry.date === today,
    );
    return `${firstNameOf(member.name)}: ${mood ? moodLabel[mood.value] : "not checked in yet"}`;
  });
}

function profileLine(state: FamilyState, childId: string): string {
  const child = state.children.find((item) => item.id === childId);
  if (!child) return "that child";
  if (!child.profile) {
    return `${child.name} (${ageFromBirthDate(child.birthDate)}) doesn't have a discovery profile yet — Kinora only has a first name and birth date.`;
  }
  const top = Object.entries(child.profile.traits)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([trait]) =>
      trait.charAt(0).toUpperCase() + trait.slice(1),
    );
  return `${child.name} (${ageFromBirthDate(child.birthDate)}) is profiled as ${child.profile.archetype}. Strongest signals: ${top.join(" and ")}. Interests: ${child.profile.interests.slice(0, 3).join(", ")}.`;
}

function childFocus(state: FamilyState, message: string) {
  const lower = message.toLowerCase();
  const named = state.children.find((child) =>
    lower.includes(child.name.toLowerCase()),
  );
  return named ?? (state.children.length === 1 ? state.children[0] : undefined);
}

function conflictReply(state: FamilyState, message: string): string {
  const lower = message.toLowerCase();
  const wife = state.family.members.find((member) => member.role === "wife");
  const partnerName = wife ? firstNameOf(wife.name) : "your partner";
  const user = state.family.members[0];
  const isVentingAboutPartner =
    /\b(she|he|wife|husband|partner)\b\s+(always|never|doesn'?t|won'?t|is)/i.test(
      lower,
    ) ||
    lower.includes("my fault") ||
    lower.includes("i'm right") ||
    lower.includes("i am right");

  if (isVentingAboutPartner) {
    return `I'm not going to decide who's right — research on AI and conflict finds that a one-sided, flattering conversation can make repair *less* likely. What I can hear is that you're carrying a lot, ${firstNameOf(
      user.name,
    )}, and that the same argument keeps coming back.\n\nA soft start that usually lands better: “I'm not blaming you. I'm overwhelmed, and I need us to figure this out together.” If you want, open a two-sided session — I'll hear ${partnerName} too, and you'll both get the same airtime. ${link(
      "/app/sessions/new",
      "Start a shared session",
    )}\n\nThis is coaching, not therapy.`;
  }

  return `Conflict is not the injury; unrepaired conflict is. The most useful move is usually not another explanation — it is a pause with a named return time, then a repair conversation where each person names their own part.\n\nIf you want, I can walk you through a 3-question repair. ${link(
    "/app/courses/repair-after-the-storm",
    "Open “Repair After the Storm”",
  )} or ${link("/app/sessions/new", "start a two-sided session")}.`;
}

function moodReply(state: FamilyState, message: string): string {
  const lines = todaysMoodLines(state);
  const actions = buildNextActions(state);
  const rainy = state.family.members.find((member) => {
    const mood = state.moods.find(
      (entry) => entry.memberId === member.id && entry.date === todayKey(),
    );
    return mood?.value === "rainy";
  });
  const action = actions[0];
  const asksForReset = /rainy|cloudy|reset|low|overwhelmed|exhausted|tired|stress/i.test(
    message,
  );

  const reset =
    "A useful reset is small: ten minutes outside, water, and one sentence to the family — “I'm low on capacity; I need a quiet hour, then I'm back.” No fixing required.";

  return `Here's the weather report: ${lines.join(" · ")}.\n\n${
    rainy
      ? `${firstNameOf(rainy.name)} is running on empty today. ${reset}`
      : asksForReset
        ? `You're describing a rainy-day kind of day. ${reset}`
        : "Nothing is on fire. A good next step is to protect one small point of connection today — a walk, a shared meal, or ten minutes of child-led play."
  }${action ? `\n\nKinora's next suggestion: **${action.title}** — ${action.reason} ${link(action.href, "Open it")}` : ""}`;
}

function childReply(state: FamilyState, message: string): string {
  const child = childFocus(state, message);
  if (!child) {
    const names = state.children.map((item) => item.name).join(", ");
    return `I can help with ${names || "your children"}. Which child are you thinking about, and what are you noticing right now?`;
  }
  if (!child.profile) {
    return `${profileLine(state, child.id)}\n\nThat's the honest starting point: Kinora doesn't know ${child.name} yet. The best next step is a short, picture-first discovery — you answer what you already notice, and it turns into a strengths map, interests, and three things to try this week. It takes about three minutes and it is not a diagnosis.\n\n${link(
      `/app/children/${child.id}`,
      `Start ${child.name}'s discovery`,
    )}`;
  }
  const tips = child.profile.parentingTips.slice(0, 2).join(" ");
  const stale = isProfileStale(child.profile.retakeAfter);
  return `${profileLine(state, child.id)}\n\nWhat that means in practice: ${tips}\n\nA small thing to try this week: ${child.profile.activities[0]}${
    stale
      ? `\n\n${child.name}'s profile is due for a refresh — interests move quickly at this age.`
      : ""
  } ${link(`/app/children/${child.id}`, `Open ${child.name}'s profile`)}`;
}

function sessionReply(state: FamilyState): string {
  const completed = [...state.sessions]
    .filter((session) => session.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const latest = completed[0];
  const upcoming = state.sessions.find((session) => session.status === "scheduled");

  if (latest?.summary) {
    return `The last session was **${latest.title}**. What I heard: ${latest.summary.whatWeHeard.slice(
      0,
      260,
    )}${latest.summary.whatWeHeard.length > 260 ? "…" : ""}\n\nYour agreements:\n\n${latest.summary.agreements
      .map((agreement, index) => `${index + 1}. ${agreement}`)
      .join("\n")}\n\nNext step: ${latest.summary.nextStep} ${link(
      `/app/sessions/${latest.id}`,
      "Open the summary",
    )}`;
  }
  if (upcoming?.scheduledFor) {
    return `You have a session scheduled for ${new Date(upcoming.scheduledFor).toLocaleString(
      "en-US",
      { weekday: "long", hour: "numeric", minute: "2-digit" },
    )}. Before it starts, write one sentence about what you want to understand — not what you want your partner to admit. That single sentence makes the first minute easier. ${link(
      `/app/sessions/${upcoming.id}`,
      "Open the session",
    )}`;
  }
  return `You haven't had a session yet. A first one is not a crisis conversation — it's a structured 15–20 minutes where Kinora hears both sides and helps you choose one agreement. You can start now or schedule it for later. ${link(
    "/app/sessions/new",
    "Start a session",
  )}`;
}

function courseReply(state: FamilyState): string {
  const inProgress = state.courses.find((progress) => !progress.completedAt);
  const course = inProgress
    ? courses.find((item) => item.slug === inProgress.slug)
    : courses[0];
  if (!course) return "The course library is empty right now.";
  const completed = state.courses.filter((progress) => progress.completedAt).length;
  return `${inProgress ? `You're partway through **${course.title}** — slide ${inProgress.slideIndex + 1} of ${course.slides.length}.` : `A good place to start is **${course.title}**.`}\n\n${course.subtitle} It takes ${course.minutes} minutes, ends with a three-question quiz, and gives you one thing to try in real life. You've completed ${completed} course${completed === 1 ? "" : "s"} so far.\n\n${link(
    `/app/courses/${course.slug}`,
    inProgress ? "Continue the course" : "Open the course",
  )}`;
}

function planReply(state: FamilyState): string {
  const actions = buildNextActions(state).slice(0, 3);
  const upcoming = state.sessions.find((session) => session.status === "scheduled");
  const child = state.children[0];
  const steps = actions.map(
    (action, index) => `${index + 1}. **${action.title}** — ${action.description}`,
  );
  return `Here's a small plan for the next few days, drawn from what's actually in your family right now:\n\n${steps.join(
    "\n",
  )}${upcoming ? `\n\nYour next session is on the calendar for ${new Date(upcoming.scheduledFor ?? "").toLocaleDateString("en-US", { weekday: "long" })}.` : ""}${
    child && !child.profile
      ? `\n\nOne honest gap: ${child.name} doesn't have a profile yet. Three minutes with the discovery would make every child-related suggestion more specific.`
      : ""
  }\n\nPick one. The rest can wait.`;
}

function welcomeText(state: FamilyState): string {
  const user = state.family.members[0];
  const action = buildNextActions(state)[0];
  const lastSession = [...state.sessions]
    .filter((session) => session.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0];
  const memoryLine = lastSession
    ? ` Your last session, **${lastSession.title}**, is still in memory.`
    : "";
  return `Hi ${firstNameOf(user.name)}. ${
    action
      ? `One thing worth your attention: **${action.title}**.${memoryLine}`
      : `I'm here for the small things and the hard conversations.${memoryLine}`
  }\n\nWhat would you like to work through?`;
}

export function buildAssistantWelcome(state: FamilyState): AssistantReply {
  return {
    text: welcomeText(state),
    memoryUsed: [
      "Family profile",
      "Today's moods",
      "Next best action",
      ...(state.sessions.some((session) => session.status === "completed")
        ? ["Last session"]
        : []),
    ],
    suggestedPrompts: [
      "What's the smallest thing we can change about bedtime?",
      state.children[0]?.profile
        ? `How do I support ${state.children[0].name}'s strengths this week?`
        : `How do we start ${state.children[0]?.name ?? "our child"}'s discovery?`,
      "What did we agree in our last session?",
      "Give us a ten-minute reset for a rainy day.",
    ],
    mode: "engine",
  };
}

export function buildEngineReply(
  state: FamilyState,
  message: string,
): AssistantReply {
  const safety = assessSafety(message);
  if (safety.flagged) {
    const resourceLines = safety.resources
      .map((resource) => `- [${resource.label}](${resource.href})`)
      .join("\n");
    return {
      text: `${safety.message ?? "Your safety comes first."}\n\n${resourceLines}\n\nThis is not a coaching moment. Please use the resources above.`,
      memoryUsed: ["Safety screening"],
      suggestedPrompts: [],
      mode: "engine",
      safety: true,
    };
  }

  const memory = memoryForAssistant(state, message);
  const lower = message.toLowerCase();
  const user = state.family.members[0];
  const userName = firstNameOf(user.name);
  let text: string;

  if (/^(hi|hello|hey|good morning|good evening|good afternoon)\b/i.test(lower)) {
    text = `Hi ${userName}. I'm here. ${todaysMoodLines(state).join(" · ")}. What's on your mind — a mood, a child, a conversation, or something you're trying to plan?`;
  } else if (
    /(mood|feel|feeling|rainy|cloudy|sunny|overwhelmed|exhausted|tired|stress)/i.test(
      lower,
    )
  ) {
    text = moodReply(state, message);
  } else if (
    state.children.some((child) => lower.includes(child.name.toLowerCase())) ||
    /(child|kid|son|daughter|school|homework|tantrum|interest|career|discovery|profile)/i.test(
      lower,
    )
  ) {
    text = childReply(state, message);
  } else if (
    /(session|last time|agreement|repair|conversation|talk it through|bedtime|sleep|night|screen|morning|handoff)/i.test(
      lower,
    )
  ) {
    text = sessionReply(state);
  } else if (/(course|learn|lesson|read|quiz)/i.test(lower)) {
    text = courseReply(state);
  } else if (
    /(argue|argument|fight|conflict|blame|wife|husband|partner|my spouse|\bshe\s+(always|never|doesn'?t|won'?t|is)|\bhe\s+(always|never|doesn'?t|won'?t|is))/i.test(
      lower,
    )
  ) {
    text = conflictReply(state, message);
  } else if (/(plan|schedule|week|tomorrow|routine|next)/i.test(lower)) {
    text = planReply(state);
  } else {
    const action = buildNextActions(state)[0];
    text = `I'm listening, ${userName}. ${profileLine(
      state,
      state.children[0]?.id ?? "",
    )} ${
      action
        ? `If you want one concrete next step, I'd start with **${action.title}** — ${action.reason}`
        : ""
    }\n\nTell me a little more: is this about a mood, a child, a decision, or a conversation with ${firstNameOf(
      state.family.members[1]?.name ?? "your partner",
    )}?`;
  }

  return {
    text,
    memoryUsed: memory.labels,
    suggestedPrompts: [
      "What's the smallest change we can try this week?",
      "What does the research say about repair?",
      "Help me plan a ten-minute family ritual.",
    ],
    mode: "engine",
  };
}
