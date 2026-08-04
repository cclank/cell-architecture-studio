import { STORAGE_KEYS } from "./storageKeys";

// Local-first progress storage with an abstraction (ProgressStore) so a remote
// backend can be swapped in later without touching UI code. A topic is never
// counted "complete" merely for being opened — completion is derived from
// meaningful actions (structures identified, questions answered, etc.).

export interface CurriculumProgress {
  /** visual ids whose structures have been explored. */
  visualsExplored: string[];
  /** `${visualId}:${structureId}` keys that have been inspected. */
  structuresIdentified: string[];
  /** process ids stepped through to the end. */
  processesCompleted: string[];
  /** practical ids opened and worked through. */
  practicalsCompleted: string[];
  /** question ids answered correctly. */
  questionsCorrect: string[];
  /** question ids answered incorrectly (kept for retry). */
  questionsWrong: string[];
  /** topic ids the learner has marked or earned as complete. */
  topicsCompleted: string[];
}

const EMPTY: CurriculumProgress = {
  visualsExplored: [],
  structuresIdentified: [],
  processesCompleted: [],
  practicalsCompleted: [],
  questionsCorrect: [],
  questionsWrong: [],
  topicsCompleted: [],
};

export interface ProgressStore {
  load(): CurriculumProgress;
  save(p: CurriculumProgress): void;
  clear(): void;
}

function sanitize(raw: unknown): CurriculumProgress {
  if (!raw || typeof raw !== "object") return { ...EMPTY };
  const obj = raw as Record<string, unknown>;
  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  return {
    visualsExplored: arr(obj.visualsExplored),
    structuresIdentified: arr(obj.structuresIdentified),
    processesCompleted: arr(obj.processesCompleted),
    practicalsCompleted: arr(obj.practicalsCompleted),
    questionsCorrect: arr(obj.questionsCorrect),
    questionsWrong: arr(obj.questionsWrong),
    topicsCompleted: arr(obj.topicsCompleted),
  };
}

export const localProgressStore: ProgressStore = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.curriculumProgress);
      return sanitize(raw ? JSON.parse(raw) : null);
    } catch {
      return { ...EMPTY };
    }
  },
  save(p) {
    try {
      localStorage.setItem(STORAGE_KEYS.curriculumProgress, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEYS.curriculumProgress);
    } catch {
      /* ignore */
    }
  },
};

const uniq = (list: string[], value: string) =>
  list.includes(value) ? list : [...list, value];

/** Record a structure inspection; also marks the visual as explored. */
export function recordStructureIdentified(
  p: CurriculumProgress,
  visualId: string,
  structureId: string,
): CurriculumProgress {
  return {
    ...p,
    visualsExplored: uniq(p.visualsExplored, visualId),
    structuresIdentified: uniq(p.structuresIdentified, `${visualId}:${structureId}`),
  };
}

export function recordVisualExplored(p: CurriculumProgress, visualId: string): CurriculumProgress {
  return { ...p, visualsExplored: uniq(p.visualsExplored, visualId) };
}

export function recordProcessCompleted(p: CurriculumProgress, processId: string): CurriculumProgress {
  return { ...p, processesCompleted: uniq(p.processesCompleted, processId) };
}

export function recordPracticalCompleted(p: CurriculumProgress, practicalId: string): CurriculumProgress {
  return { ...p, practicalsCompleted: uniq(p.practicalsCompleted, practicalId) };
}

/** Record a question result. A correct answer clears it from the wrong list. */
export function recordQuestionResult(
  p: CurriculumProgress,
  questionId: string,
  correct: boolean,
): CurriculumProgress {
  if (correct) {
    return {
      ...p,
      questionsCorrect: uniq(p.questionsCorrect, questionId),
      questionsWrong: p.questionsWrong.filter((id) => id !== questionId),
    };
  }
  return {
    ...p,
    questionsWrong: uniq(p.questionsWrong, questionId),
  };
}

export function markTopicComplete(p: CurriculumProgress, topicId: string): CurriculumProgress {
  return { ...p, topicsCompleted: uniq(p.topicsCompleted, topicId) };
}

/** Question accuracy as a percentage (0-100), or null if nothing answered. */
export function questionAccuracy(p: CurriculumProgress): number | null {
  const total = new Set([...p.questionsCorrect, ...p.questionsWrong]).size;
  if (total === 0) return null;
  return Math.round((p.questionsCorrect.length / total) * 100);
}
