import { useMemo, useState } from "react";
import { Heart, Star } from "lucide-react";
import type { BiologyVisual, SyllabusTopic, VisualStructure } from "../../data/curriculum/types";
import type { StudyMode } from "../../lib/courseLevel";
import { getObjectivesForTopic } from "../../data/syllabusObjectives";
import { getPracticalById } from "../../data/practicals";
import { accentForKey } from "../../config/product";
import { TierBadge } from "./Badge";

type Tab = "overview" | "structure" | "function" | "syllabus" | "exam" | "practical" | "notes";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "structure", label: "Structure" },
  { id: "function", label: "Function" },
  { id: "syllabus", label: "Syllabus" },
  { id: "exam", label: "Exam Skills" },
  { id: "practical", label: "Practical" },
  { id: "notes", label: "Notes" },
];

const LETTERS = "ABCDEFGHIJ";

type Props = {
  visual: BiologyVisual;
  topic: SyllabusTopic | undefined;
  structures: VisualStructure[];
  activeStructureId: string;
  onSelectStructure: (id: string) => void;
  studyMode: StudyMode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  notes: string;
  onNotesChange: (text: string) => void;
  onOpenPractical: (id: string) => void;
  onOpenQuestions: () => void;
};

export function StudyPanel({
  visual,
  topic,
  structures,
  activeStructureId,
  onSelectStructure,
  studyMode,
  isFavorite,
  onToggleFavorite,
  notes,
  onNotesChange,
  onOpenPractical,
  onOpenQuestions,
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const examMode = studyMode === "EXAM";

  const active = structures.find((s) => s.id === activeStructureId) ?? structures[0];
  const objectives = useMemo(() => (topic ? getObjectivesForTopic(topic.id) : []), [topic]);
  const practical = topic?.practicalIds.map(getPracticalById).find(Boolean);
  const accent = topic ? accentForKey(topic.accentKey) : accentForKey("foundations");

  const isRevealed = (id: string) => !examMode || revealed.has(id);
  const structureLabel = (s: VisualStructure, i: number) =>
    isRevealed(s.id) ? s.name : `Structure ${LETTERS[i] ?? i + 1}`;

  return (
    <aside className="right-rail igb-study" aria-label="Study panel">
      <section className="panel">
        <div className="panel-heading detail-heading">
          <span>{visual.title}</span>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {structures.length > 0 && (
          <div className="igb-structure-list" role="listbox" aria-label="Structures">
            {structures.map((s, i) => (
              <div key={s.id} className="igb-structure-item">
                <button
                  type="button"
                  role="option"
                  aria-selected={activeStructureId === s.id}
                  className={`igb-structure-row ${activeStructureId === s.id ? "is-active" : ""}`}
                  onClick={() => onSelectStructure(s.id)}
                >
                  <span className="color-dot" style={{ background: s.color }} />
                  <span>{structureLabel(s, i)}</span>
                  <TierBadge tier={s.courseTier} />
                </button>
                {examMode && !revealed.has(s.id) && (
                  <button
                    type="button"
                    className="igb-reveal"
                    onClick={() => setRevealed((r) => new Set(r).add(s.id))}
                  >
                    Reveal
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel igb-tabs-panel">
        <div className="igb-tabs" role="tablist" aria-label="Study details">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? "is-active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="igb-tab-body" role="tabpanel">
          {tab === "overview" && (
            <div>
              <p>{visual.textAlternative}</p>
              {topic && (
                <p className="igb-muted">
                  Part of Topic {topic.number}: {topic.title}.
                </p>
              )}
            </div>
          )}

          {tab === "structure" && active && (
            <div>
              <h4>{examMode && !isRevealed(active.id) ? "Selected structure" : active.name}</h4>
              <p>{active.structureDescription}</p>
            </div>
          )}

          {tab === "function" && active && (
            <div>
              <h4>Function</h4>
              <p>{active.function}</p>
              {active.adaptationExplanation && (
                <>
                  <h4>Structure → function</h4>
                  <p>{active.adaptationExplanation}</p>
                </>
              )}
            </div>
          )}

          {tab === "syllabus" && (
            <div>
              {topic && (
                <p className="igb-syllabus-head">
                  <span className="igb-topic-num" style={{ background: accent.soft, color: accent.accent }}>
                    {topic.number}
                  </span>
                  {topic.title}
                </p>
              )}
              <ul className="igb-obj-list">
                {objectives.map((o) => (
                  <li key={o.id}>
                    <TierBadge tier={o.courseTier} />
                    <span>{o.studentFriendlyObjective}</span>
                    <em className="igb-source">{o.sourceReference} · project ref {o.id}</em>
                  </li>
                ))}
                {objectives.length === 0 && <li className="igb-muted">Objectives are being drafted for this topic.</li>}
              </ul>
            </div>
          )}

          {tab === "exam" && active && (
            <div>
              <h4>Say it like an examiner</h4>
              <ul className="igb-chip-list">
                {active.examLanguage.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <h4>Common mistakes</h4>
              <ul className="igb-warn-list">
                {active.commonMistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <button type="button" className="igb-btn igb-btn-primary" onClick={onOpenQuestions}>
                Practice questions
              </button>
            </div>
          )}

          {tab === "practical" && (
            <div>
              {practical ? (
                <>
                  <h4>{practical.title}</h4>
                  <p>{practical.aim}</p>
                  <p className="igb-muted">
                    {practical.paperType === "BOTH" ? "Papers 5 & 6" : practical.paperType.replace("_", " ")}
                  </p>
                  <button type="button" className="igb-btn igb-btn-primary" onClick={() => onOpenPractical(practical.id)}>
                    Open practical
                  </button>
                </>
              ) : (
                <p className="igb-muted">No linked practical for this visual yet.</p>
              )}
            </div>
          )}

          {tab === "notes" && (
            <div>
              <label className="igb-notes-label" htmlFor="igb-notes">
                Your notes on {visual.title}
              </label>
              <textarea
                id="igb-notes"
                className="igb-notes"
                value={notes}
                placeholder="Write anything you want to remember…"
                onChange={(e) => onNotesChange(e.target.value)}
              />
              <p className="igb-muted">
                <Star size={12} /> Notes are saved on this device.
              </p>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}
