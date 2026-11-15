import { beforeEach, describe, expect, it } from "vitest";
import {
  clientIp,
  enforceRateLimit,
  RateLimiter,
  rateLimiter,
  RATE_LIMITS,
} from "@/lib/rate-limit";

const requestFrom = (ip: string) =>
  new Request("http://localhost/api/test", {
    headers: { "x-forwarded-for": ip },
  });

describe("RateLimiter", () => {
  it("allows requests up to the limit and denies the next one", () => {
    let now = 1_000;
    const limiter = new RateLimiter(() => now);

    expect(limiter.check("assistant", 2, 60_000)).toEqual({
      ok: true,
      remaining: 1,
    });
    now = 2_000;
    expect(limiter.check("assistant", 2, 60_000)).toEqual({
      ok: true,
      remaining: 0,
    });
    now = 3_000;
    expect(limiter.check("assistant", 2, 60_000)).toEqual({
      ok: false,
      retryAfter: 58,
      remaining: 0,
    });
  });

  it("uses independent windows per key", () => {
    const limiter = new RateLimiter(() => 10_000);
    expect(limiter.check("a", 1, 60_000).ok).toBe(true);
    expect(limiter.check("b", 1, 60_000).ok).toBe(true);
    expect(limiter.check("a", 1, 60_000).ok).toBe(false);
  });

  it("frees the window as old hits slide out", () => {
    let now = 0;
    const limiter = new RateLimiter(() => now);
    expect(limiter.check("w", 1, 1_000).ok).toBe(true);
    now = 500;
    expect(limiter.check("w", 1, 1_000).ok).toBe(false);
    now = 1_001;
    expect(limiter.check("w", 1, 1_000).ok).toBe(true);
  });
});

describe("enforceRateLimit", () => {
  beforeEach(() => rateLimiter.reset());

  it("returns a 429 with Retry-After once the bucket is full", () => {
    const rules = [{ bucket: "unit-minute", limit: 2, windowMs: 60_000 }];

    expect(enforceRateLimit(requestFrom("203.0.113.10"), rules)).toBeNull();
    expect(enforceRateLimit(requestFrom("203.0.113.10"), rules)).toBeNull();

    const denied = enforceRateLimit(requestFrom("203.0.113.10"), rules);
    expect(denied).not.toBeNull();
    expect(denied?.status).toBe(429);
    expect(Number(denied?.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(denied?.headers.get("X-RateLimit-Remaining")).toBe("0");
  });

  it("keeps separate buckets for separate clients", () => {
    const rules = [{ bucket: "unit-clients", limit: 1, windowMs: 60_000 }];
    expect(enforceRateLimit(requestFrom("203.0.113.20"), rules)).toBeNull();
    expect(enforceRateLimit(requestFrom("203.0.113.21"), rules)).toBeNull();
    expect(enforceRateLimit(requestFrom("203.0.113.20"), rules)?.status).toBe(
      429,
    );
  });

  it("uses the first forwarded address, then real-ip and cf-connecting-ip", () => {
    expect(clientIp(requestFrom("198.51.100.7, 10.0.0.1"))).toBe(
      "198.51.100.7",
    );
    expect(
      clientIp(
        new Request("http://localhost/api/test", {
          headers: { "x-real-ip": "198.51.100.8" },
        }),
      ),
    ).toBe("198.51.100.8");
    expect(
      clientIp(
        new Request("http://localhost/api/test", {
          headers: { "cf-connecting-ip": "198.51.100.9" },
        }),
      ),
    ).toBe("198.51.100.9");
  });
});

describe("RATE_LIMITS", () => {
  it("keeps the expensive model and voice paths bounded", () => {
    const assistantMinute = RATE_LIMITS.assistant.find((rule) =>
      rule.bucket.includes("minute"),
    );
    const tokenMinute = RATE_LIMITS.livekitToken.find((rule) =>
      rule.bucket.includes("minute"),
    );
    expect(assistantMinute?.limit).toBeLessThanOrEqual(15);
    expect(tokenMinute?.limit).toBeLessThanOrEqual(8);
    expect(RATE_LIMITS.global[0].limit).toBeGreaterThan(0);
  });
});
