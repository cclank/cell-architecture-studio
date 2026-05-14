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
import { cells, getCellById, type CellItem, type ViewMode } from "./data/cells";

type ModeOption = {
  id: ViewMode;
  label: string;
  Icon: LucideIcon;
};

const modeOptions: ModeOption[] = [
  { id: "mesh", label: "Lưới", Icon: Box },
  { id: "focus", label: "Tập Trung", Icon: CircleDot },
];

const initialCell = getCellById("animal");

function Header({ cell }: { cell: CellItem }) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={26} />
        </div>
        <div>
          <h1>Studio Kiến Trúc Tế Bào</h1>
          <p>Khám phá sự sống ở cấp độ vi mô</p>
        </div>
      </div>

      <nav className="top-nav" aria-label="Điều hướng chính">
        <a href="#gallery">
          <Grid3X3 size={24} />
          <span>Thư Viện Ảnh</span>
        </a>
        <a href="#library">
          <Library size={24} />
          <span>Thư Viện</span>
        </a>
        <a href="#notebooks">
          <BookOpen size={24} />
          <span>Ghi Chú</span>
        </a>
        <a href="#settings">
          <Settings size={24} />
          <span>Cài Đặt</span>
        </a>
        <button className="avatar-button" type="button" aria-label="Menu người dùng">
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
  favorites: Set<string>;
  onSelectCell: (id: string) => void;
  onSelectOrganelle: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

function MiniCell({ cell }: { cell: CellItem }) {
  if (cell.renderImage?.url) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": cell.accent } as CSSProperties}>
        <img src={cell.renderImage.url} alt="" aria-hidden="true" />
      </span>
    );
  }

  if (cell.modelAsset?.previewUrl) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": cell.accent } as CSSProperties}>
        <img src={cell.modelAsset.previewUrl} alt="" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={`mini-cell mini-cell-${cell.modelKind}`} style={{ "--thumb": cell.accent } as CSSProperties}>
      <span />
      <i />
      <b />
    </span>
  );
}

