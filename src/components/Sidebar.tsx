import type { ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CellItem } from "../data/cells";

type SidebarProps = {
  selectedCell: CellItem;
  activeOrganelle: string;
  onSelectOrganelle: (id: string) => void;
  onToast: (message: string) => void;
  topSlot?: ReactNode;
};

export function Sidebar({ selectedCell, activeOrganelle, onSelectOrganelle, onToast, topSlot }: SidebarProps) {
  const { t } = useTranslation("common");

  return (
    <aside className="left-rail">
      {topSlot}
      <section className="panel organelle-panel">
        <div className="panel-heading">
          <span>
            <Sparkles size={16} />
            {t("sidebar.organelles")}
          </span>
          <button
            type="button"
            className="panel-heading-chev"
            onClick={() => onToast(t("toast.organelleCount", { count: selectedCell.organelles.length }))}
            aria-label={t("sidebar.organellesInfo")}
          >
            <ChevronDown size={18} />
          </button>
        </div>

        <div className="organelle-list">
          {selectedCell.organelles.map((organelle) => (
            <button
              className={`organelle-row ${activeOrganelle === organelle.id ? "is-active" : ""}`}
              type="button"
              key={organelle.id}
              onClick={() => {
                if (activeOrganelle === organelle.id) {
                  onToast(t("toast.alreadyFocus", { name: organelle.name }));
                } else {
                  onSelectOrganelle(organelle.id);
                  onToast(t("toast.focused", { name: organelle.name }));
                }
              }}
            >
              <span className="color-dot" style={{ background: organelle.color }} />
              <span>{organelle.name}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
