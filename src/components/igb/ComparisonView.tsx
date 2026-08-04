import type { Comparison } from "../../data/curriculum/types";
import { getVisualById } from "../../data/biologyVisuals";
import { TierBadge } from "./Badge";

type Props = {
  comparison: Comparison;
  onOpenQuestion: (id: string) => void;
  onSave: () => void;
};

export function ComparisonView({ comparison, onOpenQuestion, onSave }: Props) {
  return (
    <section className="stage-panel igb-compare">
      <div className="stage-title">
        <div className="stage-title-copy">
          <h2>{comparison.title}</h2>
          <p>Similarities, differences and the exam-ready summary</p>
        </div>
        <TierBadge tier={comparison.courseTier} />
      </div>

      <div className="igb-compare-heads">
        {comparison.itemIds.map((id, i) => {
          const visual = getVisualById(id);
          return (
            <div key={id} className="igb-compare-head">
              {visual?.thumbnailUrl || visual?.posterUrl ? (
                <img src={visual.thumbnailUrl ?? visual.posterUrl} alt="" />
              ) : (
                <div className="igb-compare-swatch" aria-hidden="true" />
              )}
              <strong>{comparison.itemLabels[i]}</strong>
            </div>
          );
        })}
      </div>

      <div className="igb-compare-grid">
        <div className="igb-compare-similar">
          <h4>Similarities</h4>
          <ul>
            {comparison.similarities.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="igb-compare-diff">
          <h4>Differences</h4>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {comparison.itemLabels.map((l) => (
                  <th key={l}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.differences.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  {row.values.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="igb-compare-summary">
        <h4>Exam-ready summary</h4>
        <p>{comparison.examSummary}</p>
      </div>

      <div className="igb-compare-actions">
        <button type="button" className="igb-btn" onClick={onSave}>
          Save summary to notes
        </button>
        {comparison.questionId && (
          <button type="button" className="igb-btn igb-btn-primary" onClick={() => onOpenQuestion(comparison.questionId!)}>
            Try a comparison question
          </button>
        )}
      </div>
    </section>
  );
}
