import { useEffect } from "react";

export type ShortcutHandlers = {
  onPrev: () => void;
  onNext: () => void;
  onFavorite: () => void;
  onReset: () => void;
  onToggleRotate: () => void;
  onSurprise: () => void;
  onGallery: () => void;
  onLibrary: () => void;
  onFlashcards: () => void;
  onQuiz: () => void;
  onHelp: () => void;
};

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

// Global studio shortcuts. Disabled while an overlay is open (`enabled=false`)
// and ignored while the user is typing in a field.
export function useKeyboardShortcuts(enabled: boolean, handlers: ShortcutHandlers) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const map: Record<string, () => void> = {
        ArrowLeft: handlers.onPrev,
        ArrowRight: handlers.onNext,
        f: handlers.onFavorite,
        r: handlers.onReset,
        " ": handlers.onToggleRotate,
        s: handlers.onSurprise,
        g: handlers.onGallery,
        l: handlers.onLibrary,
        c: handlers.onFlashcards,
        q: handlers.onQuiz,
        "?": handlers.onHelp,
      };
      const action = map[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, handlers]);
}
