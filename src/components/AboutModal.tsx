import { Sparkles } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { cells } from "../data/cells";
import { Modal } from "./Modal";

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onClose={onClose} label={t("about.label")} panelClassName="about-modal">
      <div className="about-head">
        <span className="brand-orb" aria-hidden="true">
          <Sparkles size={24} />
        </span>
        <div>
          <h3>{t("brand.title")}</h3>
          <p>{t("brand.aboutTagline")}</p>
        </div>
      </div>

      <dl className="about-list">
        <div>
          <dt>{t("about.specimens")}</dt>
          <dd>{t("about.specimensBody", { count: cells.length })}</dd>
        </div>
        <div>
          <dt>{t("about.models")}</dt>
          <dd>
            <Trans
              i18nKey="about.modelsBody"
              components={{
                nih: <a href="https://3d.nih.gov" target="_blank" rel="noopener noreferrer" />,
              }}
            />
          </dd>
        </div>
        <div>
          <dt>{t("about.rendering")}</dt>
          <dd>{t("about.renderingBody")}</dd>
        </div>
        <div>
          <dt>{t("about.quiz")}</dt>
          <dd>{t("about.quizBody")}</dd>
        </div>
      </dl>

      <p className="about-foot">{t("about.foot")}</p>
    </Modal>
  );
}
