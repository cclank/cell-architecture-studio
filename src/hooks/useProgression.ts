import { useCallback, useEffect, useRef, useState } from "react";
import {
  award,
  loadProgress,
  resetProgress,
  type Achievement,
  type Progress,
  type ProgressEvent,
} from "../lib/progression";
import { playAchievement, playLevelUp } from "../lib/quizSound";
import { STORAGE_KEYS } from "../lib/storageKeys";

function isMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.quizMuted) === "1";
  } catch {
    return false;
  }
}

export type Celebration =
  | { kind: "level"; level: number }
  | { kind: "achievement"; achievement: Achievement };

export function useProgression() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [confettiKey, setConfettiKey] = useState(0);
  const [banner, setBanner] = useState<Celebration | null>(null);
  const [xpPulse, setXpPulse] = useState(0);
  const queue = useRef<Celebration[]>([]);
  const showing = useRef(false);

  const pump = useCallback(() => {
    if (showing.current) return;
    const next = queue.current.shift();
    if (!next) return;
    showing.current = true;
    setBanner(next);
    window.setTimeout(() => {
      setBanner(null);
      showing.current = false;
      window.setTimeout(pump, 250);
    }, 2600);
  }, []);

  const fire = useCallback(
    (event: ProgressEvent) => {
      const result = award(progress, event);
      setProgress(result.progress);
      if (result.gainedXp > 0) setXpPulse((p) => p + 1);
      const celebrations: Celebration[] = [];
      if (result.leveledUp) celebrations.push({ kind: "level", level: result.newLevel });
      for (const a of result.unlocked) celebrations.push({ kind: "achievement", achievement: a });
      if (celebrations.length > 0) {
        queue.current.push(...celebrations);
        setConfettiKey((k) => k + 1);
        if (!isMuted()) {
          if (result.leveledUp) playLevelUp();
          else playAchievement();
        }
        pump();
      }
      return result;
    },
    [progress, pump],
  );

  const reset = useCallback(() => {
    setProgress(resetProgress());
    queue.current = [];
    setBanner(null);
    showing.current = false;
  }, []);

  // Ensure the queue keeps draining if a banner was set before pump bound.
  useEffect(() => {
    if (!banner && queue.current.length > 0) pump();
  }, [banner, pump]);

  return { progress, fire, reset, confettiKey, banner, xpPulse };
}
