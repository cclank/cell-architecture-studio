import { Box, Camera, CircleDot, EyeOff, Maximize, RotateCcw, type LucideIcon } from "lucide-react";
import type { CellItem, ViewMode } from "../data/cells";
import { captureScreenshot, exportGlb, toggleFullscreen } from "../lib/download";
import { CellScene } from "./CellScene";

type ModeOption = { id: ViewMode; label: string; Icon: LucideIcon };

const modeOptions: ModeOption[] = [
  { id: "mesh", label: "Mesh", Icon: Box },
  { id: "focus", label: "Focus", Icon: CircleDot },
];

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

export function Stage({
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
                  onToast(event.target.checked ? "Cross section enabled." : "Cross section disabled.");
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
