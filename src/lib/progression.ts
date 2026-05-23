// Lightweight gamification engine: XP, levels, and achievements, all persisted
// in localStorage. App fires semantic events; this returns what to celebrate.

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

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  icon: string; // lucide icon name resolved in the UI
  check: (s: ProgressStats & { level: number }) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-contact", title: "First Contact", desc: "View your first specimen", icon: "Microscope", check: (s) => s.viewed >= 1 },
  { id: "explorer", title: "Explorer", desc: "View 25 specimens", icon: "Compass", check: (s) => s.viewed >= 25 },
  { id: "curator", title: "Curator", desc: "View 100 specimens", icon: "Library", check: (s) => s.viewed >= 100 },
  { id: "collector", title: "Collector", desc: "Favorite 10 specimens", icon: "Star", check: (s) => s.favorites >= 10 },
  { id: "first-quiz", title: "Quizzer", desc: "Finish a quiz", icon: "Gamepad2", check: (s) => s.quizzes >= 1 },
  { id: "sharp", title: "Sharpshooter", desc: "Reach a 5 answer streak", icon: "Zap", check: (s) => s.bestStreak >= 5 },
  { id: "flawless", title: "Flawless", desc: "Score a perfect quiz", icon: "Trophy", check: (s) => s.perfect >= 1 },
  { id: "scholar", title: "Scholar", desc: "Reach level 5", icon: "GraduationCap", check: (s) => s.level >= 5 },
];

export const XP = {
  viewNew: 5,
  favorite: 3,
  quizCorrect: 10,
  quizComplete: 20,
  perfectBonus: 50,
};

const KEY = "cas-progress";

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
  | { type: "quizComplete"; score: number; total: number; bestStreak: number };

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
      if (event.score === event.total) {
        gained += XP.perfectBonus;
        next.stats.perfect += 1;
      }
      break;
    }
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
