import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Check, Clock, Heart, Keyboard, RotateCcw, Share2, Trophy, Volume2, VolumeX, X, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CellScene } from "./CellScene";
import { CELL_CATEGORY_ORDER, categorize, type CellCategory, type CellItem } from "../data/cells";
import { useResolvedCells } from "../i18n/resolveCell";
import { nameMatches } from "../lib/nameMatch";
import { playCorrect, playFinish, playWrong } from "../lib/quizSound";
import { STORAGE_KEYS } from "../lib/storageKeys";

const TOTAL_QUESTIONS = 10;
const TIMED_SECONDS = 12;
const SURVIVAL_LIVES = 3;
const TIMEOUT_SENTINEL = "__timeout__";

type QuizMode = "casual" | "timed" | "type" | "survival";
type CategoryFilter = "All" | CellCategory;
type Phase = "config" | "playing" | "finished";

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

function poolForCategory(quizPool: CellItem[], category: CategoryFilter): CellItem[] {
  if (category === "All") return quizPool;
  const filtered = quizPool.filter((c) => categorize(c) === category);
  return filtered.length >= 4 ? filtered : quizPool;
}

function buildQuestion(quizPool: CellItem[], category: CategoryFilter, recent: Set<string>): Question {
  const base = poolForCategory(quizPool, category);
  const available = base.filter((c) => !recent.has(c.id));
  const pool = available.length >= 1 ? available : base;
  const target = pool[Math.floor(Math.random() * pool.length)];

  const sameCategory = quizPool.filter(
    (c) => c.id !== target.id && categorize(c) === categorize(target),
  );
  const others = quizPool.filter((c) => c.id !== target.id);
  const distractorSource = sameCategory.length >= 3 ? sameCategory : others;
  const distractors = shuffle(distractorSource).slice(0, 3);
  return { target, options: shuffle([target, ...distractors]) };
}

function bestScoreKey(category: CategoryFilter, mode: QuizMode): string {
  return `${STORAGE_KEYS.quizBestPrefix}:${category}:${mode}`;
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
    /* ignore */
  }
}

type QuizResult = {
  score: number;
  total: number;
  category: CategoryFilter;
  mode: QuizMode;
  ts: number;
};

const HISTORY_KEY = STORAGE_KEYS.quizHistory;
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

const MUTE_KEY = STORAGE_KEYS.quizMuted;

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

