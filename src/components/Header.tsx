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

type HeaderProps = {
  cell: CellItem;
  onToast: (msg: string) => void;
  onPlayQuiz: () => void;
  onAbout: () => void;
};

export function Header({ cell, onToast, onPlayQuiz, onAbout }: HeaderProps) {
  const navItems: { id: string; label: string; Icon: LucideIcon; onClick: () => void }[] = [
    { id: "gallery", label: "Gallery", Icon: Grid3X3, onClick: () => onToast("Gallery view is on the roadmap.") },
    { id: "library", label: "Library", Icon: Library, onClick: () => onToast("Library hub is on the roadmap.") },
    { id: "notebooks", label: "Notebooks", Icon: BookOpen, onClick: () => onToast("Notebooks are on the roadmap.") },
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
        <button
          className="avatar-button"
          type="button"
          aria-label="User menu"
          onClick={() => onToast("User menu is on the roadmap.")}
        >
          <span className="avatar-core" style={{ background: cell.accentSoft }}>
            <span style={{ background: cell.accent }} />
          </span>
          <ChevronDown size={20} />
        </button>
      </nav>
    </header>
  );
}
