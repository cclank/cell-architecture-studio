import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { Check, RotateCcw, Trophy, X, Zap } from "lucide-react";
import { CellScene } from "./CellScene";
import { categorize, cells, type CellItem } from "../data/cells";

const TOTAL_QUESTIONS = 10;

// Only quiz specimens that have a rendered thumbnail — guarantees the model
// loads and reads clearly in the stage.
const QUIZ_POOL = cells.filter((c) => c.renderImage);

type Question = {
  target: CellItem;
  options: CellItem[];
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestion(recent: Set<string>): Question {
  const available = QUIZ_POOL.filter((c) => !recent.has(c.id));
  const pool = available.length >= 4 ? available : QUIZ_POOL;
  const target = pool[Math.floor(Math.random() * pool.length)];

  // Prefer distractors from the same category for a meaningful challenge.
  const sameCategory = QUIZ_POOL.filter(
    (c) => c.id !== target.id && categorize(c) === categorize(target),
  );
  const others = QUIZ_POOL.filter((c) => c.id !== target.id);
  const distractorSource = sameCategory.length >= 3 ? sameCategory : others;
  const distractors = shuffle(distractorSource).slice(0, 3);
  const options = shuffle([target, ...distractors]);
  return { target, options };
}

export function SpecimenQuiz({ onExit }: { onExit: () => void }) {
  const [recent, setRecent] = useState<Set<string>>(() => new Set());
  const [question, setQuestion] = useState<Question>(() => buildQuestion(new Set()));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [finished, setFinished] = useState(false);

  const answered = selected !== null;
  const isCorrect = answered && selected === question.target.id;

  const handleAnswer = useCallback(
    (id: string) => {
      if (answered) return;
      setSelected(id);
      if (id === question.target.id) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }
    },
    [answered, question.target.id],
  );

  const handleNext = useCallback(() => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setFinished(true);
      return;
    }
    setRecent((prev) => new Set(prev).add(question.target.id));
    setQuestion(buildQuestion(new Set([...recent, question.target.id])));
    setSelected(null);
    setQuestionNumber((n) => n + 1);
    setResetKey((k) => k + 1);
  }, [questionNumber, question.target.id, recent]);

  const handleRestart = useCallback(() => {
    setRecent(new Set());
    setQuestion(buildQuestion(new Set()));
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setQuestionNumber(1);
    setResetKey((k) => k + 1);
    setFinished(false);
  }, []);

  const shellStyle = {
    "--accent": question.target.accent,
    "--accent-soft": question.target.accentSoft,
    "--cell-color": question.target.color,
  } as CSSProperties;

  if (finished) {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    const verdict =
      pct >= 90 ? "Cell biology master!" : pct >= 60 ? "Solid knowledge." : "Keep exploring!";
    return (
      <div className="quiz-layer" style={shellStyle}>
        <div className="quiz-result">
          <Trophy size={56} />
          <h2>Quiz complete</h2>
          <p className="quiz-result-score">
            {score} / {TOTAL_QUESTIONS}
          </p>
          <p className="quiz-result-verdict">{verdict}</p>
          <p className="quiz-result-streak">Best streak: {bestStreak}</p>
          <div className="quiz-result-actions">
            <button type="button" className="quiz-primary" onClick={handleRestart}>
              <RotateCcw size={18} />
              Play again
            </button>
            <button type="button" className="quiz-secondary" onClick={onExit}>
              Back to studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-layer" style={shellStyle}>
      <div className="quiz-panel">
        <header className="quiz-header">
          <div className="quiz-progress">
            <span className="quiz-progress-label">
              Question {questionNumber} / {TOTAL_QUESTIONS}
            </span>
            <div className="quiz-progress-bar">
              <i style={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }} />
            </div>
          </div>
          <div className="quiz-stats">
            <span className="quiz-stat">
              <Check size={16} />
              {score}
            </span>
            <span className="quiz-stat">
              <Zap size={16} />
              {streak}
            </span>
            <button type="button" className="quiz-exit" onClick={onExit} aria-label="Exit quiz">
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="quiz-stage">
          <CellScene
            key={resetKey}
            cell={question.target}
            activeOrganelle={question.target.defaultOrganelle}
            viewMode="mesh"
            crossSection={false}
            autoRotate
            resetKey={resetKey}
          />
          <span className="quiz-stage-hint">What specimen is this?</span>
        </div>

        <div className="quiz-options">
          {question.options.map((option) => {
            const isTarget = option.id === question.target.id;
            const isPicked = option.id === selected;
            let state = "";
            if (answered) {
              if (isTarget) state = "is-correct";
              else if (isPicked) state = "is-wrong";
              else state = "is-muted";
            }
            return (
              <button
                key={option.id}
                type="button"
                className={`quiz-option ${state}`}
                onClick={() => handleAnswer(option.id)}
                disabled={answered}
              >
                <span>{option.name}</span>
                {answered && isTarget && <Check size={18} />}
                {answered && isPicked && !isTarget && <X size={18} />}
              </button>
            );
          })}
        </div>

        <footer className="quiz-footer">
          {answered ? (
            <div className="quiz-feedback">
              <span className={isCorrect ? "quiz-feedback-ok" : "quiz-feedback-no"}>
                {isCorrect ? "Correct!" : `It was ${question.target.name}.`}
              </span>
              <button type="button" className="quiz-primary" onClick={handleNext}>
                {questionNumber >= TOTAL_QUESTIONS ? "See results" : "Next"}
              </button>
            </div>
          ) : (
            <span className="quiz-footer-hint">{question.target.type}</span>
          )}
        </footer>
      </div>
    </div>
  );
}
