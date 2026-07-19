import {
  Compass,
  Gamepad2,
  GraduationCap,
  Library,
  Microscope,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Celebration } from "../hooks/useProgression";

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

export function CelebrationBanner({ celebration }: { celebration: Celebration | null }) {
  if (!celebration) return null;

  if (celebration.kind === "level") {
    return (
      <div className="celebration" role="status">
        <div className="celebration-card celebration-level">
          <Sparkles size={28} />
          <div>
            <strong>Level up!</strong>
            <span>You reached level {celebration.level}</span>
          </div>
        </div>
      </div>
    );
  }

  const Icon = ICONS[celebration.achievement.icon] ?? Trophy;
  return (
    <div className="celebration" role="status">
      <div className="celebration-card celebration-achievement">
        <span className="celebration-badge">
          <Icon size={26} />
        </span>
        <div>
          <strong>{celebration.achievement.title}</strong>
          <span>{celebration.achievement.desc}</span>
        </div>
      </div>
    </div>
  );
}
