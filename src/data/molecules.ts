export type ModelKind =
  | "water"
  | "methane"
  | "glucose"
  | "ammonia"
  | "benzene"
  | "ethanol"
  | "co2";

export type ViewMode = "mesh" | "focus";

export type ComponentItem = {
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

export type MoleculeModelAsset = {
  url: string;
  previewUrl: string;
  sourceLabel: string;
  sourceUrl: string;
  scale: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  exposure?: number;
  materialMode?: "studio" | "native";
};

export type MoleculeRenderImage = {
  url: string;
  aspect: "square" | "wide" | "landscape";
};

export type MoleculeItem = {
  id: string;
  name: string;
  type: string;
  accent: string;
  accentSoft: string;
  color: string;
  modelKind: ModelKind;
  defaultComponent: string;
  comparison: string;
  modelAsset?: MoleculeModelAsset;
  renderImage?: MoleculeRenderImage;
  occurrence: {
    title: string;
    body: string;
    motif: string;
  };
  spectroscopy: Array<{
    label: string;
    tone: string;
    pattern: string;
  }>;
  components: ComponentItem[];
};

export const molecules: MoleculeItem[] = [
  {
    id: "water",
    name: "Water",
    type: "Polar Molecule  ·  H₂O",
    accent: "#1e88e5",
    accentSoft: "#e3f2fd",
    color: "#64b5f6",
    modelKind: "water",
    defaultComponent: "ohBond",
    comparison: "methane",
    occurrence: {
      title: "Oceans, rivers, living cells",
      body: "Water covers 71% of Earth's surface and is the universal solvent for all known biochemistry. Every living cell depends on water's unique polar properties to dissolve ions, carry nutrients, and enable chemical reactions.",
      motif: "wave",
    },
    spectroscopy: [
      { label: "¹H NMR", tone: "#90caf9", pattern: "nmr-singlet" },
      { label: "IR Spectrum", tone: "#f48fb1", pattern: "ir-broad-oh" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-18" },
    ],
    components: [
      {
        id: "ohBond",
        name: "O–H Bond",
        subtitle: "The polar link",
        color: "#cc6644",
        attributes: [
          { label: "Bond length", value: "0.96 Å" },
          { label: "Bond angle", value: "104.5°" },
          { label: "Δ Electronegativity", value: "1.4 (Pauling)" },
        ],
        note: "Oxygen strongly pulls electron density toward itself, creating a partial negative charge (δ−) on O and partial positive charge (δ+) on each H. This polarity drives water's ability to form hydrogen bonds with neighboring molecules.",
        fact: "Water's O–H bonds are among the most polar bonds found in common everyday molecules.",
      },
      {
        id: "lonePair",
        name: "Lone Pairs",
        subtitle: "The geometry shapers",
        color: "#9966cc",
        attributes: [
          { label: "Count", value: "2 pairs on oxygen" },
          { label: "Hybridization", value: "sp³" },
          { label: "Effect", value: "Compresses H–O–H angle" },
        ],
        note: "Two lone pairs on oxygen repel the bonding pairs more strongly than bonding pairs repel each other. This pushes the H–O–H angle below the tetrahedral ideal of 109.5° down to 104.5°, giving water its characteristic bent shape.",
        fact: "Without lone pair repulsion, water would be linear and have no net dipole — it would boil near −80 °C and life as we know it could not exist.",
      },
      {
        id: "dipole",
        name: "Dipole Moment",
        subtitle: "The polar pull",
        color: "#2266bb",
        attributes: [
          { label: "Magnitude", value: "1.85 D" },
          { label: "Direction", value: "Toward oxygen" },
          { label: "Result", value: "Bent, strongly polar" },
        ],
        note: "The net dipole moment is the vector sum of the two O–H bond dipoles. Because water is bent — not linear — these dipoles add rather than cancel, producing a strong overall polarity pointing toward the oxygen end.",
        fact: "Water's large dipole moment is why it dissolves ionic compounds and creates the hydrogen-bond networks that make ice less dense than liquid water.",
      },
    ],
  },
  {
    id: "methane",
    name: "Methane",
    type: "Nonpolar Molecule  ·  CH₄",
    accent: "#546e7a",
    accentSoft: "#eceff1",
    color: "#90a4ae",
    modelKind: "methane",
    defaultComponent: "chBond",
    comparison: "water",
    occurrence: {
      title: "Natural gas, atmosphere, wetlands",
      body: "Methane is the dominant component of natural gas and forms naturally in wetlands and animal digestive systems. It is the simplest organic molecule and the conceptual starting point for all of alkane chemistry.",
      motif: "microbe",
    },
    spectroscopy: [
      { label: "¹H NMR", tone: "#b0bec5", pattern: "nmr-singlet" },
      { label: "IR Spectrum", tone: "#80cbc4", pattern: "ir-ch-stretch" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-16" },
    ],
    components: [
      {
        id: "chBond",
        name: "C–H Bond",
        subtitle: "The tetrahedral arm",
        color: "#778899",
        attributes: [
          { label: "Bond length", value: "1.09 Å" },
          { label: "Bond angle", value: "109.5°" },
          { label: "Δ Electronegativity", value: "0.4 (slight)" },
        ],
        note: "Each C–H bond is slightly polar because carbon and hydrogen have different electronegativities. However, four identical bonds point toward the corners of a perfect tetrahedron, so their individual dipoles cancel exactly, making the whole molecule nonpolar.",
        fact: "Methane's C–H bond length (1.09 Å) and strength (~435 kJ/mol) set the benchmark for sp³ carbon across all of organic chemistry.",
      },
      {
        id: "carbon",
        name: "sp³ Carbon Center",
        subtitle: "The tetrahedral hub",
        color: "#444444",
        attributes: [
          { label: "Hybridization", value: "sp³" },
          { label: "Geometry", value: "Tetrahedral" },
          { label: "Bond angles", value: "109.5°" },
        ],
        note: "The central carbon uses sp³ hybrid orbitals — one s and three p orbitals combined into four equivalent hybrids that point toward the corners of a tetrahedron. This geometry is the foundation of saturated carbon chemistry.",
        fact: "sp³ hybridization is the most common bonding arrangement for carbon in organic molecules — it appears in fats, sugars, amino acids, and most drug molecules.",
      },
      {
        id: "vdw",
        name: "Van der Waals Forces",
        subtitle: "The weak attraction",
        color: "#aaccff",
        attributes: [
          { label: "Type", value: "London dispersion" },
          { label: "Strength", value: "Very weak (~2 kJ/mol)" },
          { label: "Boiling point", value: "−161.5 °C" },
        ],
        note: "Methane molecules attract each other only through temporary induced dipoles — London dispersion forces. Because the electron cloud is small and symmetric, these forces are extremely weak, giving methane an extraordinarily low boiling point.",
        fact: "Methane stays a gas at room temperature because London dispersion forces between CH₄ molecules are too weak to condense it — contrast with water's bp of 100 °C.",
      },
    ],
  },
  {
    id: "glucose",
    name: "Glucose",
    type: "Monosaccharide  ·  C₆H₁₂O₆",
    accent: "#f57c00",
    accentSoft: "#fff3e0",
    color: "#ffb74d",
    modelKind: "glucose",
    defaultComponent: "hydroxyl",
    comparison: "ethanol",
    occurrence: {
      title: "Fruits, blood, plant tissues",
      body: "Glucose circulates in the bloodstream as the primary fuel for the brain and muscles. Plants synthesize it from CO₂ and water through photosynthesis, then link glucose units into starch for energy storage and cellulose for structural support.",
      motif: "leaf",
    },
    spectroscopy: [
      { label: "¹H NMR", tone: "#ffcc80", pattern: "nmr-complex" },
      { label: "IR Spectrum", tone: "#a5d6a7", pattern: "ir-oh-broad" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-180" },
    ],
    components: [
      {
        id: "hydroxyl",
        name: "Hydroxyl Groups",
        subtitle: "The hydrogen-bond donors",
        color: "#cc4422",
        attributes: [
          { label: "Count", value: "5 free –OH groups" },
          { label: "pKa", value: "~12–16 (weakly acidic)" },
          { label: "Role", value: "Solubility and reactivity" },
        ],
        note: "Each –OH group can both donate and accept hydrogen bonds, making glucose highly soluble in water. These groups are also the reactive sites where glucose links to other sugars, is phosphorylated by kinases, or is modified by enzymes during metabolism.",
        fact: "Plants link glucose units through hydroxyl groups — β-1,4 linkages build indigestible cellulose; α-1,4 linkages build digestible starch.",
      },
      {
        id: "ring",
        name: "Pyranose Ring",
        subtitle: "The six-membered frame",
        color: "#c8960a",
        attributes: [
          { label: "Ring atoms", value: "5 C + 1 O (C1–C5–O)" },
          { label: "Conformation", value: "Chair (lowest energy)" },
          { label: "Stability", value: "Preferred in solution" },
        ],
        note: "In aqueous solution, glucose predominantly exists as a six-membered pyranose ring, with oxygen bridging C1 and C5. The chair conformation minimizes steric strain and places most bulky groups in equatorial positions.",
        fact: "The ring and open-chain forms interconvert through a process called mutarotation, reaching equilibrium at about 64% β-glucose and 36% α-glucose.",
      },
      {
        id: "anomericC",
        name: "Anomeric Carbon",
        subtitle: "The α/β switch",
        color: "#e67e22",
        attributes: [
          { label: "Position", value: "C1 (ring junction)" },
          { label: "Configurations", value: "α (OH axial) · β (OH equatorial)" },
          { label: "Process", value: "Mutarotation in solution" },
        ],
        note: "The anomeric carbon (C1) can be in two configurations that differ only in the orientation of the C1 hydroxyl. This seemingly minor difference determines whether glucose polymerizes into digestible starch (α) or indigestible cellulose (β).",
        fact: "β-D-glucose forms cellulose through β-1,4 bonds; the same sugar in the α configuration forms starch through α-1,4 bonds — a difference that determines whether you can digest it.",
      },
    ],
  },
  {
    id: "ammonia",
    name: "Ammonia",
    type: "Trigonal Pyramidal  ·  NH₃",
    accent: "#388e3c",
    accentSoft: "#e8f5e9",
    color: "#81c784",
    modelKind: "ammonia",
    defaultComponent: "nhBond",
    comparison: "water",
    occurrence: {
      title: "Fertilizers, cleaning agents, atmosphere",
      body: "Ammonia is synthesized industrially via the Haber–Bosch process to produce nitrogen fertilizers that feed billions of people. It also forms naturally during protein metabolism and cycles through ecosystems as part of the nitrogen cycle.",
      motif: "surface",
    },
    spectroscopy: [
      { label: "¹H NMR", tone: "#c8e6c9", pattern: "nmr-triplet" },
      { label: "IR Spectrum", tone: "#ffe082", pattern: "ir-nh" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-17" },
    ],
    components: [
      {
        id: "nhBond",
        name: "N–H Bond",
        subtitle: "The polar arm",
        color: "#3377cc",
        attributes: [
          { label: "Bond length", value: "1.01 Å" },
          { label: "H–N–H angle", value: "107.8°" },
          { label: "Δ Electronegativity", value: "0.9 (δ+ on H)" },
        ],
        note: "Each N–H bond is polar because nitrogen is significantly more electronegative than hydrogen. The three polar bonds and the pyramidal geometry mean their dipoles add rather than cancel, giving ammonia a substantial net dipole moment.",
        fact: "Ammonia's polar N–H bonds let it dissolve readily in water, forming the weak base ammonium hydroxide (a familiar cleaning agent).",
      },
      {
        id: "lonePair",
        name: "Lone Pair",
        subtitle: "The base donor",
        color: "#9966cc",
        attributes: [
          { label: "Location", value: "Apex of pyramid" },
          { label: "pKb (NH₃)", value: "4.74 in water" },
          { label: "Function", value: "Lewis base and nucleophile" },
        ],
        note: "The lone pair on nitrogen sits at the apex of the trigonal pyramid and is directly responsible for ammonia's basic character. It readily accepts a proton from acids or donates electron density to electrophiles, making ammonia one of the most important bases in chemistry.",
        fact: "Ammonia is the conjugate base of the ammonium ion (NH₄⁺, pKa ≈ 9.25) — roughly ten million times weaker as a base than hydroxide.",
      },
      {
        id: "dipole",
        name: "Dipole Moment",
        subtitle: "The polar vector",
        color: "#2266bb",
        attributes: [
          { label: "Magnitude", value: "1.47 D" },
          { label: "Direction", value: "Along N–lone pair axis" },
          { label: "Geometry", value: "Trigonal pyramidal" },
        ],
        note: "Unlike a planar trigonal molecule where bond dipoles would cancel, the pyramidal shape of ammonia means the three N–H dipoles add up to give a net dipole pointing from the hydrogen base toward the nitrogen lone pair.",
        fact: "Ammonia's dipole moment (1.47 D) is smaller than water's (1.85 D) despite having a similar structure — because N–H bonds are less polar than O–H bonds.",
      },
    ],
  },
  {
    id: "benzene",
    name: "Benzene",
    type: "Aromatic Hydrocarbon  ·  C₆H₆",
    accent: "#7b1fa2",
    accentSoft: "#f3e5f5",
    color: "#ba68c8",
    modelKind: "benzene",
    defaultComponent: "piCloud",
    comparison: "methane",
    occurrence: {
      title: "Petroleum, plastics, pharmaceuticals",
      body: "Benzene is a component of crude oil and the structural parent of all aromatic chemistry. It is a precursor to nylon, polystyrene, aspirin, and thousands of industrial chemicals. Its aromaticity makes it the gateway to understanding delocalization.",
      motif: "nerve",
    },
    spectroscopy: [
      { label: "¹H NMR", tone: "#ce93d8", pattern: "nmr-singlet" },
      { label: "UV-Vis", tone: "#90caf9", pattern: "uv-aromatic" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-78" },
    ],
    components: [
      {
        id: "piCloud",
        name: "π Electron Cloud",
        subtitle: "The aromatic halo",
        color: "#7b1fa2",
        attributes: [
          { label: "π electrons", value: "6 (fully delocalized)" },
          { label: "Resonance energy", value: "~150 kJ/mol" },
          { label: "Hückel rule", value: "4n+2 with n = 1 ✓" },
        ],
        note: "Six π electrons are delocalized over all six carbon atoms, forming a continuous electron cloud above and below the ring plane. This delocalization satisfies Hückel's 4n+2 rule (n=1) and confers exceptional thermodynamic stability called aromaticity.",
        fact: "Benzene's aromatic stability was the mystery that drove 19th-century organic chemistry — Kekulé reportedly dreamed of a snake eating its own tail before proposing the ring structure in 1865.",
      },
      {
        id: "ring",
        name: "Carbon Ring",
        subtitle: "The hexagonal frame",
        color: "#c09030",
        attributes: [
          { label: "C–C bond length", value: "1.40 Å (intermediate)" },
          { label: "Bond angles", value: "120°" },
          { label: "Hybridization", value: "sp² on each C" },
        ],
        note: "All six C–C bonds are identical at 1.40 Å — intermediate between a typical single bond (1.54 Å) and a double bond (1.34 Å). This uniformity is direct spectroscopic evidence of electron delocalization and resonance.",
        fact: "The 1.40 Å C–C bond in benzene is the definitive signature of aromaticity — measuring this length in an unknown compound confirms a benzene-like ring.",
      },
      {
        id: "chBond",
        name: "C–H Bonds",
        subtitle: "The peripheral arms",
        color: "#778899",
        attributes: [
          { label: "Count", value: "6" },
          { label: "Bond length", value: "1.08 Å" },
          { label: "Orientation", value: "In ring plane" },
        ],
        note: "Each sp² carbon bears one hydrogen lying in the ring plane. The remaining p orbital on each carbon is perpendicular to the ring and contributes to the π system above and below. These aromatic C–H bonds are slightly shorter and stronger than those in saturated alkanes.",
        fact: "Aromatic C–H bonds require strong electrophiles (with Lewis acid catalysts) to react — unlike alkene C–H bonds — because breaking aromaticity costs the ~150 kJ/mol resonance energy.",
      },
    ],
  },
  {
    id: "ethanol",
    name: "Ethanol",
    type: "Primary Alcohol  ·  C₂H₅OH",
    accent: "#e65100",
    accentSoft: "#fbe9e7",
    color: "#ff8a65",
    modelKind: "ethanol",
    defaultComponent: "hydroxyl",
    comparison: "glucose",
    occurrence: {
      title: "Beverages, biofuel, disinfectants",
      body: "Ethanol is produced by yeast fermentation of sugars and is the alcohol in alcoholic beverages. It is also blended into gasoline as a renewable biofuel and is one of the most widely used broad-spectrum antiseptics.",
      motif: "blood",
    },
    spectroscopy: [
      { label: "¹H NMR", tone: "#ffab91", pattern: "nmr-multiplet" },
      { label: "IR Spectrum", tone: "#f48fb1", pattern: "ir-oh-alcohol" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-46" },
    ],
    components: [
      {
        id: "hydroxyl",
        name: "Hydroxyl Group",
        subtitle: "The hydrogen bonder",
        color: "#cc4422",
        attributes: [
          { label: "pKa", value: "15.9 (weakly acidic)" },
          { label: "O–C–H angle", value: "~108°" },
          { label: "Character", value: "Strongly polar" },
        ],
        note: "The –OH group defines the alcohol functional group. It makes ethanol miscible with water through hydrogen bonding and is the site of most of ethanol's chemistry — oxidation to acetaldehyde, esterification with acids, and dehydration to ethylene.",
        fact: "Ethanol boils at 78.4 °C while ethane boils at −89 °C — the only difference is the –OH group and the hydrogen bonding it enables.",
      },
      {
        id: "alkyl",
        name: "Ethyl Chain",
        subtitle: "The hydrophobic tail",
        color: "#777777",
        attributes: [
          { label: "Formula", value: "–CH₂CH₃" },
          { label: "Hybridization", value: "sp³ on both carbons" },
          { label: "Character", value: "Nonpolar" },
        ],
        note: "The two-carbon alkyl chain is nonpolar and gives ethanol its hydrophobic portion. The balance between the polar –OH and the nonpolar ethyl tail explains why ethanol mixes completely with both water and many organic solvents.",
        fact: "Longer-chain alcohols become increasingly hydrophobic — butanol separates from water, and octanol is essentially insoluble.",
      },
      {
        id: "hBond",
        name: "Hydrogen Bonding",
        subtitle: "The intermolecular link",
        color: "#5599dd",
        attributes: [
          { label: "Type", value: "O–H···O" },
          { label: "Strength", value: "~21 kJ/mol per bond" },
          { label: "Effect", value: "Elevates boiling point" },
        ],
        note: "Ethanol molecules hydrogen-bond to each other and to water through the –OH group, significantly raising the boiling point above what van der Waals forces alone would predict. This also drives ethanol's complete miscibility with water at all proportions.",
        fact: "Ethanol and water form an azeotrope at 95.6% ethanol that cannot be separated further by simple distillation — absolute ethanol requires molecular sieves or vacuum fractional distillation.",
      },
    ],
  },
  {
    id: "co2",
    name: "Carbon Dioxide",
    type: "Linear Molecule  ·  CO₂",
    accent: "#00695c",
    accentSoft: "#e0f2f1",
    color: "#4db6ac",
    modelKind: "co2",
    defaultComponent: "doubleBond",
    comparison: "water",
    occurrence: {
      title: "Atmosphere, carbonated drinks, photosynthesis",
      body: "CO₂ cycles continuously between the atmosphere, oceans, and living organisms. Plants consume it in photosynthesis to build organic molecules. As the primary greenhouse gas, its rising atmospheric concentration drives global climate change.",
      motif: "animal",
    },
    spectroscopy: [
      { label: "IR Spectrum", tone: "#80cbc4", pattern: "ir-co2-stretch" },
      { label: "Raman Spectrum", tone: "#a5d6a7", pattern: "raman-symmetric" },
      { label: "Mass Spectrum", tone: "#9e9e9e", pattern: "mass-44" },
    ],
    components: [
      {
        id: "doubleBond",
        name: "C=O Double Bond",
        subtitle: "The resonant connection",
        color: "#cc3344",
        attributes: [
          { label: "Bond length", value: "1.16 Å" },
          { label: "Bond order", value: "2 (σ + π)" },
          { label: "Δ Electronegativity", value: "1.0 (polar bond)" },
        ],
        note: "Each C=O double bond consists of one σ bond and one π bond. Although each bond is individually polar — oxygen pulling electrons strongly — the two bonds point in exactly opposite directions and their dipole moments cancel completely in the linear geometry.",
        fact: "CO₂ absorbs and re-emits infrared radiation through its asymmetric stretching vibration at 2349 cm⁻¹ — this is the physical mechanism of the greenhouse effect.",
      },
      {
        id: "carbon",
        name: "Carbon Center",
        subtitle: "The linear hub",
        color: "#444444",
        attributes: [
          { label: "Hybridization", value: "sp" },
          { label: "Bond angle", value: "180°" },
          { label: "Formal charge", value: "0" },
        ],
        note: "The central carbon uses sp hybridization, placing its two σ bonds exactly 180° apart. The two remaining p orbitals on carbon are perpendicular to each other and each overlaps with a p orbital on an oxygen to form the two π bonds.",
        fact: "sp hybridization occurs whenever carbon forms exactly two bonds — as in CO₂ and in alkynes — always forcing a linear (180°) arrangement.",
      },
      {
        id: "linear",
        name: "Linear Geometry",
        subtitle: "The zero-dipole form",
        color: "#44aaaa",
        attributes: [
          { label: "Bond angle", value: "180°" },
          { label: "Net dipole", value: "0 D (nonpolar overall)" },
          { label: "Symmetry", value: "D∞h" },
        ],
        note: "Despite having two highly polar C=O bonds, the 180° linear geometry means the two bond dipoles are exactly anti-parallel and cancel completely. CO₂ is therefore a nonpolar molecule overall, even though the individual bonds are strongly polar.",
        fact: "CO₂ is nonpolar yet dissolves in water by reacting chemically: CO₂ + H₂O ⇌ H₂CO₃ (carbonic acid), which ionizes to make carbonated water acidic (pH ~3.7).",
      },
    ],
  },
];

export function getMoleculeById(id: string): MoleculeItem {
  return molecules.find((m) => m.id === id) ?? molecules[0];
}
