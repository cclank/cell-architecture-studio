import type { CourseLevel, CourseTier } from "../data/curriculum/types";
import { STORAGE_KEYS } from "./storageKeys";

// The three learner-facing course selectors and how they filter tiered content.
export const COURSE_LEVELS: { id: CourseLevel; label: string; hint: string }[] = [
  { id: "CORE", label: "Core", hint: "Core objectives · Papers 1 & 3" },
  { id: "EXTENDED", label: "Extended", hint: "Core + Supplement · Papers 2 & 4" },
  { id: "ALL", label: "All content", hint: "Everything, Core and Supplement marked" },
];

export const DEFAULT_COURSE_LEVEL: CourseLevel = "EXTENDED";

/**
 * Should an item of the given tier be visible at the selected course level?
 * - CORE: hide SUPPLEMENT-only material (BOTH and CORE remain visible).
 * - EXTENDED / ALL: show everything.
 * Practical material is never hidden by course level.
 */
export function isTierVisible(tier: CourseTier, level: CourseLevel): boolean {
  if (level === "CORE") return tier !== "SUPPLEMENT";
  return true;
}

export function loadCourseLevel(): CourseLevel {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.courseLevel);
    if (raw === "CORE" || raw === "EXTENDED" || raw === "ALL") return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_COURSE_LEVEL;
}

export function saveCourseLevel(level: CourseLevel): void {
  try {
    localStorage.setItem(STORAGE_KEYS.courseLevel, level);
  } catch {
    /* ignore */
  }
}

// Study modes: Learn (full labels), Revise (reduced hints), Exam (hidden answers).
export type StudyMode = "LEARN" | "REVISE" | "EXAM";

export const STUDY_MODES: { id: StudyMode; label: string; hint: string }[] = [
  { id: "LEARN", label: "Learn", hint: "Full labels and explanations" },
  { id: "REVISE", label: "Revise", hint: "Reduced hints for recall" },
  { id: "EXAM", label: "Exam", hint: "Labels hidden — identify the structure" },
];

export function loadStudyMode(): StudyMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.studyMode);
    if (raw === "LEARN" || raw === "REVISE" || raw === "EXAM") return raw;
  } catch {
    /* ignore */
  }
  return "LEARN";
}

export function saveStudyMode(mode: StudyMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.studyMode, mode);
  } catch {
    /* ignore */
  }
}
