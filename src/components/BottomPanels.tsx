import { ArrowRight, Info, Plus, X } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import type { CellItem } from "../data/cells";
import { useResolvedCell } from "../i18n/resolveCell";
import { MiniCell } from "./MiniCell";

type BottomPanelsProps = {
  cell: CellItem;
  onCompare: () => void;
  onToast: (message: string) => void;
};

type UploadedImage = { id: string; url: string; label: string };

export function BottomPanels({ cell, onCompare, onToast }: BottomPanelsProps) {
  const { t } = useTranslation("common");
  const comparedCell = useResolvedCell(cell.comparison);
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const added: UploadedImage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      added.push({
        id: `${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        label: file.name.replace(/\.[^.]+$/, "").slice(0, 18) || t("bottom.fallbackImage"),
      });
    }
    if (added.length === 0) {
      onToast(t("toast.chooseImage"));
      return;
    }
    setUploads((prev) => [...prev, ...added]);
    onToast(t("toast.addedImages", { count: added.length }));
  }

  function removeUpload(id: string) {
    setUploads((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((u) => u.id !== id);
    });
    onToast(t("toast.removedImage"));
  }

  return (
    <section className="bottom-grid">
      <div className="panel microscope-panel">
        <div className="panel-heading">
          <span>
            {t("bottom.microscope")}
            <Info size={16} />
          </span>
        </div>
        <div className="micro-card-row">
          {cell.microscope.map((image) => (
            <button
              type="button"
              key={image.pattern}
              className={`micro-card pattern-${image.pattern}`}
              style={{ "--micro": image.tone } as CSSProperties}
              onClick={() => onToast(t("toast.microSelected", { label: image.label }))}
            >
              <span />
              <strong>{image.label}</strong>
            </button>
          ))}
          {uploads.map((image) => (
            <div key={image.id} className="micro-card micro-card-upload">
              <img src={image.url} alt={image.label} />
              <strong>{image.label}</strong>
              <button
                type="button"
                className="micro-card-remove"
                aria-label={t("bottom.removeImage", { label: image.label })}
                onClick={() => removeUpload(image.id)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="micro-card add-card"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus size={28} />
            <strong>{t("bottom.addImage")}</strong>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="panel compare-panel">
        <div className="panel-heading">
          <span>
            {t("bottom.compare")}
            <Info size={16} />
          </span>
        </div>
        <div className="compare-row">
          <div>
            <MiniCell cell={cell} />
            <span>
              <strong>{cell.name}</strong>
              <em>{t("bottom.youAreHere")}</em>
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
          {t("bottom.openComparison")}
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
