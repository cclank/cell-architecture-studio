// Curriculum type backbone for IGCSE Biology Studio.
//
// These types describe the *whole* Cambridge IGCSE Biology 0610 syllabus
// (examinations 2026-2028) in a data-driven way, deliberately using general
// biology names — Topic, Objective, Visual, Structure, Process, Practical —
// rather than cell-only names, so the platform can represent molecules,
// tissues, organs, ecosystems and processes just as well as cells.
//
// IMPORTANT (provenance): every identifier in this project is an INTERNAL
// project ID. They are NOT official Cambridge objective codes. The
// `sourceReference` field records, in prose, which part of the official
// syllabus a record represents, so coverage can be audited without copying
// syllabus wording verbatim into the public interface.

/** Which part of the course an item belongs to. */
export type CourseTier = "CORE" | "SUPPLEMENT" | "BOTH";

/** The learner-facing course level selector. */
export type CourseLevel = "CORE" | "EXTENDED" | "ALL";

/** How a learning visual is best delivered. Not everything is a 3D model. */
export type VisualFormat =
  | "3D_MODEL"
  | "3D_PROCESS"
  | "2D_DIAGRAM"
  | "SIMULATION"
  | "MICROSCOPE"
  | "GRAPH"
  | "ECOSYSTEM"
  | "PRACTICAL";

/** Progress status of a syllabus objective within this project. */
export type ObjectiveStatus =
  | "NOT_STARTED"
  | "DRAFTED"
  | "VISUAL_PLANNED"
  | "VISUAL_AVAILABLE"
  | "COMPLETE"
  | "REVIEWED";

/** Production status of a referenced asset (model, microscope image, poster). */
export type AssetStatus = "PLACEHOLDER" | "CONCEPT" | "PRODUCTION";

/** Cambridge assessment objectives. */
export type AssessmentObjective = "AO1" | "AO2" | "AO3";

/** The six IGCSE Biology papers. */
export type PaperType =
  | "PAPER_1"
  | "PAPER_2"
  | "PAPER_3"
  | "PAPER_4"
  | "PAPER_5"
  | "PAPER_6";

/** Broad grouping used by the Visuals navigation mode. */
export type VisualGroup =
  | "Cells"
  | "Molecules"
  | "Plants"
  | "Human biology"
  | "Genetics"
  | "Ecology"
  | "Microorganisms"
  | "Biotechnology";

export interface AssetCredit {
  /** e.g. "Original ChatGPT concept + Meshy reconstruction" or "Project-created placeholder". */
  origin: string;
  /** Licence statement, e.g. "Project-owned asset". */
  licence: string;
  /** Optional external attribution (used for temporary development assets). */
  attribution?: string;
  sourceUrl?: string;
}

/** A single selectable structure/component inside a visual. */
export interface VisualStructure {
  id: string;
  name: string;
  /** Mesh names in the GLB that this structure maps to (if a 3D model exists). */
  meshNames?: string[];
  /** Optional normalized hotspot anchor. */
  hotspotPosition?: [number, number, number];
  /** Accent colour for list dots / hotspots. */
  color: string;
  function: string;
  structureDescription: string;
  /** How structure enables function — the exam-critical link. */
  adaptationExplanation?: string;
  /** Phrases an examiner rewards. */
  examLanguage: string[];
  commonMistakes: string[];
  courseTier: CourseTier;
}

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target?: [number, number, number];
}

/** A single stage of an animated/interactive process. */
export interface ProcessStage {
  id: string;
  title: string;
  caption: string;
  /** Plain-text transcript line for accessibility / reduced-motion. */
  transcript: string;
  courseTier: CourseTier;
}

export interface MicroscopeImage {
  id: string;
  label: string;
  /** Magnification descriptor, e.g. "x400 light microscope". */
  technique: string;
  /** Procedural placeholder descriptor until a licensed image exists. */
  placeholderPattern: string;
  tone: string;
  assetStatus: AssetStatus;
  assetCredit: AssetCredit;
}

