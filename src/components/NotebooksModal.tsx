import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CellItem } from "../data/cells";
import { useResolvedCells } from "../i18n/resolveCell";
import { loadNotes, saveNote, type NotesMap } from "../lib/storage";
import { MiniCell } from "./MiniCell";
import { Modal } from "./Modal";

type NotebooksModalProps = {
  open: boolean;
  currentCell: CellItem;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function NotebooksModal({ open, currentCell, onSelect, onClose }: NotebooksModalProps) {
  const { t } = useTranslation("common");
  const resolved = useResolvedCells();
  const [notes, setNotes] = useState<NotesMap>(() => loadNotes());
  const [draft, setDraft] = useState(() => loadNotes()[currentCell.id] ?? "");

  useEffect(() => {
    setDraft(notes[currentCell.id] ?? "");
  }, [currentCell.id, notes]);

  const otherNoteIds = Object.keys(notes).filter((id) => id !== currentCell.id && notes[id]?.trim());

  function persist() {
    setNotes(saveNote(currentCell.id, draft));
  }

  return (
    <Modal open={open} onClose={onClose} label={t("notebooks.label")} panelClassName="browser-modal notebooks-modal">
      <div className="browser-head">
        <div>
          <h3>
            <BookOpen size={20} /> {t("notebooks.title")}
          </h3>
          <p>{t("notebooks.subtitle")}</p>
        </div>
      </div>

      <div className="notebook-editor">
        <div className="notebook-editor-head">
          <MiniCell cell={currentCell} />
          <div>
            <strong>{currentCell.name}</strong>
            <span>{currentCell.type}</span>
          </div>
        </div>
        <textarea
          className="notebook-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={persist}
          placeholder={t("notebooks.placeholder", { name: currentCell.name })}
          aria-label={t("notebooks.aria", { name: currentCell.name })}
        />
        <div className="notebook-actions">
          <button type="button" className="quiz-primary" onClick={persist}>
            {t("notebooks.save")}
          </button>
          <button
            type="button"
            className="quiz-secondary"
            onClick={() => {
              setDraft("");
              setNotes(saveNote(currentCell.id, ""));
            }}
          >
            {t("notebooks.clear")}
          </button>
        </div>
      </div>

      {otherNoteIds.length > 0 && (
        <div className="browser-section">
          <div className="browser-section-title">
            {t("notebooks.other")}
            <span className="browser-section-count">{otherNoteIds.length}</span>
          </div>
          <div className="notebook-list">
            {otherNoteIds.map((id) => {
              const cell = resolved.find((c) => c.id === id);
              if (!cell) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="notebook-list-item"
                  onClick={() => {
                    onSelect(id);
                    onClose();
                  }}
                  title={t("notebooks.open", { name: cell.name })}
                >
                  <MiniCell cell={cell} />
                  <span className="notebook-list-copy">
                    <strong>{cell.name}</strong>
                    <span>{notes[id]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
