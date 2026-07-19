import { beforeEach, describe, expect, it } from "vitest";
import { award, levelInfo, loadProgress, resetProgress, XP, type Progress } from "./progression";

beforeEach(() => {
  localStorage.clear();
});

function fresh(): Progress {
  return resetProgress();
}

describe("levelInfo", () => {
  it("starts at level 1 with 0 XP", () => {
    expect(levelInfo(0)).toEqual({ level: 1, intoLevel: 0, forNext: 100 });
  });

  it("reaches level 2 at 100 XP", () => {
    const info = levelInfo(100);
    expect(info.level).toBe(2);
    expect(info.intoLevel).toBe(0);
    expect(info.forNext).toBe(135); // 100 * 1.35
  });

  it("keeps the remainder within a level", () => {
    expect(levelInfo(140)).toMatchObject({ level: 2, intoLevel: 40 });
  });
});

describe("award", () => {
  it("grants XP for viewing a new specimen and unlocks first-contact", () => {
    const r = award(fresh(), { type: "viewNew" });
    expect(r.gainedXp).toBe(XP.viewNew);
    expect(r.progress.stats.viewed).toBe(1);
    expect(r.unlocked.map((a) => a.id)).toContain("first-contact");
  });

  it("grants XP for favoriting", () => {
    const r = award(fresh(), { type: "favorite", favoritesCount: 1 });
    expect(r.gainedXp).toBe(XP.favorite);
    expect(r.progress.stats.favorites).toBe(1);
  });

  it("tracks best streak and unlocks sharpshooter at 5", () => {
    const r = award(fresh(), { type: "quizCorrect", streak: 5 });
    expect(r.progress.stats.bestStreak).toBe(5);
    expect(r.unlocked.map((a) => a.id)).toContain("sharp");
  });

  it("keeps specimen achievements attainable within the seven-item catalog", () => {
    const start: Progress = {
      xp: 0,
      unlocked: [],
      stats: { viewed: 2, favorites: 0, quizzes: 0, bestStreak: 0, perfect: 0 },
    };
    const explored = award(start, { type: "viewNew" });
    expect(explored.unlocked.map((a) => a.id)).toContain("explorer");

    const collected = award(explored.progress, { type: "favorite", favoritesCount: 3 });
    expect(collected.unlocked.map((a) => a.id)).toContain("collector");
  });

  it("adds a perfect bonus only when perfect is true", () => {
    const perfect = award(fresh(), { type: "quizComplete", score: 10, total: 10, bestStreak: 3, perfect: true });
    expect(perfect.gainedXp).toBe(XP.quizComplete + XP.perfectBonus);
    expect(perfect.progress.stats.perfect).toBe(1);
    expect(perfect.unlocked.map((a) => a.id)).toContain("flawless");

    const notPerfect = award(fresh(), { type: "quizComplete", score: 8, total: 10, bestStreak: 3, perfect: false });
    expect(notPerfect.gainedXp).toBe(XP.quizComplete);
    expect(notPerfect.progress.stats.perfect).toBe(0);
    expect(notPerfect.unlocked.map((a) => a.id)).not.toContain("flawless");
  });

  it("does not award perfect for survival-style runs (perfect=false even if score===total)", () => {
    const r = award(fresh(), { type: "quizComplete", score: 7, total: 7, bestStreak: 7, perfect: false });
    expect(r.progress.stats.perfect).toBe(0);
  });

  it("grants an arbitrary bonus amount", () => {
    const r = award(fresh(), { type: "bonus", amount: 15 });
    expect(r.gainedXp).toBe(15);
    expect(r.progress.xp).toBe(15);
  });

  it("reports a level-up when crossing the threshold", () => {
    const near: Progress = { xp: 90, unlocked: [], stats: { viewed: 0, favorites: 0, quizzes: 0, bestStreak: 0, perfect: 0 } };
    const r = award(near, { type: "quizComplete", score: 5, total: 10, bestStreak: 1, perfect: false });
    expect(r.leveledUp).toBe(true);
    expect(r.newLevel).toBe(2);
  });

  it("does not re-award an already unlocked achievement", () => {
    const once = award(fresh(), { type: "viewNew" });
    const twice = award(once.progress, { type: "viewNew" });
    expect(twice.unlocked).toHaveLength(0);
  });

  it("persists progress to localStorage", () => {
    award(fresh(), { type: "bonus", amount: 42 });
    expect(loadProgress().xp).toBe(42);
  });
});
