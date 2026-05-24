import {
  Compass,
  Gamepad2,
  GraduationCap,
  Library,
  Lock,
  Microscope,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ACHIEVEMENTS, levelInfo, statsWithLevel, type Progress } from "../lib/progression";
import { Modal } from "./Modal";

const ICONS: Record<string, LucideIcon> = {
  Microscope,
  Compass,
  Library,
  Star,
  Gamepad2,
  Zap,
  Trophy,
  GraduationCap,
};

export function AchievementsPanel({
  open,
  progress,
  onClose,
}: {
  open: boolean;
  progress: Progress;
  onClose: () => void;
}) {
  const stats = statsWithLevel(progress);
  const { level, intoLevel, forNext } = levelInfo(progress.xp);
  const unlockedCount = progress.unlocked.length;

  return (
    <Modal open={open} onClose={onClose} label="Achievements" panelClassName="browser-modal achievements-modal">
      <div className="browser-head">
        <div>
          <h3>
            <Trophy size={20} /> Achievements
          </h3>
          <p>
            {unlockedCount}/{ACHIEVEMENTS.length} unlocked · {progress.xp} XP
          </p>
        </div>
      </div>

      <div className="ach-level">
          <span className="ach-level-badge">
            <Sparkles size={16} /> Level {level}
          </span>
          <span className="ach-level-track">
            <span className="ach-level-fill" style={{ width: `${(intoLevel / forNext) * 100}%` }} />
          </span>
          <span className="ach-level-num">
            {intoLevel}/{forNext} XP
          </span>
        </div>

        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = progress.unlocked.includes(a.id);
            const current = Math.min(a.metric(stats), a.target);
            const pct = Math.round((current / a.target) * 100);
            const Icon = ICONS[a.icon] ?? Trophy;
            return (
              <div key={a.id} className={`ach-item ${unlocked ? "is-unlocked" : ""}`}>
                <span className="ach-icon">{unlocked ? <Icon size={22} /> : <Lock size={18} />}</span>
                <div className="ach-copy">
                  <strong>{a.title}</strong>
                  <span>{a.desc}</span>
                  {!unlocked && a.target > 1 && (
                    <span className="ach-progress">
                      <span className="ach-progress-track">
                        <span className="ach-progress-fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="ach-progress-num">
                        {current}/{a.target}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
    </Modal>
  );
}
