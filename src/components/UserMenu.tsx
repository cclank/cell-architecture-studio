import { useEffect, useRef } from "react";
import { Check, Compass, RotateCcw, Star, Trash2, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ACCENTS } from "../lib/theme";
import type { AppLang } from "../i18n";

type UserMenuProps = {
  open: boolean;
  favoritesCount: number;
  exploredCount: number;
  totalCount: number;
  accentId: string;
  onAccentChange: (id: string) => void;
  onReplayIntro: () => void;
  onAchievements: () => void;
  onClearFavorites: () => void;
  onResetAll: () => void;
  onClose: () => void;
};

export function UserMenu({
  open,
  favoritesCount,
  exploredCount,
  totalCount,
  accentId,
  onAccentChange,
  onReplayIntro,
  onAchievements,
  onClearFavorites,
  onResetAll,
  onClose,
}: UserMenuProps) {
  const { t, i18n } = useTranslation("common");
  const ref = useRef<HTMLDivElement>(null);
  const activeLang: AppLang = i18n.language.startsWith("en") ? "en" : "tr";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="user-menu" ref={ref} role="menu">
      <div className="user-menu-stats">
        <div>
          <strong>{exploredCount}</strong>
          <span>{t("menu.explored", { total: totalCount })}</span>
        </div>
        <div>
          <strong>{favoritesCount}</strong>
          <span>{t("menu.favorites")}</span>
        </div>
      </div>
      <div className="user-menu-theme">
        <span className="user-menu-theme-label">{t("menu.language")}</span>
        <div className="user-menu-langs">
          {(["tr", "en"] as const).map((lng) => (
            <button
              key={lng}
              type="button"
              className={`user-menu-lang ${activeLang === lng ? "is-active" : ""}`}
              onClick={() => void i18n.changeLanguage(lng)}
            >
              {t(`lang.${lng}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="user-menu-theme">
        <span className="user-menu-theme-label">{t("menu.accent")}</span>
        <div className="user-menu-swatches">
          {ACCENTS.map((a) => {
            const label = t(`accents.${a.id}`);
            return (
              <button
                key={a.id}
                type="button"
                className={`user-menu-swatch ${accentId === a.id ? "is-active" : ""}`}
                style={{ background: a.accent }}
                onClick={() => onAccentChange(a.id)}
                aria-label={label}
                title={label}
              >
                {accentId === a.id && <Check size={13} />}
              </button>
            );
          })}
        </div>
      </div>
      <button type="button" className="user-menu-item" role="menuitem" onClick={onAchievements}>
        <Trophy size={16} />
        {t("menu.achievements")}
      </button>
      <button type="button" className="user-menu-item" role="menuitem" onClick={onReplayIntro}>
        <Compass size={16} />
        {t("menu.replayIntro")}
      </button>
      <button type="button" className="user-menu-item" role="menuitem" onClick={onClearFavorites}>
        <Star size={16} />
        {t("menu.clearFavorites")}
      </button>
      <button type="button" className="user-menu-item is-danger" role="menuitem" onClick={onResetAll}>
        <Trash2 size={16} />
        {t("menu.resetAll")}
      </button>
      <p className="user-menu-foot">
        <RotateCcw size={12} /> {t("menu.localOnly")}
      </p>
    </div>
  );
}
