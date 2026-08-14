import type { CellItem } from "../data/cells";
import i18n from "../i18n";

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

function fileStem(cell: CellItem): string {
  return slugify(cell.id);
}

export function captureScreenshot(cell: CellItem, onToast: Notify): void {
  const canvas = document.querySelector<HTMLCanvasElement>(".canvas-wrap canvas");
  if (!canvas) {
    onToast(i18n.t("toast.stageNotReady", { ns: "common" }));
    return;
  }
  try {
    const url = canvas.toDataURL("image/png");
    triggerDownload(url, `${fileStem(cell)}.png`);
    onToast(i18n.t("toast.savedPng", { ns: "common", name: cell.name }));
  } catch {
    onToast(i18n.t("toast.screenshotFailed", { ns: "common" }));
  }
}

export function toggleFullscreen(onToast: Notify): void {
  const el = document.querySelector<HTMLElement>(".canvas-wrap");
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen()
      .then(() => onToast(i18n.t("toast.fullscreenOn", { ns: "common" })))
      .catch(() => onToast(i18n.t("toast.fullscreenBlocked", { ns: "common" })));
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

export async function exportGlb(cell: CellItem, onToast: Notify): Promise<void> {
  const url = cell.modelAsset?.url;
  if (!url) {
    onToast(i18n.t("toast.noModel", { ns: "common", name: cell.name }));
    return;
  }
  onToast(i18n.t("toast.preparingModel", { ns: "common", name: cell.name }));
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, `${fileStem(cell)}.glb`);
    URL.revokeObjectURL(objectUrl);
    onToast(i18n.t("toast.downloadedGlb", { ns: "common", name: cell.name }));
  } catch {
    onToast(i18n.t("toast.modelFailed", { ns: "common" }));
  }
}
