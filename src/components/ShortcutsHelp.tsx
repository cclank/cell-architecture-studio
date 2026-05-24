import { Keyboard } from "lucide-react";
import { Modal } from "./Modal";

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
  return (
    <Modal open={open} onClose={onClose} label="Keyboard shortcuts" panelClassName="browser-modal shortcuts-modal">
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
    </Modal>
  );
}
