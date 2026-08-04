import { Atom, FlaskConical, GitCompare, Play } from "lucide-react";
import type { CourseLevel, SyllabusTopic } from "../../data/curriculum/types";
import { getVisualById } from "../../data/biologyVisuals";
import { getProcessById } from "../../data/processes";
import { getPracticalById } from "../../data/practicals";
import { getComparisonById } from "../../data/comparisons";
import { isTierVisible } from "../../lib/courseLevel";
import { accentForKey } from "../../config/product";
import type { ExplorerSelection } from "./SyllabusExplorer";
import { TierBadge, PracticalBadge } from "./Badge";

type Props = {
  topic: SyllabusTopic;
  courseLevel: CourseLevel;
  onSelect: (sel: ExplorerSelection) => void;
  onOpenComparison: (id: string) => void;
  onOpenQuestions: () => void;
  questionCount: number;
};

export function TopicOverview({
  topic,
  courseLevel,
  onSelect,
  onOpenComparison,
  onOpenQuestions,
  questionCount,
}: Props) {
  const accent = accentForKey(topic.accentKey);
  const visuals = topic.visualIds.map(getVisualById).filter((v) => v && isTierVisible(v.courseTier, courseLevel));
  const procs = topic.processIds.map(getProcessById).filter((p) => p && isTierVisible(p.courseTier, courseLevel));
  const pracs = topic.practicalIds.map(getPracticalById).filter(Boolean);
  const comps = topic.comparisonIds.map(getComparisonById).filter((c) => c && isTierVisible(c.courseTier, courseLevel));

  return (
    <section className="stage-panel igb-topic-overview">
      <div className="igb-topic-hero" style={{ background: accent.soft }}>
        <span className="igb-topic-hero-num" style={{ color: accent.accent }}>{topic.number}</span>
        <div>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
        </div>
      </div>

      {visuals.length > 0 && (
        <div className="igb-ov-block">
          <h3><Atom size={16} /> Visuals</h3>
          <div className="igb-card-grid">
            {visuals.map((v) => v && (
              <button key={v.id} type="button" className="igb-ov-card" onClick={() => onSelect({ kind: "visual", id: v.id })}>
                {v.thumbnailUrl && <img src={v.thumbnailUrl} alt="" />}
                <strong>{v.title}</strong>
                <span className="igb-ov-format">{v.format.replace(/_/g, " ").toLowerCase()}</span>
                <TierBadge tier={v.courseTier} />
              </button>
            ))}
          </div>
        </div>
      )}

      {procs.length > 0 && (
        <div className="igb-ov-block">
          <h3><Play size={16} /> Processes</h3>
          <div className="igb-card-grid">
            {procs.map((p) => p && (
              <button key={p.id} type="button" className="igb-ov-card igb-ov-card-flat" onClick={() => onSelect({ kind: "process", id: p.id })}>
                <strong>{p.title}</strong>
                <span className="igb-ov-format">{p.subtitle}</span>
                <TierBadge tier={p.courseTier} />
              </button>
            ))}
          </div>
        </div>
      )}

      {comps.length > 0 && (
        <div className="igb-ov-block">
          <h3><GitCompare size={16} /> Comparisons</h3>
          <div className="igb-card-grid">
            {comps.map((c) => c && (
              <button key={c.id} type="button" className="igb-ov-card igb-ov-card-flat" onClick={() => onOpenComparison(c.id)}>
                <strong>{c.title}</strong>
                <TierBadge tier={c.courseTier} />
              </button>
            ))}
          </div>
        </div>
      )}

      {pracs.length > 0 && (
        <div className="igb-ov-block">
          <h3><FlaskConical size={16} /> Practicals</h3>
          <div className="igb-card-grid">
            {pracs.map((p) => p && (
              <button key={p.id} type="button" className="igb-ov-card igb-ov-card-flat" onClick={() => onSelect({ kind: "practical", id: p.id })}>
                <strong>{p.title}</strong>
                <PracticalBadge />
              </button>
            ))}
          </div>
        </div>
      )}

      {questionCount > 0 && (
        <div className="igb-ov-block">
          <button type="button" className="igb-btn igb-btn-primary igb-ov-quiz" onClick={onOpenQuestions}>
            Practice {questionCount} question{questionCount === 1 ? "" : "s"} for this topic
          </button>
        </div>
      )}
    </section>
  );
}
