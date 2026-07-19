export type ModelKind =
  | "plant"
  | "whiteBlood"
  | "neuron"
  | "epithelial"
  | "bacteria"
  | "animal"
  | "muscle";

export type ViewMode = "mesh" | "focus";

export type OrganelleItem = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  attributes: Array<{
    label: string;
    value: string;
  }>;
  note: string;
  fact: string;
};

export type CellModelAsset = {
  url: string;
  previewUrl: string;
  sourceLabel: string;
  sourceUrl: string;
  scale: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  exposure?: number;
  materialMode?: "studio" | "native" | "solid";
};

export type CellRenderImage = {
  url: string;
  aspect: "square" | "wide" | "landscape";
};

export type CellItem = {
  id: string;
  name: string;
  type: string;
  accent: string;
  accentSoft: string;
  color: string;
  modelKind: ModelKind;
  defaultOrganelle: string;
  comparison: string;
  clinicalContext: string;
  modelAsset?: CellModelAsset;
  renderImage?: CellRenderImage;
  occurrence: {
    title: string;
    body: string;
    motif: string;
  };
  microscope: Array<{
    label: string;
    tone: string;
    pattern: string;
  }>;
  organelles: OrganelleItem[];
};

export const cells: CellItem[] = [
  {
    id: "plant",
    name: "Plant Cell",
    type: "Eukaryotic Cell",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#81b64b",
    modelKind: "plant",
    defaultOrganelle: "nucleus",
    comparison: "animal",
    clinicalContext:
      "A useful non-human baseline for teaching why cell walls and chloroplasts are absent from patient tissue samples.",
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
      aspect: "square",
    },
    modelAsset: {
      url: "/models/plant-cell-first001.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      sourceLabel: "User Plant Cell GLB first001",
      sourceUrl: "local:/Users/lank/Downloads/first001.glb",
      scale: 2.36,
      rotation: [0.08, -1.42, -0.02],
      exposure: 1.08,
      materialMode: "native",
    },
    occurrence: {
      title: "Leaves, stems, roots",
      body: "Plant cells form tissues that store energy, move water, and turn sunlight into sugars.",
      motif: "leaf",
    },
    microscope: [
      { label: "Light Microscope", tone: "#b9d48a", pattern: "plant-light" },
      { label: "Stained Selection", tone: "#cf8cc2", pattern: "plant-stain" },
      { label: "Electron Microscope", tone: "#9a9a8e", pattern: "electron" },
    ],
    organelles: [
      {
        id: "nucleus",
        name: "Nucleus",
        subtitle: "The control center",
        color: "#7047a8",
        attributes: [
          { label: "Size", value: "5 to 10 µm in diameter" },
          { label: "Location", value: "Usually central" },
          { label: "Visible in LM", value: "Yes" },
        ],
        note:
          "The nucleus is surrounded by a double membrane called the nuclear envelope, which contains pores that regulate molecular traffic.",
        fact: "The nucleus was one of the first cell structures discovered.",
      },
      {
        id: "chloroplast",
        name: "Chloroplast",
        subtitle: "The light harvester",
        color: "#5fa842",
        attributes: [
          { label: "Role", value: "Photosynthesis" },
          { label: "Pigment", value: "Chlorophyll" },
          { label: "Visible in LM", value: "Often" },
        ],
        note:
          "Chloroplasts convert light energy into chemical energy and give many plant tissues their green color.",
        fact: "A single leaf cell can contain dozens of chloroplasts.",
      },
      {
        id: "vacuole",
        name: "Vacuole",
        subtitle: "The pressure reservoir",
        color: "#62bdd2",
        attributes: [
          { label: "Volume", value: "Large central space" },
          { label: "Content", value: "Water and solutes" },
          { label: "Function", value: "Turgor support" },
        ],
        note:
          "The central vacuole stores water, ions, and small molecules while helping the plant cell remain firm.",
        fact: "Vacuoles can occupy most of a mature plant cell.",
      },
      {
        id: "cellWall",
        name: "Cell Wall",
        subtitle: "The rigid frame",
        color: "#7aa647",
        attributes: [
          { label: "Material", value: "Cellulose rich" },
          { label: "Position", value: "Outer boundary" },
          { label: "Function", value: "Protection" },
        ],
        note:
          "The cell wall gives plant cells their regular shape and protects the membrane beneath it.",
        fact: "Cell walls help plants stand upright without a skeleton.",
      },
    ],
  },
  {
    id: "whiteBlood",
    name: "White Blood Cell",
    type: "Immune Cell",
    accent: "#6d78a8",
    accentSoft: "#e6eaf7",
    color: "#b9bfd7",
    modelKind: "whiteBlood",
    defaultOrganelle: "lysosome",
    comparison: "epithelial",
    clinicalContext:
      "Immune cell morphology is a bridge from basic cell biology to how clinicians interpret infection, inflammation, and blood smears.",
    renderImage: {
      url: "/cell-renders-transparent/white-blood.png",
      aspect: "square",
    },
    modelAsset: {
      url: "/models/white-blood-cell-user.glb",
      previewUrl: "/cell-renders-transparent/white-blood.png",
      sourceLabel: "User White Blood Cell GLB",
      sourceUrl: "local:/Users/lank/Downloads/second.glb",
      scale: 3.18,
      rotation: [0.02, -0.18, 0],
      exposure: 1.08,
      materialMode: "native",
    },
    occurrence: {
      title: "Blood, lymph, tissues",
      body: "White blood cells move through blood and tissue spaces to identify threats and coordinate immune defense.",
      motif: "blood",
    },
    microscope: [
      { label: "Light Microscope", tone: "#ded6e9", pattern: "blood-light" },
      { label: "Stained Selection", tone: "#9c73be", pattern: "blood-stain" },
      { label: "Electron Microscope", tone: "#8f8f91", pattern: "electron" },
    ],
    organelles: [
      {
        id: "lysosome",
        name: "Lysosome",
        subtitle: "The cleanup vesicle",
        color: "#8b54b7",
        attributes: [
          { label: "Size", value: "About 1 µm" },
          { label: "Content", value: "Digestive enzymes" },
          { label: "Role", value: "Breakdown" },
        ],
        note:
          "Lysosomes help immune cells digest engulfed material and recycle worn cellular components.",
        fact: "White blood cells rely heavily on vesicles for defense.",
      },
      {
        id: "nucleus",
        name: "Lobed Nucleus",
        subtitle: "Flexible genome vault",
        color: "#6f35a1",
        attributes: [
          { label: "Shape", value: "Often lobed" },
          { label: "Location", value: "Central" },
          { label: "Visible in LM", value: "Yes, with stain" },
        ],
        note:
          "Many white blood cells have a lobed nucleus that helps them squeeze through tight spaces.",
        fact: "Nuclear shape is one clue used to identify immune cell types.",
      },
      {
        id: "granules",
        name: "Granules",
        subtitle: "The chemical packets",
        color: "#c06696",
        attributes: [
          { label: "Content", value: "Proteins and enzymes" },
          { label: "Use", value: "Defense" },
          { label: "Visibility", value: "Stain dependent" },
        ],
        note:
          "Granules store molecules that help immune cells respond quickly to infection or inflammation.",
        fact: "Some immune cells are named by how their granules stain.",
      },
    ],
  },
  {
    id: "neuron",
    name: "Neuron",
    type: "Nerve Cell",
    accent: "#6578b5",
    accentSoft: "#e4e9f8",
    color: "#8c91d0",
    modelKind: "neuron",
    defaultOrganelle: "axon",
    comparison: "muscle",
    clinicalContext:
      "Neuron shape helps learners connect cell structure with bedside neuroanatomy, reflexes, sensation, and motor signaling.",
    renderImage: {
      url: "/cell-renders-transparent/neuron.png",
      aspect: "wide",
    },
    modelAsset: {
      url: "/models/neuron-nih.glb",
      previewUrl: "/nih-previews/neuron-nih.png",
      sourceLabel: "NIH 3D Neuron",
      sourceUrl: "https://3d.nih.gov/entries/3DPX-015796/2",
      scale: 3.15,
      rotation: [0.18, -0.24, -0.18],
      position: [0, 0.05, 0],
      exposure: 1.05,
    },
    occurrence: {
      title: "Brain, spinal cord, nerves",
      body: "Neurons carry electrical and chemical signals through long branching networks.",
      motif: "nerve",
    },
    microscope: [
      { label: "Light Microscope", tone: "#c9c4ed", pattern: "neuron-light" },
      { label: "Stained Selection", tone: "#dc99cc", pattern: "neuron-stain" },
      { label: "Electron Microscope", tone: "#8e8e94", pattern: "electron" },
    ],
    organelles: [
      {
        id: "axon",
        name: "Axon",
        subtitle: "The signal highway",
        color: "#6b7dc6",
        attributes: [
          { label: "Length", value: "µm to over 1 metre" },
          { label: "Insulation", value: "Myelin sheath" },
          { label: "Visible in LM", value: "Yes, with stain" },
        ],
        note:
          "Some axons in the human body run from the spine to the foot, making neurons among the longest cells in nature.",
        fact: "A nerve impulse can travel at over 100 metres per second.",
      },
      {
        id: "soma",
        name: "Soma",
        subtitle: "The cell body",
        color: "#7c52b7",
        attributes: [
          { label: "Contains", value: "Nucleus" },
          { label: "Role", value: "Metabolic hub" },
          { label: "Shape", value: "Rounded" },
        ],
        note:
          "The soma maintains the neuron and integrates signals arriving from branching dendrites.",
        fact: "Most neuron proteins are made in or near the soma.",
      },
      {
        id: "dendrites",
        name: "Dendrites",
        subtitle: "The receiving branches",
        color: "#7d9bcf",
        attributes: [
          { label: "Shape", value: "Branched" },
          { label: "Role", value: "Input" },
          { label: "Surface", value: "Often spiny" },
        ],
        note:
          "Dendrites increase the surface area available for receiving signals from other cells.",
        fact: "A single neuron can receive thousands of synaptic inputs.",
      },
    ],
  },
  {
    id: "epithelial",
    name: "Epithelial Cell",
    type: "Human Tissue Cell",
    accent: "#a56d7f",
    accentSoft: "#f4e2e7",
    color: "#d79baa",
    modelKind: "epithelial",
    defaultOrganelle: "microvilli",
    comparison: "animal",
    clinicalContext:
      "Epithelial polarity and tight junctions make this cell type central to barriers, absorption, and pathology slide interpretation.",
    renderImage: {
      url: "/cell-renders-transparent/epithelial.png",
      aspect: "square",
    },
    occurrence: {
      title: "Skin, intestine, airways",
      body: "Epithelial cells form protective sheets and absorption surfaces across the body.",
      motif: "surface",
    },
    microscope: [
      { label: "Light Microscope", tone: "#e6a4bd", pattern: "tissue-light" },
      { label: "Stained Selection", tone: "#cb72a4", pattern: "tissue-stain" },
      { label: "Electron Microscope", tone: "#989899", pattern: "electron" },
    ],
    organelles: [
      {
        id: "microvilli",
        name: "Microvilli",
        subtitle: "The absorption brush",
        color: "#c86f80",
        attributes: [
          { label: "Length", value: "0.5 to 1 µm" },
          { label: "Location", value: "Apical surface" },
          { label: "Role", value: "Surface area" },
        ],
        note:
          "Microvilli increase surface area for absorption and secretion along epithelial sheets.",
        fact: "Intestinal microvilli form a dense brush border.",
      },
      {
        id: "junctions",
        name: "Tight Junctions",
        subtitle: "The sealed seams",
        color: "#9f6cbd",
        attributes: [
          { label: "Position", value: "Between cells" },
          { label: "Role", value: "Barrier" },
          { label: "Visibility", value: "EM preferred" },
        ],
        note:
          "Tight junctions link neighboring epithelial cells and control what passes between them.",
        fact: "Epithelial barriers are essential for organ boundaries.",
      },
      {
        id: "nucleus",
        name: "Nucleus",
        subtitle: "The instruction store",
        color: "#7a4aa2",
        attributes: [
          { label: "Position", value: "Basal to central" },
          { label: "Shape", value: "Oval" },
          { label: "Visible in LM", value: "Yes" },
        ],
        note:
          "The epithelial nucleus stores genetic information and changes position depending on tissue shape.",
        fact: "Nuclear shape helps pathologists read tissue samples.",
      },
    ],
  },
  {
    id: "bacteria",
    name: "Bacteria Cell",
    type: "Prokaryotic Cell",
    accent: "#48a77d",
    accentSoft: "#dbf1e7",
    color: "#65b8ae",
    modelKind: "bacteria",
    defaultOrganelle: "nucleoid",
    comparison: "animal",
    clinicalContext:
      "Cell wall structure provides a clinically relevant path from microscopy and Gram staining to antimicrobial mechanism discussions.",
    renderImage: {
      url: "/cell-renders-transparent/bacteria.png",
      aspect: "landscape",
    },
    modelAsset: {
      url: "/models/bacteria-wall-nih.glb",
      previewUrl: "/nih-previews/bacteria-wall-nih.png",
      sourceLabel: "NIH 3D Gram Positive Cell Wall",
      sourceUrl: "https://3d.nih.gov/entries/3DPX-010752/2",
      scale: 0.00185,
      rotation: [0.08, -0.44, -0.08],
      position: [0, -0.1, 0],
      exposure: 1.1,
    },
    occurrence: {
      title: "Soil, water, gut, skin",
      body: "Bacteria live in nearly every environment and can exist as independent single cells.",
      motif: "microbe",
    },
    microscope: [
      { label: "Light Microscope", tone: "#c7b8eb", pattern: "bacteria-light" },
      { label: "Stained Selection", tone: "#dc6e96", pattern: "bacteria-stain" },
      { label: "Electron Microscope", tone: "#8c8c8c", pattern: "electron" },
    ],
    organelles: [
      {
        id: "nucleoid",
        name: "Nucleoid",
        subtitle: "The naked genome",
        color: "#7a43ad",
        attributes: [
          { label: "Size", value: "About 1 µm region" },
          { label: "Membrane", value: "None" },
          { label: "Visible in LM", value: "No, EM only" },
        ],
        note:
          "Unlike eukaryotic cells, bacteria have no nuclear envelope. Their DNA floats in a cytoplasm region called the nucleoid.",
        fact: "There are more bacterial cells in your body than many people expect.",
      },
      {
        id: "cellWall",
        name: "Cell Wall",
        subtitle: "The protective shell",
        color: "#55aa89",
        attributes: [
          { label: "Material", value: "Peptidoglycan" },
          { label: "Role", value: "Shape and defense" },
          { label: "Position", value: "Outside membrane" },
        ],
        note:
          "The bacterial cell wall helps cells resist pressure and gives many species their characteristic shapes.",
        fact: "Gram staining reveals differences in bacterial wall structure.",
      },
      {
        id: "flagellum",
        name: "Flagellum",
        subtitle: "The swimming tail",
        color: "#b87438",
        attributes: [
          { label: "Role", value: "Movement" },
          { label: "Shape", value: "Helical filament" },
          { label: "Visible in LM", value: "Special stain" },
        ],
        note:
          "Some bacteria rotate flagella like tiny motors to move through liquid environments.",
        fact: "Bacterial flagella are powered by ion gradients.",
      },
    ],
  },
  {
    id: "animal",
    name: "Animal Cell",
    type: "Eukaryotic Cell",
    accent: "#9b74b7",
    accentSoft: "#efe5f6",
    color: "#9db6dc",
    modelKind: "animal",
    defaultOrganelle: "mitochondrion",
    comparison: "plant",
    clinicalContext:
      "This general eukaryotic model helps learners anchor organelle functions before applying them to human tissues and disease mechanisms.",
    renderImage: {
      url: "/cell-renders-transparent/animal.png",
      aspect: "square",
    },
    modelAsset: {
      url: "/models/animal-cell-nih.glb",
      previewUrl: "/nih-previews/animal-cell-nih.png",
      sourceLabel: "NIH 3D Animal Cell",
      sourceUrl: "https://3d.nih.gov/entries/3DPX-015797/2",
      scale: 0.044,
      rotation: [0.24, -0.08, 0.03],
      position: [0, -0.03, 0],
      exposure: 1.12,
    },
    occurrence: {
      title: "Animal tissues",
      body: "Animal cells form flexible tissues with membranes, internal organelles, and specialized signaling structures.",
      motif: "animal",
    },
    microscope: [
      { label: "Light Microscope", tone: "#d9a7c7", pattern: "animal-light" },
      { label: "Stained Selection", tone: "#b889da", pattern: "animal-stain" },
      { label: "Electron Microscope", tone: "#8b8b8d", pattern: "electron" },
    ],
    organelles: [
      {
        id: "mitochondrion",
        name: "Mitochondrion",
        subtitle: "The energy converter",
        color: "#cf6f42",
        attributes: [
          { label: "Length", value: "1 to 10 µm" },
          { label: "Membrane", value: "Double" },
          { label: "Role", value: "ATP production" },
        ],
        note:
          "Mitochondria convert fuel molecules into usable cellular energy through folded inner membranes.",
        fact: "Mitochondria contain their own small DNA genome.",
      },
      {
        id: "nucleus",
        name: "Nucleus",
        subtitle: "The command room",
        color: "#7a49b0",
        attributes: [
          { label: "Shape", value: "Rounded" },
          { label: "Membrane", value: "Double" },
          { label: "Visible in LM", value: "Yes" },
        ],
        note:
          "The nucleus stores chromosomes and regulates which genes are active in a cell.",
        fact: "Not all animal cells keep a nucleus. Mature red blood cells lose theirs.",
      },
      {
        id: "golgi",
        name: "Golgi Apparatus",
        subtitle: "The packaging stack",
        color: "#d49057",
        attributes: [
          { label: "Shape", value: "Flattened stacks" },
          { label: "Role", value: "Modify and sort" },
          { label: "Position", value: "Near nucleus" },
        ],
        note:
          "The Golgi apparatus modifies, sorts, and ships proteins and lipids to their destinations.",
        fact: "Secretory cells often have a prominent Golgi apparatus.",
      },
    ],
  },
  {
    id: "muscle",
    name: "Muscle Cell",
    type: "Muscle Fiber",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#ca6678",
    modelKind: "muscle",
    defaultOrganelle: "myofibril",
    comparison: "neuron",
    clinicalContext:
      "Muscle fiber architecture links microscopic structure with contraction, fatigue, rehabilitation, and neuromuscular disease teaching.",
    renderImage: {
      url: "/cell-renders-transparent/muscle.png",
      aspect: "wide",
    },
    occurrence: {
      title: "Skeletal muscles",
      body: "Muscle fibers contain repeating contractile bundles that shorten to generate force.",
      motif: "muscle",
    },
    microscope: [
      { label: "Light Microscope", tone: "#ef9aab", pattern: "muscle-light" },
      { label: "Stained Selection", tone: "#c7508d", pattern: "muscle-stain" },
      { label: "Electron Microscope", tone: "#8d8d8d", pattern: "electron" },
    ],
    organelles: [
      {
        id: "myofibril",
        name: "Myofibril",
        subtitle: "The contracting thread",
        color: "#bd3d51",
        attributes: [
          { label: "Diameter", value: "About 1 µm" },
          { label: "Arrangement", value: "Striated bundles" },
          { label: "Visible in LM", value: "Yes, banded" },
        ],
        note:
          "Each muscle fiber contains hundreds to thousands of myofibrils running its full length, packed tightly together.",
        fact: "A single muscle fiber can be up to 30 cm long.",
      },
      {
        id: "sarcolemma",
        name: "Sarcolemma",
        subtitle: "The excitable membrane",
        color: "#d7b284",
        attributes: [
          { label: "Position", value: "Outer surface" },
          { label: "Role", value: "Signal spread" },
          { label: "Type", value: "Cell membrane" },
        ],
        note:
          "The sarcolemma conducts electrical signals that trigger contraction throughout the muscle fiber.",
        fact: "Membrane signals reach deep into fibers through T tubules.",
      },
      {
        id: "mitochondria",
        name: "Mitochondria",
        subtitle: "The endurance supply",
        color: "#cf7042",
        attributes: [
          { label: "Role", value: "Energy supply" },
          { label: "Position", value: "Between fibers" },
          { label: "Density", value: "Activity dependent" },
        ],
        note:
          "Muscle cells need many mitochondria because contraction consumes large amounts of ATP.",
        fact: "Endurance training can increase mitochondrial density.",
      },
    ],
  },
];

export function getCellById(id: string) {
  return cells.find((cell) => cell.id === id) ?? cells[0];
}

export type CellCategory =
  | "Cells"
  | "Organs"
  | "Body Systems"
  | "Bones & Joints"
  | "Macromolecules"
  | "Viruses"
  | "Botanical Specimens";

export const CELL_CATEGORY_ORDER: CellCategory[] = [
  "Cells",
  "Organs",
  "Body Systems",
  "Bones & Joints",
  "Macromolecules",
  "Viruses",
  "Botanical Specimens",
];

export function categorize(cell: CellItem): CellCategory {
  const t = cell.type.toLowerCase();
  if (t.includes("virus")) return "Viruses";
  if (t.includes("botanical") || t.includes("pollen")) return "Botanical Specimens";
  if (t.includes("macromolecule")) return "Macromolecules";
  if (t.includes("bone") || t.includes("joint")) return "Bones & Joints";
  if (t.includes("system")) return "Body Systems";
  if (t.includes("cell") || t.includes("fiber")) return "Cells";
  if (t.includes("organ")) return "Organs";
  return "Cells";
}
