import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { Check, Clock, Keyboard, RotateCcw, Share2, Trophy, Volume2, VolumeX, X, Zap } from "lucide-react";
import { CellScene } from "./CellScene";
import { CELL_CATEGORY_ORDER, categorize, cells, type CellCategory, type CellItem } from "../data/cells";
import { playCorrect, playFinish, playWrong } from "../lib/quizSound";

const TOTAL_QUESTIONS = 10;
const TIMED_SECONDS = 12;
const TIMEOUT_SENTINEL = "__timeout__";

// Only quiz specimens that have a rendered thumbnail — guarantees the model
// loads and reads clearly in the stage.
const QUIZ_POOL = cells.filter((c) => c.renderImage);

type QuizMode = "casual" | "timed" | "type";
type CategoryFilter = "All" | CellCategory;
type Phase = "config" | "playing" | "finished";

type Question = {
  target: CellItem;
  options: CellItem[];
};

const CATEGORY_FILTERS: CategoryFilter[] = ["All", ...CELL_CATEGORY_ORDER];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Accept exact normalized match, or a near-miss typo for longer names.
function nameMatches(typed: string, target: string): boolean {
  const a = normalizeName(typed);
  const b = normalizeName(target);
  if (!a) return false;
  if (a === b) return true;
  const tolerance = b.length >= 8 ? 2 : b.length >= 5 ? 1 : 0;
  return levenshtein(a, b) <= tolerance;
}

function poolForCategory(category: CategoryFilter): CellItem[] {
  if (category === "All") return QUIZ_POOL;
  const filtered = QUIZ_POOL.filter((c) => categorize(c) === category);
  return filtered.length >= 4 ? filtered : QUIZ_POOL;
}

function buildQuestion(category: CategoryFilter, recent: Set<string>): Question {
  const base = poolForCategory(category);
  const available = base.filter((c) => !recent.has(c.id));
  const pool = available.length >= 1 ? available : base;
  const target = pool[Math.floor(Math.random() * pool.length)];

  // Prefer distractors from the same anatomical category for a real challenge.
  const sameCategory = QUIZ_POOL.filter(
    (c) => c.id !== target.id && categorize(c) === categorize(target),
  );
  const others = QUIZ_POOL.filter((c) => c.id !== target.id);
  const distractorSource = sameCategory.length >= 3 ? sameCategory : others;
  const distractors = shuffle(distractorSource).slice(0, 3);
  return { target, options: shuffle([target, ...distractors]) };
}

function bestScoreKey(category: CategoryFilter, mode: QuizMode): string {
  return `cas-quiz-best:${category}:${mode}`;
}

