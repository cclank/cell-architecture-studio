import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { CourseLevel, PracticeQuestion } from "../../data/curriculum/types";
import { getVisualById } from "../../data/biologyVisuals";
import { isTierVisible } from "../../lib/courseLevel";
import { TierBadge } from "./Badge";

type Props = {
  title: string;
  questions: PracticeQuestion[];
  courseLevel: CourseLevel;
  onResult: (questionId: string, correct: boolean) => void;
  onClose: () => void;
};

export function QuestionRunner({ title, questions, courseLevel, onResult, onClose }: Props) {
  const pool = useMemo(
    () => questions.filter((q) => isTierVisible(q.courseTier, courseLevel)),
    [questions, courseLevel],
  );
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [scored, setScored] = useState<Record<string, boolean>>({});

  if (pool.length === 0) {
    return (
      <div className="igb-quiz-empty">
        <p>No questions at this course level yet.</p>
        <button type="button" className="igb-btn" onClick={onClose}>Close</button>
      </div>
    );
  }

  const q = pool[Math.min(index, pool.length - 1)];
  const isChoiceType = q.type === "MCQ" || q.type === "MODEL_SELECT";

  function commitResult(correct: boolean) {
    if (scored[q.id] === undefined) onResult(q.id, correct);
    setScored((s) => ({ ...s, [q.id]: correct }));
  }

  function selectChoice(id: string, correct: boolean) {
    if (submitted) return;
    setChoice(id);
    setSubmitted(true);
    commitResult(correct);
  }

  function nextQuestion() {
    setChoice(null);
    setSubmitted(false);
    setIndex((i) => (i + 1) % pool.length);
  }

  const modelStructures = q.type === "MODEL_SELECT" && q.visualId ? getVisualById(q.visualId)?.structures ?? [] : [];

  return (
    <div className="igb-quiz">
      <div className="igb-quiz-head">
        <div>
          <h2>{title}</h2>
          <p className="igb-muted">
            Question {index + 1} of {pool.length}
          </p>
        </div>
        <button type="button" className="igb-btn" onClick={onClose} aria-label="Close questions">
          <X size={18} /> Close
        </button>
      </div>

      <div className="igb-quiz-card">
        <div className="igb-quiz-meta">
          <TierBadge tier={q.courseTier} />
          <span className="igb-badge badge-practical">{q.paper.replace("_", " ")}</span>
          <span className="igb-badge badge-ao">{q.assessmentObjective}</span>
          <span className="igb-quiz-marks">{q.marks} mark{q.marks === 1 ? "" : "s"}</span>
          <span className="igb-quiz-command">{q.commandWord}</span>
        </div>

        <p className="igb-quiz-prompt">{q.prompt}</p>

        {q.type === "MCQ" && q.options && (
          <div className="igb-quiz-options">
            {q.options.map((opt) => {
              const state = submitted
                ? opt.correct
                  ? "correct"
                  : choice === opt.id
                    ? "wrong"
                    : ""
                : "";
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`igb-quiz-option ${state}`}
                  disabled={submitted}
                  onClick={() => selectChoice(opt.id, opt.correct)}
                >
                  {opt.text}
                  {submitted && opt.correct && <Check size={16} />}
                  {submitted && !opt.correct && choice === opt.id && <X size={16} />}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "MODEL_SELECT" && (
          <div className="igb-quiz-options">
            <p className="igb-muted">Select the correct structure from the model:</p>
            {modelStructures.map((s) => {
              const correct = s.id === q.answerStructureId;
              const state = submitted ? (correct ? "correct" : choice === s.id ? "wrong" : "") : "";
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`igb-quiz-option ${state}`}
                  disabled={submitted}
                  onClick={() => selectChoice(s.id, correct)}
                >
                  <span className="color-dot" style={{ background: s.color }} /> {s.name}
                  {submitted && correct && <Check size={16} />}
                </button>
              );
            })}
          </div>
        )}

        {!isChoiceType && (
          <div className="igb-quiz-free">
            {!submitted ? (
              <button type="button" className="igb-btn igb-btn-primary" onClick={() => setSubmitted(true)}>
                Show mark scheme
              </button>
            ) : (
              <>
                <h4>Mark points</h4>
                <ul className="igb-mark-points">
                  {q.markPoints.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                {scored[q.id] === undefined && (
                  <div className="igb-selfmark">
                    <span>How did you do?</span>
                    <button type="button" className="igb-btn igb-selfmark-yes" onClick={() => commitResult(true)}>
                      Got it
                    </button>
                    <button type="button" className="igb-btn igb-selfmark-no" onClick={() => commitResult(false)}>
                      Missed it
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {submitted && (
          <div className="igb-quiz-explain">
            {isChoiceType && (
              <p className={`igb-quiz-verdict ${scored[q.id] ? "ok" : "no"}`}>
                {scored[q.id] ? "Correct" : "Not quite"}
              </p>
            )}
            <p>{q.explanation}</p>
            <button type="button" className="igb-btn igb-btn-primary" onClick={nextQuestion}>
              Next question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
