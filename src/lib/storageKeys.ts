// Single source of truth for every localStorage key the app uses.
// Keeping them here avoids magic strings drifting across modules.
export const STORAGE_KEYS = {
  favorites: "cas-favorites",
  lastCell: "cas-last-cell",
  recent: "cas-recent",
  notes: "cas-notes",
  progress: "cas-progress",
  daily: "cas-daily",
  accent: "cas-accent",
  lang: "cas-lang",
  onboarded: "cas-onboarded",
  quizMuted: "cas-quiz-muted",
  quizHistory: "cas-quiz-history",
  // Best scores are stored as `cas-quiz-best:<category>:<mode>`.
  quizBestPrefix: "cas-quiz-best",
} as const;

// Prefix shared by all quiz-related keys, used for bulk reset.
export const QUIZ_KEY_PREFIX = "cas-quiz";
