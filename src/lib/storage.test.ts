import { beforeEach, describe, expect, it } from "vitest";
import { cells } from "../data/cells";
import {
  clearAllData,
  loadFavorites,
  loadNotes,
  loadRecentIds,
  pushRecentId,
  saveFavorites,
  saveNote,
} from "./storage";

const A = cells[0].id;
const B = cells[1].id;
const C = cells[2].id;

beforeEach(() => {
  localStorage.clear();
});

describe("favorites", () => {
  it("round-trips a saved set", () => {
    saveFavorites(new Set([A, B]));
    const loaded = loadFavorites();
    expect(loaded.has(A)).toBe(true);
    expect(loaded.has(B)).toBe(true);
  });

  it("drops ids that no longer exist", () => {
    saveFavorites(new Set([A, "does-not-exist"]));
    const loaded = loadFavorites();
    expect(loaded.has(A)).toBe(true);
    expect(loaded.has("does-not-exist")).toBe(false);
  });
});

describe("recent ids", () => {
  it("puts the most recent first and dedupes", () => {
    pushRecentId(A);
    pushRecentId(B);
    const list = pushRecentId(A);
    expect(list[0]).toBe(A);
    expect(list.filter((x) => x === A)).toHaveLength(1);
    expect(list).toContain(B);
  });

  it("persists across loads", () => {
    pushRecentId(C);
    expect(loadRecentIds()[0]).toBe(C);
  });
});

describe("notes", () => {
  it("saves and removes notes", () => {
    saveNote(A, "hello");
    expect(loadNotes()[A]).toBe("hello");
    saveNote(A, "   ");
    expect(loadNotes()[A]).toBeUndefined();
  });
});

describe("clearAllData", () => {
  it("wipes favorites, recents, and notes", () => {
    saveFavorites(new Set([A]));
    pushRecentId(A);
    saveNote(A, "note");
    localStorage.setItem("cas-quiz-best:All:casual", "9");
    clearAllData();
    expect(loadRecentIds()).toHaveLength(0);
    expect(loadNotes()[A]).toBeUndefined();
    expect(localStorage.getItem("cas-quiz-best:All:casual")).toBeNull();
  });
});
