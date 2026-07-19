import type { CellItem } from "../data/cells";

type Notify = (message: string) => void;

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function triggerDownload(href: string, filename: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function captureScreenshot(cell: CellItem, onToast: Notify): void {
  const canvas = document.querySelector<HTMLCanvasElement>(".canvas-wrap canvas");
  if (!canvas) {
    onToast("Stage not ready — try again.");
    return;
  }
  try {
    const url = canvas.toDataURL("image/png");
    triggerDownload(url, `${slugify(cell.name)}.png`);
    onToast(`Saved ${cell.name}.png`);
  } catch {
    onToast("Screenshot failed — canvas blocked.");
  }
}

export function toggleFullscreen(onToast: Notify): void {
  const el = document.querySelector<HTMLElement>(".canvas-wrap");
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen()
      .then(() => onToast("Fullscreen — press Esc to exit."))
      .catch(() => onToast("Fullscreen blocked by browser."));
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

export async function exportGlb(cell: CellItem, onToast: Notify): Promise<void> {
  const url = cell.modelAsset?.url;
  if (!url) {
    onToast(`${cell.name} has no downloadable model.`);
    return;
  }
  onToast(`Preparing ${cell.name} model…`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, `${slugify(cell.name)}.glb`);
    URL.revokeObjectURL(objectUrl);
    onToast(`Downloaded ${cell.name}.glb`);
  } catch {
    onToast("Model download failed.");
  }
}
