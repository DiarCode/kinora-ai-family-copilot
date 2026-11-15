import type { Family, Session, Turn } from "@/lib/types";
import { generateWithLLM, llmEnabled } from "@/lib/engine/llm";
import {
  classifyProblem,
  nextKinoraTurn,
  type NextTurnResult,
} from "@/lib/engine/psychologist";
import { firstName } from "@/lib/utils";

const SYSTEM = `You are Kinora, a calm, warm, professional family coach leading a structured session with two parents.
You are not a therapist and you never diagnose.

Hard rules:
- Never decide who is right. Reflect both sides and name each person's own contribution when relevant.
- Keep the structured intent of the draft turn. Do not add a verdict, a diagnosis, or clinical advice.
- Speak in plain, natural prose. No markdown, no lists, no emojis, no stage directions.
- 1–3 short sentences. Ask exactly one question, addressed to the parent who has the floor.
- If either parent is flooded, suggest a twenty-minute pause with a return time.
- If there is abuse, violence, or self-harm, stop coaching and give 911, 988, or 1-800-799-7233.
- Use the parents' first names naturally.`;

function sanitizeTurn(text: string): string {
  return text
    .replace(/^kinora\s*:\s*/i, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1200);
}

/**
 * The deterministic engine is the structure and the safety net. When an LLM is
 * configured, it rewrites only the wording of the next turn; the phase, invited
 * speaker, safety routing, and turn kind stay identical.
 */
export async function generateKinoraTurn(
  session: Session,
  family: Family,
  now: Date = new Date(),
): Promise<NextTurnResult | null> {
  const base = nextKinoraTurn(session, family, now);
  if (!base || !llmEnabled() || base.turn.kind === "safety" || base.phase === "safety") {
    return base;
  }

  const domain = classifyProblem(session.problem);
  const invited = base.turn.invite
    ? family.members.find((member) => member.id === base.turn.invite)
    : undefined;
  const invitedName = invited ? firstName(invited.name) : "both parents";
  const transcript = session.turns
    .slice(-10)
    .map((turn: Turn) => `${turn.speakerName}: ${turn.text}`)
    .join("\n");

  const text = await generateWithLLM({
    system: SYSTEM,
    prompt: `Session problem: ${session.problem}
Domain: ${domain.label}
Current phase: ${base.phase}
The next speaker is: ${invitedName}
Structured draft to preserve: ${base.turn.text}

Recent transcript:
${transcript}

Write Kinora's next spoken turn only.`,
    maxOutputTokens: 220,
    temperature: 0.45,
    timeoutMs: Number(process.env.KINORA_SESSION_LLM_TIMEOUT_MS ?? 15000),
  });

  if (!text) return base;
  const cleaned = sanitizeTurn(text);
  if (!cleaned) return base;

  return {
    ...base,
    turn: {
      ...base.turn,
      text: cleaned,
    },
  };
}
