// Lightweight gamification engine: XP, levels, and achievements, all persisted
// in localStorage. App fires semantic events; this returns what to celebrate.
import { STORAGE_KEYS } from "./storageKeys";

export type ProgressStats = {
  viewed: number;
  favorites: number;
  quizzes: number;
  bestStreak: number;
  perfect: number;
};

export type Progress = {
  xp: number;
  unlocked: string[];
  stats: ProgressStats;
};

type StatsWithLevel = ProgressStats & { level: number };

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  icon: string; // lucide icon name resolved in the UI
  metric: (s: StatsWithLevel) => number;
  target: number;
  check: (s: StatsWithLevel) => boolean;
};

function achievement(
  id: string,
  title: string,
  desc: string,
  icon: string,
  metric: (s: StatsWithLevel) => number,
  target: number,
): Achievement {
  return { id, title, desc, icon, metric, target, check: (s) => metric(s) >= target };
}

export const ACHIEVEMENTS: Achievement[] = [
  achievement("first-contact", "First Contact", "View your first specimen", "Microscope", (s) => s.viewed, 1),
  achievement("explorer", "Explorer", "View 25 specimens", "Compass", (s) => s.viewed, 25),
  achievement("curator", "Curator", "View 100 specimens", "Library", (s) => s.viewed, 100),
  achievement("collector", "Collector", "Favorite 10 specimens", "Star", (s) => s.favorites, 10),
  achievement("first-quiz", "Quizzer", "Finish a quiz", "Gamepad2", (s) => s.quizzes, 1),
  achievement("sharp", "Sharpshooter", "Reach a 5 answer streak", "Zap", (s) => s.bestStreak, 5),
  achievement("flawless", "Flawless", "Score a perfect quiz", "Trophy", (s) => s.perfect, 1),
  achievement("scholar", "Scholar", "Reach level 5", "GraduationCap", (s) => s.level, 5),
];

// Stats including derived level, for progress display in the achievements panel.
export function statsWithLevel(progress: Progress): StatsWithLevel {
  return { ...progress.stats, level: levelInfo(progress.xp).level };
}

export const XP = {
  viewNew: 5,
  favorite: 3,
  quizCorrect: 10,
  quizComplete: 20,
  perfectBonus: 50,
};

const KEY = STORAGE_KEYS.progress;

const EMPTY: Progress = {
  xp: 0,
  unlocked: [],
  stats: { viewed: 0, favorites: 0, quizzes: 0, bestStreak: 0, perfect: 0 },
};

// Escalating level curve: 100, then ×1.35 each level.
export function levelInfo(xp: number): { level: number; intoLevel: number; forNext: number } {
  let level = 1;
  let need = 100;
  let remaining = xp;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = Math.round(need * 1.35);
  }
  return { level, intoLevel: remaining, forNext: need };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(EMPTY);
    const parsed = JSON.parse(raw) as Progress;
    return {
      xp: parsed.xp ?? 0,
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
      stats: { ...EMPTY.stats, ...parsed.stats },
    };
  } catch {
    return structuredClone(EMPTY);
  }
}

function save(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function resetProgress(): Progress {
  const fresh = structuredClone(EMPTY);
  save(fresh);
  return fresh;
}

export type ProgressEvent =
  | { type: "viewNew" }
  | { type: "favorite"; favoritesCount: number }
  | { type: "quizCorrect"; streak: number }
  | { type: "quizComplete"; score: number; total: number; bestStreak: number; perfect: boolean }
  | { type: "bonus"; amount: number };

export type AwardResult = {
  progress: Progress;
  gainedXp: number;
  leveledUp: boolean;
  newLevel: number;
  unlocked: Achievement[];
};

// Apply an event: update XP + stats, persist, and report what to celebrate.
export function award(current: Progress, event: ProgressEvent): AwardResult {
  const before = levelInfo(current.xp).level;
  const next: Progress = {
    xp: current.xp,
    unlocked: [...current.unlocked],
    stats: { ...current.stats },
  };
  let gained = 0;

  switch (event.type) {
    case "viewNew":
      gained = XP.viewNew;
      next.stats.viewed += 1;
      break;
    case "favorite":
      gained = XP.favorite;
      next.stats.favorites = Math.max(next.stats.favorites, event.favoritesCount);
      break;
    case "quizCorrect":
      gained = XP.quizCorrect;
      next.stats.bestStreak = Math.max(next.stats.bestStreak, event.streak);
      break;
    case "quizComplete": {
      gained = XP.quizComplete;
      next.stats.quizzes += 1;
      next.stats.bestStreak = Math.max(next.stats.bestStreak, event.bestStreak);
      if (event.perfect) {
        gained += XP.perfectBonus;
        next.stats.perfect += 1;
      }
      break;
    }
    case "bonus":
      gained = event.amount;
      break;
  }

  next.xp += gained;
  const after = levelInfo(next.xp).level;

  const statsForCheck = { ...next.stats, level: after };
  const unlocked: Achievement[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!next.unlocked.includes(a.id) && a.check(statsForCheck)) {
      next.unlocked.push(a.id);
      unlocked.push(a);
    }
  }

  save(next);
  return { progress: next, gainedXp: gained, leveledUp: after > before, newLevel: after, unlocked };
}
