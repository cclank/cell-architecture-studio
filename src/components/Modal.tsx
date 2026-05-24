import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useEscapeToClose } from "../hooks/useEscapeToClose";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  panelClassName: string;
  children: ReactNode;
};

// Shared modal shell: overlay layer, Escape-to-close, ARIA dialog role, and a
// consistent close button. Each modal just supplies its panel class + content.
export function Modal({ open, onClose, label, panelClassName, children }: ModalProps) {
  useEscapeToClose(open, onClose);
  if (!open) return null;
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label={label}>
      <div className={panelClassName}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
