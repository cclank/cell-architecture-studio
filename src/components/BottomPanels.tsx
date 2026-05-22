import { ArrowRight, Info, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { getCellById, type CellItem } from "../data/cells";
import { MiniCell } from "./MiniCell";

type BottomPanelsProps = {
  cell: CellItem;
  onCompare: () => void;
  onToast: (message: string) => void;
};

export function BottomPanels({ cell, onCompare, onToast }: BottomPanelsProps) {
  const comparedCell = getCellById(cell.comparison);

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
          <button
            type="button"
            className="micro-card add-card"
            onClick={() => onToast("Image upload is a planned step.")}
          >
            <Plus size={28} />
            <strong>Add Image</strong>
          </button>
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
