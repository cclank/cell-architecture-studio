import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Gamepad2,
  Grid3X3,
  Info,
  Layers,
  Library,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CellItem } from "../data/cells";
import type { Progress } from "../lib/progression";
import { UserMenu } from "./UserMenu";
import { XpBar } from "./XpBar";

type HeaderProps = {
  cell: CellItem;
  favoritesCount: number;
  exploredCount: number;
  totalCount: number;
  progress: Progress;
  xpPulse: number;
  onPlayQuiz: () => void;
  onAbout: () => void;
  onGallery: () => void;
  onLibrary: () => void;
  onNotebooks: () => void;
  onFlashcards: () => void;
  onAchievements: () => void;
  accentId: string;
  onAccentChange: (id: string) => void;
  onReplayIntro: () => void;
  onClearFavorites: () => void;
  onResetAll: () => void;
};

export function Header({
  cell,
  favoritesCount,
  exploredCount,
  totalCount,
  progress,
  xpPulse,
  onPlayQuiz,
  onAbout,
  onGallery,
  onLibrary,
  onNotebooks,
  onFlashcards,
  onAchievements,
  accentId,
  onAccentChange,
  onReplayIntro,
  onClearFavorites,
  onResetAll,
}: HeaderProps) {
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: string; label: string; Icon: LucideIcon; onClick: () => void }[] = [
    { id: "gallery", label: t("nav.gallery"), Icon: Grid3X3, onClick: onGallery },
    { id: "library", label: t("nav.library"), Icon: Library, onClick: onLibrary },
    { id: "cards", label: t("nav.cards"), Icon: Layers, onClick: onFlashcards },
    { id: "notebooks", label: t("nav.notebooks"), Icon: BookOpen, onClick: onNotebooks },
    { id: "about", label: t("nav.about"), Icon: Info, onClick: onAbout },
  ];

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={26} />
        </div>
        <div>
          <h1>{t("brand.title")}</h1>
          <p>{t("brand.tagline")}</p>
        </div>
      </div>

      <nav className="top-nav" aria-label={t("nav.primary")}>
        <XpBar progress={progress} pulse={xpPulse} />
        {navItems.map(({ id, label, Icon, onClick }) => (
          <button key={id} type="button" onClick={onClick}>
            <Icon size={24} />
            <span>{label}</span>
          </button>
        ))}
        <button className="quiz-launch" type="button" onClick={onPlayQuiz}>
          <Gamepad2 size={22} />
          <span>{t("nav.quiz")}</span>
        </button>
        <div className="avatar-wrap">
          <button
            className="avatar-button"
            type="button"
            aria-label={t("nav.userMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="avatar-core" style={{ background: cell.accentSoft }}>
              <span style={{ background: cell.accent }} />
            </span>
            <ChevronDown size={20} />
          </button>
          <UserMenu
            open={menuOpen}
            favoritesCount={favoritesCount}
            exploredCount={exploredCount}
            totalCount={totalCount}
            accentId={accentId}
            onAccentChange={onAccentChange}
            onReplayIntro={() => {
              onReplayIntro();
              setMenuOpen(false);
            }}
            onAchievements={() => {
              onAchievements();
              setMenuOpen(false);
            }}
            onClearFavorites={() => {
              onClearFavorites();
              setMenuOpen(false);
            }}
            onResetAll={() => {
              onResetAll();
              setMenuOpen(false);
            }}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      </nav>
    </header>
  );
}
