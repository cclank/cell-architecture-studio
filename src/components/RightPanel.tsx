import { Brain, Gauge, Heart, MessageCircle, Sparkles, Target } from "lucide-react";
import type { CSSProperties } from "react";
import { cells, getCellById, type CellItem } from "../data/cells";

type RightPanelProps = {
  cell: CellItem;
  activeOrganelle: string;
  favorites: Set<string>;
  mastery: number;
  viewedCellCount: number;
  viewedOrganelleCount: number;
  totalOrganelleCount: number;
  tutorPrompt: string;
  onToggleFavorite: (id: string) => void;
  onTutorPrompt: (prompt: string) => void;
};

function buildTutorPrompts(cell: CellItem, organelle: CellItem["organelles"][number]) {
  return [
    `Explain how ${organelle.name} helps a ${cell.name} stay alive.`,
    `Quiz me on the visual differences between ${cell.name} and ${getCellById(cell.comparison).name}.`,
    `Guide me through finding ${organelle.name} inside the 3D model.`,
    `Connect ${cell.name} structure to one clinical observation without giving medical advice.`,
  ];
}

export function RightPanel({
  cell,
  activeOrganelle,
  favorites,
  mastery,
  viewedCellCount,
  viewedOrganelleCount,
  totalOrganelleCount,
  tutorPrompt,
  onToggleFavorite,
  onTutorPrompt,
}: RightPanelProps) {
  const organelle = cell.organelles.find((item) => item.id === activeOrganelle) ?? cell.organelles[0];
  const tutorPrompts = buildTutorPrompts(cell, organelle);

  return (
    <aside className="right-rail">
      <section className="panel details-panel">
        <div className="panel-heading detail-heading">
          <span>Organelle Details</span>
          <button
            type="button"
            onClick={() => onToggleFavorite(cell.id)}
            aria-label="Toggle favorite"
            title={favorites.has(cell.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={22} fill={favorites.has(cell.id) ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="detail-hero">
          <span className="organelle-orb" style={{ background: organelle.color }} />
          <div>
            <h3>{organelle.name}</h3>
            <p>{organelle.subtitle}</p>
          </div>
        </div>

        <dl className="attribute-list">
          {organelle.attributes.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div>
            <dt>Label</dt>
            <dd>
              <span className="mini-toggle is-on" />
              <span className="detail-dot" style={{ background: organelle.color }} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel notes-panel">
        <div className="panel-heading">
          <span>Biological Notes</span>
        </div>
        <p>{organelle.note}</p>
        {cell.clinicalContext && (
          <div className="clinical-context">
            <span>Clinical Context</span>
            <p>{cell.clinicalContext}</p>
          </div>
        )}
        <div className="fun-fact">
          <span>Fun Fact: {organelle.fact}</span>
          <Sparkles size={18} />
        </div>
      </section>

      <section className="panel learning-panel">
        <div className="panel-heading">
          <span>
            <Brain size={17} />
            AI Tutor
          </span>
        </div>

        <div className="mastery-meter" style={{ "--progress": `${mastery}%` } as CSSProperties}>
          <div>
            <Gauge size={18} />
            <span>Mastery</span>
            <strong>{mastery}%</strong>
          </div>
          <i>
            <b />
          </i>
          <small>
            {viewedCellCount}/{cells.length} cells explored · {viewedOrganelleCount}/{totalOrganelleCount} organelles inspected
          </small>
        </div>

        <div className="lesson-focus">
          <span>
            <Target size={17} />
            Current lesson focus
          </span>
          <p>
            Locate <strong>{organelle.name}</strong>, explain its role, then compare it with the matching structure in{" "}
            {getCellById(cell.comparison).name}.
          </p>
        </div>

        <div className="tutor-prompt">
          <span>
            <MessageCircle size={17} />
            Prompt staged for AI tutor
          </span>
          <p>{tutorPrompt}</p>
        </div>

        <div className="prompt-list">
          {tutorPrompts.map((prompt) => (
            <button type="button" key={prompt} onClick={() => onTutorPrompt(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="panel occurrence-panel">
        <div className="panel-heading">
          <span>Where It Occurs</span>
        </div>
        <div className={`occurrence-art occurrence-${cell.occurrence.motif}`}>
          <span />
          <i />
          <b />
        </div>
        <h4>{cell.occurrence.title}</h4>
        <p>{cell.occurrence.body}</p>
      </section>
    </aside>
  );
}
