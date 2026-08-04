import { useMemo, useState } from "react";
import {
  Atom,
  Check,
  ChevronRight,
  FlaskConical,
  Layers,
  Play,
  Search,
  Star,
} from "lucide-react";
import { syllabusTopics } from "../../data/syllabusTopics";
import { biologyVisuals } from "../../data/biologyVisuals";
import { processes } from "../../data/processes";
import { practicals } from "../../data/practicals";
import type { BiologyVisual, CourseLevel, VisualGroup } from "../../data/curriculum/types";
import { COURSE_LEVELS, isTierVisible } from "../../lib/courseLevel";
import { accentForKey } from "../../config/product";
import type { CurriculumProgress } from "../../lib/curriculumProgress";
import { searchCurriculum } from "../../lib/curriculumSearch";
import { TierBadge } from "./Badge";

type ExplorerMode = "syllabus" | "visuals" | "processes" | "practicals";

const MODES: { id: ExplorerMode; label: string; Icon: typeof Layers }[] = [
  { id: "syllabus", label: "Syllabus", Icon: Layers },
  { id: "visuals", label: "Visuals", Icon: Atom },
  { id: "processes", label: "Processes", Icon: Play },
  { id: "practicals", label: "Practicals", Icon: FlaskConical },
];

const VISUAL_GROUP_ORDER: VisualGroup[] = [
  "Cells",
  "Molecules",
  "Plants",
  "Human biology",
  "Genetics",
  "Ecology",
  "Microorganisms",
  "Biotechnology",
];

export type ExplorerSelection =
  | { kind: "topic"; id: string }
  | { kind: "visual"; id: string }
  | { kind: "process"; id: string }
  | { kind: "practical"; id: string }
  | { kind: "glossary"; id: string };

type Props = {
  courseLevel: CourseLevel;
  onCourseLevelChange: (level: CourseLevel) => void;
  progress: CurriculumProgress;
  favorites: Set<string>;
  onToggleFavorite: (visualId: string) => void;
  activeId: string | null;
  onSelect: (sel: ExplorerSelection) => void;
};

