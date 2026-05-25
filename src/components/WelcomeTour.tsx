import { useState } from "react";
import { Gamepad2, Keyboard, Layers, Sparkles, type LucideIcon } from "lucide-react";
import { Modal } from "./Modal";

type Step = { Icon: LucideIcon; title: string; body: string };

const STEPS: Step[] = [
  {
    Icon: Sparkles,
    title: "Welcome to Cell Architecture Studio",
    body: "Explore 272 interactive 3D specimens — cells, organs, bones, viruses, macromolecules and botanical scans — rendered in your browser.",
  },
  {
    Icon: Layers,
    title: "Browse & study",
    body: "Search the strip at the top, open the Gallery for the full grid, save favorites, and flip through Flashcards to learn names and notes.",
  },
  {
    Icon: Gamepad2,
    title: "Test yourself",
    body: "Play the Quiz in casual, timed, type-it or survival mode. Build streaks, earn XP, level up and unlock achievements. Come back daily for a bonus.",
  },
  {
    Icon: Keyboard,
    title: "Pro tips",
    body: "Press ? anytime for keyboard shortcuts (arrows switch specimens). Pick your accent colour from the avatar menu. Have fun!",
  },
];

export function WelcomeTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { Icon } = current;

  function finish() {
    setStep(0);
    onClose();
  }

  return (
    <Modal open={open} onClose={finish} label="Welcome" panelClassName="welcome-modal">
      <div className="welcome-art">
        <Icon size={40} />
      </div>
      <h2 className="welcome-title">{current.title}</h2>
      <p className="welcome-body">{current.body}</p>

      <div className="welcome-dots" aria-hidden="true">
        {STEPS.map((_, i) => (
          <span key={i} className={`welcome-dot ${i === step ? "is-active" : ""}`} />
        ))}
      </div>

      <div className="welcome-actions">
        {step > 0 ? (
          <button type="button" className="quiz-secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : (
          <button type="button" className="quiz-secondary" onClick={finish}>
            Skip
          </button>
        )}
        {isLast ? (
          <button type="button" className="quiz-primary" onClick={finish}>
            Start exploring
          </button>
        ) : (
          <button type="button" className="quiz-primary" onClick={() => setStep((s) => s + 1)}>
            Next
          </button>
        )}
      </div>
    </Modal>
  );
}
