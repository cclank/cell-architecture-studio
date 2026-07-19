import { beforeEach, describe, expect, it } from "vitest";
import { claimDaily, currentStreak, isDailyClaimed, registerVisit, specimenOfTheDay } from "./daily";

beforeEach(() => {
  localStorage.clear();
});

describe("specimenOfTheDay", () => {
  it("is deterministic for a given date", () => {
    const d = new Date(2026, 4, 24);
    expect(specimenOfTheDay(d).id).toBe(specimenOfTheDay(d).id);
  });

  it("differs across (most) days", () => {
    const a = specimenOfTheDay(new Date(2026, 4, 24));
    const b = specimenOfTheDay(new Date(2026, 4, 25));
    // Not guaranteed unique, but these two dates should differ.
    expect(a.id).not.toBe(b.id);
  });

  it("always returns a renderable specimen", () => {
    expect(specimenOfTheDay(new Date(2026, 0, 1)).renderImage).toBeDefined();
  });
});

describe("daily streak", () => {
  it("starts a streak at 1 on first visit", () => {
    const r = registerVisit(new Date(2026, 4, 24));
    expect(r).toEqual({ streak: 1, isNewDay: true });
  });

  it("does not advance on a repeat visit the same day", () => {
    const d = new Date(2026, 4, 24);
    registerVisit(d);
    const again = registerVisit(d);
    expect(again).toEqual({ streak: 1, isNewDay: false });
  });

  it("increments on consecutive days", () => {
    registerVisit(new Date(2026, 4, 24));
    const next = registerVisit(new Date(2026, 4, 25));
    expect(next.streak).toBe(2);
  });

  it("resets when a day is skipped", () => {
    registerVisit(new Date(2026, 4, 24));
    const afterGap = registerVisit(new Date(2026, 4, 27));
    expect(afterGap.streak).toBe(1);
    expect(currentStreak()).toBe(1);
  });
});

describe("daily claim", () => {
  it("can be claimed once per day", () => {
    const d = new Date(2026, 4, 24);
    expect(isDailyClaimed(d)).toBe(false);
    expect(claimDaily(d)).toBe(true);
    expect(isDailyClaimed(d)).toBe(true);
    expect(claimDaily(d)).toBe(false);
  });
});
