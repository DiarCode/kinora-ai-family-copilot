import { NextResponse } from "next/server";

export type RateLimitRule = {
  /** Stable bucket name, e.g. "assistant-minute". */
  bucket: string;
  limit: number;
  windowMs: number;
};

export type RateLimitDecision =
  | { ok: true; remaining: number }
  | { ok: false; retryAfter: number; remaining: 0 };

/**
 * A small sliding-window limiter for the demo's single Node process.
 *
 * It protects the expensive paths (LLM assistant, session turns, LiveKit
 * tokens/dispatch) from casual loops and accidental token burn. For a
 * multi-instance deployment, swap the map for Redis/Upstash or a Supabase
 * counter table behind the same `check()` interface.
 */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();
  private lastSweep = 0;

  constructor(
    private readonly now: () => number = () => Date.now(),
  ) {}

  check(key: string, limit: number, windowMs: number): RateLimitDecision {
    const now = this.now();
    this.sweep(now);
    const cutoff = now - windowMs;
    const recent = (this.hits.get(key) ?? []).filter((time) => time > cutoff);

    if (recent.length >= limit) {
      const oldest = recent[0];
      const retryAfter = Math.max(
        1,
        Math.ceil((oldest + windowMs - now) / 1000),
      );
      this.hits.set(key, recent);
      return { ok: false, retryAfter, remaining: 0 };
    }

    recent.push(now);
    this.hits.set(key, recent);
    return { ok: true, remaining: Math.max(0, limit - recent.length) };
  }

  reset(): void {
    this.hits.clear();
    this.lastSweep = 0;
  }

  size(): number {
    return this.hits.size;
  }

  private sweep(now: number): void {
    if (now - this.lastSweep < 60_000) return;
    this.lastSweep = now;
    for (const [key, times] of this.hits) {
      if (!times.length || times[times.length - 1] < now - 86_400_000) {
        this.hits.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "local"
  );
}

export function enforceRateLimit(
  request: Request,
  rules: RateLimitRule[],
): NextResponse | null {
  const ip = clientIp(request);
  for (const rule of rules) {
    const decision = rateLimiter.check(
      `${rule.bucket}:${ip}`,
      rule.limit,
      rule.windowMs,
    );
    if (!decision.ok) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${decision.retryAfter}s and try again.`,
          retryAfter: decision.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(decision.retryAfter),
            "X-RateLimit-Limit": String(rule.limit),
            "X-RateLimit-Remaining": "0",
            "Cache-Control": "no-store, max-age=0",
          },
        },
      );
    }
  }
  return null;
}

export const RATE_LIMITS = {
  assistant: [
    { bucket: "assistant-minute", limit: 15, windowMs: 60_000 },
    { bucket: "assistant-day", limit: 200, windowMs: 86_400_000 },
  ],
  sessionTurn: [
    { bucket: "session-turn-minute", limit: 40, windowMs: 60_000 },
    { bucket: "session-turn-day", limit: 600, windowMs: 86_400_000 },
  ],
  livekitToken: [
    { bucket: "livekit-token-minute", limit: 8, windowMs: 60_000 },
    { bucket: "livekit-token-day", limit: 80, windowMs: 86_400_000 },
  ],
  livekitDispatch: [
    { bucket: "livekit-dispatch-minute", limit: 6, windowMs: 60_000 },
  ],
  sessionCreate: [
    { bucket: "session-create-minute", limit: 20, windowMs: 60_000 },
    { bucket: "session-create-day", limit: 200, windowMs: 86_400_000 },
  ],
  assessment: [
    { bucket: "assessment-minute", limit: 10, windowMs: 60_000 },
    { bucket: "assessment-day", limit: 100, windowMs: 86_400_000 },
  ],
  transcript: [
    { bucket: "transcript-minute", limit: 120, windowMs: 60_000 },
  ],
  global: [
    { bucket: "api-global-minute", limit: 600, windowMs: 60_000 },
  ],
} satisfies Record<string, RateLimitRule[]>;
