import { ArrowRight, Info, Plus, X } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { getCellById, type CellItem } from "../data/cells";
import { MiniCell } from "./MiniCell";

type BottomPanelsProps = {
  cell: CellItem;
  onCompare: () => void;
  onToast: (message: string) => void;
};

type UploadedImage = { id: string; url: string; label: string };

export function BottomPanels({ cell, onCompare, onToast }: BottomPanelsProps) {
  const comparedCell = getCellById(cell.comparison);
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
        label: file.name.replace(/\.[^.]+$/, "").slice(0, 18) || "Image",
      });
    }
    if (added.length === 0) {
      onToast("Please choose an image file.");
      return;
    }
    setUploads((prev) => [...prev, ...added]);
    onToast(`Added ${added.length} microscope image${added.length > 1 ? "s" : ""}.`);
  }

  function removeUpload(id: string) {
    setUploads((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((u) => u.id !== id);
    });
    onToast("Removed image.");
  }

  return (
    <section className="bottom-grid">
      <div className="panel microscope-panel">
        <div className="panel-heading">
          <span>
            Microscope View
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
              onClick={() => onToast(`${image.label} selected.`)}
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
                aria-label={`Remove ${image.label}`}
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
            <strong>Add Image</strong>
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
            Compare Cells
            <Info size={16} />
          </span>
        </div>
        <div className="compare-row">
          <div>
            <MiniCell cell={cell} />
            <span>
              <strong>{cell.name}</strong>
              <em>You are here</em>
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
          Open Comparison View
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
