import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_COURSE_LEVEL,
  isTierVisible,
  loadCourseLevel,
  saveCourseLevel,
  loadStudyMode,
  saveStudyMode,
} from "./courseLevel";

afterEach(() => localStorage.clear());

describe("isTierVisible", () => {
  it("hides SUPPLEMENT-only content in Core mode", () => {
    expect(isTierVisible("SUPPLEMENT", "CORE")).toBe(false);
    expect(isTierVisible("CORE", "CORE")).toBe(true);
    expect(isTierVisible("BOTH", "CORE")).toBe(true);
  });

  it("shows everything in Extended and All modes", () => {
    for (const level of ["EXTENDED", "ALL"] as const) {
      expect(isTierVisible("SUPPLEMENT", level)).toBe(true);
      expect(isTierVisible("CORE", level)).toBe(true);
      expect(isTierVisible("BOTH", level)).toBe(true);
    }
  });
});

describe("persistence", () => {
  it("defaults to Extended and round-trips a saved level", () => {
    expect(loadCourseLevel()).toBe(DEFAULT_COURSE_LEVEL);
    saveCourseLevel("CORE");
    expect(loadCourseLevel()).toBe("CORE");
  });

  it("ignores a corrupt stored level", () => {
    localStorage.setItem("igb-course-level", "NONSENSE");
    expect(loadCourseLevel()).toBe(DEFAULT_COURSE_LEVEL);
  });

  it("round-trips study mode with a Learn default", () => {
    expect(loadStudyMode()).toBe("LEARN");
    saveStudyMode("EXAM");
    expect(loadStudyMode()).toBe("EXAM");
  });
});
