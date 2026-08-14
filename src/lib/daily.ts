import { cells, type CellStructure } from "../data/cells";
import { STORAGE_KEYS } from "./storageKeys";

// Local YYYY-MM-DD key for "today".
function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Deterministic hash so everyone gets the same specimen on the same day.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const FEATURED = cells.filter((c) => c.renderImage);

export function specimenOfTheDay(d = new Date()): CellStructure {
  const pool = FEATURED.length > 0 ? FEATURED : cells;
  return pool[hashString(todayKey(d)) % pool.length];
}

type DailyState = {
  lastVisit: string; // YYYY-MM-DD
  streak: number;
  claimed: string; // date the bonus was claimed
};

const KEY = STORAGE_KEYS.daily;

function load(): DailyState {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as DailyState) : null;
    if (parsed && typeof parsed.streak === "number") return parsed;
  } catch {
    /* ignore */
  }
  return { lastVisit: "", streak: 0, claimed: "" };
}

function save(state: DailyState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function yesterdayKey(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}

// Register today's visit, updating the consecutive-day streak.
export function registerVisit(d = new Date()): { streak: number; isNewDay: boolean } {
  const today = todayKey(d);
  const state = load();
  if (state.lastVisit === today) {
    return { streak: state.streak, isNewDay: false };
  }
  const continued = state.lastVisit === yesterdayKey(d);
  const next: DailyState = {
    lastVisit: today,
    streak: continued ? state.streak + 1 : 1,
    claimed: state.claimed,
  };
  save(next);
  return { streak: next.streak, isNewDay: true };
}

export function isDailyClaimed(d = new Date()): boolean {
  return load().claimed === todayKey(d);
}

export function claimDaily(d = new Date()): boolean {
  const today = todayKey(d);
  const state = load();
  if (state.claimed === today) return false;
  save({ ...state, claimed: today });
  return true;
}

export function currentStreak(): number {
  return load().streak;
}
