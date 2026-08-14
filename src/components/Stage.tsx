import { Box, Camera, CircleDot, EyeOff, Maximize, RotateCcw, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CellItem, ViewMode } from "../data/cells";
import { captureScreenshot, exportGlb, toggleFullscreen } from "../lib/download";
import { CellScene } from "./CellScene";

type ModeOption = { id: ViewMode; labelKey: "mesh" | "focus"; Icon: LucideIcon };

const modeOptions: ModeOption[] = [
  { id: "mesh", labelKey: "mesh", Icon: Box },
  { id: "focus", labelKey: "focus", Icon: CircleDot },
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
  const { t } = useTranslation("common");

  return (
    <main className="stage-column">
      <section className="stage-panel">
        <div className="stage-title">
          <div key={cell.id} className="stage-title-copy">
            <h2>{cell.name}</h2>
            <p>{cell.type}</p>
          </div>

          <div className="view-card">
            <span>{t("stage.viewMode")}</span>
            <div className="mode-switcher">
              {modeOptions.map(({ id, labelKey, Icon }) => {
                const label = t(`stage.${labelKey}`);
                return (
                  <button
                    key={id}
                    type="button"
                    className={viewMode === id ? "is-active" : ""}
                    onClick={() => {
                      if (viewMode === id) {
                        onToast(t("toast.modeAlready", { label }));
                      } else {
                        onModeChange(id);
                        onToast(t("toast.modeEnabled", { label }));
                      }
                    }}
                    title={label}
                  >
                    <Icon size={22} />
                  </button>
                );
              })}
            </div>
            <label className="toggle-line">
              <span>{t("stage.crossSection")}</span>
              <input
                type="checkbox"
                checked={crossSection}
                onChange={(event) => {
                  onCrossSectionChange(event.target.checked);
                  onToast(event.target.checked ? t("toast.crossOn") : t("toast.crossOff"));
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
              onToast(next ? t("toast.rotateOn") : t("toast.rotateOff"));
            }}
          >
            <RotateCcw size={20} />
            {t("stage.rotate")}
          </button>
          <button
            type="button"
            className={viewMode === "focus" ? "is-active" : ""}
            onClick={() => {
              onModeChange("focus");
              onToast(
                viewMode === "focus"
                  ? t("toast.isolatingAgain", { name: cell.name })
                  : t("toast.isolatedFocus", { name: cell.name }),
              );
            }}
          >
            <CircleDot size={20} />
            {t("stage.isolate")}
          </button>
          <button
            type="button"
            className={viewMode === "focus" ? "is-active" : ""}
            onClick={() => {
              onModeChange("focus");
              onToast(t("toast.hideOthers"));
            }}
          >
            <EyeOff size={20} />
            {t("stage.hideOthers")}
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            {t("stage.resetView")}
          </button>
          <button type="button" onClick={() => toggleFullscreen(onToast)}>
            <Maximize size={20} />
            {t("stage.fullscreen")}
          </button>
        </div>

        <div className="export-toolbar">
          <button type="button" onClick={() => captureScreenshot(cell, onToast)}>
            <Camera size={20} />
            {t("stage.screenshot")}
          </button>
          <button type="button" onClick={() => exportGlb(cell, onToast)}>
            <Box size={20} />
            {t("stage.glbExport")}
          </button>
        </div>
      </section>
    </main>
  );
}
