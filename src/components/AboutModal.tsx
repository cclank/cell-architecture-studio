import { Sparkles } from "lucide-react";
import { cells } from "../data/cells";
import { useEscapeToClose } from "../hooks/useEscapeToClose";

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEscapeToClose(open, onClose);
  if (!open) return null;
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="About this app">
      <div className="about-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          Close
        </button>
        <div className="about-head">
          <span className="brand-orb" aria-hidden="true">
            <Sparkles size={24} />
          </span>
          <div>
            <h3>Cell Architecture Studio</h3>
            <p>Explore life at the microscopic level in interactive 3D.</p>
          </div>
        </div>

        <dl className="about-list">
          <div>
            <dt>Specimens</dt>
            <dd>
              {cells.length} interactive 3D models across cells, organs, bones, viruses,
              macromolecules and botanical specimens.
            </dd>
          </div>
          <div>
            <dt>3D models</dt>
            <dd>
              Sourced from the{" "}
              <a href="https://3d.nih.gov" target="_blank" rel="noopener noreferrer">
                NIH 3D Print Exchange
              </a>
              . Licenses vary per entry — verify each model's terms before reuse.
            </dd>
          </div>
          <div>
            <dt>Rendering</dt>
            <dd>
              React + Three.js (React Three Fiber) with an HDR studio environment, ACES tone
              mapping, and meshopt-compressed assets.
            </dd>
          </div>
          <div>
            <dt>Quiz</dt>
            <dd>
              Identify specimens across casual, timed and type-it modes; scores and history are
              saved locally in your browser.
            </dd>
          </div>
        </dl>

        <p className="about-foot">Built as an educational project. Not for clinical use.</p>
      </div>
    </div>
  );
}
