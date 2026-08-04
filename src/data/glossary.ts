import type { GlossaryTerm, Misconception } from "./curriculum/types";

// Glossary with common synonyms so search can match alternative student wording
// (e.g. "windpipe" -> trachea, "leucocyte" -> white blood cell).

export const glossary: GlossaryTerm[] = [
  {
    id: "gl-diffusion",
    term: "Diffusion",
    definition: "The net movement of particles from a higher to a lower concentration, down a concentration gradient.",
    synonyms: ["spreading out"],
    topicIds: ["movement"],
    courseTier: "CORE",
  },
  {
    id: "gl-osmosis",
    term: "Osmosis",
    definition: "The net movement of water molecules across a partially permeable membrane from a dilute to a more concentrated solution.",
    synonyms: ["water movement"],
    topicIds: ["movement"],
    courseTier: "CORE",
  },
  {
    id: "gl-active-transport",
    term: "Active transport",
    definition: "Movement of particles against a concentration gradient using energy from respiration and carrier proteins.",
    synonyms: [],
    topicIds: ["movement"],
    courseTier: "BOTH",
  },
  {
    id: "gl-membrane",
    term: "Cell membrane",
    definition: "The partially permeable boundary of a cell that controls what enters and leaves.",
    synonyms: ["plasma membrane", "cell surface membrane"],
    topicIds: ["organisation"],
    courseTier: "CORE",
  },
  {
    id: "gl-wbc",
    term: "White blood cell",
    definition: "A blood cell involved in defending the body against pathogens.",
    synonyms: ["leucocyte", "leukocyte"],
    topicIds: ["disease-immunity", "transport-animals"],
    courseTier: "CORE",
  },
  {
    id: "gl-enzyme",
    term: "Enzyme",
    definition: "A protein that acts as a biological catalyst, speeding up a reaction without being used up.",
    synonyms: ["biological catalyst"],
    topicIds: ["enzymes"],
    courseTier: "CORE",
  },
  {
    id: "gl-denatured",
    term: "Denatured",
    definition: "When an enzyme's active site permanently changes shape (e.g. by heat or extreme pH) so the substrate no longer fits.",
    synonyms: ["denaturation"],
    topicIds: ["enzymes"],
    courseTier: "BOTH",
  },
  {
    id: "gl-magnification",
    term: "Magnification",
    definition: "How many times larger an image is than the real object: magnification = image size ÷ actual size.",
    synonyms: ["scale factor"],
    topicIds: ["organisation"],
    courseTier: "BOTH",
  },
  {
    id: "gl-species",
    term: "Species",
    definition: "A group of organisms that can reproduce to produce fertile offspring.",
    synonyms: [],
    topicIds: ["characteristics"],
    courseTier: "CORE",
  },
  {
    id: "gl-chloroplast",
    term: "Chloroplast",
    definition: "The organelle in plant cells that contains chlorophyll and is the site of photosynthesis.",
    synonyms: [],
    topicIds: ["organisation", "plant-nutrition"],
    courseTier: "CORE",
  },
  {
    id: "gl-trachea",
    term: "Trachea",
    definition: "The tube that carries air from the throat toward the lungs.",
    synonyms: ["windpipe"],
    topicIds: ["gas-exchange"],
    courseTier: "CORE",
  },
  {
    id: "gl-nephron",
    term: "Nephron",
    definition: "The functional filtering unit of the kidney.",
    synonyms: ["kidney tubule"],
    topicIds: ["excretion"],
    courseTier: "SUPPLEMENT",
  },
];

export const misconceptions: Misconception[] = [
  {
    id: "mis-char-1",
    topicId: "characteristics",
    statement: "Excretion and egestion mean the same thing.",
    correction: "Excretion removes waste made by the body's reactions; egestion removes undigested food that was never inside cells.",
  },
  {
    id: "mis-org-1",
    topicId: "organisation",
    statement: "The nucleus makes energy for the cell.",
    correction: "The nucleus controls the cell; energy is released by respiration in the mitochondria.",
  },
  {
    id: "mis-org-2",
    topicId: "organisation",
    statement: "All cells have chloroplasts and a cell wall.",
    correction: "Only plant (and algal) cells have chloroplasts and a cellulose cell wall; animal cells have neither.",
  },
  {
    id: "mis-org-3",
    topicId: "organisation",
    statement: "Bacteria have a nucleus.",
    correction: "Bacteria are prokaryotic — their circular DNA is free in the cytoplasm with no nuclear membrane.",
  },
  {
    id: "mis-org-4",
    topicId: "organisation",
    statement: "You can divide image size in mm by actual size in µm.",
    correction: "Convert both to the same unit first (1 mm = 1000 µm) before using the magnification equation.",
  },
  {
    id: "mis-mov-1",
    topicId: "movement",
    statement: "Diffusion needs energy from the cell.",
    correction: "Diffusion is passive — it uses the particles' own kinetic energy, not energy from respiration.",
  },
  {
    id: "mis-mov-2",
    topicId: "movement",
    statement: "Osmosis is the movement of any small molecule.",
    correction: "Osmosis is specifically the movement of water across a partially permeable membrane.",
  },
  {
    id: "mis-mov-3",
    topicId: "movement",
    statement: "Active transport moves substances down the concentration gradient.",
    correction: "Active transport moves them against the gradient (low → high), which is why it needs energy.",
  },
  {
    id: "mis-mol-1",
    topicId: "molecules",
    statement: "Benedict's solution tests for all sugars and starch.",
    correction: "Benedict's tests for reducing sugars; starch is tested with iodine.",
  },
  {
    id: "mis-enz-1",
    topicId: "enzymes",
    statement: "Enzymes are used up during a reaction.",
    correction: "Enzymes are catalysts — they are unchanged and can be reused many times.",
  },
  {
    id: "mis-enz-2",
    topicId: "enzymes",
    statement: "One enzyme can break down any substrate.",
    correction: "Each enzyme is specific: only a substrate that fits its active site will react.",
  },
  {
    id: "mis-enz-3",
    topicId: "enzymes",
    statement: "High temperatures kill enzymes.",
    correction: "Enzymes are not alive — heat denatures them by permanently changing the active site shape.",
  },
];

export function getMisconceptionById(id: string): Misconception | undefined {
  return misconceptions.find((m) => m.id === id);
}
