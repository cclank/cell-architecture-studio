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
import type { CellItem } from "../data/cells";
import type { Progress } from "../lib/progression";
import { UserMenu } from "./UserMenu";
import { XpBar } from "./XpBar";
import { PRODUCT } from "../config/product";
import { STUDY_MODES, type StudyMode } from "../lib/courseLevel";

type HeaderProps = {
  cell: CellItem;
  favoritesCount: number;
  exploredCount: number;
  totalCount: number;
  progress: Progress;
  xpPulse: number;
  studyMode: StudyMode;
  onStudyModeChange: (mode: StudyMode) => void;
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
  studyMode,
  onStudyModeChange,
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
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: string; label: string; Icon: LucideIcon; onClick: () => void }[] = [
    { id: "gallery", label: "Gallery", Icon: Grid3X3, onClick: onGallery },
    { id: "library", label: "Library", Icon: Library, onClick: onLibrary },
    { id: "cards", label: "Cards", Icon: Layers, onClick: onFlashcards },
    { id: "notebooks", label: "Notebooks", Icon: BookOpen, onClick: onNotebooks },
    { id: "about", label: "About", Icon: Info, onClick: onAbout },
  ];

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={26} />
        </div>
        <div>
          <h1>{PRODUCT.name}</h1>
          <p>{PRODUCT.subtitle}</p>
        </div>
      </div>

      <nav className="top-nav" aria-label="Primary">
        <div className="igb-studymode" role="group" aria-label="Study mode">
          {STUDY_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={studyMode === m.id ? "is-active" : ""}
              aria-pressed={studyMode === m.id}
              title={m.hint}
              onClick={() => onStudyModeChange(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <XpBar progress={progress} pulse={xpPulse} />
        {navItems.map(({ id, label, Icon, onClick }) => (
          <button key={id} type="button" onClick={onClick}>
            <Icon size={24} />
            <span>{label}</span>
          </button>
        ))}
        <button className="quiz-launch" type="button" onClick={onPlayQuiz}>
          <Gamepad2 size={22} />
          <span>Quiz</span>
        </button>
        <div className="avatar-wrap">
          <button
            className="avatar-button"
            type="button"
            aria-label="User menu"
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
