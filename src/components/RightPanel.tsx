import { Brain, Gauge, Heart, MessageCircle, Sparkles, Target } from "lucide-react";
import type { CSSProperties } from "react";
import { Trans, useTranslation } from "react-i18next";
import { cells, type CellItem } from "../data/cells";
import { useResolvedCell } from "../i18n/resolveCell";

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
  const { t } = useTranslation("common");
  const comparison = useResolvedCell(cell.comparison);
  const organelle = cell.organelles.find((item) => item.id === activeOrganelle) ?? cell.organelles[0];
  const tutorPrompts = [
    t("tutor.explain", { organelle: organelle.name, cell: cell.name }),
    t("tutor.quizDiff", { cell: cell.name, comparison: comparison.name }),
    t("tutor.guide", { organelle: organelle.name }),
    t("tutor.clinical", { cell: cell.name }),
  ];

  return (
    <aside className="right-rail">
      <section className="panel details-panel">
        <div className="panel-heading detail-heading">
          <span>{t("right.organelleDetails")}</span>
          <button
            type="button"
            onClick={() => onToggleFavorite(cell.id)}
            aria-label={t("right.toggleFavorite")}
            title={favorites.has(cell.id) ? t("right.removeFavorite") : t("right.addFavorite")}
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
            <dt>{t("right.label")}</dt>
            <dd>
              <span className="mini-toggle is-on" />
              <span className="detail-dot" style={{ background: organelle.color }} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel notes-panel">
        <div className="panel-heading">
          <span>{t("right.biologicalNotes")}</span>
        </div>
        <p>{organelle.note}</p>
        {cell.clinicalContext && (
          <div className="clinical-context">
            <span>{t("right.clinicalContext")}</span>
            <p>{cell.clinicalContext}</p>
          </div>
        )}
        <div className="fun-fact">
          <span>{t("right.funFact", { fact: organelle.fact })}</span>
          <Sparkles size={18} />
        </div>
      </section>

      <section className="panel learning-panel">
        <div className="panel-heading">
          <span>
            <Brain size={17} />
            {t("right.aiTutor")}
          </span>
        </div>

        <div className="mastery-meter" style={{ "--progress": `${mastery}%` } as CSSProperties}>
          <div>
            <Gauge size={18} />
            <span>{t("right.mastery")}</span>
            <strong>{mastery}%</strong>
          </div>
          <i>
            <b />
          </i>
          <small>
            {t("right.masteryMeta", {
              cells: viewedCellCount,
              cellTotal: cells.length,
              organelles: viewedOrganelleCount,
              organelleTotal: totalOrganelleCount,
            })}
          </small>
        </div>

        <div className="lesson-focus">
          <span>
            <Target size={17} />
            {t("right.lessonFocus")}
          </span>
          <p>
            <Trans
              i18nKey="right.lessonBody"
              values={{ organelle: organelle.name, comparison: comparison.name }}
              components={{ strong: <strong /> }}
            />
          </p>
        </div>

        <div className="tutor-prompt">
          <span>
            <MessageCircle size={17} />
            {t("right.promptStaged")}
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
          <span>{t("right.whereItOccurs")}</span>
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
