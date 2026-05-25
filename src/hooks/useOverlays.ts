import { useCallback, useState } from "react";

// Every full-screen modal/overlay in the app. Only one is open at a time, so a
// single piece of state replaces a pile of independent booleans.
export type OverlayId =
  | "quiz"
  | "about"
  | "gallery"
  | "library"
  | "notebooks"
  | "flashcards"
  | "achievements"
  | "comparison"
  | "shortcuts"
  | "welcome";

export function useOverlays() {
  const [active, setActive] = useState<OverlayId | null>(null);
  const open = useCallback((id: OverlayId) => setActive(id), []);
  const close = useCallback(() => setActive(null), []);
  const isOpen = useCallback((id: OverlayId) => active === id, [active]);
  return { active, open, close, isOpen };
}
