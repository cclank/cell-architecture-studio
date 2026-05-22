import { useMemo, useState } from "react";
import { Leaf, Shuffle, Star } from "lucide-react";
import {
  CELL_CATEGORY_ORDER,
  categorize,
  cells,
  type CellCategory,
  type CellItem,
} from "../data/cells";
import { MiniCell } from "./MiniCell";

type SpecimenStripProps = {
  selectedCell: CellItem;
  favorites: Set<string>;
  onSelectCell: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToast: (message: string) => void;
};

export function SpecimenStrip({
  selectedCell,
  favorites,
  onSelectCell,
  onToggleFavorite,
  onToast,
}: SpecimenStripProps) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = q
      ? cells.filter(
          (c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q),
        )
      : cells;
    if (favoritesOnly) filtered = filtered.filter((c) => favorites.has(c.id));
    const map = new Map<CellCategory, CellItem[]>();
    for (const category of CELL_CATEGORY_ORDER) map.set(category, []);
    for (const cell of filtered) map.get(categorize(cell))!.push(cell);
    return CELL_CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: map.get(cat) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [query, favoritesOnly, favorites]);

  return (
    <section className="specimen-strip">
      <div className="specimen-strip-header">
        <span className="specimen-strip-title">
          <Leaf size={18} />
          Specimens
        </span>
        <button
          type="button"
          className={`specimen-strip-fav-toggle ${favoritesOnly ? "is-on" : ""}`}
          onClick={() => {
            const next = !favoritesOnly;
            setFavoritesOnly(next);
            onToast(next ? "Showing favorites only." : "Showing all specimens.");
          }}
          aria-pressed={favoritesOnly}
        >
          <Star size={15} fill={favoritesOnly ? "currentColor" : "none"} />
          <span>{favoritesOnly ? "Favorites" : "All"}</span>
        </button>
        <button
          type="button"
          className="specimen-strip-surprise"
          onClick={() => {
            const pool = cells.filter((c) => c.id !== selectedCell.id);
            const pick = pool[Math.floor(Math.random() * pool.length)];
            onSelectCell(pick.id);
            onToast(`Surprise — ${pick.name}!`);
          }}
        >
          <Shuffle size={15} />
          <span>Surprise</span>
        </button>
        <label className="specimen-strip-search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search specimens…"
            aria-label="Search specimens"
          />
        </label>
      </div>
      <div className="specimen-strip-scroll">
        {grouped.length === 0 && (
          <p className="specimen-strip-empty">
            {favoritesOnly && !query.trim()
              ? "No favorites yet — tap the star on a tile."
              : `No specimens match “${query}”.`}
          </p>
        )}
        {grouped.map(({ category, items }) => (
          <div key={category} className="specimen-strip-section">
            <div className="specimen-strip-section-title">
              <span>{category}</span>
              <span className="specimen-strip-count">{items.length}</span>
            </div>
            <div className="specimen-strip-row">
              {items.map((cell) => {
                const selected = selectedCell.id === cell.id;
                return (
                  <button
                    type="button"
                    key={cell.id}
                    className={`specimen-tile ${selected ? "is-active" : ""}`}
                    onClick={() => {
                      if (selected) {
                        onToast(`${cell.name} is already on stage.`);
                      } else {
                        onSelectCell(cell.id);
                        onToast(`Loaded ${cell.name} on stage.`);
                      }
                    }}
                    title={cell.name}
                  >
                    <MiniCell cell={cell} />
                    <span className="specimen-tile-label">{cell.name}</span>
                    <span
                      className={`favorite-pin ${favorites.has(cell.id) ? "is-on" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        const wasOn = favorites.has(cell.id);
                        onToggleFavorite(cell.id);
                        onToast(
                          wasOn
                            ? `Removed ${cell.name} from favorites.`
                            : `Added ${cell.name} to favorites.`,
                        );
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Favorite ${cell.name}`}
                    >
                      <Star size={12} fill="currentColor" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
