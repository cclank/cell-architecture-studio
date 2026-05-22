import { cells, getCellById } from "../data/cells";

const FAVORITES_KEY = "cas-favorites";
const LAST_CELL_KEY = "cas-last-cell";

const initialCell = getCellById("animal");
const cellExists = (id: string) => cells.some((c) => c.id === id);

export function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : null;
    if (Array.isArray(ids)) return new Set(ids.filter(cellExists));
  } catch {
    /* ignore */
  }
  return new Set([initialCell.id]);
}

export function saveFavorites(favorites: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  } catch {
    /* ignore */
  }
}

export function loadLastCellId(): string {
  try {
    const id = localStorage.getItem(LAST_CELL_KEY);
    if (id && cellExists(id)) return id;
  } catch {
    /* ignore */
  }
  return initialCell.id;
}

export function saveLastCellId(id: string): void {
  try {
    localStorage.setItem(LAST_CELL_KEY, id);
  } catch {
    /* ignore */
  }
}

const RECENT_KEY = "cas-recent";
const RECENT_MAX = 24;

export function loadRecentIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(ids) ? ids.filter(cellExists) : [];
  } catch {
    return [];
  }
}

export function pushRecentId(id: string): string[] {
  const next = [id, ...loadRecentIds().filter((x) => x !== id)].slice(0, RECENT_MAX);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

const NOTES_KEY = "cas-notes";

export type NotesMap = Record<string, string>;

export function loadNotes(): NotesMap {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const parsed = raw ? (JSON.parse(raw) as NotesMap) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveNote(id: string, text: string): NotesMap {
  const notes = loadNotes();
  if (text.trim()) {
    notes[id] = text;
  } else {
    delete notes[id];
  }
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    /* ignore */
  }
  return notes;
}

export function clearAllData(): void {
  try {
    for (const key of [FAVORITES_KEY, LAST_CELL_KEY, RECENT_KEY, NOTES_KEY]) {
      localStorage.removeItem(key);
    }
    // Quiz keys live under cas-quiz-*.
    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith("cas-quiz")) localStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
}
