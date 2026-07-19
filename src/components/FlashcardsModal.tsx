import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, RotateCw, Shuffle } from "lucide-react";
import {
  CELL_CATEGORY_ORDER,
  categorize,
  cells,
  type CellCategory,
  type CellItem,
} from "../data/cells";
import { Modal } from "./Modal";

const DECK_BASE = cells.filter((c) => c.renderImage);
const CATEGORY_FILTERS: ("All" | CellCategory)[] = [
  "All",
  ...CELL_CATEGORY_ORDER.filter((category) =>
    DECK_BASE.some((cell) => categorize(cell) === category),
  ),
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashcardsModal({
  open,
  onClose,
  onStudySpecimen,
}: {
  open: boolean;
  onClose: () => void;
  onStudySpecimen: (id: string) => void;
}) {
  const [category, setCategory] = useState<"All" | CellCategory>("All");
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    void seed;
    const pool = category === "All" ? DECK_BASE : DECK_BASE.filter((c) => categorize(c) === category);
    return shuffle(pool.length > 0 ? pool : DECK_BASE);
  }, [category, seed]);

  const card: CellItem | undefined = deck[index];
  const organelle = card?.organelles[0];

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + deck.length) % deck.length);
  }

  function reshuffle() {
    setFlipped(false);
    setIndex(0);
    setSeed((s) => s + 1);
  }

  return (
    <Modal open={open} onClose={onClose} label="Flashcards" panelClassName="browser-modal flashcards-modal">
        <div className="browser-head">
          <div>
            <h3>
              <BookOpen size={20} /> Flashcards
            </h3>
            <p>Tap the card to reveal the answer · {index + 1} / {deck.length}</p>
          </div>
          <button type="button" className="quiz-secondary" onClick={reshuffle}>
            <Shuffle size={15} /> Shuffle
          </button>
        </div>

        <div className="fc-chips">
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              className={`quiz-chip ${category === c ? "is-active" : ""}`}
              onClick={() => {
                setCategory(c);
                setIndex(0);
                setFlipped(false);
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {card && (
          <button
            type="button"
            className={`flashcard ${flipped ? "is-flipped" : ""}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Show image" : "Reveal answer"}
          >
            <span className="flashcard-inner">
              <span className="flashcard-face flashcard-front">
                <img src={card.renderImage!.url} alt="" aria-hidden="true" />
                <span className="flashcard-hint">
                  <RotateCw size={14} /> What specimen is this?
                </span>
              </span>
              <span className="flashcard-face flashcard-back">
                <strong>{card.name}</strong>
                <em>{card.type}</em>
                {organelle && <p className="flashcard-note">{organelle.note}</p>}
                <span className="flashcard-where">Occurs in: {card.occurrence.title}</span>
              </span>
            </span>
          </button>
        )}

        <div className="fc-controls">
          <button type="button" className="quiz-secondary" onClick={() => go(-1)} aria-label="Previous">
            <ArrowLeft size={16} /> Prev
          </button>
          <button type="button" className="quiz-primary" onClick={() => setFlipped((f) => !f)}>
            {flipped ? "Show image" : "Flip card"}
          </button>
          <button type="button" className="quiz-secondary" onClick={() => go(1)} aria-label="Next">
            Next <ArrowRight size={16} />
          </button>
        </div>

        {card && (
          <button
            type="button"
            className="fc-study-link"
            onClick={() => {
              onStudySpecimen(card.id);
              onClose();
            }}
          >
            Open {card.name} in the studio →
          </button>
        )}
    </Modal>
  );
}