export function SyllabusExplorer({
  courseLevel,
  onCourseLevelChange,
  progress,
  favorites,
  onToggleFavorite,
  activeId,
  onSelect,
}: Props) {
  const [mode, setMode] = useState<ExplorerMode>("syllabus");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>("organisation");
  const [favOnly, setFavOnly] = useState(false);

  const results = useMemo(() => searchCurriculum(query), [query]);

  const visualsByGroup = useMemo(() => {
    const map = new Map<VisualGroup, BiologyVisual[]>();
    for (const v of biologyVisuals) {
      if (favOnly && !favorites.has(v.id)) continue;
      const list = map.get(v.group) ?? [];
      list.push(v);
      map.set(v.group, list);
    }
    return map;
  }, [favOnly, favorites]);

  const topicIsComplete = (id: string) => progress.topicsCompleted.includes(id);

  return (
    <aside className="left-rail igb-explorer" aria-label="Syllabus explorer">
      <div className="igb-explorer-head">
        <div className="igb-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder="Search topics, visuals, terms…"
            aria-label="Search the curriculum"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="igb-level" role="group" aria-label="Course level">
          {COURSE_LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              className={courseLevel === lvl.id ? "is-active" : ""}
              aria-pressed={courseLevel === lvl.id}
              title={lvl.hint}
              onClick={() => onCourseLevelChange(lvl.id)}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {!query && (
          <div className="igb-modes" role="tablist" aria-label="Explorer mode">
            {MODES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                className={mode === id ? "is-active" : ""}
                onClick={() => setMode(id)}
              >
                <Icon size={15} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {!query && mode === "visuals" && (
          <label className="igb-fav-filter">
            <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} />
            <Star size={13} aria-hidden="true" /> Favourites only
          </label>
        )}
      </div>

      <div className="igb-explorer-body">
        {query ? (
          <div className="igb-results">
            <p className="igb-results-count">
              {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
            </p>
            {results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                type="button"
                className="igb-result-row"
                onClick={() => {
                  onSelect(r.target as ExplorerSelection);
                  setQuery("");
                }}
              >
                <span className="igb-result-type">{r.type}</span>
                <span className="igb-result-title">{r.title}</span>
                <span className="igb-result-meta">
                  {r.topicNumber > 0 && <em>T{r.topicNumber}</em>}
                  <TierBadge tier={r.courseTier} />
                </span>
              </button>
            ))}
            {results.length === 0 && <p className="igb-empty">No matches. Try another term.</p>}
          </div>
        ) : mode === "syllabus" ? (
          <ul className="igb-topic-list">
            {syllabusTopics.map((topic) => {
              const accent = accentForKey(topic.accentKey);
              const visibleSubs = topic.subtopics.filter((s) => isTierVisible(s.courseTier, courseLevel));
              const visualCount = topic.visualIds.filter((id) => biologyVisuals.some((v) => v.id === id)).length;
              const isOpen = expanded === topic.id;
              return (
                <li key={topic.id} className="igb-topic">
                  <button
                    type="button"
                    className={`igb-topic-head ${activeId === topic.id ? "is-active" : ""}`}
                    aria-expanded={isOpen}
                    onClick={() => {
                      setExpanded(isOpen ? null : topic.id);
                      onSelect({ kind: "topic", id: topic.id });
                    }}
                  >
                    <span className="igb-topic-num" style={{ background: accent.soft, color: accent.accent }}>
                      {topic.number}
                    </span>
                    <span className="igb-topic-title">{topic.title}</span>
                    {topicIsComplete(topic.id) && <Check size={15} className="igb-topic-done" aria-label="Complete" />}
                    <ChevronRight size={16} className={`igb-chev ${isOpen ? "is-open" : ""}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div className="igb-topic-detail">
                      <ul className="igb-sub-list">
                        {visibleSubs.map((sub) => (
                          <li key={sub.id} className="igb-sub-row">
                            <span>{sub.title}</span>
                            <TierBadge tier={sub.courseTier} />
                          </li>
                        ))}
                      </ul>
                      <div className="igb-topic-counts">
                        <span>{visibleSubs.length} subtopics</span>
                        <span>{visualCount} visuals</span>
                        <span>{topic.questionIds.length} questions</span>
                        {topic.practicalIds.length > 0 && <span>{topic.practicalIds.length} practical</span>}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : mode === "visuals" ? (
          <div className="igb-group-list">
            {VISUAL_GROUP_ORDER.map((group) => {
              const items = visualsByGroup.get(group);
              if (!items || items.length === 0) return null;
              return (
                <section key={group} className="igb-group">
                  <h3>{group}</h3>
                  {items.map((v) => (
                    <div key={v.id} className={`igb-item-row ${activeId === v.id ? "is-active" : ""}`}>
                      <button type="button" className="igb-item-main" onClick={() => onSelect({ kind: "visual", id: v.id })}>
                        <span className="igb-item-title">{v.title}</span>
                        <span className="igb-item-sub">{v.format.replace(/_/g, " ").toLowerCase()}</span>
                      </button>
                      <button
                        type="button"
                        className={`igb-fav ${favorites.has(v.id) ? "is-on" : ""}`}
                        aria-label={favorites.has(v.id) ? `Remove ${v.title} from favourites` : `Add ${v.title} to favourites`}
                        onClick={() => onToggleFavorite(v.id)}
                      >
                        <Star size={15} fill={favorites.has(v.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  ))}
                </section>
              );
            })}
            {favOnly && favorites.size === 0 && <p className="igb-empty">No favourites yet — tap a star.</p>}
          </div>
        ) : mode === "processes" ? (
          <div className="igb-group-list">
            {processes.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`igb-item-row igb-item-flat ${activeId === p.id ? "is-active" : ""}`}
                onClick={() => onSelect({ kind: "process", id: p.id })}
              >
                <span className="igb-item-title">{p.title}</span>
                <span className="igb-item-sub">{p.subtitle}</span>
                <TierBadge tier={p.courseTier} />
              </button>
            ))}
          </div>
        ) : (
          <div className="igb-group-list">
            {practicals.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`igb-item-row igb-item-flat ${activeId === p.id ? "is-active" : ""}`}
                onClick={() => onSelect({ kind: "practical", id: p.id })}
              >
                <span className="igb-item-title">{p.title}</span>
                <span className="igb-item-sub">{p.aim}</span>
                <span className="igb-badge badge-practical">{p.paperType.replace(/_/g, " ")}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
