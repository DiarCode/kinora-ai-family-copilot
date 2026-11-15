import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export type AiMode = "engine" | "llm" | "auto";

export function aiMode(): AiMode {
  const value = (process.env.KINORA_AI_MODE ?? "engine").toLowerCase();
  if (value === "llm" || value === "auto") return value;
  return "engine";
}

function provider() {
  const baseURL =
    process.env.KINORA_LLM_BASE_URL ??
    process.env.OLLAMA_BASE_URL ??
    "http://localhost:11434/v1";
  const apiKey =
    process.env.KINORA_LLM_API_KEY ??
    process.env.OLLAMA_API_KEY ??
    process.env.OPENAI_API_KEY ??
    "kinora-local";
  return createOpenAICompatible({
    name: "kinora",
    baseURL,
    apiKey,
  });
}

export function llmModelName(): string {
  return (
    process.env.KINORA_LLM_MODEL ??
    process.env.OPENAI_MODEL ??
    "gemma4:e2b-it-qat"
  );
}

export type LlmRequest = {
  system: string;
  prompt: string;
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

/**
 * Optional LLM polish. The app never depends on this call: a missing key,
 * an offline model, or a slow model all fall back to the deterministic Kinora
 * Engine. The UI reports which path answered.
 */
export async function generateWithLLM({
  system,
  prompt,
  maxOutputTokens = 420,
  temperature = 0.6,
  timeoutMs = Number(process.env.KINORA_LLM_TIMEOUT_MS ?? 20000),
}: LlmRequest): Promise<string | null> {
  if (aiMode() === "engine") return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const { text } = await generateText({
      model: provider()(llmModelName()),
      system,
      prompt,
      temperature,
      maxOutputTokens,
      abortSignal: controller.signal,
    });
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function llmEnabled(): boolean {
  return aiMode() !== "engine";
}
