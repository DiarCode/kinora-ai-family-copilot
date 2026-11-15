import type { FamilyState } from "@/lib/types";
import { buildEngineReply, type AssistantReply } from "@/lib/engine/assistant";
import { generateWithLLM, llmEnabled, llmModelName } from "@/lib/engine/llm";
import { memoryForAssistant } from "@/lib/engine/memory";
import { todayKey } from "@/lib/date";
import { firstName } from "@/lib/utils";
import { courses } from "@/content/courses";

function contextBlock(state: FamilyState): string {
  const today = todayKey();
  const moods = state.family.members.map((member) => {
    const todayMood = state.moods.find(
      (mood) => mood.memberId === member.id && mood.date === today,
    );
    const recent = state.moods
      .filter((mood) => mood.memberId === member.id && mood.date >= today)
      .slice(-7);
    return `${firstName(member.name)}: today=${todayMood?.value ?? "not checked in"} (recent entries: ${recent.length})`;
  });

  const children = state.children.map((child) => {
    if (!child.profile) {
      return `${child.name}, ${child.birthDate}: no discovery profile yet.`;
    }
    return `${child.name}, ${child.birthDate}: ${child.profile.archetype}; traits ${JSON.stringify(
      child.profile.traits,
    )}; interests ${child.profile.interests.join(", ")}; strengths ${child.profile.strengths
      .slice(0, 2)
      .join(" | ")}; tips ${child.profile.parentingTips.slice(0, 2).join(" | ")}`;
  });

  const sessions = state.sessions
    .slice()
    .sort((a, b) => (b.completedAt ?? b.createdAt).localeCompare(a.completedAt ?? a.createdAt))
    .slice(0, 3)
    .map((session) => {
      const summary = session.summary
        ? ` summary: ${session.summary.whatWeHeard} agreements: ${session.summary.agreements.join(" | ")}`
        : "";
      return `${session.status} — ${session.title}: ${session.problem}.${summary}`;
    });

  const courseState = state.courses
    .map((progress) => {
      const course = courses.find((item) => item.slug === progress.slug);
      if (!course) return null;
      return `${course.title}: ${
        progress.completedAt
          ? `completed with ${progress.score}/${progress.total}`
          : `in progress at slide ${progress.slideIndex + 1}/${course.slides.length}`
      }`;
    })
    .filter(Boolean);

  return [
    `Family: ${state.family.name}. Parents: ${state.family.members
      .map((member) => `${member.name} (${member.role})`)
      .join(", ")}. The user is ${state.family.members[0].name}.`,
    `Moods: ${moods.join("; ")}.`,
    `Children: ${children.length ? children.join("; ") : "none added"}.`,
    `Sessions: ${sessions.length ? sessions.join("; ") : "none"}.`,
    `Courses: ${courseState.length ? courseState.join("; ") : "none"}.`,
  ].join("\n");
}

const systemPrompt = `You are Kinora, a warm, professional family copilot for two parents. You help with moods, next best actions, shared sessions, children's strengths, and short parenting courses.

Hard rules:
- You are a coach and skills educator, not a therapist, doctor, or mediator. Never diagnose. Never claim clinical authority.
- Never decide who is right in a couple conflict. Reflect both sides. If the user vents one-sidedly about their partner, acknowledge the feeling, explain briefly that a one-sided conversation makes repair harder, and invite a two-sided session.
- Use only facts in the family context. If something is missing, say so plainly (for example, "Sophie has no discovery profile yet").
- If the message suggests abuse, violence, self-harm, or immediate danger: stop coaching, tell them to call 911 if in immediate danger, 988 for crisis support, or 1-800-799-7233 for domestic violence support.
- Be concise: 90–160 words. No emojis. At most one short list.
- End with one concrete next step and include exactly one markdown link chosen from: /app/sessions/new, /app/children/{childId}, /app/courses/{slug}, /app/assistant.
- Tone: kind, clear, grounded, never saccharine. Do not use the word "journey".`;


function ensureActionLink(text: string, fallback?: string): string {
  if (/\[[^\]]+\]\(\/app\//.test(text)) return text;
  const bare = text.match(/\/app\/[^\s)\].,]+/);
  if (bare) {
    const path = bare[0];
    return text.replace(path, `[Open in Kinora](${path})`);
  }
  if (fallback) return `${text}\n\n${fallback}`;
  return text;
}

export async function generateAssistantReply(
  state: FamilyState,
  message: string,
): Promise<AssistantReply> {
  const engine = buildEngineReply(state, message);
  if (engine.safety || !llmEnabled()) return engine;

  const memory = memoryForAssistant(state, message);
  const llmText = await generateWithLLM({
    system: systemPrompt,
    prompt: `Family context:\n${contextBlock(state)}\n\nMemory labels available: ${memory.labels.join(
      ", ",
    )}\n\nUser message:\n${message}`,
    maxOutputTokens: 500,
    temperature: 0.5,
  });

  if (!llmText) return engine;

  const engineLink = engine.text.match(/\[[^\]]+\]\(\/app\/[^)]+\)/)?.[0];
  return {
    ...engine,
    text: ensureActionLink(llmText, engineLink),
    mode: "llm",
    memoryUsed: memory.labels,
    suggestedPrompts: engine.suggestedPrompts,
  };
}

export function aiStatus(): { mode: "engine" | "llm"; model: string } {
  return {
    mode: llmEnabled() ? "llm" : "engine",
    model: llmEnabled() ? llmModelName() : "Kinora Engine",
  };
}
