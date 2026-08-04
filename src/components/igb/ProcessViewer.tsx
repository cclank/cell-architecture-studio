import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import type { BiologyProcess, CourseLevel } from "../../data/curriculum/types";
import { isTierVisible } from "../../lib/courseLevel";
import { TierBadge } from "./Badge";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

type Props = {
  process: BiologyProcess;
  courseLevel: CourseLevel;
  onComplete: (processId: string) => void;
};

export function ProcessViewer({ process, courseLevel, onComplete }: Props) {
  const stages = useMemo(
    () => process.stages.filter((s) => isTierVisible(s.courseTier, courseLevel)),
    [process, courseLevel],
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | null>(null);

  // Reset when the process changes.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [process.id]);

  useEffect(() => {
    if (index >= stages.length - 1) {
      onComplete(process.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, stages.length]);

  useEffect(() => {
    if (!playing) return;
    if (prefersReducedMotion()) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      setIndex((i) => {
        if (i >= stages.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 2600 / speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, index, speed, stages.length]);

  const stage = stages[Math.min(index, stages.length - 1)];
  const pct = stages.length > 1 ? Math.round((index / (stages.length - 1)) * 100) : 100;

  return (
    <section className="stage-panel igb-process">
      <div className="stage-title">
        <div className="stage-title-copy">
          <h2>{process.title}</h2>
          <p>{process.subtitle}</p>
        </div>
        <TierBadge tier={process.courseTier} />
      </div>

      <div className="canvas-wrap igb-process-stage">
        <div className="igb-process-figure" aria-hidden="true">
          <span className="igb-process-index">
            {index + 1}/{stages.length}
          </span>
          <div className="igb-process-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="igb-process-caption">
          <h3>{stage.title}</h3>
          <p>{stage.caption}</p>
        </div>
      </div>

      <div className="stage-toolbar igb-process-controls">
        <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          <ChevronLeft size={20} /> Previous
        </button>
        <button type="button" className={playing ? "is-active" : ""} onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause size={20} /> : <Play size={20} />} {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(stages.length - 1, i + 1))}
          disabled={index >= stages.length - 1}
        >
          Next <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setPlaying(false);
          }}
        >
          <RotateCcw size={20} /> Reset
        </button>
        <label className="igb-speed">
          Speed
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
          </select>
        </label>
      </div>

      <div className="igb-process-explain">
        <p>{process.overview}</p>
        <details>
          <summary>Full transcript (accessible)</summary>
          <ol>
            {stages.map((s) => (
              <li key={s.id}>{s.transcript}</li>
            ))}
          </ol>
        </details>
        <p className="igb-exam-note">
          <strong>Exam note:</strong> {process.examNote}
        </p>
      </div>
    </section>
  );
}
