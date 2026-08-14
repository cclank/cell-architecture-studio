import { Keyboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";

const SHORTCUT_KEYS: string[][] = [
  ["←", "→"],
  ["F"],
  ["R"],
  ["Space"],
  ["S"],
  ["G"],
  ["L"],
  ["C"],
  ["Q"],
  ["?"],
  ["Esc"],
];

export function ShortcutsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation("common");
  const labels = t("shortcuts.items", { returnObjects: true }) as string[];

  return (
    <Modal open={open} onClose={onClose} label={t("shortcuts.label")} panelClassName="browser-modal shortcuts-modal">
      <div className="browser-head">
        <div>
          <h3>
            <Keyboard size={20} /> {t("shortcuts.title")}
          </h3>
          <p>{t("shortcuts.subtitle")}</p>
        </div>
      </div>
      <ul className="shortcuts-list">
        {SHORTCUT_KEYS.map((keys, index) => (
          <li key={keys.join("-")}>
            <span className="shortcut-keys">
              {keys.map((k) => (
                <kbd key={k}>{k}</kbd>
              ))}
            </span>
            <span className="shortcut-label">{labels[index] ?? ""}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
