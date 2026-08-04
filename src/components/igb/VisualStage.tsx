import { Box, CircleDot, Maximize, RotateCcw } from "lucide-react";
import type { CellItem, ViewMode } from "../../data/cells";
import type { BiologyVisual } from "../../data/curriculum/types";
import { captureScreenshot, toggleFullscreen } from "../../lib/download";
import { CellScene } from "../CellScene";
import { ErrorBoundary } from "../ErrorBoundary";
import { GraphViewer } from "./GraphViewer";
import { DichotomousKey } from "./DichotomousKey";

function PosterFallback({ visual }: { visual: BiologyVisual }) {
  return (
    <div className="igb-fallback igb-poster-fallback">
      {visual.posterUrl ? (
        <img src={visual.posterUrl} alt={visual.textAlternative} className="igb-poster" />
      ) : (
        <div className="igb-poster igb-poster-empty" role="img" aria-label={visual.textAlternative} />
      )}
      <p className="igb-fallback-note">
        Showing a poster preview — the interactive 3D view is unavailable here. Use the structure list on
        the right to explore its parts.
      </p>
    </div>
  );
}

type Props = {
  visual: BiologyVisual;
  specimen: CellItem | undefined;
  activeStructureId: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  resetKey: number;
  labelsVisible: boolean;
  onModeChange: (m: ViewMode) => void;
  onCrossSectionChange: (v: boolean) => void;
  onAutoRotateChange: (v: boolean) => void;
  onReset: () => void;
  onToast: (m: string) => void;
};

// Central viewer that adapts to the visual's format. A 3D model reuses the
// existing CellScene; graphs, calculators, simulations and to-be-built models
// fall back to purpose-built interactives or a poster — never a blank canvas.
export function VisualStage({
  visual,
  specimen,
  activeStructureId,
  viewMode,
  crossSection,
  autoRotate,
  resetKey,
  labelsVisible,
  onModeChange,
  onCrossSectionChange,
  onAutoRotateChange,
  onReset,
  onToast,
}: Props) {
  const is3D = Boolean(specimen);

  return (
    <section className="stage-panel">
      <div className="stage-title">
        <div className="stage-title-copy">
          <h2>{visual.title}</h2>
          <p>{visual.subtitle}</p>
        </div>
        {is3D && (
          <div className="view-card">
            <span>View Mode</span>
            <div className="mode-switcher">
              <button
                type="button"
                className={viewMode === "mesh" ? "is-active" : ""}
                onClick={() => onModeChange("mesh")}
                title="Mesh"
              >
                <Box size={22} />
              </button>
              <button
                type="button"
                className={viewMode === "focus" ? "is-active" : ""}
                onClick={() => onModeChange("focus")}
                title="Focus"
              >
                <CircleDot size={22} />
              </button>
            </div>
            <label className="toggle-line">
              <span>Cross Section</span>
              <input
                type="checkbox"
                checked={crossSection}
                onChange={(e) => onCrossSectionChange(e.target.checked)}
              />
              <i />
            </label>
          </div>
        )}
      </div>

      <div className="canvas-wrap">
        {is3D && specimen ? (
          <ErrorBoundary resetKey={visual.id} fallback={<PosterFallback visual={visual} />}>
            <CellScene
              cell={specimen}
              activeOrganelle={activeStructureId}
              viewMode={viewMode}
              crossSection={crossSection}
              autoRotate={autoRotate}
              resetKey={resetKey}
            />
          </ErrorBoundary>
        ) : visual.format === "GRAPH" ? (
          <div className="igb-fallback">
            <GraphViewer slug={visual.slug} />
          </div>
        ) : visual.slug === "dichotomous-key" ? (
          <div className="igb-fallback">
            <DichotomousKey />
          </div>
        ) : (
          <div className="igb-fallback igb-poster-fallback">
            {visual.posterUrl ? (
              <img src={visual.posterUrl} alt={visual.textAlternative} className="igb-poster" />
            ) : (
              <div className="igb-poster igb-poster-empty" role="img" aria-label={visual.textAlternative} />
            )}
            <p className="igb-fallback-note">
              {visual.assetStatus === "PLACEHOLDER" || visual.assetStatus === "CONCEPT"
                ? "Interactive 3D model in production — showing a poster preview. Use the structure list on the right to explore its parts."
                : "Poster preview."}
            </p>
          </div>
        )}
      </div>

      {is3D && (
        <>
          <div className="stage-toolbar">
            <button
              type="button"
              className={autoRotate ? "is-active" : ""}
              onClick={() => onAutoRotateChange(!autoRotate)}
            >
              <RotateCcw size={20} /> Rotate
            </button>
            <button
              type="button"
              className={viewMode === "focus" ? "is-active" : ""}
              onClick={() => onModeChange(viewMode === "focus" ? "mesh" : "focus")}
            >
              <CircleDot size={20} /> {viewMode === "focus" ? "Show all" : "Isolate"}
            </button>
            <button type="button" onClick={onReset}>
              <RotateCcw size={20} /> Reset View
            </button>
            <button type="button" onClick={() => toggleFullscreen(onToast)}>
              <Maximize size={20} /> Fullscreen
            </button>
          </div>
          <div className="export-toolbar">
            <button type="button" onClick={() => specimen && captureScreenshot(specimen, onToast)}>
              <Box size={20} /> Screenshot
            </button>
            <span className={`igb-label-state ${labelsVisible ? "is-on" : "is-off"}`}>
              Labels {labelsVisible ? "shown" : "hidden (exam)"}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
