import type { CourseLevel, SyllabusTopic } from "../../data/curriculum/types";
import { getObjectivesForTopic } from "../../data/syllabusObjectives";
import { isTierVisible } from "../../lib/courseLevel";
import { accentForKey } from "../../config/product";
import type { CurriculumProgress } from "../../lib/curriculumProgress";
import { questionAccuracy } from "../../lib/curriculumProgress";
import { TierBadge } from "./Badge";

type Props = {
  topic: SyllabusTopic;
  courseLevel: CourseLevel;
  progress: CurriculumProgress;
  onOpenQuestions: () => void;
};

export function TopicAside({ topic, courseLevel, progress, onOpenQuestions }: Props) {
  const accent = accentForKey(topic.accentKey);
  const objectives = getObjectivesForTopic(topic.id).filter((o) => isTierVisible(o.courseTier, courseLevel));
  const accuracy = questionAccuracy(progress);

  return (
    <aside className="right-rail igb-study" aria-label="Topic context">
      <section className="panel">
        <div className="panel-heading">
          <span>
            <span className="igb-topic-num" style={{ background: accent.soft, color: accent.accent }}>
              {topic.number}
            </span>
            Topic focus
          </span>
        </div>
        <h3 className="igb-aside-title">{topic.title}</h3>
        <p className="igb-muted">{topic.description}</p>
      </section>

      <section className="panel igb-tabs-panel">
        <div className="panel-heading"><span>Learning objectives</span></div>
        <ul className="igb-obj-list">
          {objectives.map((o) => (
            <li key={o.id}>
              <TierBadge tier={o.courseTier} />
              <span>{o.studentFriendlyObjective}</span>
            </li>
          ))}
          {objectives.length === 0 && <li className="igb-muted">Objectives are being drafted for this topic.</li>}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-heading"><span>Your progress</span></div>
        <p className="igb-muted">
          {accuracy === null ? "No questions answered yet." : `Question accuracy: ${accuracy}%`}
        </p>
        <p className="igb-muted">{progress.questionsWrong.length} to review · {progress.visualsExplored.length} visuals explored</p>
        {topic.questionIds.length > 0 && (
          <button type="button" className="igb-btn igb-btn-primary" onClick={onOpenQuestions}>
            Practice questions
          </button>
        )}
      </section>
    </aside>
  );
}
