import { getCellById, type CellItem } from "../data/cells";
import { MiniCell } from "./MiniCell";
import { Modal } from "./Modal";

type ComparisonModalProps = {
  cell: CellItem;
  open: boolean;
  onClose: () => void;
};

export function ComparisonModal({ cell, open, onClose }: ComparisonModalProps) {
  const comparedCell = getCellById(cell.comparison);
  const currentOrganelle =
    cell.organelles.find((item) => item.id === cell.defaultOrganelle) ?? cell.organelles[0];
  const comparedOrganelle =
    comparedCell.organelles.find((item) => item.id === comparedCell.defaultOrganelle) ??
    comparedCell.organelles[0];

  return (
    <Modal open={open} onClose={onClose} label="Cell comparison" panelClassName="comparison-modal">
      <div className="comparison-modal-head">
        <h3>Comparison View</h3>
        <p>
          {cell.name} compared with {comparedCell.name}
        </p>
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
                  <dt>Default focus</dt>
                  <dd>{organelle.name}</dd>
                </div>
                <div>
                  <dt>Main note</dt>
                  <dd>{organelle.subtitle}</dd>
                </div>
                <div>
                  <dt>Occurs in</dt>
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
