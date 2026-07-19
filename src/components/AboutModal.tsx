import { Sparkles } from "lucide-react";
import { cells } from "../data/cells";
import { Modal } from "./Modal";

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="About this app" panelClassName="about-modal">
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
            Identify specimens across casual, timed, type-it and survival modes; scores and
            history are saved locally in your browser.
          </dd>
        </div>
      </dl>

      <p className="about-foot">Built as an educational project. Not for clinical use.</p>
    </Modal>
  );
}
