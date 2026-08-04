import { syllabusTopics } from "../data/syllabusTopics";
import { biologyVisuals } from "../data/biologyVisuals";
import { processes } from "../data/processes";
import { practicals } from "../data/practicals";
import { glossary } from "../data/glossary";
import type { CourseTier } from "../data/curriculum/types";

export type SearchResultType =
  | "topic"
  | "subtopic"
  | "visual"
  | "process"
  | "practical"
  | "glossary";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  topicId: string;
  topicNumber: number;
  courseTier: CourseTier;
  /** Navigation target hint used by the explorer. */
  target: { kind: string; id: string };
}

interface IndexEntry extends SearchResult {
  haystack: string;
}

// Build a flat search index over the whole curriculum. Synonyms from the
// glossary are folded into the haystack so "windpipe" finds "trachea", etc.
function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  for (const topic of syllabusTopics) {
    entries.push({
      id: topic.id,
      type: "topic",
      title: `${topic.number}. ${topic.title}`,
      topicId: topic.id,
      topicNumber: topic.number,
      courseTier: "BOTH",
      target: { kind: "topic", id: topic.id },
      haystack: `${topic.title} ${topic.description}`.toLowerCase(),
    });
    for (const sub of topic.subtopics) {
      entries.push({
        id: sub.id,
        type: "subtopic",
        title: sub.title,
        topicId: topic.id,
        topicNumber: topic.number,
        courseTier: sub.courseTier,
        target: { kind: "topic", id: topic.id },
        haystack: sub.title.toLowerCase(),
      });
    }
  }

  const topicNumberOf = (topicId: string) =>
    syllabusTopics.find((t) => t.id === topicId)?.number ?? 0;

  for (const v of biologyVisuals) {
    entries.push({
      id: v.id,
      type: "visual",
      title: v.title,
      topicId: v.topicIds[0] ?? "",
      topicNumber: topicNumberOf(v.topicIds[0] ?? ""),
      courseTier: v.courseTier,
      target: { kind: "visual", id: v.id },
      haystack: `${v.title} ${v.subtitle} ${v.structures.map((s) => s.name).join(" ")}`.toLowerCase(),
    });
  }

  for (const p of processes) {
    entries.push({
      id: p.id,
      type: "process",
      title: p.title,
      topicId: p.topicIds[0] ?? "",
      topicNumber: topicNumberOf(p.topicIds[0] ?? ""),
      courseTier: p.courseTier,
      target: { kind: "process", id: p.id },
      haystack: `${p.title} ${p.subtitle} ${p.overview}`.toLowerCase(),
    });
  }

  for (const p of practicals) {
    entries.push({
      id: p.id,
      type: "practical",
      title: p.title,
      topicId: p.topicIds[0] ?? "",
      topicNumber: topicNumberOf(p.topicIds[0] ?? ""),
      courseTier: "BOTH",
      target: { kind: "practical", id: p.id },
      haystack: `${p.title} ${p.aim}`.toLowerCase(),
    });
  }

  for (const g of glossary) {
    entries.push({
      id: g.id,
      type: "glossary",
      title: g.term,
      topicId: g.topicIds[0] ?? "",
      topicNumber: topicNumberOf(g.topicIds[0] ?? ""),
      courseTier: g.courseTier,
      target: { kind: "glossary", id: g.id },
      haystack: `${g.term} ${g.definition} ${g.synonyms.join(" ")}`.toLowerCase(),
    });
  }

  return entries;
}

const INDEX = buildIndex();

export function searchCurriculum(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored: { entry: IndexEntry; score: number }[] = [];
  for (const entry of INDEX) {
    let score = 0;
    for (const term of terms) {
      if (!entry.haystack.includes(term)) {
        score = -1;
        break;
      }
      // Reward title matches over body matches.
      score += entry.title.toLowerCase().includes(term) ? 3 : 1;
    }
    if (score > 0) scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score || a.entry.topicNumber - b.entry.topicNumber);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return scored.slice(0, limit).map(({ entry: { haystack, ...rest } }) => rest);
}