function readBest(category: CategoryFilter, mode: QuizMode): number {
  try {
    const raw = localStorage.getItem(bestScoreKey(category, mode));
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeBest(category: CategoryFilter, mode: QuizMode, value: number): void {
  try {
    localStorage.setItem(bestScoreKey(category, mode), String(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

type QuizResult = {
  score: number;
  total: number;
  category: CategoryFilter;
  mode: QuizMode;
  ts: number;
};

const HISTORY_KEY = "cas-quiz-history";
const HISTORY_MAX = 12;

function readHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as QuizResult[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function pushHistory(result: QuizResult): void {
  try {
    const next = [result, ...readHistory()].slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

const MUTE_KEY = "cas-quiz-muted";

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(value: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function SpecimenQuiz({
  onExit,
  onStudySpecimen,
}: {
  onExit: () => void;
  onStudySpecimen?: (id: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>("config");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [mode, setMode] = useState<QuizMode>("casual");

  const [question, setQuestion] = useState<Question | null>(null);
  const [recent, setRecent] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [newRecord, setNewRecord] = useState(false);
  const [typed, setTyped] = useState("");
  const [typedWasRight, setTypedWasRight] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const [history, setHistory] = useState<QuizResult[]>(() => readHistory());
  const [misses, setMisses] = useState<CellItem[]>([]);
  const [roundLog, setRoundLog] = useState<boolean[]>([]);
  const [shareLabel, setShareLabel] = useState("Share result");

  const answered = selected !== null;
  const isCorrect = answered && (selected === question?.target.id || typedWasRight);
  const accentCell = question?.target ?? QUIZ_POOL[0];

  const startGame = useCallback(() => {
    setQuestion(buildQuestion(category, new Set()));
    setRecent(new Set());
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setQuestionNumber(1);
    setResetKey((k) => k + 1);
    setTimeLeft(TIMED_SECONDS);
    setNewRecord(false);
    setTyped("");
    setTypedWasRight(false);
    setMisses([]);
    setRoundLog([]);
    setShareLabel("Share result");
    setPhase("playing");
  }, [category]);

  const shareResult = useCallback(() => {
    const squares = roundLog.map((ok) => (ok ? "🟩" : "🟥")).join("");
    const label = category === "All" ? "all specimens" : category;
    const text = `Cell Architecture Quiz — ${score}/${TOTAL_QUESTIONS} (${label}, ${mode})\n${squares}`;
    const done = () => {
      setShareLabel("Copied!");
      window.setTimeout(() => setShareLabel("Share result"), 1800);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => setShareLabel("Copy failed"));
    } else {
      setShareLabel("Copy failed");
    }
  }, [roundLog, score, category, mode]);

  const registerResult = useCallback(
    (right: boolean) => {
      setRoundLog((log) => [...log, right]);
      if (right) {
        if (!muted) playCorrect();
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        if (!muted) playWrong();
        setStreak(0);
        if (question) setMisses((m) => (m.some((c) => c.id === question.target.id) ? m : [...m, question.target]));
      }
    },
    [muted, question],
  );

  const handleAnswer = useCallback(
    (id: string) => {
      if (answered || !question) return;
      setSelected(id);
      registerResult(id === question.target.id);
    },
    [answered, question, registerResult],
  );

  const submitTyped = useCallback(() => {
    if (answered || !question) return;
    const right = nameMatches(typed, question.target.name);
    setTypedWasRight(right);
    setSelected(right ? question.target.id : TIMEOUT_SENTINEL);
    registerResult(right);
  }, [answered, question, typed, registerResult]);

  const finishGame = useCallback(
    (finalScore: number) => {
      const prevBest = readBest(category, mode);
      if (finalScore > prevBest) {
        writeBest(category, mode, finalScore);
        setNewRecord(true);
      }
      const result: QuizResult = {
        score: finalScore,
        total: TOTAL_QUESTIONS,
        category,
        mode,
        ts: Date.now(),
      };
      pushHistory(result);
      setHistory(readHistory());
      if (!muted) playFinish();
      setPhase("finished");
    },
    [category, mode, muted],
  );

  const handleNext = useCallback(() => {
    if (!question) return;
    if (questionNumber >= TOTAL_QUESTIONS) {
      finishGame(score);
      return;
    }
    const nextRecent = new Set([...recent, question.target.id]);
    setRecent(nextRecent);
    setQuestion(buildQuestion(category, nextRecent));
    setSelected(null);
    setQuestionNumber((n) => n + 1);
    setResetKey((k) => k + 1);
    setTimeLeft(TIMED_SECONDS);
    setTyped("");
    setTypedWasRight(false);
  }, [question, questionNumber, score, recent, category, finishGame]);

  // Countdown timer for timed mode — auto-reveal (as wrong) when it hits zero.
  useEffect(() => {
    if (phase !== "playing" || mode !== "timed" || answered) return;
    if (timeLeft <= 0) {
      setSelected(TIMEOUT_SENTINEL);
      setStreak(0);
      if (!muted) playWrong();
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, mode, answered, timeLeft, muted]);

  // Keyboard: 1-4 to answer, Enter/Space to advance, Esc to exit.
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      if (!answered && question && mode !== "type") {
        const idx = Number(e.key) - 1;
        if (idx >= 0 && idx < question.options.length) {
          handleAnswer(question.options[idx].id);
        }
      } else if (answered && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answered, question, mode, handleAnswer, handleNext, onExit]);

  const shellStyle = {
    "--accent": accentCell.accent,
    "--accent-soft": accentCell.accentSoft,
    "--cell-color": accentCell.color,
  } as CSSProperties;

  if (phase === "config") {
    return (
      <div className="quiz-layer" style={shellStyle}>
        <div className="quiz-config">
          <button type="button" className="quiz-exit quiz-config-close" onClick={onExit} aria-label="Close">
            <X size={20} />
          </button>
          <h2>Specimen Quiz</h2>
          <p className="quiz-config-sub">Identify the 3D model from 4 options.</p>

          <div className="quiz-config-group">
            <span className="quiz-config-label">Category</span>
            <div className="quiz-chip-row">
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`quiz-chip ${category === c ? "is-active" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-config-group">
            <span className="quiz-config-label">Mode</span>
            <div className="quiz-chip-row">
              <button
                type="button"
                className={`quiz-chip ${mode === "casual" ? "is-active" : ""}`}
                onClick={() => setMode("casual")}
              >
                Casual
              </button>
              <button
                type="button"
                className={`quiz-chip ${mode === "timed" ? "is-active" : ""}`}
                onClick={() => setMode("timed")}
              >
                <Clock size={14} /> Timed ({TIMED_SECONDS}s)
              </button>
              <button
                type="button"
                className={`quiz-chip ${mode === "type" ? "is-active" : ""}`}
                onClick={() => setMode("type")}
              >
                <Keyboard size={14} /> Type it
              </button>
            </div>
          </div>

          <div className="quiz-config-meta">
            <p className="quiz-config-best">
              <Trophy size={15} /> Best: {readBest(category, mode)} / {TOTAL_QUESTIONS}
            </p>
            <button
              type="button"
              className={`quiz-mute ${muted ? "is-muted" : ""}`}
              onClick={() => {
                const next = !muted;
                setMuted(next);
                writeMuted(next);
              }}
              aria-pressed={muted}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>

          {history.length > 0 && (
            <div className="quiz-config-group">
              <span className="quiz-config-label">Recent games</span>
              <ul className="quiz-history">
                {history.slice(0, 5).map((h) => (
                  <li key={h.ts} className="quiz-history-row">
                    <span className="quiz-history-score">
                      {h.score}/{h.total}
                    </span>
                    <span className="quiz-history-meta">
                      {h.category} · {h.mode}
                    </span>
                    <span className="quiz-history-time">{relativeTime(h.ts)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="quiz-result-actions">
            <button type="button" className="quiz-primary" onClick={startGame}>
              Start quiz
            </button>
            <button type="button" className="quiz-secondary" onClick={onExit}>
              Cancel
            </button>
          </div>
          <p className="quiz-config-hint">Tip: press 1-4 to answer, Enter for next.</p>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
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
          {newRecord && <p className="quiz-result-record">New best score!</p>}
          <p className="quiz-result-streak">
            Best streak: {bestStreak} · {category} · {mode}
          </p>

          {misses.length > 0 && (
            <div className="quiz-review">
              <span className="quiz-review-title">Review — you missed {misses.length}</span>
              <div className="quiz-review-grid">
                {misses.map((cell) => (
                  <button
                    key={cell.id}
                    type="button"
                    className="quiz-review-item"
                    onClick={() => onStudySpecimen?.(cell.id)}
                    disabled={!onStudySpecimen}
                    title={onStudySpecimen ? `Open ${cell.name} in studio` : cell.name}
                  >
                    <span
                      className="quiz-review-thumb"
                      style={{ backgroundImage: `url(${cell.renderImage?.url ?? ""})` }}
                    />
                    <span className="quiz-review-name">{cell.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quiz-result-actions">
            <button type="button" className="quiz-primary" onClick={() => setPhase("config")}>
              <RotateCcw size={18} />
              Play again
            </button>
            <button type="button" className="quiz-secondary" onClick={shareResult}>
              <Share2 size={16} />
              {shareLabel}
            </button>
            <button type="button" className="quiz-secondary" onClick={onExit}>
              Back to studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const timePct = (timeLeft / TIMED_SECONDS) * 100;
  const timeLow = mode === "timed" && timeLeft <= 4;

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

        {mode === "timed" && (
          <div className={`quiz-timer ${timeLow ? "is-low" : ""}`}>
            <Clock size={14} />
            <div className="quiz-timer-bar">
              <i style={{ width: `${timePct}%` }} />
            </div>
            <span className="quiz-timer-num">{timeLeft}s</span>
          </div>
        )}

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

        {mode === "type" ? (
          <form
            className="quiz-type"
            onSubmit={(e) => {
              e.preventDefault();
              if (answered) handleNext();
              else submitTyped();
            }}
          >
            <input
              type="text"
              className="quiz-type-input"
              value={answered ? question.target.name : typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type the specimen name…"
              aria-label="Specimen name"
              disabled={answered}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
            {!answered && (
              <button type="submit" className="quiz-primary" disabled={!typed.trim()}>
                Submit
              </button>
            )}
          </form>
        ) : (
          <div className="quiz-options">
            {question.options.map((option, idx) => {
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
                  <span className="quiz-option-key">{idx + 1}</span>
                  <span className="quiz-option-name">{option.name}</span>
                  {answered && isTarget && <Check size={18} />}
                  {answered && isPicked && !isTarget && <X size={18} />}
                </button>
              );
            })}
          </div>
        )}

        <footer className="quiz-footer">
          {answered ? (
            <div className="quiz-feedback">
              <span className={isCorrect ? "quiz-feedback-ok" : "quiz-feedback-no"}>
                {isCorrect
                  ? "Correct!"
                  : mode === "timed" && selected === TIMEOUT_SENTINEL
                    ? `Time's up — it was ${question.target.name}.`
                    : `It was ${question.target.name}.`}
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
