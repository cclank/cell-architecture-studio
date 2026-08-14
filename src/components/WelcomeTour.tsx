import { useState } from "react";
import { Gamepad2, Keyboard, Layers, Sparkles, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";

const STEP_ICONS: LucideIcon[] = [Sparkles, Layers, Gamepad2, Keyboard];

export function WelcomeTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation("common");
  const [step, setStep] = useState(0);
  const steps = t("welcome.steps", { returnObjects: true }) as Array<{ title: string; body: string }>;
  const current = steps[step] ?? steps[0];
  const isLast = step >= steps.length - 1;
  const Icon = STEP_ICONS[step] ?? Sparkles;

  function finish() {
    setStep(0);
    onClose();
  }

  if (!current) return null;

  return (
    <Modal open={open} onClose={finish} label={t("welcome.label")} panelClassName="welcome-modal">
      <div className="welcome-art">
        <Icon size={40} />
      </div>
      <h2 className="welcome-title">{current.title}</h2>
      <p className="welcome-body">{current.body}</p>

      <div className="welcome-dots" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={`welcome-dot ${i === step ? "is-active" : ""}`} />
        ))}
      </div>

      <div className="welcome-actions">
        {step > 0 ? (
          <button type="button" className="quiz-secondary" onClick={() => setStep((s) => s - 1)}>
            {t("welcome.back")}
          </button>
        ) : (
          <button type="button" className="quiz-secondary" onClick={finish}>
            {t("welcome.skip")}
          </button>
        )}
        {isLast ? (
          <button type="button" className="quiz-primary" onClick={finish}>
            {t("welcome.start")}
          </button>
        ) : (
          <button type="button" className="quiz-primary" onClick={() => setStep((s) => s + 1)}>
            {t("welcome.next")}
          </button>
        )}
      </div>
    </Modal>
  );
}
