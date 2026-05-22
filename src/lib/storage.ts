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
