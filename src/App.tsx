import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { getCellById, type ViewMode } from "./data/cells";
import { biologyVisuals, getVisualById } from "./data/biologyVisuals";
import { getTopicById } from "./data/syllabusTopics";
import { getProcessById } from "./data/processes";
import { getPracticalById } from "./data/practicals";
import { getComparisonById } from "./data/comparisons";
import { getQuestionsForTopic, getQuestionById } from "./data/questions";
import { glossary } from "./data/glossary";
import type { PracticeQuestion } from "./data/curriculum/types";
import { clearAllData } from "./lib/storage";
import {
  loadVisualFavorites,
  saveVisualFavorites,
  loadVisualNotes,
  saveVisualNote,
} from "./lib/studioStorage";
import {
  localProgressStore,
  recordStructureIdentified,
  recordVisualExplored,
  recordProcessCompleted,
  recordPracticalCompleted,
  recordQuestionResult,
} from "./lib/curriculumProgress";
import {
  loadCourseLevel,
  saveCourseLevel,
  loadStudyMode,
  saveStudyMode,
  type StudyMode,
} from "./lib/courseLevel";
import type { CourseLevel } from "./data/curriculum/types";
import { Header } from "./components/Header";
import { BottomPanels } from "./components/BottomPanels";
import { AboutModal } from "./components/AboutModal";
import { SpecimenGridModal } from "./components/SpecimenGridModal";
import { NotebooksModal } from "./components/NotebooksModal";
import { FlashcardsModal } from "./components/FlashcardsModal";
import { AchievementsPanel } from "./components/AchievementsPanel";
import { ShortcutsHelp } from "./components/ShortcutsHelp";
import { WelcomeTour } from "./components/WelcomeTour";
import { Toast } from "./components/Toast";
import { Confetti } from "./components/Confetti";
import { CelebrationBanner } from "./components/CelebrationBanner";
import { SyllabusExplorer, type ExplorerSelection } from "./components/igb/SyllabusExplorer";
import { VisualStage } from "./components/igb/VisualStage";
import { StudyPanel } from "./components/igb/StudyPanel";
import { ProcessViewer } from "./components/igb/ProcessViewer";
import { PracticalPanel } from "./components/igb/PracticalPanel";
import { ComparisonView } from "./components/igb/ComparisonView";
import { TopicOverview } from "./components/igb/TopicOverview";
import { TopicAside } from "./components/igb/TopicAside";
import { QuestionRunner } from "./components/igb/QuestionRunner";
import { useProgression } from "./hooks/useProgression";
import { useOverlays } from "./hooks/useOverlays";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { ACCENTS, loadAccent, saveAccent } from "./lib/theme";
import { STORAGE_KEYS } from "./lib/storageKeys";
import { cells } from "./data/cells";

const SpecimenQuiz = lazy(() =>
  import("./components/SpecimenQuiz").then((m) => ({ default: m.SpecimenQuiz })),
);

type Workspace = "topic" | "visual" | "process" | "practical" | "comparison";

const DEFAULT_VISUAL = "vis-animal-cell";