export function SpecimenQuiz({
  onExit,
  onStudySpecimen,
  onCorrect,
  onComplete,
}: {
  onExit: () => void;
  onStudySpecimen?: (id: string) => void;
  onCorrect?: (streak: number) => void;
  onComplete?: (score: number, total: number, bestStreak: number, perfect: boolean) => void;
}) {
  const { t } = useTranslation(["quiz", "cells", "common"]);
  const resolved = useResolvedCells();
  const quizPool = useMemo(() => resolved.filter((c) => c.renderImage), [resolved]);
  const categoryFilters: CategoryFilter[] = useMemo(
    () => [
      "All",
      ...CELL_CATEGORY_ORDER.filter((category) =>
        quizPool.some((cell) => categorize(cell) === category),
      ),
    ],
    [quizPool],
  );

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
  const [shareLabel, setShareLabel] = useState(() => t("share"));
  const [lives, setLives] = useState(SURVIVAL_LIVES);

  const answered = selected !== null;
  const isCorrect = answered && (selected === question?.target.id || typedWasRight);
  const accentCell = question?.target ?? quizPool[0];

  function categoryLabel(c: CategoryFilter) {
    return c === "All" ? t("all") : t(`categories.${c}`, { ns: "cells" });
  }

  function modeLabel(m: QuizMode) {
    if (m === "timed") return t("modes.timed", { seconds: TIMED_SECONDS });
    return t(`modes.${m}`);
  }

  function relativeTime(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.round(diff / 60000);
    if (mins < 1) return t("relative.justNow");
    if (mins < 60) return t("relative.minutes", { count: mins });
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return t("relative.hours", { count: hrs });
    const days = Math.round(hrs / 24);
    return t("relative.days", { count: days });
  }

  const startGame = useCallback(() => {
    setQuestion(buildQuestion(quizPool, category, new Set()));
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
    setShareLabel(t("share"));
    setLives(SURVIVAL_LIVES);
    setPhase("playing");
  }, [category, quizPool, t]);

  const shareResult = useCallback(() => {
    const squares = roundLog.map((ok) => (ok ? "🟩" : "🟥")).join("");
    const label = category === "All" ? t("shareAll") : categoryLabel(category);
    const text = t("shareText", {
      score,
      total: TOTAL_QUESTIONS,
      label,
      mode: modeLabel(mode),
      squares,
    });
    const done = () => {
      setShareLabel(t("copied"));
      window.setTimeout(() => setShareLabel(t("share")), 1800);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => setShareLabel(t("copyFailed")));
    } else {
      setShareLabel(t("copyFailed"));
    }
  }, [roundLog, score, category, mode, t]);

  const registerResult = useCallback(
    (right: boolean) => {
      setRoundLog((log) => [...log, right]);
      if (right) {
        if (!muted) playCorrect();
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          onCorrect?.(next);
          return next;
        });
      } else {
        if (!muted) playWrong();
        setStreak(0);
        if (mode === "survival") setLives((l) => Math.max(0, l - 1));
        if (question) setMisses((m) => (m.some((c) => c.id === question.target.id) ? m : [...m, question.target]));
      }
    },
    [muted, mode, onCorrect, question],
  );

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (answered || !question) return;
      setSelected(optionId);
      registerResult(optionId === question.target.id);
    },
    [answered, question, registerResult],
  );

  const submitTyped = useCallback(() => {
    if (answered || !question) return;
    const targets = [question.target.name, ...question.target.aliases];
    const right = nameMatches(typed, targets);
    setTypedWasRight(right);
    setSelected(right ? question.target.id : "__wrong__");
    registerResult(right);
  }, [answered, question, typed, registerResult]);

  const finishRound = useCallback(
    (finalScore: number, finalBest: number) => {
      if (!muted) playFinish();
      const total = mode === "survival" ? finalScore : TOTAL_QUESTIONS;
      const prevBest = readBest(category, mode);
      if (finalScore > prevBest) {
        writeBest(category, mode, finalScore);
        setNewRecord(true);
      }
      pushHistory({ score: finalScore, total, category, mode, ts: Date.now() });
      setHistory(readHistory());
      onComplete?.(finalScore, total, finalBest, mode !== "survival" && finalScore === TOTAL_QUESTIONS);
      setPhase("finished");
    },
    [muted, mode, category, onComplete],
  );

  const handleNext = useCallback(() => {
    if (!question) return;
    if (mode === "survival" ? lives <= 0 : questionNumber >= TOTAL_QUESTIONS) {
      finishRound(score, bestStreak);
      return;
    }
    setRecent((r) => new Set(r).add(question.target.id));
    setQuestion(buildQuestion(quizPool, category, new Set([...recent, question.target.id])));
    setSelected(null);
    setTyped("");
    setTypedWasRight(false);
    setQuestionNumber((n) => n + 1);
    setResetKey((k) => k + 1);
    setTimeLeft(TIMED_SECONDS);
  }, [question, mode, lives, questionNumber, score, bestStreak, finishRound, quizPool, category, recent]);

  useEffect(() => {
    if (phase !== "playing" || mode !== "timed" || answered) return;
    if (timeLeft <= 0) {
      setSelected(TIMEOUT_SENTINEL);
      registerResult(false);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, mode, answered, timeLeft, registerResult]);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      if (!answered && question && mode !== "type") {
        const n = Number(e.key);
        if (n >= 1 && n <= 4 && question.options[n - 1]) {
          e.preventDefault();
          handleAnswer(question.options[n - 1].id);
        }
      }
      if (answered && e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answered, question, mode, handleAnswer, handleNext, onExit]);

  const shellStyle = {
    "--cell-color": accentCell?.color ?? "#2563eb",
  } as CSSProperties;

  if (phase === "config") {
    return (
      <div className="quiz-layer" style={shellStyle}>
        <div className="quiz-config">
          <button type="button" className="quiz-exit quiz-config-close" onClick={onExit} aria-label={t("close")}>
            <X size={20} />
          </button>
          <h2>{t("title")}</h2>
          <p className="quiz-config-sub">{t("subtitle")}</p>

          <div className="quiz-config-group">
            <span className="quiz-config-label">{t("category")}</span>
            <div className="quiz-chip-row">
              {categoryFilters.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`quiz-chip ${category === c ? "is-active" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {categoryLabel(c)}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-config-group">
            <span className="quiz-config-label">{t("mode")}</span>
            <div className="quiz-chip-row">
              <button
                type="button"
                className={`quiz-chip ${mode === "casual" ? "is-active" : ""}`}
                onClick={() => setMode("casual")}
              >
                {t("modes.casual")}
              </button>
              <button
                type="button"
                className={`quiz-chip ${mode === "timed" ? "is-active" : ""}`}
                onClick={() => setMode("timed")}
              >
                <Clock size={14} /> {t("modes.timed", { seconds: TIMED_SECONDS })}
              </button>
              <button
                type="button"
                className={`quiz-chip ${mode === "type" ? "is-active" : ""}`}
                onClick={() => setMode("type")}
              >
                <Keyboard size={14} /> {t("modes.type")}
              </button>
              <button
                type="button"
                className={`quiz-chip ${mode === "survival" ? "is-active" : ""}`}
                onClick={() => setMode("survival")}
              >
                <Heart size={14} /> {t("modes.survival")}
              </button>
            </div>
          </div>

          <div className="quiz-config-meta">
            <p className="quiz-config-best">
              <Trophy size={15} /> {t("best")}{" "}
              {mode === "survival"
                ? t("bestCorrect", { count: readBest(category, mode) })
                : t("bestOf", { count: readBest(category, mode), total: TOTAL_QUESTIONS })}
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
              {muted ? t("soundOff") : t("soundOn")}
            </button>
          </div>

          {history.length > 0 && (
            <div className="quiz-config-group">
              <span className="quiz-config-label">{t("recent")}</span>
              <ul className="quiz-history">
                {history.slice(0, 5).map((h) => (
                  <li key={h.ts} className="quiz-history-row">
                    <span className="quiz-history-score">
                      {h.score}/{h.total}
                    </span>
                    <span className="quiz-history-meta">
                      {categoryLabel(h.category)} · {modeLabel(h.mode)}
                    </span>
                    <span className="quiz-history-time">{relativeTime(h.ts)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="quiz-result-actions">
            <button type="button" className="quiz-primary" onClick={startGame} disabled={quizPool.length < 4}>
              {t("start")}
            </button>
            <button type="button" className="quiz-secondary" onClick={onExit}>
              {t("cancel")}
            </button>
          </div>
          <p className="quiz-config-hint">{t("hint")}</p>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    const survival = mode === "survival";
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    const verdict = survival
      ? score >= 15
        ? t("verdict.unstoppable")
        : score >= 7
          ? t("verdict.greatRun")
          : t("verdict.keepTraining")
      : pct >= 90
        ? t("verdict.master")
        : pct >= 60
          ? t("verdict.solid")
          : t("verdict.keepExploring");
    return (
      <div className="quiz-layer" style={shellStyle}>
        <div className="quiz-result">
          <Trophy size={56} />
          <h2>{survival ? t("runOver") : t("complete")}</h2>
          <p className="quiz-result-score">
            {survival ? t("scoreCorrect", { score }) : t("scoreOf", { score, total: TOTAL_QUESTIONS })}
          </p>
          <p className="quiz-result-verdict">{verdict}</p>
          {newRecord && <p className="quiz-result-record">{t("newBest")}</p>}
          <p className="quiz-result-streak">
            {t("bestStreak", {
              streak: bestStreak,
              category: categoryLabel(category),
              mode: modeLabel(mode),
            })}
          </p>

          {misses.length > 0 && (
            <div className="quiz-review">
              <span className="quiz-review-title">{t("review", { count: misses.length })}</span>
              <div className="quiz-review-grid">
                {misses.map((cell) => (
                  <button
                    key={cell.id}
                    type="button"
                    className="quiz-review-item"
                    onClick={() => onStudySpecimen?.(cell.id)}
                    disabled={!onStudySpecimen}
                    title={onStudySpecimen ? t("openStudio", { name: cell.name }) : cell.name}
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
              {t("playAgain")}
            </button>
            <button type="button" className="quiz-secondary" onClick={shareResult}>
              <Share2 size={16} />
              {shareLabel}
            </button>
            <button type="button" className="quiz-secondary" onClick={onExit}>
              {t("backToStudio")}
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
          {mode === "survival" ? (
            <div className="quiz-progress">
              <span className="quiz-progress-label">{t("survivalProgress", { n: questionNumber })}</span>
              <div className="quiz-lives" aria-label={t("livesLeft", { count: lives })}>
                {Array.from({ length: SURVIVAL_LIVES }).map((_, i) => (
                  <Heart
                    key={i}
                    size={18}
                    fill={i < lives ? "currentColor" : "none"}
                    className={i < lives ? "is-alive" : "is-lost"}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-progress">
              <span className="quiz-progress-label">
                {t("questionOf", { n: questionNumber, total: TOTAL_QUESTIONS })}
              </span>
              <div className="quiz-progress-bar">
                <i style={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }} />
              </div>
            </div>
          )}
          <div className="quiz-stats">
            <span className="quiz-stat">
              <Check size={16} />
              {score}
            </span>
            <span className="quiz-stat">
              <Zap size={16} />
              {streak}
            </span>
            <button type="button" className="quiz-exit" onClick={onExit} aria-label={t("exit")}>
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
          <span className="quiz-stage-hint">{t("whatSpecimen")}</span>
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
              placeholder={t("typePlaceholder")}
              aria-label={t("typeAria")}
              disabled={answered}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
            {!answered && (
              <button type="submit" className="quiz-primary" disabled={!typed.trim()}>
                {t("submit")}
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
                  ? t("correct")
                  : mode === "timed" && selected === TIMEOUT_SENTINEL
                    ? t("timesUp", { name: question.target.name })
                    : t("itWas", { name: question.target.name })}
              </span>
              <button type="button" className="quiz-primary" onClick={handleNext}>
                {(mode === "survival" ? lives <= 0 : questionNumber >= TOTAL_QUESTIONS)
                  ? t("seeResults")
                  : t("next")}
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
