import { useState, type CSSProperties } from "react";
import type { CellItem } from "../data/cells";

export function MiniCell({ cell }: { cell: CellItem }) {
  const [imageBroken, setImageBroken] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const previewUrl = cell.renderImage?.url ?? cell.modelAsset?.previewUrl;

  if (previewUrl && !imageBroken) {
    return (
      <span
        className={`mini-cell has-preview ${imageLoaded ? "is-loaded" : "is-loading"}`}
        style={{ "--thumb": cell.accent, background: cell.accentSoft } as CSSProperties}
      >
        <img
          src={previewUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageBroken(true)}
        />
      </span>
    );
  }

  return (
    <span
      className="mini-cell mini-cell-fallback"
      style={{
        "--thumb": cell.accent,
        background: `linear-gradient(135deg, ${cell.accent}, ${cell.color})`,
      } as CSSProperties}
    >
      <span />
      <i />
      <b />
    </span>
  );
}
