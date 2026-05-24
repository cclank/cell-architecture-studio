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
import { FlashcardsModal } from "./components/FlashcardsModal";
import { Toast } from "./components/Toast";
import { Confetti } from "./components/Confetti";
import { CelebrationBanner } from "./components/CelebrationBanner";
import { AchievementsPanel } from "./components/AchievementsPanel";
import { DailyChallenge } from "./components/DailyChallenge";
import { useProgression } from "./hooks/useProgression";
import { useOverlays } from "./hooks/useOverlays";
import { claimDaily, isDailyClaimed, registerVisit, specimenOfTheDay } from "./lib/daily";

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
  const overlays = useOverlays();
  const [tutorPrompt, setTutorPrompt] = useState(
    `Guide me through finding ${initialCell.organelles[0].name} inside the 3D model.`,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>(() => loadRecentIds());
  const toastTimer = useRef<number | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState(() => isDailyClaimed());
  const [dailyStreak, setDailyStreak] = useState(0);
  const { progress, fire, reset: resetProgress, confettiKey, banner, xpPulse } = useProgression();
  // Seed with the restored cell so reloading doesn't fire a "viewed" award.
  const firedViews = useRef<Set<string>>(new Set([loadLastCellId()]));
  const dailyCell = useMemo(() => specimenOfTheDay(), []);

  useEffect(() => {
    setDailyStreak(registerVisit().streak);
  }, []);

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
    overlays.close();
  }, [selectedCell]);

  useEffect(() => {
    saveLastCellId(selectedCellId);
    setRecentIds(pushRecentId(selectedCellId));
    if (!firedViews.current.has(selectedCellId)) {
      firedViews.current.add(selectedCellId);
      fire({ type: "viewNew" });
    }
  }, [selectedCellId, fire]);

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
    const wasFav = favorites.has(id);
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (!wasFav) fire({ type: "favorite", favoritesCount: favorites.size + 1 });
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
        progress={progress}
        xpPulse={xpPulse}
        onPlayQuiz={() => overlays.open("quiz")}
        onAbout={() => overlays.open("about")}
        onGallery={() => overlays.open("gallery")}
        onLibrary={() => overlays.open("library")}
        onNotebooks={() => overlays.open("notebooks")}
        onFlashcards={() => overlays.open("flashcards")}
        onAchievements={() => overlays.open("achievements")}
        onClearFavorites={() => {
          setFavorites(new Set());
          showToast("Cleared all favorites.");
        }}
        onResetAll={() => {
          clearAllData();
          resetProgress();
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
          topSlot={
            <DailyChallenge
              cell={dailyCell}
              streak={dailyStreak}
              claimed={dailyClaimed}
              onStudy={() => {
                setSelectedCellId(dailyCell.id);
                if (!dailyClaimed && claimDaily()) {
                  setDailyClaimed(true);
                  fire({ type: "bonus", amount: 15 });
                  showToast(`Daily specimen — ${dailyCell.name}! +15 XP`);
                } else {
                  showToast(`Loaded ${dailyCell.name} on stage.`);
                }
              }}
            />
          }
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
              overlays.open("comparison");
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
        open={overlays.isOpen("comparison")}
        onClose={() => {
          overlays.close();
          showToast("Closed comparison view.");
        }}
      />
      {overlays.isOpen("quiz") && (
        <Suspense fallback={<div className="quiz-layer quiz-loading">Loading quiz…</div>}>
          <SpecimenQuiz
            onExit={() => overlays.close()}
            onStudySpecimen={(id) => {
              setSelectedCellId(id);
              overlays.close();
              showToast(`Loaded ${getCellById(id).name} on stage.`);
            }}
            onCorrect={(streak) => fire({ type: "quizCorrect", streak })}
            onComplete={(score, total, bestStreak, perfect) =>
              fire({ type: "quizComplete", score, total, bestStreak, perfect })
            }
          />
        </Suspense>
      )}
      <AboutModal open={overlays.isOpen("about")} onClose={overlays.close} />

      <SpecimenGridModal
        title="Gallery"
        subtitle={`Browse all ${cells.length} specimens`}
        open={overlays.isOpen("gallery")}
        searchable
        selectedId={selectedCellId}
        sections={[{ label: "All specimens", items: cells }]}
        onSelect={(id) => {
          setSelectedCellId(id);
          overlays.close();
          showToast(`Loaded ${getCellById(id).name} on stage.`);
        }}
        onClose={() => overlays.close()}
      />

      <SpecimenGridModal
        title="Your Library"
        subtitle="Favorites and recently viewed specimens"
        open={overlays.isOpen("library")}
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
          overlays.close();
          showToast(`Loaded ${getCellById(id).name} on stage.`);
        }}
        onClose={() => overlays.close()}
      />

      <NotebooksModal
        open={overlays.isOpen("notebooks")}
        currentCell={selectedCell}
        onSelect={setSelectedCellId}
        onClose={() => overlays.close()}
      />

      <FlashcardsModal
        open={overlays.isOpen("flashcards")}
        onClose={() => overlays.close()}
        onStudySpecimen={(id) => {
          setSelectedCellId(id);
          showToast(`Loaded ${getCellById(id).name} on stage.`);
        }}
      />

      <AchievementsPanel
        open={overlays.isOpen("achievements")}
        progress={progress}
        onClose={() => overlays.close()}
      />

      <CelebrationBanner celebration={banner} />
      <Confetti fireKey={confettiKey} />
      <Toast message={toast} />
    </div>
  );
}
