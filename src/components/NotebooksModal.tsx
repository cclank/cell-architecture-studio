import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { getCellById, type CellItem } from "../data/cells";
import { useEscapeToClose } from "../hooks/useEscapeToClose";
import { loadNotes, saveNote, type NotesMap } from "../lib/storage";
import { MiniCell } from "./MiniCell";

type NotebooksModalProps = {
  open: boolean;
  currentCell: CellItem;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function NotebooksModal({ open, currentCell, onSelect, onClose }: NotebooksModalProps) {
  const [notes, setNotes] = useState<NotesMap>(() => loadNotes());
  const [draft, setDraft] = useState(() => loadNotes()[currentCell.id] ?? "");
  useEscapeToClose(open, onClose);

  if (!open) return null;

  const otherNoteIds = Object.keys(notes).filter((id) => id !== currentCell.id && notes[id]?.trim());

  function persist() {
    setNotes(saveNote(currentCell.id, draft));
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Notebooks">
      <div className="browser-modal notebooks-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="browser-head">
          <div>
            <h3>
              <BookOpen size={20} /> Notebooks
            </h3>
            <p>Personal notes saved in your browser, per specimen.</p>
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
            placeholder={`Write notes about ${currentCell.name}…`}
            aria-label={`Notes for ${currentCell.name}`}
          />
          <div className="notebook-actions">
            <button type="button" className="quiz-primary" onClick={persist}>
              Save note
            </button>
            <button
              type="button"
              className="quiz-secondary"
              onClick={() => {
                setDraft("");
                setNotes(saveNote(currentCell.id, ""));
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {otherNoteIds.length > 0 && (
          <div className="browser-section">
            <div className="browser-section-title">
              Other notes
              <span className="browser-section-count">{otherNoteIds.length}</span>
            </div>
            <div className="notebook-list">
              {otherNoteIds.map((id) => {
                const cell = getCellById(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className="notebook-list-item"
                    onClick={() => {
                      onSelect(id);
                      onClose();
                    }}
                    title={`Open ${cell.name}`}
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
      </div>
    </div>
  );
}
