import { useMemo, useState } from "react";
import { Leaf, Shuffle, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CELL_CATEGORY_ORDER,
  categorize,
  cells,
  type CellCategory,
  type CellItem,
} from "../data/cells";
import { useResolvedCells } from "../i18n/resolveCell";
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
  const { t } = useTranslation(["common", "cells"]);
  const resolved = useResolvedCells();
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = q
      ? resolved.filter(
          (c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q),
        )
      : resolved;
    if (favoritesOnly) filtered = filtered.filter((c) => favorites.has(c.id));
    const map = new Map<CellCategory, CellItem[]>();
    for (const category of CELL_CATEGORY_ORDER) map.set(category, []);
    for (const cell of filtered) map.get(categorize(cell))!.push(cell);
    return CELL_CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: map.get(cat) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [query, favoritesOnly, favorites, resolved]);

  return (
    <section className="specimen-strip">
      <div className="specimen-strip-header">
        <span className="specimen-strip-title">
          <Leaf size={18} />
          {t("strip.specimens")}
        </span>
        <button
          type="button"
          className={`specimen-strip-fav-toggle ${favoritesOnly ? "is-on" : ""}`}
          onClick={() => {
            const next = !favoritesOnly;
            setFavoritesOnly(next);
            onToast(next ? t("toast.favoritesOnly") : t("toast.showingAll"));
          }}
          aria-pressed={favoritesOnly}
        >
          <Star size={15} fill={favoritesOnly ? "currentColor" : "none"} />
          <span>{favoritesOnly ? t("strip.favorites") : t("strip.all")}</span>
        </button>
        <button
          type="button"
          className="specimen-strip-surprise"
          onClick={() => {
            const pool = cells.filter((c) => c.id !== selectedCell.id);
            const pick = pool[Math.floor(Math.random() * pool.length)];
            const name = resolved.find((c) => c.id === pick.id)?.name ?? pick.id;
            onSelectCell(pick.id);
            onToast(t("toast.surprise", { name }));
          }}
        >
          <Shuffle size={15} />
          <span>{t("strip.surprise")}</span>
        </button>
        <label className="specimen-strip-search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("strip.search")}
            aria-label={t("strip.searchAria")}
          />
        </label>
      </div>
      <div className="specimen-strip-scroll">
        {grouped.length === 0 && (
          <p className="specimen-strip-empty">
            {favoritesOnly && !query.trim()
              ? t("strip.noFavorites")
              : t("strip.noMatch", { query })}
          </p>
        )}
        {grouped.map(({ category, items }) => (
          <div key={category} className="specimen-strip-section">
            <div className="specimen-strip-section-title">
              <span>{t(`categories.${category}`, { ns: "cells" })}</span>
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
                        onToast(t("toast.alreadyOnStage", { name: cell.name }));
                      } else {
                        onSelectCell(cell.id);
                        onToast(t("toast.loaded", { name: cell.name }));
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
                            ? t("toast.removedFavorite", { name: cell.name })
                            : t("toast.addedFavorite", { name: cell.name }),
                        );
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={t("strip.favoriteAria", { name: cell.name })}
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
