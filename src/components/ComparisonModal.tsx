import { useTranslation } from "react-i18next";
import type { CellItem } from "../data/cells";
import { useResolvedCell } from "../i18n/resolveCell";
import { MiniCell } from "./MiniCell";
import { Modal } from "./Modal";

type ComparisonModalProps = {
  cell: CellItem;
  open: boolean;
  onClose: () => void;
};

export function ComparisonModal({ cell, open, onClose }: ComparisonModalProps) {
  const { t } = useTranslation("common");
  const comparedCell = useResolvedCell(cell.comparison);
  const currentOrganelle =
    cell.organelles.find((item) => item.id === cell.defaultOrganelle) ?? cell.organelles[0];
  const comparedOrganelle =
    comparedCell.organelles.find((item) => item.id === comparedCell.defaultOrganelle) ??
    comparedCell.organelles[0];

  return (
    <Modal open={open} onClose={onClose} label={t("compare.label")} panelClassName="comparison-modal">
      <div className="comparison-modal-head">
        <h3>{t("compare.title")}</h3>
        <p>{t("compare.vs", { a: cell.name, b: comparedCell.name })}</p>
      </div>
      <div className="comparison-columns">
        {[cell, comparedCell].map((item) => {
          const organelle = item.id === cell.id ? currentOrganelle : comparedOrganelle;
          return (
            <section key={item.id}>
              <MiniCell cell={item} />
              <h4>{item.name}</h4>
              <p>{item.type}</p>
              <dl>
                <div>
                  <dt>{t("compare.defaultFocus")}</dt>
                  <dd>{organelle.name}</dd>
                </div>
                <div>
                  <dt>{t("compare.mainNote")}</dt>
                  <dd>{organelle.subtitle}</dd>
                </div>
                <div>
                  <dt>{t("compare.occursIn")}</dt>
                  <dd>{item.occurrence.title}</dd>
                </div>
              </dl>
            </section>
          );
        })}
      </div>
    </Modal>
  );
}
