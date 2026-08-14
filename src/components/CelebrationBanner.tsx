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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["common", "achievements"]);
  if (!celebration) return null;

  if (celebration.kind === "level") {
    return (
      <div className="celebration" role="status">
        <div className="celebration-card celebration-level">
          <Sparkles size={28} />
          <div>
            <strong>{t("celebration.levelUp")}</strong>
            <span>{t("celebration.reached", { level: celebration.level })}</span>
          </div>
        </div>
      </div>
    );
  }

  const Icon = ICONS[celebration.achievement.icon] ?? Trophy;
  const id = celebration.achievement.id;
  return (
    <div className="celebration" role="status">
      <div className="celebration-card celebration-achievement">
        <span className="celebration-badge">
          <Icon size={26} />
        </span>
        <div>
          <strong>{t(`items.${id}.title`, { ns: "achievements" })}</strong>
          <span>{t(`items.${id}.desc`, { ns: "achievements" })}</span>
        </div>
      </div>
    </div>
  );
}
