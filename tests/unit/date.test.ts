import { describe, expect, it } from "vitest";
import {
  ageFromBirthDate,
  birthDateForAge,
  isProfileStale,
  lastNDays,
  relativeDayLabel,
  retakeDateKey,
  todayKey,
} from "@/lib/date";
import { NOW } from "../helpers";

describe("date helpers", () => {
  it("formats the local day key", () => {
    expect(todayKey(NOW)).toBe("2026-11-14");
  });

  it("builds a seven-day window ending today", () => {
    const days = lastNDays(7, NOW);
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2026-11-08");
    expect(days[6]).toBe("2026-11-14");
  });

  it("calculates age with birthday awareness", () => {
    expect(ageFromBirthDate("2020-09-01", NOW)).toBe(6);
    expect(ageFromBirthDate("2020-12-01", NOW)).toBe(5);
    expect(ageFromBirthDate("2026-11-14", NOW)).toBe(0);
  });

  it("creates a birth date for a target age", () => {
    expect(birthDateForAge(6, NOW)).toBe("2020-09-14");
  });

  it("flags a profile for refresh on or after the retake date", () => {
    expect(isProfileStale("2026-11-13", NOW)).toBe(true);
    expect(isProfileStale("2026-11-14", NOW)).toBe(true);
    expect(isProfileStale("2026-11-15", NOW)).toBe(false);
  });

  it("adds 90 days for the next refresh", () => {
    expect(retakeDateKey(90, NOW)).toBe("2027-02-12");
  });

  it("labels relative days", () => {
    expect(relativeDayLabel("2026-11-14", NOW)).toBe("Today");
    expect(relativeDayLabel("2026-11-13", NOW)).toBe("Yesterday");
    expect(relativeDayLabel("2026-11-15", NOW)).toBe("Tomorrow");
  });
});
