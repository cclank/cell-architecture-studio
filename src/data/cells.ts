export type ModelKind =
  | "plant"
  | "whiteBlood"
  | "neuron"
  | "epithelial"
  | "bacteria"
  | "animal"
  | "muscle";

export type ViewMode = "mesh" | "focus";

export type MicroscopeKind = "light" | "stained" | "electron";

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

export type CellCategory =
  | "Cells"
  | "Organs"
  | "Body Systems"
  | "Bones & Joints"
  | "Macromolecules"
  | "Viruses"
  | "Botanical Specimens";

export type CellStructure = {
  id: string;
  accent: string;
  accentSoft: string;
  color: string;
  modelKind: ModelKind;
  defaultOrganelle: string;
  comparison: string;
  category: CellCategory;
  modelAsset?: CellModelAsset;
  renderImage?: CellRenderImage;
  occurrenceMotif: string;
  microscope: Array<{
    kind: MicroscopeKind;
    tone: string;
    pattern: string;
  }>;
  organelles: Array<{
    id: string;
    color: string;
  }>;
};

export type CellItem = Omit<CellStructure, "organelles" | "microscope" | "occurrenceMotif"> & {
  name: string;
  type: string;
  aliases: string[];
  clinicalContext: string;
  occurrence: {
    title: string;
    body: string;
    motif: string;
  };
  microscope: Array<{
    kind: MicroscopeKind;
    label: string;
    tone: string;
    pattern: string;
  }>;
  organelles: OrganelleItem[];
};

export const CELL_CATEGORY_ORDER: CellCategory[] = [
  "Cells",
  "Organs",
  "Body Systems",
  "Bones & Joints",
  "Macromolecules",
  "Viruses",
  "Botanical Specimens",
];

export const cells: CellStructure[] = [
  {
    id: "plant",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#81b64b",
    modelKind: "plant",
    defaultOrganelle: "nucleus",
    comparison: "animal",
    category: "Cells",
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
    occurrenceMotif: "leaf",
    microscope: [
      { kind: "light", tone: "#b9d48a", pattern: "plant-light" },
      { kind: "stained", tone: "#cf8cc2", pattern: "plant-stain" },
      { kind: "electron", tone: "#9a9a8e", pattern: "electron" },
    ],
    organelles: [
      { id: "nucleus", color: "#7047a8" },
      { id: "chloroplast", color: "#5fa842" },
      { id: "vacuole", color: "#62bdd2" },
      { id: "cellWall", color: "#7aa647" },
    ],
  },
  {
    id: "whiteBlood",
    accent: "#6d78a8",
    accentSoft: "#e6eaf7",
    color: "#b9bfd7",
    modelKind: "whiteBlood",
    defaultOrganelle: "lysosome",
    comparison: "epithelial",
    category: "Cells",
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
    occurrenceMotif: "blood",
    microscope: [
      { kind: "light", tone: "#ded6e9", pattern: "blood-light" },
      { kind: "stained", tone: "#9c73be", pattern: "blood-stain" },
      { kind: "electron", tone: "#8f8f91", pattern: "electron" },
    ],
    organelles: [
      { id: "lysosome", color: "#8b54b7" },
      { id: "nucleus", color: "#6f35a1" },
      { id: "granules", color: "#c06696" },
    ],
  },
  {
    id: "neuron",
    accent: "#6578b5",
    accentSoft: "#e4e9f8",
    color: "#8c91d0",
    modelKind: "neuron",
    defaultOrganelle: "axon",
    comparison: "muscle",
    category: "Cells",
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
    occurrenceMotif: "nerve",
    microscope: [
      { kind: "light", tone: "#c9c4ed", pattern: "neuron-light" },
      { kind: "stained", tone: "#dc99cc", pattern: "neuron-stain" },
      { kind: "electron", tone: "#8e8e94", pattern: "electron" },
    ],
    organelles: [
      { id: "axon", color: "#6b7dc6" },
      { id: "soma", color: "#7c52b7" },
      { id: "dendrites", color: "#7d9bcf" },
    ],
  },
  {
    id: "epithelial",
    accent: "#a56d7f",
    accentSoft: "#f4e2e7",
    color: "#d79baa",
    modelKind: "epithelial",
    defaultOrganelle: "microvilli",
    comparison: "animal",
    category: "Cells",
    renderImage: {
      url: "/cell-renders-transparent/epithelial.png",
      aspect: "square",
    },
    occurrenceMotif: "surface",
    microscope: [
      { kind: "light", tone: "#e6a4bd", pattern: "tissue-light" },
      { kind: "stained", tone: "#cb72a4", pattern: "tissue-stain" },
      { kind: "electron", tone: "#989899", pattern: "electron" },
    ],
    organelles: [
      { id: "microvilli", color: "#c86f80" },
      { id: "junctions", color: "#9f6cbd" },
      { id: "nucleus", color: "#7a4aa2" },
    ],
  },
  {
    id: "bacteria",
    accent: "#48a77d",
    accentSoft: "#dbf1e7",
    color: "#65b8ae",
    modelKind: "bacteria",
    defaultOrganelle: "nucleoid",
    comparison: "animal",
    category: "Cells",
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
    occurrenceMotif: "microbe",
    microscope: [
      { kind: "light", tone: "#c7b8eb", pattern: "bacteria-light" },
      { kind: "stained", tone: "#dc6e96", pattern: "bacteria-stain" },
      { kind: "electron", tone: "#8c8c8c", pattern: "electron" },
    ],
    organelles: [
      { id: "nucleoid", color: "#7a43ad" },
      { id: "cellWall", color: "#55aa89" },
      { id: "flagellum", color: "#b87438" },
    ],
  },
  {
    id: "animal",
    accent: "#9b74b7",
    accentSoft: "#efe5f6",
    color: "#9db6dc",
    modelKind: "animal",
    defaultOrganelle: "mitochondrion",
    comparison: "plant",
    category: "Cells",
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
    occurrenceMotif: "animal",
    microscope: [
      { kind: "light", tone: "#d9a7c7", pattern: "animal-light" },
      { kind: "stained", tone: "#b889da", pattern: "animal-stain" },
      { kind: "electron", tone: "#8b8b8d", pattern: "electron" },
    ],
    organelles: [
      { id: "mitochondrion", color: "#cf6f42" },
      { id: "nucleus", color: "#7a49b0" },
      { id: "golgi", color: "#d49057" },
    ],
  },
  {
    id: "muscle",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#ca6678",
    modelKind: "muscle",
    defaultOrganelle: "myofibril",
    comparison: "neuron",
    category: "Cells",
    renderImage: {
      url: "/cell-renders-transparent/muscle.png",
      aspect: "wide",
    },
    occurrenceMotif: "muscle",
    microscope: [
      { kind: "light", tone: "#ef9aab", pattern: "muscle-light" },
      { kind: "stained", tone: "#c7508d", pattern: "muscle-stain" },
      { kind: "electron", tone: "#8d8d8d", pattern: "electron" },
    ],
    organelles: [
      { id: "myofibril", color: "#bd3d51" },
      { id: "sarcolemma", color: "#d7b284" },
      { id: "mitochondria", color: "#cf7042" },
    ],
  },
];

export function getCellById(id: string): CellStructure {
  return cells.find((cell) => cell.id === id) ?? cells[0];
}

export function categorize(cell: { category: CellCategory }): CellCategory {
  return cell.category;
}
