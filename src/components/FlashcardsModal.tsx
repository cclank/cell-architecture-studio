import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, RotateCw, Shuffle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CELL_CATEGORY_ORDER,
  categorize,
  type CellCategory,
  type CellItem,
} from "../data/cells";
import { useResolvedCells } from "../i18n/resolveCell";
import { Modal } from "./Modal";

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
  const { t } = useTranslation(["common", "cells"]);
  const resolved = useResolvedCells();
  const deckBase = useMemo(() => resolved.filter((c) => c.renderImage), [resolved]);
  const categoryFilters: ("All" | CellCategory)[] = useMemo(
    () => [
      "All",
      ...CELL_CATEGORY_ORDER.filter((category) =>
        deckBase.some((cell) => categorize(cell) === category),
      ),
    ],
    [deckBase],
  );

  const [category, setCategory] = useState<"All" | CellCategory>("All");
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    void seed;
    const pool = category === "All" ? deckBase : deckBase.filter((c) => categorize(c) === category);
    return shuffle(pool.length > 0 ? pool : deckBase);
  }, [category, seed, deckBase]);

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

  function categoryLabel(c: "All" | CellCategory) {
    return c === "All" ? t("strip.all") : t(`categories.${c}`, { ns: "cells" });
  }

  return (
    <Modal open={open} onClose={onClose} label={t("flashcards.label")} panelClassName="browser-modal flashcards-modal">
      <div className="browser-head">
        <div>
          <h3>
            <BookOpen size={20} /> {t("flashcards.title")}
          </h3>
          <p>{t("flashcards.subtitle", { index: index + 1, total: deck.length })}</p>
        </div>
        <button type="button" className="quiz-secondary" onClick={reshuffle}>
          <Shuffle size={15} /> {t("flashcards.shuffle")}
        </button>
      </div>

      <div className="fc-chips">
        {categoryFilters.map((c) => (
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
            {categoryLabel(c)}
          </button>
        ))}
      </div>

      {card && (
        <button
          type="button"
          className={`flashcard ${flipped ? "is-flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? t("flashcards.showImage") : t("flashcards.reveal")}
        >
          <span className="flashcard-inner">
            <span className="flashcard-face flashcard-front">
              <img src={card.renderImage!.url} alt="" aria-hidden="true" />
              <span className="flashcard-hint">
                <RotateCw size={14} /> {t("flashcards.hint")}
              </span>
            </span>
            <span className="flashcard-face flashcard-back">
              <strong>{card.name}</strong>
              <em>{card.type}</em>
              {organelle && <p className="flashcard-note">{organelle.note}</p>}
              <span className="flashcard-where">
                {t("flashcards.occurs", { place: card.occurrence.title })}
              </span>
            </span>
          </span>
        </button>
      )}

      <div className="fc-controls">
        <button type="button" className="quiz-secondary" onClick={() => go(-1)} aria-label={t("flashcards.previousAria")}>
          <ArrowLeft size={16} /> {t("flashcards.prev")}
        </button>
        <button type="button" className="quiz-primary" onClick={() => setFlipped((f) => !f)}>
          {flipped ? t("flashcards.showImage") : t("flashcards.flip")}
        </button>
        <button type="button" className="quiz-secondary" onClick={() => go(1)} aria-label={t("flashcards.nextAria")}>
          {t("flashcards.next")} <ArrowRight size={16} />
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
          {t("flashcards.study", { name: card.name })}
        </button>
      )}
    </Modal>
  );
}