/** The central unit rendered by the studio viewer. Generalises the old CellItem. */
export interface BiologyVisual {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  format: VisualFormat;
  group: VisualGroup;
  topicIds: string[];
  objectiveIds: string[];
  courseTier: CourseTier;
  /** Optional link to a legacy specimen id (existing GLB experience) so the
   *  working 3D viewer can be reused directly. */
  specimenId?: string;
  modelUrl?: string;
  mobileModelUrl?: string;
  posterUrl?: string;
  thumbnailUrl?: string;
  /** One-line text alternative describing the visual for screen readers. */
  textAlternative: string;
  structures: VisualStructure[];
  cameraPresets?: CameraPreset[];
  processId?: string;
  microscopeImages?: MicroscopeImage[];
  assetStatus: AssetStatus;
  assetCredit: AssetCredit;
}

export interface Subtopic {
  id: string;
  title: string;
  courseTier: CourseTier;
}

export interface SyllabusTopic {
  id: string;
  number: number;
  title: string;
  description: string;
  /** Visual grouping accent key (see product config topicAccents). */
  accentKey: string;
  subtopics: Subtopic[];
  visualIds: string[];
  processIds: string[];
  practicalIds: string[];
  comparisonIds: string[];
  questionIds: string[];
}

export interface SyllabusObjective {
  id: string;
  topicId: string;
  subtopicId: string;
  /** Prose reference to the official syllabus location (internal project note). */
  sourceReference: string;
  courseTier: CourseTier;
  studentFriendlyObjective: string;
  keyTerms: string[];
  misconceptionIds: string[];
  visualIds: string[];
  practicalIds: string[];
  questionIds: string[];
  status: ObjectiveStatus;
}

export interface PracticalActivity {
  id: string;
  title: string;
  topicIds: string[];
  objectiveIds: string[];
  aim: string;
  independentVariable: string;
  dependentVariable: string;
  controlVariables: string[];
  apparatus: string[];
  safetyNotes: string[];
  methodSummary: string[];
  expectedObservations: string[];
  resultsTableColumns: string[];
  suitableGraph: string;
  dataSkills: string[];
  conclusionPrompts: string[];
  sourcesOfError: string[];
  improvements: string[];
  commonMistakes: string[];
  paperType: "PAPER_5" | "PAPER_6" | "BOTH";
}

/** A worked comparison between two or more items. */
export interface Comparison {
  id: string;
  title: string;
  topicIds: string[];
  /** Visual ids or specimen ids being compared. */
  itemIds: string[];
  itemLabels: string[];
  similarities: string[];
  differences: ComparisonRow[];
  examSummary: string;
  courseTier: CourseTier;
  questionId?: string;
}

export interface ComparisonRow {
  feature: string;
  values: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface PracticeQuestion {
  id: string;
  topicId: string;
  subtopicId: string;
  objectiveIds: string[];
  courseTier: CourseTier;
  paper: PaperType;
  assessmentObjective: AssessmentObjective;
  commandWord: string;
  marks: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** e.g. "MCQ", "SHORT", "STRUCTURED", "MODEL_SELECT", "GRAPH", "PRACTICAL". */
  type: string;
  prompt: string;
  /** For multiple-choice questions. */
  options?: QuestionOption[];
  /** For MODEL_SELECT questions: the visual + the structure id that is correct. */
  visualId?: string;
  answerStructureId?: string;
  markPoints: string[];
  explanation: string;
  misconceptionTags: string[];
  estimatedSeconds: number;
}

export interface Misconception {
  id: string;
  topicId: string;
  statement: string;
  correction: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  synonyms: string[];
  topicIds: string[];
  courseTier: CourseTier;
}

/** Interactive process (diffusion, photosynthesis, mitosis, …). */
export interface BiologyProcess {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  topicIds: string[];
  objectiveIds: string[];
  courseTier: CourseTier;
  group: VisualGroup;
  overview: string;
  stages: ProcessStage[];
  examNote: string;
}
