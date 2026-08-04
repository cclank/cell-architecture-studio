import type { Comparison } from "./curriculum/types";

// Milestone-1 comparisons. `itemIds` reference biology visuals or specimens.

export const comparisons: Comparison[] = [
  {
    id: "cmp-plant-animal",
    title: "Plant cell vs Animal cell",
    topicIds: ["organisation"],
    itemIds: ["vis-plant-cell", "vis-animal-cell"],
    itemLabels: ["Plant cell", "Animal cell"],
    similarities: [
      "Both have a cell membrane, cytoplasm and a nucleus.",
      "Both contain mitochondria and ribosomes.",
      "Both are eukaryotic (nucleus enclosed by a membrane).",
    ],
    differences: [
      { feature: "Cell wall", values: ["Present (cellulose)", "Absent"] },
      { feature: "Chloroplasts", values: ["Present", "Absent"] },
      { feature: "Vacuole", values: ["One large permanent vacuole", "Small or none"] },
      { feature: "Shape", values: ["Regular / fixed", "Rounded / varied"] },
    ],
    examSummary:
      "Plant cells have a cellulose cell wall, chloroplasts and a large permanent vacuole; animal cells do not.",
    courseTier: "CORE",
    questionId: "q-org-3",
  },
  {
    id: "cmp-prokaryote-eukaryote",
    title: "Prokaryotic vs Eukaryotic cell",
    topicIds: ["organisation"],
    itemIds: ["vis-bacterial-cell", "vis-animal-cell"],
    itemLabels: ["Bacterial (prokaryotic)", "Animal (eukaryotic)"],
    similarities: [
      "Both have a cell membrane and cytoplasm.",
      "Both contain DNA and ribosomes.",
    ],
    differences: [
      { feature: "Nucleus", values: ["No true nucleus (circular DNA)", "Membrane-bound nucleus"] },
      { feature: "Membrane-bound organelles", values: ["Absent", "Present (e.g. mitochondria)"] },
      { feature: "Plasmids", values: ["Often present", "Absent"] },
      { feature: "Size", values: ["Smaller (~1–5 µm)", "Larger (~10–100 µm)"] },
    ],
    examSummary:
      "Prokaryotes have circular DNA free in the cytoplasm and no membrane-bound organelles; eukaryotes have a true nucleus and organelles.",
    courseTier: "CORE",
    questionId: "q-org-5",
  },
  {
    id: "cmp-transport",
    title: "Diffusion vs Osmosis vs Active transport",
    topicIds: ["movement"],
    itemIds: ["proc-diffusion", "proc-osmosis", "proc-active-transport"],
    itemLabels: ["Diffusion", "Osmosis", "Active transport"],
    similarities: [
      "All move substances across the cell membrane.",
      "Diffusion and osmosis are both passive (no energy needed).",
    ],
    differences: [
      { feature: "What moves", values: ["Any particle", "Water only", "Specific particles"] },
      { feature: "Direction", values: ["High → low", "High → low water potential", "Low → high (against gradient)"] },
      { feature: "Energy needed", values: ["No", "No", "Yes (from respiration)"] },
      { feature: "Membrane", values: ["Any permeable", "Partially permeable", "With carrier proteins"] },
    ],
    examSummary:
      "Diffusion and osmosis are passive and move down a gradient; osmosis is specifically water across a partially permeable membrane; active transport moves particles up the gradient using energy.",
    courseTier: "BOTH",
    questionId: "q-mov-5",
  },
  {
    id: "cmp-biomolecules",
    title: "Carbohydrate vs Protein vs Lipid",
    topicIds: ["molecules"],
    itemIds: ["vis-biomolecules"],
    itemLabels: ["Carbohydrate", "Protein", "Lipid"],
    similarities: ["All are biological molecules that contain carbon, hydrogen and oxygen."],
    differences: [
      { feature: "Smaller units", values: ["Simple sugars", "Amino acids", "Glycerol + fatty acids"] },
      { feature: "Extra element", values: ["None", "Nitrogen (N)", "None"] },
      { feature: "Food test", values: ["Iodine / Benedict's", "Biuret", "Ethanol emulsion"] },
      { feature: "Main use", values: ["Energy", "Growth & repair", "Energy store & insulation"] },
    ],
    examSummary:
      "Carbohydrates are sugars (energy), proteins are amino-acid chains containing nitrogen (growth), and lipids are glycerol + fatty acids (storage/insulation).",
    courseTier: "CORE",
    questionId: "q-mol-2",
  },
];

export function getComparisonById(id: string): Comparison | undefined {
  return comparisons.find((c) => c.id === id);
}
