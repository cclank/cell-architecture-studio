import { STORAGE_KEYS } from "./storageKeys";

// Local persistence for IGCSE Biology Studio favourites and per-visual notes.

export function loadVisualFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.visualFavorites);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(ids) ? ids.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

export function saveVisualFavorites(favs: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.visualFavorites, JSON.stringify([...favs]));
  } catch {
    /* ignore */
  }
}

export type NotesMap = Record<string, string>;

export function loadVisualNotes(): NotesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.visualNotes);
    const parsed = raw ? (JSON.parse(raw) as NotesMap) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveVisualNote(id: string, text: string): NotesMap {
  const notes = loadVisualNotes();
  if (text.trim()) notes[id] = text;
  else delete notes[id];
  try {
    localStorage.setItem(STORAGE_KEYS.visualNotes, JSON.stringify(notes));
  } catch {
    /* ignore */
  }
  return notes;
}
