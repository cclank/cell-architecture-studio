import { useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import type { CellItem } from "../data/cells";
import { useEscapeToClose } from "../hooks/useEscapeToClose";
import { MiniCell } from "./MiniCell";

type Section = { label: string; items: CellItem[]; emptyHint?: string };

type SpecimenGridModalProps = {
  title: string;
  subtitle?: string;
  open: boolean;
  sections: Section[];
  searchable?: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  footer?: ReactNode;
};

export function SpecimenGridModal({
  title,
  subtitle,
  open,
  sections,
  searchable = false,
  selectedId,
  onSelect,
  onClose,
  footer,
}: SpecimenGridModalProps) {
  const [query, setQuery] = useState("");
  useEscapeToClose(open, onClose);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.map((s) => ({
      ...s,
      items: s.items.filter(
        (c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q),
      ),
    }));
  }, [sections, query]);

  if (!open) return null;
  const totalShown = filtered.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label={title}>
      <div className="browser-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="browser-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {searchable && (
            <label className="browser-search">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search specimens"
                autoFocus
              />
            </label>
          )}
        </div>

        <div className="browser-body">
          {totalShown === 0 && <p className="browser-empty">No specimens to show.</p>}
          {filtered.map((section) => {
            if (section.items.length === 0) {
              return section.emptyHint ? (
                <div key={section.label} className="browser-section">
                  <div className="browser-section-title">{section.label}</div>
                  <p className="browser-empty">{section.emptyHint}</p>
                </div>
              ) : null;
            }
            return (
              <div key={section.label} className="browser-section">
                <div className="browser-section-title">
                  {section.label}
                  <span className="browser-section-count">{section.items.length}</span>
                </div>
                <div className="browser-grid">
                  {section.items.map((cell) => (
                    <button
                      key={cell.id}
                      type="button"
                      className={`browser-tile ${selectedId === cell.id ? "is-active" : ""}`}
                      onClick={() => onSelect(cell.id)}
                      title={cell.name}
                    >
                      <MiniCell cell={cell} />
                      <span className="browser-tile-name">{cell.name}</span>
                      <span className="browser-tile-type">{cell.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {footer && <div className="browser-footer">{footer}</div>}
      </div>
    </div>
  );
}
