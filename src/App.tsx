import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cells, getCellById, type ViewMode } from "./data/cells";
import {
  clearAllData,
  loadFavorites,
  loadLastCellId,
  loadRecentIds,
  pushRecentId,
  saveFavorites,
  saveLastCellId,
} from "./lib/storage";
import { Header } from "./components/Header";
import { SpecimenStrip } from "./components/SpecimenStrip";
import { Sidebar } from "./components/Sidebar";
import { Stage } from "./components/Stage";
import { RightPanel } from "./components/RightPanel";
import { BottomPanels } from "./components/BottomPanels";
import { ComparisonModal } from "./components/ComparisonModal";
import { AboutModal } from "./components/AboutModal";
import { SpecimenGridModal } from "./components/SpecimenGridModal";
import { NotebooksModal } from "./components/NotebooksModal";
import { Toast } from "./components/Toast";

const SpecimenQuiz = lazy(() =>
  import("./components/SpecimenQuiz").then((m) => ({ default: m.SpecimenQuiz })),
);

const initialCell = getCellById("animal");

export default function App() {
  const [selectedCellId, setSelectedCellId] = useState(loadLastCellId);
  const [activeOrganelle, setActiveOrganelle] = useState(initialCell.defaultOrganelle);
  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
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
  const [aboutOpen, setAboutOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [notebooksOpen, setNotebooksOpen] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>(() => loadRecentIds());
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
    saveLastCellId(selectedCellId);
    setRecentIds(pushRecentId(selectedCellId));
  }, [selectedCellId]);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    setViewedCells((current) => new Set(current).add(selectedCell.id));
    setViewedOrganelleKeys((current) => new Set(current).add(`${selectedCell.id}:${activeOrganelle}`));
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

  // Only the 3D-stage tint follows the specimen; UI accent stays clinical blue.
  const shellStyle = {
    "--cell-color": selectedCell.color,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <Header
        cell={selectedCell}
        favoritesCount={favorites.size}
        exploredCount={viewedCells.size}
        totalCount={cells.length}
        onPlayQuiz={() => setQuizOpen(true)}
        onAbout={() => setAboutOpen(true)}
        onGallery={() => setGalleryOpen(true)}
        onLibrary={() => setLibraryOpen(true)}
        onNotebooks={() => setNotebooksOpen(true)}
        onClearFavorites={() => {
          setFavorites(new Set());
          showToast("Cleared all favorites.");
        }}
        onResetAll={() => {
          clearAllData();
          setFavorites(new Set());
          setRecentIds([]);
          showToast("All saved data reset.");
        }}
      />

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
              showToast(
                `Opened comparison: ${selectedCell.name} vs ${getCellById(selectedCell.comparison).name}.`,
              );
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
      {quizOpen && (
        <Suspense fallback={<div className="quiz-layer quiz-loading">Loading quiz…</div>}>
          <SpecimenQuiz
            onExit={() => setQuizOpen(false)}
            onStudySpecimen={(id) => {
              setSelectedCellId(id);
              setQuizOpen(false);
              showToast(`Loaded ${getCellById(id).name} on stage.`);
            }}
          />
        </Suspense>
      )}
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <SpecimenGridModal
        title="Gallery"
        subtitle={`Browse all ${cells.length} specimens`}
        open={galleryOpen}
        searchable
        selectedId={selectedCellId}
        sections={[{ label: "All specimens", items: cells }]}
        onSelect={(id) => {
          setSelectedCellId(id);
          setGalleryOpen(false);
          showToast(`Loaded ${getCellById(id).name} on stage.`);
        }}
        onClose={() => setGalleryOpen(false)}
      />

      <SpecimenGridModal
        title="Your Library"
        subtitle="Favorites and recently viewed specimens"
        open={libraryOpen}
        selectedId={selectedCellId}
        sections={[
          {
            label: "Favorites",
            items: cells.filter((c) => favorites.has(c.id)),
            emptyHint: "No favorites yet — tap the star on a specimen.",
          },
          {
            label: "Recently viewed",
            items: recentIds.map(getCellById),
            emptyHint: "Specimens you open will appear here.",
          },
        ]}
        onSelect={(id) => {
          setSelectedCellId(id);
          setLibraryOpen(false);
          showToast(`Loaded ${getCellById(id).name} on stage.`);
        }}
        onClose={() => setLibraryOpen(false)}
      />

      <NotebooksModal
        open={notebooksOpen}
        currentCell={selectedCell}
        onSelect={setSelectedCellId}
        onClose={() => setNotebooksOpen(false)}
      />

      <Toast message={toast} />
    </div>
  );
}
