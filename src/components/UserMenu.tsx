import { useEffect, useRef } from "react";
import { RotateCcw, Star, Trash2, Trophy } from "lucide-react";

type UserMenuProps = {
  open: boolean;
  favoritesCount: number;
  exploredCount: number;
  totalCount: number;
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
  onAchievements,
  onClearFavorites,
  onResetAll,
  onClose,
}: UserMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

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
          <span>of {totalCount} explored</span>
        </div>
        <div>
          <strong>{favoritesCount}</strong>
          <span>favorites</span>
        </div>
      </div>
      <button type="button" className="user-menu-item" role="menuitem" onClick={onAchievements}>
        <Trophy size={16} />
        Achievements
      </button>
      <button type="button" className="user-menu-item" role="menuitem" onClick={onClearFavorites}>
        <Star size={16} />
        Clear favorites
      </button>
      <button type="button" className="user-menu-item is-danger" role="menuitem" onClick={onResetAll}>
        <Trash2 size={16} />
        Reset all saved data
      </button>
      <p className="user-menu-foot">
        <RotateCcw size={12} /> Data is stored only in this browser.
      </p>
    </div>
  );
}
