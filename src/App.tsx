import {
  ArrowRight,
  BookOpen,
  Box,
  Brain,
  Camera,
  ChevronDown,
  CircleDot,
  FlaskConical,
  Gauge,
  EyeOff,
  Grid3X3,
  Heart,
  Info,
  MessageCircle,
  Library,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MoleculeScene } from "./components/CellScene";
import { molecules, getMoleculeById, type MoleculeItem, type ViewMode } from "./data/molecules";

type ModeOption = {
  id: ViewMode;
  label: string;
  Icon: LucideIcon;
};

const modeOptions: ModeOption[] = [
  { id: "mesh", label: "Mesh", Icon: Box },
  { id: "focus", label: "Focus", Icon: CircleDot },
];

const initialMolecule = getMoleculeById("water");

function Header({ molecule }: { molecule: MoleculeItem }) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={26} />
        </div>
        <div>
          <h1>Molecule Structure Studio</h1>
          <p>Explore chemistry at the molecular level</p>
        </div>
      </div>

      <nav className="top-nav" aria-label="Primary">
        <a href="#gallery">
          <Grid3X3 size={24} />
          <span>Gallery</span>
        </a>
        <a href="#library">
          <Library size={24} />
          <span>Library</span>
        </a>
        <a href="#notebooks">
          <BookOpen size={24} />
          <span>Notebooks</span>
        </a>
        <a href="#settings">
          <Settings size={24} />
          <span>Settings</span>
        </a>
        <button className="avatar-button" type="button" aria-label="User menu">
          <span className="avatar-core" style={{ background: molecule.accentSoft }}>
            <span style={{ background: molecule.accent }} />
          </span>
          <ChevronDown size={20} />
        </button>
      </nav>
    </header>
  );
}

type SidebarProps = {
  selectedMolecule: MoleculeItem;
  activeComponent: string;
  favorites: Set<string>;
  onSelectMolecule: (id: string) => void;
  onSelectComponent: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

function MiniMolecule({ molecule }: { molecule: MoleculeItem }) {
  if (molecule.renderImage?.url) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": molecule.accent } as CSSProperties}>
        <img src={molecule.renderImage.url} alt="" aria-hidden="true" />
      </span>
    );
  }

  if (molecule.modelAsset?.previewUrl) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": molecule.accent } as CSSProperties}>
        <img src={molecule.modelAsset.previewUrl} alt="" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={`mini-cell mini-cell-${molecule.modelKind}`} style={{ "--thumb": molecule.accent } as CSSProperties}>
      <span />
      <i />
      <b />
    </span>
  );
}

