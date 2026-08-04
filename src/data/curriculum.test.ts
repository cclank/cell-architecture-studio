import { describe, expect, it } from "vitest";
import { syllabusTopics } from "./syllabusTopics";
import { syllabusObjectives } from "./syllabusObjectives";
import { biologyVisuals, getVisualById } from "./biologyVisuals";
import { questions } from "./questions";
import { processes } from "./processes";
import { comparisons } from "./comparisons";

const MILESTONE_TOPICS = ["characteristics", "organisation", "movement", "molecules", "enzymes"];

describe("syllabus topics", () => {
  it("contains all 21 topics numbered 1-21 in order", () => {
    expect(syllabusTopics).toHaveLength(21);
    syllabusTopics.forEach((t, i) => expect(t.number).toBe(i + 1));
  });

  it("every topic has at least one subtopic and a unique id", () => {
    const ids = new Set<string>();
    for (const t of syllabusTopics) {
      expect(t.subtopics.length).toBeGreaterThan(0);
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
    }
  });
});

describe("milestone 1 content (topics 1-5)", () => {
  it("each milestone topic has at least 5 questions", () => {
    for (const topicId of MILESTONE_TOPICS) {
      const count = questions.filter((q) => q.topicId === topicId).length;
      expect(count, `topic ${topicId}`).toBeGreaterThanOrEqual(5);
    }
  });

  it("includes at least one model-select, graph and practical question", () => {
    expect(questions.some((q) => q.type === "MODEL_SELECT")).toBe(true);
    expect(questions.some((q) => q.type === "GRAPH")).toBe(true);
    expect(questions.some((q) => q.type === "PRACTICAL")).toBe(true);
  });

  it("includes a mix of Core and Supplement questions", () => {
    expect(questions.some((q) => q.courseTier === "CORE")).toBe(true);
    expect(questions.some((q) => q.courseTier === "SUPPLEMENT")).toBe(true);
  });
});

describe("referential integrity", () => {
  it("MODEL_SELECT questions point to a real visual and structure", () => {
    for (const q of questions.filter((q) => q.type === "MODEL_SELECT")) {
      const v = getVisualById(q.visualId!);
      expect(v, q.id).toBeDefined();
      expect(v!.structures.some((s) => s.id === q.answerStructureId)).toBe(true);
    }
  });

  it("topic questionIds resolve to real questions", () => {
    const ids = new Set(questions.map((q) => q.id));
    for (const t of syllabusTopics) {
      for (const qid of t.questionIds) expect(ids.has(qid), qid).toBe(true);
    }
  });

  it("every objective belongs to a real topic", () => {
    const topicIds = new Set(syllabusTopics.map((t) => t.id));
    for (const o of syllabusObjectives) expect(topicIds.has(o.topicId), o.id).toBe(true);
  });

  it("comparison itemIds reference known visuals or processes", () => {
    const known = new Set<string>([
      ...biologyVisuals.map((v) => v.id),
      ...processes.map((p) => p.id),
    ]);
    for (const c of comparisons) {
      for (const id of c.itemIds) expect(known.has(id), `${c.id}:${id}`).toBe(true);
    }
  });
});
