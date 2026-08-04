import { describe, expect, it } from "vitest";
import { searchCurriculum } from "./curriculumSearch";

describe("curriculum search", () => {
  it("returns nothing for an empty query", () => {
    expect(searchCurriculum("")).toEqual([]);
  });

  it("finds a topic by title", () => {
    const results = searchCurriculum("enzymes");
    expect(results.some((r) => r.type === "topic" && r.title.includes("Enzymes"))).toBe(true);
  });

  it("matches synonyms via the glossary (windpipe -> trachea)", () => {
    const results = searchCurriculum("windpipe");
    expect(results.some((r) => r.title.toLowerCase().includes("trachea"))).toBe(true);
  });

  it("matches an alternative term (leucocyte -> white blood cell)", () => {
    const results = searchCurriculum("leucocyte");
    expect(results.some((r) => r.title.toLowerCase().includes("white blood"))).toBe(true);
  });

  it("finds a visual by name", () => {
    const results = searchCurriculum("plant cell");
    expect(results.some((r) => r.type === "visual")).toBe(true);
  });

  it("carries a course tier and navigation target on each result", () => {
    const [first] = searchCurriculum("diffusion");
    expect(first.target.kind).toBeTruthy();
    expect(["CORE", "SUPPLEMENT", "BOTH"]).toContain(first.courseTier);
  });
});
