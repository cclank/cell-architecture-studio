import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { levelInfo, type Progress } from "../lib/progression";

export function XpBar({ progress, pulse }: { progress: Progress; pulse: number }) {
  const { level, intoLevel, forNext } = levelInfo(progress.xp);
  const pct = Math.min(100, Math.round((intoLevel / forNext) * 100));
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    if (pulse === 0) return;
    setBumped(true);
    const t = window.setTimeout(() => setBumped(false), 600);
    return () => window.clearTimeout(t);
  }, [pulse]);

  return (
    <div className={`xp-bar ${bumped ? "is-bumped" : ""}`} title={`${progress.xp} XP total`}>
      <span className="xp-level">
        <Sparkles size={13} />
        Lv {level}
      </span>
      <span className="xp-track">
        <span className="xp-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="xp-count">
        {intoLevel}/{forNext}
      </span>
    </div>
  );
}