function Sidebar({
  selectedMolecule,
  activeComponent,
  favorites,
  onSelectMolecule,
  onSelectComponent,
  onToggleFavorite,
}: SidebarProps) {
  return (
    <aside className="left-rail">
      <section className="panel cell-type-panel">
        <div className="panel-heading">
          <span>
            <FlaskConical size={18} />
            Molecules
          </span>
          <ChevronDown size={18} />
        </div>

        <div className="cell-list">
          {molecules.map((molecule) => {
            const selected = selectedMolecule.id === molecule.id;
            return (
              <button
                className={`cell-row ${selected ? "is-active" : ""}`}
                type="button"
                key={molecule.id}
                onClick={() => onSelectMolecule(molecule.id)}
              >
                <MiniMolecule molecule={molecule} />
                <span className="cell-row-copy">
                  <strong>{molecule.name}</strong>
                  <span>{molecule.type}</span>
                </span>
                <span
                  className={`favorite-dot ${favorites.has(molecule.id) ? "is-on" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(molecule.id);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Favorite ${molecule.name}`}
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
            Components
          </span>
          <ChevronDown size={18} />
        </div>

        <div className="organelle-list">
          {selectedMolecule.components.map((component) => (
            <button
              className={`organelle-row ${activeComponent === component.id ? "is-active" : ""}`}
              type="button"
              key={component.id}
              onClick={() => onSelectComponent(component.id)}
            >
              <span className="color-dot" style={{ background: component.color }} />
              <span>{component.name}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

type StageProps = {
  molecule: MoleculeItem;
  activeComponent: string;
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
  molecule,
  activeComponent,
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
            <h2>{molecule.name}</h2>
            <p>{molecule.type}</p>
          </div>

          <div className="view-card">
            <span>View Mode</span>
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
              <span>Cross Section</span>
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
          <MoleculeScene
            molecule={molecule}
            activeComponent={activeComponent}
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
            Rotate
          </button>
          <button type="button" onClick={() => onModeChange("focus")}>
            <CircleDot size={20} />
            Isolate
          </button>
          <button type="button" onClick={() => onModeChange("focus")}>
            <EyeOff size={20} />
            Hide Others
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            Reset View
          </button>
        </div>

        <div className="export-toolbar">
          <button type="button" onClick={() => onToast("Screenshot feature coming soon.")}>
            <Camera size={20} />
            Screenshot
          </button>
          <button type="button" onClick={() => onToast("GLB export pipeline not yet connected.")}>
            <Box size={20} />
            GLB Export
          </button>
        </div>
      </section>
    </main>
  );
}

type RightPanelProps = {
  molecule: MoleculeItem;
  activeComponent: string;
  favorites: Set<string>;
  mastery: number;
  viewedMoleculeCount: number;
  viewedComponentCount: number;
  totalComponentCount: number;
  tutorPrompt: string;
  onToggleFavorite: (id: string) => void;
  onTutorPrompt: (prompt: string) => void;
};

function buildTutorPrompts(molecule: MoleculeItem, component: MoleculeItem["components"][number]) {
  return [
    `Explain the role of ${component.name} in ${molecule.name} and why it matters.`,
    `Quiz me on the structural differences between ${molecule.name} and ${getMoleculeById(molecule.comparison).name}.`,
    `Guide me through identifying ${component.name} in the 3D model.`,
  ];
}

function RightPanel({
  molecule,
  activeComponent,
  favorites,
  mastery,
  viewedMoleculeCount,
  viewedComponentCount,
  totalComponentCount,
  tutorPrompt,
  onToggleFavorite,
  onTutorPrompt,
}: RightPanelProps) {
  const component = molecule.components.find((item) => item.id === activeComponent) ?? molecule.components[0];
  const tutorPrompts = buildTutorPrompts(molecule, component);

  return (
    <aside className="right-rail">
      <section className="panel details-panel">
        <div className="panel-heading detail-heading">
          <span>Component Details</span>
          <button type="button" onClick={() => onToggleFavorite(molecule.id)} aria-label="Toggle favorite">
            <Heart size={22} fill={favorites.has(molecule.id) ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="detail-hero">
          <span className="organelle-orb" style={{ background: component.color }} />
          <div>
            <h3>{component.name}</h3>
            <p>{component.subtitle}</p>
          </div>
        </div>

        <dl className="attribute-list">
          {component.attributes.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div>
            <dt>Highlight</dt>
            <dd>
              <span className="mini-toggle is-on" />
              <span className="detail-dot" style={{ background: component.color }} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel notes-panel">
        <div className="panel-heading">
          <span>Chemistry Notes</span>
        </div>
        <p>{component.note}</p>
        <div className="fun-fact">
          <span>Fun Fact: {component.fact}</span>
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
            {viewedMoleculeCount}/{molecules.length} molecules explored · {viewedComponentCount}/{totalComponentCount} components inspected
          </small>
        </div>

        <div className="lesson-focus">
          <span>
            <Target size={17} />
            Current lesson focus
          </span>
          <p>
            Identify <strong>{component.name}</strong>, describe its chemistry, then compare it with the equivalent feature in{" "}
            {getMoleculeById(molecule.comparison).name}.
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
          <span>Found In</span>
        </div>
        <div className={`occurrence-art occurrence-${molecule.occurrence.motif}`}>
          <span />
          <i />
          <b />
        </div>
        <h4>{molecule.occurrence.title}</h4>
        <p>{molecule.occurrence.body}</p>
      </section>
    </aside>
  );
}

type BottomPanelsProps = {
  molecule: MoleculeItem;
  onCompare: () => void;
  onToast: (message: string) => void;
};

function BottomPanels({ molecule, onCompare, onToast }: BottomPanelsProps) {
  const comparedMolecule = getMoleculeById(molecule.comparison);

  return (
    <section className="bottom-grid">
      <div className="panel microscope-panel">
        <div className="panel-heading">
          <span>
            Spectroscopy
            <Info size={16} />
          </span>
        </div>
        <div className="micro-card-row">
          {molecule.spectroscopy.map((image) => (
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
          <button type="button" className="micro-card add-card" onClick={() => onToast("Spectrum upload is a planned feature.")}>
            <Plus size={28} />
            <strong>Add Spectrum</strong>
          </button>
        </div>
      </div>

      <div className="panel compare-panel">
        <div className="panel-heading">
          <span>
            Compare Molecules
            <Info size={16} />
          </span>
        </div>
        <div className="compare-row">
          <div>
            <MiniMolecule molecule={molecule} />
            <span>
              <strong>{molecule.name}</strong>
              <em>You are here</em>
            </span>
          </div>
          <b>VS</b>
          <div>
            <span>
              <strong>{comparedMolecule.name}</strong>
              <em>{comparedMolecule.type}</em>
            </span>
            <MiniMolecule molecule={comparedMolecule} />
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
  molecule: MoleculeItem;
  open: boolean;
  onClose: () => void;
};

function ComparisonModal({ molecule, open, onClose }: ComparisonModalProps) {
  const comparedMolecule = getMoleculeById(molecule.comparison);
  if (!open) {
    return null;
  }

  const currentComponent = molecule.components.find((item) => item.id === molecule.defaultComponent) ?? molecule.components[0];
  const comparedComponent =
    comparedMolecule.components.find((item) => item.id === comparedMolecule.defaultComponent) ?? comparedMolecule.components[0];

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Molecule comparison">
      <div className="comparison-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          Close
        </button>
        <div className="comparison-modal-head">
          <h3>Comparison View</h3>
          <p>
            {molecule.name} compared with {comparedMolecule.name}
          </p>
        </div>
        <div className="comparison-columns">
          {[molecule, comparedMolecule].map((item) => {
            const component = item.id === molecule.id ? currentComponent : comparedComponent;
            return (
              <section key={item.id}>
                <MiniMolecule molecule={item} />
                <h4>{item.name}</h4>
                <p>{item.type}</p>
                <dl>
                  <div>
                    <dt>Key feature</dt>
                    <dd>{component.name}</dd>
                  </div>
                  <div>
                    <dt>Description</dt>
                    <dd>{component.subtitle}</dd>
                  </div>
                  <div>
                    <dt>Found in</dt>
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
  const [selectedMoleculeId, setSelectedMoleculeId] = useState(initialMolecule.id);
  const [activeComponent, setActiveComponent] = useState(initialMolecule.defaultComponent);
  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialMolecule.id]));
  const [viewedMolecules, setViewedMolecules] = useState<Set<string>>(() => new Set([initialMolecule.id]));
  const [viewedComponentKeys, setViewedComponentKeys] = useState<Set<string>>(
    () => new Set([`${initialMolecule.id}:${initialMolecule.defaultComponent}`]),
  );
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [tutorPrompt, setTutorPrompt] = useState(
    `Guide me through identifying ${initialMolecule.components[0].name} in the 3D model.`,
  );
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const selectedMolecule = useMemo(() => getMoleculeById(selectedMoleculeId), [selectedMoleculeId]);
  const totalComponentCount = useMemo(
    () => molecules.reduce((total, molecule) => total + molecule.components.length, 0),
    [],
  );
  const mastery = useMemo(() => {
    const moleculeCoverage = viewedMolecules.size / molecules.length;
    const componentCoverage = viewedComponentKeys.size / totalComponentCount;
    return Math.round((moleculeCoverage * 0.42 + componentCoverage * 0.58) * 100);
  }, [totalComponentCount, viewedMolecules, viewedComponentKeys]);

  useEffect(() => {
    setActiveComponent(selectedMolecule.defaultComponent);
    setComparisonOpen(false);
  }, [selectedMolecule]);

  useEffect(() => {
    setViewedMolecules((current) => {
      const next = new Set(current);
      next.add(selectedMolecule.id);
      return next;
    });
    setViewedComponentKeys((current) => {
      const next = new Set(current);
      next.add(`${selectedMolecule.id}:${activeComponent}`);
      return next;
    });
  }, [activeComponent, selectedMolecule.id]);

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
    "--accent": selectedMolecule.accent,
    "--accent-soft": selectedMolecule.accentSoft,
    "--cell-color": selectedMolecule.color,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <Header molecule={selectedMolecule} />

      <div className="app-grid">
        <Sidebar
          selectedMolecule={selectedMolecule}
          activeComponent={activeComponent}
          favorites={favorites}
          onSelectMolecule={setSelectedMoleculeId}
          onSelectComponent={setActiveComponent}
          onToggleFavorite={toggleFavorite}
        />

        <div className="center-stack">
          <Stage
            molecule={selectedMolecule}
            activeComponent={activeComponent}
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
            molecule={selectedMolecule}
            onCompare={() => setComparisonOpen(true)}
            onToast={showToast}
          />
        </div>

        <RightPanel
          molecule={selectedMolecule}
          activeComponent={activeComponent}
          favorites={favorites}
          mastery={mastery}
          viewedMoleculeCount={viewedMolecules.size}
          viewedComponentCount={viewedComponentKeys.size}
          totalComponentCount={totalComponentCount}
          tutorPrompt={tutorPrompt}
          onToggleFavorite={toggleFavorite}
          onTutorPrompt={(prompt) => {
            setTutorPrompt(prompt);
            showToast("AI tutor prompt staged.");
          }}
        />
      </div>

      <ComparisonModal molecule={selectedMolecule} open={comparisonOpen} onClose={() => setComparisonOpen(false)} />
      <Toast message={toast} />
    </div>
  );
}
