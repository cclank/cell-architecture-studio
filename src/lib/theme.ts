import { STORAGE_KEYS } from "./storageKeys";

export type AccentTheme = {
  id: string;
  name: string;
  accent: string;
  accentSoft: string;
};

export const ACCENTS: AccentTheme[] = [
  { id: "blue", name: "Clinical Blue", accent: "#2563eb", accentSoft: "#dbe6ff" },
  { id: "teal", name: "Teal", accent: "#0d9488", accentSoft: "#cdfaf2" },
  { id: "violet", name: "Violet", accent: "#7c3aed", accentSoft: "#ece4fe" },
  { id: "rose", name: "Rose", accent: "#e11d48", accentSoft: "#ffe0e7" },
  { id: "amber", name: "Amber", accent: "#d97706", accentSoft: "#fdecc8" },
  { id: "emerald", name: "Emerald", accent: "#059669", accentSoft: "#cdf5e3" },
];

export const DEFAULT_ACCENT = ACCENTS[0];

export function loadAccent(): AccentTheme {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.accent);
    return ACCENTS.find((a) => a.id === id) ?? DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

export function saveAccent(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.accent, id);
  } catch {
    /* ignore */
  }
}