export default function App() {
  const [courseLevel, setCourseLevel] = useState<CourseLevel>(loadCourseLevel);
  const [studyMode, setStudyMode] = useState<StudyMode>(loadStudyMode);

  const [workspace, setWorkspace] = useState<Workspace>("visual");
  const [selectedVisualId, setSelectedVisualId] = useState<string>(DEFAULT_VISUAL);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    getVisualById(DEFAULT_VISUAL)?.topicIds[0] ?? "organisation",
  );
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [selectedPracticalId, setSelectedPracticalId] = useState<string | null>(null);
  const [selectedComparisonId, setSelectedComparisonId] = useState<string | null>(null);
  const [activeStructureId, setActiveStructureId] = useState<string>(
    getVisualById(DEFAULT_VISUAL)?.structures[0]?.id ?? "",
  );

  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const [favorites, setFavorites] = useState<Set<string>>(loadVisualFavorites);
  const [notes, setNotes] = useState(loadVisualNotes);
  const [progress, setProgress] = useState(() => localProgressStore.load());
  const [accent, setAccent] = useState(loadAccent);

  const [runner, setRunner] = useState<{ title: string; questions: PracticeQuestion[] } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const overlays = useOverlays();
  const { progress: xp, fire, reset: resetProgress, confettiKey, banner, xpPulse } = useProgression();

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.onboarded) !== "1") overlays.open("welcome");
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => saveCourseLevel(courseLevel), [courseLevel]);
  useEffect(() => saveStudyMode(studyMode), [studyMode]);
  useEffect(() => saveVisualFavorites(favorites), [favorites]);
  useEffect(() => localProgressStore.save(progress), [progress]);

  const selectedVisual = getVisualById(selectedVisualId) ?? biologyVisuals[0];
  const specimen = selectedVisual.specimenId ? getCellById(selectedVisual.specimenId) : undefined;
  const topic = getTopicById(selectedTopicId);
  const labelsVisible = studyMode !== "EXAM";

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  function openVisual(id: string) {
    const v = getVisualById(id);
    if (!v) return;
    setSelectedVisualId(id);
    setSelectedTopicId(v.topicIds[0] ?? selectedTopicId);
    setActiveStructureId(v.structures[0]?.id ?? "");
    setWorkspace("visual");
    setResetKey((k) => k + 1);
    setProgress((p) => recordVisualExplored(p, id));
    fire({ type: "viewNew" });
    showToast(`Opened ${v.title}.`);
  }

  function openTopic(id: string) {
    const t = getTopicById(id);
    if (!t) return;
    setSelectedTopicId(id);
    setWorkspace("topic");
  }

  function openProcess(id: string) {
    const p = getProcessById(id);
    if (!p) return;
    setSelectedProcessId(id);
    setSelectedTopicId(p.topicIds[0] ?? selectedTopicId);
    setWorkspace("process");
    showToast(`Playing process: ${p.title}.`);
  }

  function openPractical(id: string) {
    const p = getPracticalById(id);
    if (!p) return;
    setSelectedPracticalId(id);
    setSelectedTopicId(p.topicIds[0] ?? selectedTopicId);
    setWorkspace("practical");
  }

  function openComparison(id: string) {
    const c = getComparisonById(id);
    if (!c) return;
    setSelectedComparisonId(id);
    setSelectedTopicId(c.topicIds[0] ?? selectedTopicId);
    setWorkspace("comparison");
  }

  function handleExplorerSelect(sel: ExplorerSelection) {
    if (sel.kind === "visual") openVisual(sel.id);
    else if (sel.kind === "topic") openTopic(sel.id);
    else if (sel.kind === "process") openProcess(sel.id);
    else if (sel.kind === "practical") openPractical(sel.id);
    else if (sel.kind === "glossary") {
      const term = glossary.find((g) => g.id === sel.id);
      if (term) showToast(`${term.term}: ${term.definition}`);
    }
  }

  function selectStructure(id: string) {
    setActiveStructureId(id);
    setProgress((p) => recordStructureIdentified(p, selectedVisualId, id));
    if (viewMode === "mesh" && specimen) setViewMode("focus");
  }

  function toggleFavorite(id: string) {
    setFavorites((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        fire({ type: "favorite", favoritesCount: next.size });
      }
      return next;
    });
  }

  function updateNote(text: string) {
    setNotes(saveVisualNote(selectedVisualId, text));
  }

  function openTopicQuestions(topicId: string) {
    const t = getTopicById(topicId);
    if (!t) return;
    const qs = getQuestionsForTopic(topicId);
    if (qs.length === 0) {
      showToast("No questions yet for this topic.");
      return;
    }
    setRunner({ title: `${t.number}. ${t.title}`, questions: qs });
  }

  function openSingleQuestion(id: string) {
    const q = getQuestionById(id);
    if (!q) return;
    setRunner({ title: "Comparison question", questions: [q] });
  }

  function recordAnswer(qid: string, correct: boolean) {
    setProgress((p) => recordQuestionResult(p, qid, correct));
    if (correct) fire({ type: "quizCorrect", streak: 1 });
  }

  const stepVisual = (delta: number) => {
    const idx = biologyVisuals.findIndex((v) => v.id === selectedVisualId);
    const next = biologyVisuals[(idx + delta + biologyVisuals.length) % biologyVisuals.length];
    openVisual(next.id);
  };

  useKeyboardShortcuts(overlays.active === null && runner === null, {
    onPrev: () => stepVisual(-1),
    onNext: () => stepVisual(1),
    onFavorite: () => toggleFavorite(selectedVisualId),
    onReset: () => {
      setResetKey((k) => k + 1);
      showToast("View reset.");
    },
    onToggleRotate: () => setAutoRotate((v) => !v),
    onSurprise: () => stepVisual(1),
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
    "--cell-color": specimen?.color ?? accent.accent,
  } as CSSProperties;

  const headerCell = specimen ?? getCellById("animal");

  return (
    <div className="app-shell" style={shellStyle}>
      <Header
        cell={headerCell}
        favoritesCount={favorites.size}
        exploredCount={progress.visualsExplored.length}
        totalCount={biologyVisuals.length}
        progress={xp}
        xpPulse={xpPulse}
        studyMode={studyMode}
        onStudyModeChange={setStudyMode}
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
          showToast("Cleared all favourites.");
        }}
        onResetAll={() => {
          clearAllData();
          localProgressStore.clear();
          resetProgress();
          setFavorites(new Set());
          setProgress(localProgressStore.load());
          showToast("All saved progress reset.");
        }}
      />

      <div className="app-grid">
        <SyllabusExplorer
          courseLevel={courseLevel}
          onCourseLevelChange={(lvl) => {
            setCourseLevel(lvl);
            showToast(`Course level: ${lvl === "ALL" ? "All content" : lvl.charAt(0) + lvl.slice(1).toLowerCase()}.`);
          }}
          progress={progress}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          activeId={
            workspace === "visual"
              ? selectedVisualId
              : workspace === "process"
                ? selectedProcessId
                : workspace === "practical"
                  ? selectedPracticalId
                  : selectedTopicId
          }
          onSelect={handleExplorerSelect}
        />

        <div className="center-stack">
          {workspace === "topic" && topic && (
            <TopicOverview
              topic={topic}
              courseLevel={courseLevel}
              onSelect={handleExplorerSelect}
              onOpenComparison={openComparison}
              onOpenQuestions={() => openTopicQuestions(topic.id)}
              questionCount={topic.questionIds.length}
            />
          )}

          {workspace === "visual" && (
            <>
              <VisualStage
                visual={selectedVisual}
                specimen={specimen}
                activeStructureId={activeStructureId}
                viewMode={viewMode}
                crossSection={crossSection}
                autoRotate={autoRotate}
                resetKey={resetKey}
                labelsVisible={labelsVisible}
                onModeChange={setViewMode}
                onCrossSectionChange={setCrossSection}
                onAutoRotateChange={setAutoRotate}
                onReset={() => {
                  setResetKey((k) => k + 1);
                  showToast("View reset.");
                }}
                onToast={showToast}
              />
              {specimen && (
                <BottomPanels
                  cell={specimen}
                  onCompare={() => {
                    const cmp = topic?.comparisonIds[0];
                    if (cmp) openComparison(cmp);
                    else showToast("No comparison available for this topic yet.");
                  }}
                  onToast={showToast}
                />
              )}
            </>
          )}

          {workspace === "process" && selectedProcessId && getProcessById(selectedProcessId) && (
            <ProcessViewer
              process={getProcessById(selectedProcessId)!}
              courseLevel={courseLevel}
              onComplete={(id) => setProgress((p) => recordProcessCompleted(p, id))}
            />
          )}

          {workspace === "practical" && selectedPracticalId && getPracticalById(selectedPracticalId) && (
            <PracticalPanel
              practical={getPracticalById(selectedPracticalId)!}
              onComplete={(id) => {
                setProgress((p) => recordPracticalCompleted(p, id));
                showToast("Practical marked as reviewed.");
              }}
            />
          )}

          {workspace === "comparison" && selectedComparisonId && getComparisonById(selectedComparisonId) && (
            <ComparisonView
              comparison={getComparisonById(selectedComparisonId)!}
              onOpenQuestion={openSingleQuestion}
              onSave={() => {
                const c = getComparisonById(selectedComparisonId)!;
                setNotes(saveVisualNote(`compare:${c.id}`, `${c.title}\n${c.examSummary}`));
                showToast("Saved comparison summary to notes.");
              }}
            />
          )}
        </div>

        {workspace === "visual" ? (
          <StudyPanel
            visual={selectedVisual}
            topic={topic}
            structures={selectedVisual.structures}
            activeStructureId={activeStructureId}
            onSelectStructure={selectStructure}
            studyMode={studyMode}
            isFavorite={favorites.has(selectedVisualId)}
            onToggleFavorite={() => toggleFavorite(selectedVisualId)}
            notes={notes[selectedVisualId] ?? ""}
            onNotesChange={updateNote}
            onOpenPractical={openPractical}
            onOpenQuestions={() => topic && openTopicQuestions(topic.id)}
          />
        ) : (
          topic && (
            <TopicAside
              topic={topic}
              courseLevel={courseLevel}
              progress={progress}
              onOpenQuestions={() => openTopicQuestions(topic.id)}
            />
          )
        )}
      </div>

      {runner && (
        <div className="quiz-layer igb-quiz-layer">
          <QuestionRunner
            title={runner.title}
            questions={runner.questions}
            courseLevel={courseLevel}
            onResult={recordAnswer}
            onClose={() => setRunner(null)}
          />
        </div>
      )}

      {overlays.isOpen("quiz") && (
        <Suspense fallback={<div className="quiz-layer quiz-loading">Loading quiz…</div>}>
          <SpecimenQuiz
            onExit={() => overlays.close()}
            onStudySpecimen={(id) => {
              const v = biologyVisuals.find((bv) => bv.specimenId === id);
              if (v) openVisual(v.id);
              overlays.close();
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
        title="Specimen gallery"
        subtitle={`Browse all ${cells.length} 3D specimens`}
        open={overlays.isOpen("gallery")}
        searchable
        selectedId={specimen?.id ?? ""}
        sections={[{ label: "All specimens", items: cells }]}
        onSelect={(id) => {
          const v = biologyVisuals.find((bv) => bv.specimenId === id);
          if (v) openVisual(v.id);
          overlays.close();
        }}
        onClose={() => overlays.close()}
      />

      <SpecimenGridModal
        title="Your library"
        subtitle="Favourite and recently explored specimens"
        open={overlays.isOpen("library")}
        selectedId={specimen?.id ?? ""}
        sections={[
          {
            label: "Specimens",
            items: cells,
          },
        ]}
        onSelect={(id) => {
          const v = biologyVisuals.find((bv) => bv.specimenId === id);
          if (v) openVisual(v.id);
          overlays.close();
        }}
        onClose={() => overlays.close()}
      />

      <NotebooksModal
        open={overlays.isOpen("notebooks")}
        currentCell={headerCell}
        onSelect={(id) => {
          const v = biologyVisuals.find((bv) => bv.specimenId === id);
          if (v) openVisual(v.id);
        }}
        onClose={() => overlays.close()}
      />

      <FlashcardsModal
        open={overlays.isOpen("flashcards")}
        onClose={() => overlays.close()}
        onStudySpecimen={(id) => {
          const v = biologyVisuals.find((bv) => bv.specimenId === id);
          if (v) openVisual(v.id);
        }}
      />

      <AchievementsPanel open={overlays.isOpen("achievements")} progress={xp} onClose={() => overlays.close()} />
      <ShortcutsHelp open={overlays.isOpen("shortcuts")} onClose={() => overlays.close()} />
      <WelcomeTour
        open={overlays.isOpen("welcome")}
        onClose={() => {
          overlays.close();
          try {
            localStorage.setItem(STORAGE_KEYS.onboarded, "1");
          } catch {
            /* ignore */
          }
        }}
      />

      <CelebrationBanner celebration={banner} />
      <Confetti fireKey={confettiKey} />
      <Toast message={toast} />
    </div>
  );
}
