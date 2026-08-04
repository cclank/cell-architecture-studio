import type { PracticalActivity } from "../../data/curriculum/types";
import { PracticalBadge } from "./Badge";

// Structured practical guidance for Paper 5 / Paper 6 skills. It coaches the
// method and evaluation but does not auto-produce assessed answers.
export function PracticalPanel({
  practical,
  onComplete,
}: {
  practical: PracticalActivity;
  onComplete: (id: string) => void;
}) {
  return (
    <section className="stage-panel igb-practical">
      <div className="stage-title">
        <div className="stage-title-copy">
          <h2>{practical.title}</h2>
          <p>{practical.aim}</p>
        </div>
        <PracticalBadge />
      </div>

      <div className="igb-practical-body">
        <div className="igb-practical-vars">
          <div>
            <h4>Independent variable</h4>
            <p>{practical.independentVariable}</p>
          </div>
          <div>
            <h4>Dependent variable</h4>
            <p>{practical.dependentVariable}</p>
          </div>
          <div>
            <h4>Control variables</h4>
            <ul>
              {practical.controlVariables.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="igb-practical-cols">
          <section>
            <h4>Apparatus</h4>
            <ul>{practical.apparatus.map((a) => <li key={a}>{a}</li>)}</ul>
            <h4>Safety</h4>
            <ul className="igb-warn-list">{practical.safetyNotes.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
          <section>
            <h4>Method</h4>
            <ol>{practical.methodSummary.map((m) => <li key={m}>{m}</li>)}</ol>
            <h4>Expected observations</h4>
            <ul>{practical.expectedObservations.map((o) => <li key={o}>{o}</li>)}</ul>
          </section>
        </div>

        <div className="igb-practical-table">
          <h4>Suggested results table</h4>
          <table>
            <thead>
              <tr>{practical.resultsTableColumns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              <tr>{practical.resultsTableColumns.map((c) => <td key={c}>—</td>)}</tr>
              <tr>{practical.resultsTableColumns.map((c) => <td key={c}>—</td>)}</tr>
            </tbody>
          </table>
          <p className="igb-muted">Suitable graph: {practical.suitableGraph}</p>
        </div>

        <div className="igb-practical-cols">
          <section>
            <h4>Sources of error</h4>
            <ul>{practical.sourcesOfError.map((e) => <li key={e}>{e}</li>)}</ul>
          </section>
          <section>
            <h4>Improvements</h4>
            <ul>{practical.improvements.map((i) => <li key={i}>{i}</li>)}</ul>
          </section>
        </div>

        <div className="igb-practical-cols">
          <section>
            <h4>Conclusion prompts</h4>
            <ul>{practical.conclusionPrompts.map((c) => <li key={c}>{c}</li>)}</ul>
          </section>
          <section>
            <h4>Common exam mistakes</h4>
            <ul className="igb-warn-list">{practical.commonMistakes.map((m) => <li key={m}>{m}</li>)}</ul>
          </section>
        </div>

        <button type="button" className="igb-btn igb-btn-primary" onClick={() => onComplete(practical.id)}>
          Mark practical reviewed
        </button>
      </div>
    </section>
  );
}
