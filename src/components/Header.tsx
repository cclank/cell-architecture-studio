import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Gamepad2,
  Grid3X3,
  Info,
  Library,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CellItem } from "../data/cells";
import { UserMenu } from "./UserMenu";

type HeaderProps = {
  cell: CellItem;
  favoritesCount: number;
  exploredCount: number;
  totalCount: number;
  onPlayQuiz: () => void;
  onAbout: () => void;
  onGallery: () => void;
  onLibrary: () => void;
  onNotebooks: () => void;
  onClearFavorites: () => void;
  onResetAll: () => void;
};

export function Header({
  cell,
  favoritesCount,
  exploredCount,
  totalCount,
  onPlayQuiz,
  onAbout,
  onGallery,
  onLibrary,
  onNotebooks,
  onClearFavorites,
  onResetAll,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: string; label: string; Icon: LucideIcon; onClick: () => void }[] = [
    { id: "gallery", label: "Gallery", Icon: Grid3X3, onClick: onGallery },
    { id: "library", label: "Library", Icon: Library, onClick: onLibrary },
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
          <h1>Cell Architecture Studio</h1>
          <p>Explore life at the microscopic level</p>
        </div>
      </div>

      <nav className="top-nav" aria-label="Primary">
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
