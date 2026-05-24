import { CalendarDays, Flame } from "lucide-react";
import type { CellItem } from "../data/cells";
import { MiniCell } from "./MiniCell";

type DailyChallengeProps = {
  cell: CellItem;
  streak: number;
  claimed: boolean;
  onStudy: () => void;
};

export function DailyChallenge({ cell, streak, claimed, onStudy }: DailyChallengeProps) {
  return (
    <section className="panel daily-panel">
      <div className="panel-heading">
        <span>
          <CalendarDays size={16} />
          Daily Specimen
        </span>
        {streak > 0 && (
          <span className="daily-streak" title={`${streak}-day streak`}>
            <Flame size={14} />
            {streak}
          </span>
        )}
      </div>

      <button type="button" className="daily-card" onClick={onStudy}>
        <MiniCell cell={cell} />
        <span className="daily-copy">
          <strong>{cell.name}</strong>
          <span>{cell.type}</span>
        </span>
      </button>

      <button type="button" className="daily-cta" onClick={onStudy} disabled={claimed}>
        {claimed ? "Bonus claimed today" : "Study it · +15 XP"}
      </button>
    </section>
  );
}