function Sidebar({
  selectedCell,
  activeOrganelle,
  favorites,
  onSelectCell,
  onSelectOrganelle,
  onToggleFavorite,
}: SidebarProps) {
  return (
    <aside className="left-rail">
      <section className="panel cell-type-panel">
        <div className="panel-heading">
          <span>
            <Leaf size={18} />
            Loại Tế Bào
          </span>
          <ChevronDown size={18} />
        </div>

        <div className="cell-list">
          {cells.map((cell) => {
            const selected = selectedCell.id === cell.id;
            return (
              <button
                className={`cell-row ${selected ? "is-active" : ""}`}
                type="button"
                key={cell.id}
                onClick={() => onSelectCell(cell.id)}
              >
                <MiniCell cell={cell} />
                <span className="cell-row-copy">
                  <strong>{cell.name}</strong>
                  <span>{cell.type}</span>
                </span>
                <span
                  className={`favorite-dot ${favorites.has(cell.id) ? "is-on" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(cell.id);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Yêu thích ${cell.name}`}
                >
                  <Star size={18} fill="currentColor" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel organelle-panel">
        <div className="panel-heading">
          <span>
            <Sparkles size={16} />
            Bào Quan
          </span>
          <ChevronDown size={18} />
        </div>

        <div className="organelle-list">
          {selectedCell.organelles.map((organelle) => (
            <button
              className={`organelle-row ${activeOrganelle === organelle.id ? "is-active" : ""}`}
              type="button"
              key={organelle.id}
              onClick={() => onSelectOrganelle(organelle.id)}
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
          <div>
            <h2>{cell.name}</h2>
            <p>{cell.type}</p>
          </div>

          <div className="view-card">
            <span>Chế Độ Xem</span>
            <div className="mode-switcher">
              {modeOptions.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={viewMode === id ? "is-active" : ""}
                  onClick={() => onModeChange(id)}
                  title={label}
                >
                  <Icon size={22} />
                </button>
              ))}
            </div>
            <label className="toggle-line">
              <span>Mặt Cắt Ngang</span>
              <input
                type="checkbox"
                checked={crossSection}
                onChange={(event) => onCrossSectionChange(event.target.checked)}
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
            onClick={() => onAutoRotateChange(!autoRotate)}
          >
            <RotateCcw size={20} />
            Xoay
          </button>
          <button type="button" onClick={() => onModeChange("focus")}>
            <CircleDot size={20} />
            Tách Biệt
          </button>
          <button type="button" onClick={() => onModeChange("focus")}>
            <EyeOff size={20} />
            Ẩn Phần Còn Lại
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            Đặt Lại Góc Nhìn
          </button>
        </div>

        <div className="export-toolbar">
          <button type="button" onClick={() => onToast("Chức năng chụp màn hình đang được phát triển.")}>
            <Camera size={20} />
            Chụp Màn Hình
          </button>
          <button type="button" onClick={() => onToast("Xuất GLB cần kết nối với đường dẫn xuất mô hình.")}>
            <Box size={20} />
            Xuất GLB
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
    `Giải thích cách ${organelle.name} giúp ${cell.name} tồn tại.`,
    `Kiểm tra tôi về sự khác biệt trực quan giữa ${cell.name} và ${getCellById(cell.comparison).name}.`,
    `Hướng dẫn tôi tìm ${organelle.name} trong mô hình 3D.`,
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
          <span>Chi Tiết Bào Quan</span>
          <button type="button" onClick={() => onToggleFavorite(cell.id)} aria-label="Chuyển đổi yêu thích">
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
            <dt>Nhãn</dt>
            <dd>
              <span className="mini-toggle is-on" />
              <span className="detail-dot" style={{ background: organelle.color }} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel notes-panel">
        <div className="panel-heading">
          <span>Ghi Chú Sinh Học</span>
        </div>
        <p>{organelle.note}</p>
        <div className="fun-fact">
          <span>Sự Thật Thú Vị: {organelle.fact}</span>
          <Sparkles size={18} />
        </div>
      </section>

      <section className="panel learning-panel">
        <div className="panel-heading">
          <span>
            <Brain size={17} />
            Gia Sư AI
          </span>
        </div>

        <div className="mastery-meter" style={{ "--progress": `${mastery}%` } as CSSProperties}>
          <div>
            <Gauge size={18} />
            <span>Mức Độ Thành Thạo</span>
            <strong>{mastery}%</strong>
          </div>
          <i>
            <b />
          </i>
          <small>
            {viewedCellCount}/{cells.length} tế bào đã khám phá · {viewedOrganelleCount}/{totalOrganelleCount} bào quan đã quan sát
          </small>
        </div>

        <div className="lesson-focus">
          <span>
            <Target size={17} />
            Trọng tâm bài học hiện tại
          </span>
          <p>
            Định vị <strong>{organelle.name}</strong>, giải thích vai trò của nó, sau đó so sánh với cấu trúc tương ứng trong{" "}
            {getCellById(cell.comparison).name}.
          </p>
        </div>

        <div className="tutor-prompt">
          <span>
            <MessageCircle size={17} />
            Câu hỏi cho Gia Sư AI
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
          <span>Nơi Xuất Hiện</span>
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
            Góc Nhìn Kính Hiển Vi
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
              onClick={() => onToast(`Đã chọn ${image.label}.`)}
            >
              <span />
              <strong>{image.label}</strong>
            </button>
          ))}
          <button type="button" className="micro-card add-card" onClick={() => onToast("Tải ảnh lên là tính năng đang được phát triển.")}>
            <Plus size={28} />
            <strong>Thêm Ảnh</strong>
          </button>
        </div>
      </div>

      <div className="panel compare-panel">
        <div className="panel-heading">
          <span>
            So Sánh Tế Bào
            <Info size={16} />
          </span>
        </div>
        <div className="compare-row">
          <div>
            <MiniCell cell={cell} />
            <span>
              <strong>{cell.name}</strong>
              <em>Bạn đang ở đây</em>
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
          Mở Chế Độ So Sánh
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
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="So sánh tế bào">
      <div className="comparison-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          Đóng
        </button>
        <div className="comparison-modal-head">
          <h3>Chế Độ So Sánh</h3>
          <p>
            {cell.name} so sánh với {comparedCell.name}
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
                    <dt>Bào quan mặc định</dt>
                    <dd>{organelle.name}</dd>
                  </div>
                  <div>
                    <dt>Ghi chú chính</dt>
                    <dd>{organelle.subtitle}</dd>
                  </div>
                  <div>
                    <dt>Xuất hiện ở</dt>
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
    `Hướng dẫn tôi tìm ${initialCell.organelles[0].name} trong mô hình 3D.`,
  );
  const [toast, setToast] = useState<string | null>(null);
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
      <Header cell={selectedCell} />

      <div className="app-grid">
        <Sidebar
          selectedCell={selectedCell}
          activeOrganelle={activeOrganelle}
          favorites={favorites}
          onSelectCell={setSelectedCellId}
          onSelectOrganelle={setActiveOrganelle}
          onToggleFavorite={toggleFavorite}
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
              showToast("Đã đặt lại góc nhìn.");
            }}
            onToast={showToast}
          />
          <BottomPanels
            cell={selectedCell}
            onCompare={() => setComparisonOpen(true)}
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
          onToggleFavorite={toggleFavorite}
          onTutorPrompt={(prompt) => {
            setTutorPrompt(prompt);
            showToast("Đã chuẩn bị câu hỏi cho Gia Sư AI.");
          }}
        />
      </div>

      <ComparisonModal cell={selectedCell} open={comparisonOpen} onClose={() => setComparisonOpen(false)} />
      <Toast message={toast} />
    </div>
  );
}
