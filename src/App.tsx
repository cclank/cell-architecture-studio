import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { cells, type ViewMode } from "./data/cells";
import { useResolvedCell, useResolvedCells } from "./i18n/resolveCell";
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
import { ShortcutsHelp } from "./components/ShortcutsHelp";
import { WelcomeTour } from "./components/WelcomeTour";
import { useProgression } from "./hooks/useProgression";
import { useOverlays } from "./hooks/useOverlays";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { claimDaily, isDailyClaimed, registerVisit, specimenOfTheDay } from "./lib/daily";
import { ACCENTS, loadAccent, saveAccent } from "./lib/theme";
import { STORAGE_KEYS } from "./lib/storageKeys";

const SpecimenQuiz = lazy(() =>
  import("./components/SpecimenQuiz").then((m) => ({ default: m.SpecimenQuiz })),
);

export default function App() {
  const { t, i18n } = useTranslation("common");
  const resolvedCells = useResolvedCells();
  const [selectedCellId, setSelectedCellId] = useState(loadLastCellId);
  const selectedCell = useResolvedCell(selectedCellId);
  const [activeOrganelle, setActiveOrganelle] = useState(selectedCell.defaultOrganelle);
  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
  const [viewedCells, setViewedCells] = useState<Set<string>>(() => new Set([loadLastCellId()]));
  const [viewedOrganelleKeys, setViewedOrganelleKeys] = useState<Set<string>>(
    () => new Set([`${loadLastCellId()}:${selectedCell.defaultOrganelle}`]),
  );
  const overlays = useOverlays();
  const organelleName =
    selectedCell.organelles.find((item) => item.id === selectedCell.defaultOrganelle)?.name ??
    selectedCell.organelles[0]?.name ??
    "";
  const [tutorPrompt, setTutorPrompt] = useState(() =>
    t("tutor.guide", { organelle: organelleName }),
  );
  const [toast, setToast] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>(() => loadRecentIds());
  const toastTimer = useRef<number | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState(() => isDailyClaimed());
  const [dailyStreak, setDailyStreak] = useState(0);
  const [accent, setAccent] = useState(loadAccent);
  const { progress, fire, reset: resetProgress, confettiKey, banner, xpPulse } = useProgression();
  const firedViews = useRef<Set<string>>(new Set([loadLastCellId()]));
  const dailyCell = useResolvedCell(specimenOfTheDay().id);

  useEffect(() => {
    setDailyStreak(registerVisit().streak);
    try {
      if (localStorage.getItem(STORAGE_KEYS.onboarded) !== "1") overlays.open("welcome");
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current =
      selectedCell.organelles.find((item) => item.id === activeOrganelle) ?? selectedCell.organelles[0];
    if (current) setTutorPrompt(t("tutor.guide", { organelle: current.name }));
  }, [i18n.language, t]);

  function closeWelcome() {
    overlays.close();
    try {
      localStorage.setItem(STORAGE_KEYS.onboarded, "1");
    } catch {
      /* ignore */
    }
  }

  const totalOrganelleCount = useMemo(
    () => cells.reduce((total, cell) => total + cell.organelles.length, 0),
    [],
  );
  const mastery = useMemo(() => {
    const cellCoverage = viewedCells.size / cells.length;
    const organelleCoverage = viewedOrganelleKeys.size / totalOrganelleCount;
    return Math.round((cellCoverage * 0.42 + organelleCoverage * 0.58) * 100);
  }, [totalOrganelleCount, viewedCells, viewedOrganelleKeys]);

  const prevCellId = useRef(selectedCellId);
  useEffect(() => {
    setActiveOrganelle(selectedCell.defaultOrganelle);
    if (prevCellId.current !== selectedCell.id) {
      overlays.close();
      prevCellId.current = selectedCell.id;
    }
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

  function cellName(id: string) {
    return resolvedCells.find((c) => c.id === id)?.name ?? id;
  }

  function stepSpecimen(delta: number) {
    const index = cells.findIndex((c) => c.id === selectedCellId);
    const next = cells[(index + delta + cells.length) % cells.length];
    setSelectedCellId(next.id);
    showToast(cellName(next.id));
  }

  useKeyboardShortcuts(overlays.active === null, {
    onPrev: () => stepSpecimen(-1),
    onNext: () => stepSpecimen(1),
    onFavorite: () => toggleFavorite(selectedCellId),
    onReset: () => {
      setResetKey((key) => key + 1);
      showToast(t("toast.viewReset"));
    },
    onToggleRotate: () => {
      setAutoRotate((v) => {
        showToast(v ? t("toast.rotateOff") : t("toast.rotateOn"));
        return !v;
      });
    },
    onSurprise: () => {
      const pool = cells.filter((c) => c.id !== selectedCellId);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setSelectedCellId(pick.id);
      showToast(t("toast.surprise", { name: cellName(pick.id) }));
    },
    onGallery: () => overlays.open("gallery"),
    onLibrary: () => overlays.open("library"),
    onFlashcards: () => overlays.open("flashcards"),
    onQuiz: () => overlays.open("quiz"),
    onHelp: () => overlays.open("shortcuts"),
  });

  const shellStyle = {
    "--accent": accent.accent,
    "--accent-soft": accent.accentSoft,
    "--brand": accent.accent,
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
        accentId={accent.id}
        onAccentChange={(id) => {
          const next = ACCENTS.find((a) => a.id === id) ?? accent;
          setAccent(next);
          saveAccent(next.id);
        }}
        onReplayIntro={() => overlays.open("welcome")}
        onClearFavorites={() => {
          setFavorites(new Set());
          showToast(t("toast.clearedFavorites"));
        }}
        onResetAll={() => {
          clearAllData();
          resetProgress();
          setFavorites(new Set());
          setRecentIds([]);
          showToast(t("toast.resetAll"));
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
                  showToast(t("toast.dailyBonus", { name: dailyCell.name }));
                } else {
                  showToast(t("toast.loaded", { name: dailyCell.name }));
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
              showToast(t("toast.viewReset"));
            }}
            onToast={showToast}
          />
          <BottomPanels
            cell={selectedCell}
            onCompare={() => {
              overlays.open("comparison");
              showToast(
                t("toast.openedComparison", {
                  a: selectedCell.name,
                  b: cellName(selectedCell.comparison),
                }),
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
            const name = cellName(id);
            showToast(wasOn ? t("toast.removedFavorite", { name }) : t("toast.addedFavorite", { name }));
          }}
          onTutorPrompt={(prompt) => {
            setTutorPrompt(prompt);
            showToast(t("toast.tutorStaged"));
          }}
        />
      </div>

      <ComparisonModal
        cell={selectedCell}
        open={overlays.isOpen("comparison")}
        onClose={() => {
          overlays.close();
          showToast(t("toast.closedComparison"));
        }}
      />
      {overlays.isOpen("quiz") && (
        <Suspense fallback={<div className="quiz-layer quiz-loading">{t("quizLoading")}</div>}>
          <SpecimenQuiz
            onExit={() => overlays.close()}
            onStudySpecimen={(id) => {
              setSelectedCellId(id);
              overlays.close();
              showToast(t("toast.loaded", { name: cellName(id) }));
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
        title={t("gallery.title")}
        subtitle={t("gallery.subtitle", { count: cells.length })}
        open={overlays.isOpen("gallery")}
        searchable
        selectedId={selectedCellId}
        sections={[{ label: t("gallery.all"), items: resolvedCells }]}
        onSelect={(id) => {
          setSelectedCellId(id);
          overlays.close();
          showToast(t("toast.loaded", { name: cellName(id) }));
        }}
        onClose={() => overlays.close()}
      />

      <SpecimenGridModal
        title={t("library.title")}
        subtitle={t("library.subtitle")}
        open={overlays.isOpen("library")}
        selectedId={selectedCellId}
        sections={[
          {
            label: t("library.favorites"),
            items: resolvedCells.filter((c) => favorites.has(c.id)),
            emptyHint: t("library.emptyFavorites"),
          },
          {
            label: t("library.recent"),
            items: recentIds.map((id) => resolvedCells.find((c) => c.id === id)).filter(Boolean) as typeof resolvedCells,
            emptyHint: t("library.emptyRecent"),
          },
        ]}
        onSelect={(id) => {
          setSelectedCellId(id);
          overlays.close();
          showToast(t("toast.loaded", { name: cellName(id) }));
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
          showToast(t("toast.loaded", { name: cellName(id) }));
        }}
      />

      <AchievementsPanel
        open={overlays.isOpen("achievements")}
        progress={progress}
        onClose={() => overlays.close()}
      />

      <ShortcutsHelp open={overlays.isOpen("shortcuts")} onClose={overlays.close} />

      <WelcomeTour open={overlays.isOpen("welcome")} onClose={closeWelcome} />

      <CelebrationBanner celebration={banner} />
      <Confetti fireKey={confettiKey} />
      <Toast message={toast} />
    </div>
  );
}
