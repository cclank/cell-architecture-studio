// Central product identity + branding configuration.
// Change values here to rebrand the platform without touching layout code.

export const PRODUCT = {
  name: "IGCSE Biology Studio",
  shortName: "Biology Studio",
  subtitle: "Explore biology from molecules to ecosystems.",
  tagline: "An interactive visual studio for Cambridge IGCSE Biology 0610.",
  syllabus: {
    board: "Cambridge IGCSE",
    code: "0610",
    examYears: "2026 · 2027 · 2028",
  },
  // Displayed in the About area. Kept deliberately explicit about independence.
  disclaimer:
    "IGCSE Biology Studio is an independent study tool. It is not endorsed by or affiliated with Cambridge International. It uses no official logos and no copyrighted past-paper questions. All questions are original and all syllabus references are the project's own paraphrase.",
} as const;

// Topic-group accent keys -> colour tokens. Colour is never the only signal;
// every badge and status also carries visible text.
export const TOPIC_ACCENTS: Record<string, { accent: string; soft: string; label: string }> = {
  foundations: { accent: "#7c3aed", soft: "#ece4fe", label: "Foundations & cells" },
  plants: { accent: "#4f8a3f", soft: "#e5f1d8", label: "Plant biology" },
  human: { accent: "#d9556a", soft: "#f7e0e4", label: "Human biology" },
  genetics: { accent: "#2563eb", soft: "#dbe6ff", label: "Genetics" },
  ecology: { accent: "#b07a2c", soft: "#f4e6cd", label: "Ecology" },
  biotech: { accent: "#0d9488", soft: "#cdfaf2", label: "Biotechnology" },
};

export function accentForKey(key: string) {
  return TOPIC_ACCENTS[key] ?? TOPIC_ACCENTS.foundations;
}

// Badge presentation for the CORE / SUPPLEMENT / PRACTICAL system.
// Text label is mandatory; colour supplements but never replaces it.
export const TIER_BADGES = {
  CORE: { label: "Core", className: "badge-core" },
  SUPPLEMENT: { label: "Supplement", className: "badge-supplement" },
  BOTH: { label: "Core + Supplement", className: "badge-both" },
  PRACTICAL: { label: "Practical", className: "badge-practical" },
} as const;
