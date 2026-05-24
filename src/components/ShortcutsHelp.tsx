import { Keyboard, X } from "lucide-react";
import { useEscapeToClose } from "../hooks/useEscapeToClose";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["←", "→"], label: "Previous / next specimen" },
  { keys: ["F"], label: "Toggle favorite" },
  { keys: ["R"], label: "Reset the 3D view" },
  { keys: ["Space"], label: "Toggle auto-rotate" },
  { keys: ["S"], label: "Surprise — random specimen" },
  { keys: ["G"], label: "Open Gallery" },
  { keys: ["L"], label: "Open Library" },
  { keys: ["C"], label: "Open Flashcards" },
  { keys: ["Q"], label: "Start a Quiz" },
  { keys: ["?"], label: "Show this help" },
  { keys: ["Esc"], label: "Close any panel" },
];

export function ShortcutsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEscapeToClose(open, onClose);
  if (!open) return null;
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="browser-modal shortcuts-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="browser-head">
          <div>
            <h3>
              <Keyboard size={20} /> Keyboard shortcuts
            </h3>
            <p>Work faster without leaving the keyboard.</p>
          </div>
        </div>
        <ul className="shortcuts-list">
          {SHORTCUTS.map((s) => (
            <li key={s.label}>
              <span className="shortcut-keys">
                {s.keys.map((k) => (
                  <kbd key={k}>{k}</kbd>
                ))}
              </span>
              <span className="shortcut-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
