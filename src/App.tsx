import {
  ArrowRight,
  BookOpen,
  Box,
  Brain,
  Camera,
  ChevronDown,
  CircleDot,
  Gauge,
  EyeOff,
  Grid3X3,
  Heart,
  Info,
  Leaf,
  MessageCircle,
  Library,
  Microscope,
  Gamepad2,
  Maximize,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CellScene } from "./components/CellScene";
import { SpecimenQuiz } from "./components/SpecimenQuiz";
import {
  CELL_CATEGORY_ORDER,
  categorize,
  cells,
  getCellById,
  type CellCategory,
  type CellItem,
  type ViewMode,
} from "./data/cells";

type ModeOption = {
  id: ViewMode;
  label: string;
  Icon: LucideIcon;
};

const modeOptions: ModeOption[] = [
  { id: "mesh", label: "Mesh", Icon: Box },
  { id: "focus", label: "Focus", Icon: CircleDot },
];

const initialCell = getCellById("animal");

function Header({
  cell,
  onToast,
  onPlayQuiz,
}: {
  cell: CellItem;
  onToast: (msg: string) => void;
  onPlayQuiz: () => void;
}) {
  const navItems: { id: string; label: string; Icon: LucideIcon; msg: string }[] = [
    { id: "gallery", label: "Gallery", Icon: Grid3X3, msg: "Gallery view is on the roadmap." },
    { id: "library", label: "Library", Icon: Library, msg: "Library hub is on the roadmap." },
    { id: "notebooks", label: "Notebooks", Icon: BookOpen, msg: "Notebooks are on the roadmap." },
    { id: "settings", label: "Settings", Icon: Settings, msg: "Settings panel is on the roadmap." },
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
        {navItems.map(({ id, label, Icon, msg }) => (
          <button key={id} type="button" onClick={() => onToast(msg)}>
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

type SidebarProps = {
  selectedCell: CellItem;
  activeOrganelle: string;
  onSelectOrganelle: (id: string) => void;
  onToast: (message: string) => void;
};

function MiniCell({ cell }: { cell: CellItem }) {
  const [imageBroken, setImageBroken] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const previewUrl = cell.renderImage?.url ?? cell.modelAsset?.previewUrl;

  if (previewUrl && !imageBroken) {
    return (
      <span
        className={`mini-cell has-preview ${imageLoaded ? "is-loaded" : "is-loading"}`}
        style={{ "--thumb": cell.accent, background: cell.accentSoft } as CSSProperties}
      >
        <img
          src={previewUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageBroken(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={`mini-cell mini-cell-fallback`}
      style={{
        "--thumb": cell.accent,
        background: `linear-gradient(135deg, ${cell.accent}, ${cell.color})`,
      } as CSSProperties}
    >
      <span />
      <i />
      <b />
    </span>
  );
}

type SpecimenStripProps = {
  selectedCell: CellItem;
  favorites: Set<string>;
  onSelectCell: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToast: (message: string) => void;
};

function SpecimenStrip({
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
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q),
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

function Sidebar({
  selectedCell,
  activeOrganelle,
  onSelectOrganelle,
  onToast,
}: SidebarProps) {
  return (
    <aside className="left-rail">
      <section className="panel organelle-panel">
        <div className="panel-heading">
          <span>
            <Sparkles size={16} />
            Organelles
          </span>
          <button
            type="button"
            className="panel-heading-chev"
            onClick={() =>
              onToast(`${selectedCell.organelles.length} organelles available.`)
            }
            aria-label="Organelles info"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        <div className="organelle-list">
          {selectedCell.organelles.map((organelle) => (
            <button
              className={`organelle-row ${activeOrganelle === organelle.id ? "is-active" : ""}`}
              type="button"
              key={organelle.id}
              onClick={() => {
                if (activeOrganelle === organelle.id) {
                  onToast(`${organelle.name} is already in focus.`);
                } else {
                  onSelectOrganelle(organelle.id);
                  onToast(`Focused on ${organelle.name}.`);
                }
              }}
            >
              <span className="color-dot" style={{ background: organelle.color }} />
              <span>{organelle.name}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function triggerDownload(href: string, filename: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function captureScreenshot(cell: CellItem, onToast: (msg: string) => void): void {
  const canvas = document.querySelector<HTMLCanvasElement>(".canvas-wrap canvas");
  if (!canvas) {
    onToast("Stage not ready — try again.");
    return;
  }
  try {
    const url = canvas.toDataURL("image/png");
    triggerDownload(url, `${slugify(cell.name)}.png`);
    onToast(`Saved ${cell.name}.png`);
  } catch {
    onToast("Screenshot failed — canvas blocked.");
  }
}

function toggleFullscreen(onToast: (msg: string) => void): void {
  const el = document.querySelector<HTMLElement>(".canvas-wrap");
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen()
      .then(() => onToast("Fullscreen — press Esc to exit."))
      .catch(() => onToast("Fullscreen blocked by browser."));
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

async function exportGlb(cell: CellItem, onToast: (msg: string) => void): Promise<void> {
  const url = cell.modelAsset?.url;
  if (!url) {
    onToast(`${cell.name} has no downloadable model.`);
    return;
  }
  onToast(`Preparing ${cell.name} model…`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, `${slugify(cell.name)}.glb`);
    URL.revokeObjectURL(objectUrl);
    onToast(`Downloaded ${cell.name}.glb`);
  } catch {
    onToast("Model download failed.");
  }
}

type StageProps = {
  cell: CellItem;
  activeOrganelle: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  resetKey: number;
  onModeChange: (mode: ViewMode) => void;
  onCrossSectionChange: (value: boolean) => void;
  onAutoRotateChange: (value: boolean) => void;
  onReset: () => void;
  onToast: (message: string) => void;
};

function Stage({
  cell,
  activeOrganelle,
  viewMode,
  crossSection,
  autoRotate,
  resetKey,
  onModeChange,
  onCrossSectionChange,
  onAutoRotateChange,
  onReset,
  onToast,
}: StageProps) {
  return (
    <main className="stage-column">
      <section className="stage-panel">
        <div className="stage-title">
          <div key={cell.id} className="stage-title-copy">
            <h2>{cell.name}</h2>
            <p>{cell.type}</p>
          </div>

          <div className="view-card">
            <span>View Mode</span>
            <div className="mode-switcher">
              {modeOptions.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={viewMode === id ? "is-active" : ""}
                  onClick={() => {
                    if (viewMode === id) {
                      onToast(`${label} view already active.`);
                    } else {
                      onModeChange(id);
                      onToast(`${label} view enabled.`);
                    }
                  }}
                  title={label}
                >
                  <Icon size={22} />
                </button>
              ))}
            </div>
            <label className="toggle-line">
              <span>Cross Section</span>
              <input
                type="checkbox"
                checked={crossSection}
                onChange={(event) => {
                  onCrossSectionChange(event.target.checked);
                  onToast(
                    event.target.checked
                      ? "Cross section enabled."
                      : "Cross section disabled.",
                  );
                }}
              />
              <i />
            </label>
          </div>
        </div>

        <div className="canvas-wrap">
          <CellScene
            cell={cell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
          />
        </div>

        <div className="stage-toolbar">
          <button
            type="button"
            className={autoRotate ? "is-active" : ""}
            onClick={() => {
              const next = !autoRotate;
              onAutoRotateChange(next);
              onToast(next ? "Auto-rotate on." : "Auto-rotate off.");
            }}
          >
            <RotateCcw size={20} />
            Rotate
          </button>
          <button
            type="button"
            className={viewMode === "focus" ? "is-active" : ""}
            onClick={() => {
              onModeChange("focus");
              onToast(
                viewMode === "focus"
                  ? `Isolating ${cell.name} again.`
                  : `Isolated ${cell.name} — Focus view.`,
              );
            }}
          >
            <CircleDot size={20} />
            Isolate
          </button>
          <button
            type="button"
            className={viewMode === "focus" ? "is-active" : ""}
            onClick={() => {
              onModeChange("focus");
              onToast("Hide others — switched to Focus view.");
            }}
          >
            <EyeOff size={20} />
            Hide Others
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            Reset View
          </button>
          <button type="button" onClick={() => toggleFullscreen(onToast)}>
            <Maximize size={20} />
            Fullscreen
          </button>
        </div>

        <div className="export-toolbar">
          <button type="button" onClick={() => captureScreenshot(cell, onToast)}>
            <Camera size={20} />
            Screenshot
          </button>
          <button type="button" onClick={() => exportGlb(cell, onToast)}>
            <Box size={20} />
            GLB Export
          </button>
        </div>
      </section>
    </main>
  );
}

type RightPanelProps = {
  cell: CellItem;
  activeOrganelle: string;
  favorites: Set<string>;
  mastery: number;
  viewedCellCount: number;
  viewedOrganelleCount: number;
  totalOrganelleCount: number;
  tutorPrompt: string;
  onToggleFavorite: (id: string) => void;
  onTutorPrompt: (prompt: string) => void;
};

function buildTutorPrompts(cell: CellItem, organelle: CellItem["organelles"][number]) {
  return [
    `Explain how ${organelle.name} helps a ${cell.name} stay alive.`,
    `Quiz me on the visual differences between ${cell.name} and ${getCellById(cell.comparison).name}.`,
    `Guide me through finding ${organelle.name} inside the 3D model.`,
  ];
}

function RightPanel({
  cell,
  activeOrganelle,
  favorites,
  mastery,
  viewedCellCount,
  viewedOrganelleCount,
  totalOrganelleCount,
  tutorPrompt,
  onToggleFavorite,
  onTutorPrompt,
}: RightPanelProps) {
  const organelle = cell.organelles.find((item) => item.id === activeOrganelle) ?? cell.organelles[0];
  const tutorPrompts = buildTutorPrompts(cell, organelle);

  return (
    <aside className="right-rail">
      <section className="panel details-panel">
        <div className="panel-heading detail-heading">
          <span>Organelle Details</span>
          <button
            type="button"
            onClick={() => onToggleFavorite(cell.id)}
            aria-label="Toggle favorite"
            title={favorites.has(cell.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={22} fill={favorites.has(cell.id) ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="detail-hero">
          <span className="organelle-orb" style={{ background: organelle.color }} />
          <div>
            <h3>{organelle.name}</h3>
            <p>{organelle.subtitle}</p>
          </div>
        </div>

        <dl className="attribute-list">
          {organelle.attributes.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div>
            <dt>Label</dt>
            <dd>
              <span className="mini-toggle is-on" />
              <span className="detail-dot" style={{ background: organelle.color }} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel notes-panel">
        <div className="panel-heading">
          <span>Biological Notes</span>
        </div>
        <p>{organelle.note}</p>
        <div className="fun-fact">
          <span>Fun Fact: {organelle.fact}</span>
          <Sparkles size={18} />
        </div>
      </section>

      <section className="panel learning-panel">
        <div className="panel-heading">
          <span>
            <Brain size={17} />
            AI Tutor
          </span>
        </div>

        <div className="mastery-meter" style={{ "--progress": `${mastery}%` } as CSSProperties}>
          <div>
            <Gauge size={18} />
            <span>Mastery</span>
            <strong>{mastery}%</strong>
          </div>
          <i>
            <b />
          </i>
          <small>
            {viewedCellCount}/{cells.length} cells explored · {viewedOrganelleCount}/{totalOrganelleCount} organelles inspected
          </small>
        </div>

        <div className="lesson-focus">
          <span>
            <Target size={17} />
            Current lesson focus
          </span>
          <p>
            Locate <strong>{organelle.name}</strong>, explain its role, then compare it with the matching structure in{" "}
            {getCellById(cell.comparison).name}.
          </p>
        </div>

        <div className="tutor-prompt">
          <span>
            <MessageCircle size={17} />
            Prompt staged for AI tutor
          </span>
          <p>{tutorPrompt}</p>
        </div>

        <div className="prompt-list">
          {tutorPrompts.map((prompt) => (
            <button type="button" key={prompt} onClick={() => onTutorPrompt(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="panel occurrence-panel">
        <div className="panel-heading">
          <span>Where It Occurs</span>
        </div>
        <div className={`occurrence-art occurrence-${cell.occurrence.motif}`}>
          <span />
          <i />
          <b />
        </div>
        <h4>{cell.occurrence.title}</h4>
        <p>{cell.occurrence.body}</p>
      </section>
    </aside>
  );
}

type BottomPanelsProps = {
  cell: CellItem;
  onCompare: () => void;
  onToast: (message: string) => void;
};

function BottomPanels({ cell, onCompare, onToast }: BottomPanelsProps) {
  const comparedCell = getCellById(cell.comparison);

  return (
    <section className="bottom-grid">
      <div className="panel microscope-panel">
        <div className="panel-heading">
          <span>
            Microscope View
            <Info size={16} />
          </span>
        </div>
        <div className="micro-card-row">
          {cell.microscope.map((image) => (
            <button
              type="button"
              key={image.label}
              className={`micro-card pattern-${image.pattern}`}
              style={{ "--micro": image.tone } as CSSProperties}
              onClick={() => onToast(`${image.label} selected.`)}
            >
              <span />
              <strong>{image.label}</strong>
            </button>
          ))}
          <button type="button" className="micro-card add-card" onClick={() => onToast("Image upload is a planned step.")}>
            <Plus size={28} />
            <strong>Add Image</strong>
          </button>
        </div>
      </div>

      <div className="panel compare-panel">
        <div className="panel-heading">
          <span>
            Compare Cells
            <Info size={16} />
          </span>
        </div>
        <div className="compare-row">
          <div>
            <MiniCell cell={cell} />
            <span>
              <strong>{cell.name}</strong>
              <em>You are here</em>
            </span>
          </div>
          <b>VS</b>
          <div>
            <span>
              <strong>{comparedCell.name}</strong>
              <em>{comparedCell.type}</em>
            </span>
            <MiniCell cell={comparedCell} />
          </div>
        </div>
        <button type="button" className="comparison-button" onClick={onCompare}>
          Open Comparison View
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

type ComparisonModalProps = {
  cell: CellItem;
  open: boolean;
  onClose: () => void;
};

function ComparisonModal({ cell, open, onClose }: ComparisonModalProps) {
  const comparedCell = getCellById(cell.comparison);
  if (!open) {
    return null;
  }

  const currentOrganelle = cell.organelles.find((item) => item.id === cell.defaultOrganelle) ?? cell.organelles[0];
  const comparedOrganelle =
    comparedCell.organelles.find((item) => item.id === comparedCell.defaultOrganelle) ?? comparedCell.organelles[0];

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Cell comparison">
      <div className="comparison-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          Close
        </button>
        <div className="comparison-modal-head">
          <h3>Comparison View</h3>
          <p>
            {cell.name} compared with {comparedCell.name}
          </p>
        </div>
        <div className="comparison-columns">
          {[cell, comparedCell].map((item) => {
            const organelle = item.id === cell.id ? currentOrganelle : comparedOrganelle;
            return (
              <section key={item.id}>
                <MiniCell cell={item} />
                <h4>{item.name}</h4>
                <p>{item.type}</p>
                <dl>
                  <div>
                    <dt>Default focus</dt>
                    <dd>{organelle.name}</dd>
                  </div>
                  <div>
                    <dt>Main note</dt>
                    <dd>{organelle.subtitle}</dd>
                  </div>
                  <div>
                    <dt>Occurs in</dt>
                    <dd>{item.occurrence.title}</dd>
                  </div>
                </dl>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return <div className="toast">{message}</div>;
}

export default function App() {
  const [selectedCellId, setSelectedCellId] = useState(initialCell.id);
  const [activeOrganelle, setActiveOrganelle] = useState(initialCell.defaultOrganelle);
  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialCell.id]));
  const [viewedCells, setViewedCells] = useState<Set<string>>(() => new Set([initialCell.id]));
  const [viewedOrganelleKeys, setViewedOrganelleKeys] = useState<Set<string>>(
    () => new Set([`${initialCell.id}:${initialCell.defaultOrganelle}`]),
  );
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [tutorPrompt, setTutorPrompt] = useState(
    `Guide me through finding ${initialCell.organelles[0].name} inside the 3D model.`,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const selectedCell = useMemo(() => getCellById(selectedCellId), [selectedCellId]);
  const totalOrganelleCount = useMemo(
    () => cells.reduce((total, cell) => total + cell.organelles.length, 0),
    [],
  );
  const mastery = useMemo(() => {
    const cellCoverage = viewedCells.size / cells.length;
    const organelleCoverage = viewedOrganelleKeys.size / totalOrganelleCount;
    return Math.round((cellCoverage * 0.42 + organelleCoverage * 0.58) * 100);
  }, [totalOrganelleCount, viewedCells, viewedOrganelleKeys]);

  useEffect(() => {
    setActiveOrganelle(selectedCell.defaultOrganelle);
    setComparisonOpen(false);
  }, [selectedCell]);

  useEffect(() => {
    setViewedCells((current) => {
      const next = new Set(current);
      next.add(selectedCell.id);
      return next;
    });
    setViewedOrganelleKeys((current) => {
      const next = new Set(current);
      next.add(`${selectedCell.id}:${activeOrganelle}`);
      return next;
    });
  }, [activeOrganelle, selectedCell.id]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const shellStyle = {
    "--accent": selectedCell.accent,
    "--accent-soft": selectedCell.accentSoft,
    "--cell-color": selectedCell.color,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <Header cell={selectedCell} onToast={showToast} onPlayQuiz={() => setQuizOpen(true)} />

      <SpecimenStrip
        selectedCell={selectedCell}
        favorites={favorites}
        onSelectCell={setSelectedCellId}
        onToggleFavorite={toggleFavorite}
        onToast={showToast}
      />

      <div className="app-grid">
        <Sidebar
          selectedCell={selectedCell}
          activeOrganelle={activeOrganelle}
          onSelectOrganelle={setActiveOrganelle}
          onToast={showToast}
        />

        <div className="center-stack">
          <Stage
            cell={selectedCell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
            onModeChange={setViewMode}
            onCrossSectionChange={setCrossSection}
            onAutoRotateChange={setAutoRotate}
            onReset={() => {
              setResetKey((key) => key + 1);
              showToast("View reset.");
            }}
            onToast={showToast}
          />
          <BottomPanels
            cell={selectedCell}
            onCompare={() => {
              setComparisonOpen(true);
              showToast(`Opened comparison: ${selectedCell.name} vs ${getCellById(selectedCell.comparison).name}.`);
            }}
            onToast={showToast}
          />
        </div>

        <RightPanel
          cell={selectedCell}
          activeOrganelle={activeOrganelle}
          favorites={favorites}
          mastery={mastery}
          viewedCellCount={viewedCells.size}
          viewedOrganelleCount={viewedOrganelleKeys.size}
          totalOrganelleCount={totalOrganelleCount}
          tutorPrompt={tutorPrompt}
          onToggleFavorite={(id) => {
            const wasOn = favorites.has(id);
            toggleFavorite(id);
            const name = getCellById(id).name;
            showToast(wasOn ? `Removed ${name} from favorites.` : `Added ${name} to favorites.`);
          }}
          onTutorPrompt={(prompt) => {
            setTutorPrompt(prompt);
            showToast("AI tutor prompt staged.");
          }}
        />
      </div>

      <ComparisonModal
        cell={selectedCell}
        open={comparisonOpen}
        onClose={() => {
          setComparisonOpen(false);
          showToast("Closed comparison view.");
        }}
      />
      {quizOpen && <SpecimenQuiz onExit={() => setQuizOpen(false)} />}
      <Toast message={toast} />
    </div>
  );
}
