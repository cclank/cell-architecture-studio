import { afterEach, describe, expect, it } from "vitest";
import {
  localProgressStore,
  recordStructureIdentified,
  recordQuestionResult,
  recordProcessCompleted,
  questionAccuracy,
} from "./curriculumProgress";

afterEach(() => localStorage.clear());

describe("progress tracking", () => {
  it("recording a structure also marks its visual explored, without duplicates", () => {
    let p = localProgressStore.load();
    p = recordStructureIdentified(p, "vis-plant-cell", "nucleus");
    p = recordStructureIdentified(p, "vis-plant-cell", "nucleus");
    expect(p.visualsExplored).toEqual(["vis-plant-cell"]);
    expect(p.structuresIdentified).toEqual(["vis-plant-cell:nucleus"]);
  });

  it("a correct answer clears the question from the wrong list (retry model)", () => {
    let p = localProgressStore.load();
    p = recordQuestionResult(p, "q-org-1", false);
    expect(p.questionsWrong).toContain("q-org-1");
    p = recordQuestionResult(p, "q-org-1", true);
    expect(p.questionsWrong).not.toContain("q-org-1");
    expect(p.questionsCorrect).toContain("q-org-1");
  });

  it("computes accuracy and returns null before any answers", () => {
    let p = localProgressStore.load();
    expect(questionAccuracy(p)).toBeNull();
    p = recordQuestionResult(p, "a", true);
    p = recordQuestionResult(p, "b", false);
    expect(questionAccuracy(p)).toBe(50);
  });

  it("persists and reloads through the store", () => {
    let p = localProgressStore.load();
    p = recordProcessCompleted(p, "proc-diffusion");
    localProgressStore.save(p);
    expect(localProgressStore.load().processesCompleted).toEqual(["proc-diffusion"]);
  });

  it("sanitizes malformed localStorage into an empty shape", () => {
    localStorage.setItem("igb-progress", "{not json");
    const p = localProgressStore.load();
    expect(p.visualsExplored).toEqual([]);
    expect(p.questionsCorrect).toEqual([]);
  });

  it("drops non-string entries from stored arrays", () => {
    localStorage.setItem("igb-progress", JSON.stringify({ visualsExplored: ["ok", 5, null] }));
    expect(localProgressStore.load().visualsExplored).toEqual(["ok"]);
  });
});
