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
  nameZh: string;
  subtitle: string;
  subtitleZh: string;
  color: string;
  attributes: Array<{
    label: string;
    labelZh: string;
    value: string;
    valueZh: string;
  }>;
  note: string;
  noteZh: string;
  fact: string;
  factZh: string;
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
  materialMode?: "studio" | "native";
};

export type CellRenderImage = {
  url: string;
  aspect: "square" | "wide" | "landscape";
};

export type CellItem = {
  id: string;
  name: string;
  nameZh: string;
  type: string;
  typeZh: string;
  accent: string;
  accentSoft: string;
  color: string;
  modelKind: ModelKind;
  defaultOrganelle: string;
  comparison: string;
  modelAsset?: CellModelAsset;
  renderImage?: CellRenderImage;
  occurrence: {
    title: string;
    titleZh: string;
    body: string;
    bodyZh: string;
    motif: string;
  };
  microscope: Array<{
    label: string;
    labelZh: string;
    tone: string;
    pattern: string;
  }>;
  organelles: OrganelleItem[];
};

export const cells: CellItem[] = [
  {
    id: "plant",
    name: "Plant Cell",
    nameZh: "植物细胞",
    type: "Eukaryotic Cell",
    typeZh: "真核细胞",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#81b64b",
    modelKind: "plant",
    defaultOrganelle: "nucleus",
    comparison: "animal",
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
      titleZh: "叶片、茎干、根部",
      body: "Plant cells form tissues that store energy, move water, and turn sunlight into sugars.",
      bodyZh: "植物细胞形成组织，储存能量、输送水分，并将阳光转化为糖类。",
      motif: "leaf",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#b9d48a", pattern: "plant-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#cf8cc2", pattern: "plant-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#9a9a8e", pattern: "electron" },
    ],
    organelles: [
      {
        id: "nucleus",
        name: "Nucleus",
        nameZh: "细胞核",
        subtitle: "The control center",
        subtitleZh: "控制中心",
        color: "#7047a8",
        attributes: [
          { label: "Size", labelZh: "大小", value: "5 to 10 µm in diameter", valueZh: "直径 5 至 10 微米" },
          { label: "Location", labelZh: "位置", value: "Usually central", valueZh: "通常位于中央" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Yes", valueZh: "是" },
        ],
        note:
          "The nucleus is surrounded by a double membrane called the nuclear envelope, which contains pores that regulate molecular traffic.",
        noteZh:
          "细胞核由称为核膜的双层膜包裹，核膜上含有调节分子运输的核孔。",
        fact: "The nucleus was one of the first cell structures discovered.",
        factZh: "细胞核是最早被发现的细胞结构之一。",
      },
      {
        id: "chloroplast",
        name: "Chloroplast",
        nameZh: "叶绿体",
        subtitle: "The light harvester",
        subtitleZh: "光能采集者",
        color: "#5fa842",
        attributes: [
          { label: "Role", labelZh: "功能", value: "Photosynthesis", valueZh: "光合作用" },
          { label: "Pigment", labelZh: "色素", value: "Chlorophyll", valueZh: "叶绿素" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Often", valueZh: "常见" },
        ],
        note:
          "Chloroplasts convert light energy into chemical energy and give many plant tissues their green color.",
        noteZh:
          "叶绿体将光能转化为化学能，并赋予许多植物组织绿色。",
        fact: "A single leaf cell can contain dozens of chloroplasts.",
        factZh: "单个叶肉细胞可包含数十个叶绿体。",
      },
      {
        id: "vacuole",
        name: "Vacuole",
        nameZh: "液泡",
        subtitle: "The pressure reservoir",
        subtitleZh: "压力储库",
        color: "#62bdd2",
        attributes: [
          { label: "Volume", labelZh: "体积", value: "Large central space", valueZh: "中央大空间" },
          { label: "Content", labelZh: "内容物", value: "Water and solutes", valueZh: "水与溶质" },
          { label: "Function", labelZh: "功能", value: "Turgor support", valueZh: "膨压支撑" },
        ],
        note:
          "The central vacuole stores water, ions, and small molecules while helping the plant cell remain firm.",
        noteZh:
          "中央液泡储存水分、离子和小分子，同时帮助植物细胞保持坚挺。",
        fact: "Vacuoles can occupy most of a mature plant cell.",
        factZh: "液泡可占据成熟植物细胞的大部分空间。",
      },
      {
        id: "cellWall",
        name: "Cell Wall",
        nameZh: "细胞壁",
        subtitle: "The rigid frame",
        subtitleZh: "刚性框架",
        color: "#7aa647",
        attributes: [
          { label: "Material", labelZh: "材质", value: "Cellulose rich", valueZh: "富含纤维素" },
          { label: "Position", labelZh: "位置", value: "Outer boundary", valueZh: "外层边界" },
          { label: "Function", labelZh: "功能", value: "Protection", valueZh: "保护作用" },
        ],
        note:
          "The cell wall gives plant cells their regular shape and protects the membrane beneath it.",
        noteZh:
          "细胞壁赋予植物细胞规则的外形，并保护其下方的细胞膜。",
        fact: "Cell walls help plants stand upright without a skeleton.",
        factZh: "细胞壁帮助植物在没有骨骼的情况下直立生长。",
      },
    ],
  },
  {
    id: "whiteBlood",
    name: "White Blood Cell",
    nameZh: "白细胞",
    type: "Immune Cell",
    typeZh: "免疫细胞",
    accent: "#6d78a8",
    accentSoft: "#e6eaf7",
    color: "#b9bfd7",
    modelKind: "whiteBlood",
    defaultOrganelle: "lysosome",
    comparison: "epithelial",
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
      titleZh: "血液、淋巴、组织",
      body: "White blood cells move through blood and tissue spaces to identify threats and coordinate immune defense.",
      bodyZh: "白细胞在血液和组织间隙中移动，识别威胁并协调免疫防御。",
      motif: "blood",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#ded6e9", pattern: "blood-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#9c73be", pattern: "blood-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#8f8f91", pattern: "electron" },
    ],
    organelles: [
      {
        id: "lysosome",
        name: "Lysosome",
        nameZh: "溶酶体",
        subtitle: "The cleanup vesicle",
        subtitleZh: "清理囊泡",
        color: "#8b54b7",
        attributes: [
          { label: "Size", labelZh: "大小", value: "About 1 µm", valueZh: "约 1 微米" },
          { label: "Content", labelZh: "内容物", value: "Digestive enzymes", valueZh: "消化酶" },
          { label: "Role", labelZh: "功能", value: "Breakdown", valueZh: "分解" },
        ],
        note:
          "Lysosomes help immune cells digest engulfed material and recycle worn cellular components.",
        noteZh:
          "溶酶体帮助免疫细胞消化吞噬的物质并回收老旧细胞成分。",
        fact: "White blood cells rely heavily on vesicles for defense.",
        factZh: "白细胞高度依赖囊泡进行防御。",
      },
      {
        id: "nucleus",
        name: "Lobed Nucleus",
        nameZh: "分叶核",
        subtitle: "Flexible genome vault",
        subtitleZh: "灵活的基因库",
        color: "#6f35a1",
        attributes: [
          { label: "Shape", labelZh: "形状", value: "Often lobed", valueZh: "常呈分叶状" },
          { label: "Location", labelZh: "位置", value: "Central", valueZh: "中央" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Yes, with stain", valueZh: "是，需染色" },
        ],
        note:
          "Many white blood cells have a lobed nucleus that helps them squeeze through tight spaces.",
        noteZh:
          "许多白细胞具有分叶核，有助于它们挤过狭窄空间。",
        fact: "Nuclear shape is one clue used to identify immune cell types.",
        factZh: "核形态是识别免疫细胞类型的线索之一。",
      },
      {
        id: "granules",
        name: "Granules",
        nameZh: "颗粒",
        subtitle: "The chemical packets",
        subtitleZh: "化学包裹",
        color: "#c06696",
        attributes: [
          { label: "Content", labelZh: "内容物", value: "Proteins and enzymes", valueZh: "蛋白质和酶" },
          { label: "Use", labelZh: "用途", value: "Defense", valueZh: "防御" },
          { label: "Visibility", labelZh: "可见性", value: "Stain dependent", valueZh: "取决于染色" },
        ],
        note:
          "Granules store molecules that help immune cells respond quickly to infection or inflammation.",
        noteZh:
          "颗粒储存有助于免疫细胞快速响应感染或炎症的分子。",
        fact: "Some immune cells are named by how their granules stain.",
        factZh: "一些免疫细胞根据其颗粒染色特性命名。",
      },
    ],
  },
  {
    id: "neuron",
    name: "Neuron",
    nameZh: "神经元",
    type: "Nerve Cell",
    typeZh: "神经细胞",
    accent: "#6578b5",
    accentSoft: "#e4e9f8",
    color: "#8c91d0",
    modelKind: "neuron",
    defaultOrganelle: "axon",
    comparison: "muscle",
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
      titleZh: "大脑、脊髓、神经",
      body: "Neurons carry electrical and chemical signals through long branching networks.",
      bodyZh: "神经元通过长分支网络传递电信号和化学信号。",
      motif: "nerve",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#c9c4ed", pattern: "neuron-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#dc99cc", pattern: "neuron-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#8e8e94", pattern: "electron" },
    ],
    organelles: [
      {
        id: "axon",
        name: "Axon",
        nameZh: "轴突",
        subtitle: "The signal highway",
        subtitleZh: "信号高速公路",
        color: "#6b7dc6",
        attributes: [
          { label: "Length", labelZh: "长度", value: "µm to over 1 metre", valueZh: "微米至超过 1 米" },
          { label: "Insulation", labelZh: "绝缘", value: "Myelin sheath", valueZh: "髓鞘" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Yes, with stain", valueZh: "是，需染色" },
        ],
        note:
          "Some axons in the human body run from the spine to the foot, making neurons among the longest cells in nature.",
        noteZh:
          "人体中一些轴突从脊柱延伸至足部，使神经元成为自然界中最长的细胞之一。",
        fact: "A nerve impulse can travel at over 100 metres per second.",
        factZh: "神经冲动可以每秒超过 100 米的速度传播。",
      },
      {
        id: "soma",
        name: "Soma",
        nameZh: "胞体",
        subtitle: "The cell body",
        subtitleZh: "细胞体",
        color: "#7c52b7",
        attributes: [
          { label: "Contains", labelZh: "包含", value: "Nucleus", valueZh: "细胞核" },
          { label: "Role", labelZh: "功能", value: "Metabolic hub", valueZh: "代谢中枢" },
          { label: "Shape", labelZh: "形状", value: "Rounded", valueZh: "圆形" },
        ],
        note:
          "The soma maintains the neuron and integrates signals arriving from branching dendrites.",
        noteZh:
          "胞体维持神经元生命并整合来自分支树突的信号。",
        fact: "Most neuron proteins are made in or near the soma.",
        factZh: "大多数神经元蛋白质在胞体或其附近合成。",
      },
      {
        id: "dendrites",
        name: "Dendrites",
        nameZh: "树突",
        subtitle: "The receiving branches",
        subtitleZh: "接收分支",
        color: "#7d9bcf",
        attributes: [
          { label: "Shape", labelZh: "形状", value: "Branched", valueZh: "分支状" },
          { label: "Role", labelZh: "功能", value: "Input", valueZh: "输入" },
          { label: "Surface", labelZh: "表面", value: "Often spiny", valueZh: "常具棘突" },
        ],
        note:
          "Dendrites increase the surface area available for receiving signals from other cells.",
        noteZh:
          "树突增加了接收其他细胞信号的表面积。",
        fact: "A single neuron can receive thousands of synaptic inputs.",
        factZh: "单个神经元可接收数千个突触输入。",
      },
    ],
  },
  {
    id: "epithelial",
    name: "Epithelial Cell",
    nameZh: "上皮细胞",
    type: "Human Tissue Cell",
    typeZh: "人体组织细胞",
    accent: "#a56d7f",
    accentSoft: "#f4e2e7",
    color: "#d79baa",
    modelKind: "epithelial",
    defaultOrganelle: "microvilli",
    comparison: "animal",
    renderImage: {
      url: "/cell-renders-transparent/epithelial.png",
      aspect: "square",
    },
    occurrence: {
      title: "Skin, intestine, airways",
      titleZh: "皮肤、肠道、呼吸道",
      body: "Epithelial cells form protective sheets and absorption surfaces across the body.",
      bodyZh: "上皮细胞在全身形成保护层和吸收表面。",
      motif: "surface",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#e6a4bd", pattern: "tissue-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#cb72a4", pattern: "tissue-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#989899", pattern: "electron" },
    ],
    organelles: [
      {
        id: "microvilli",
        name: "Microvilli",
        nameZh: "微绒毛",
        subtitle: "The absorption brush",
        subtitleZh: "吸收刷状缘",
        color: "#c86f80",
        attributes: [
          { label: "Length", labelZh: "长度", value: "0.5 to 1 µm", valueZh: "0.5 至 1 微米" },
          { label: "Location", labelZh: "位置", value: "Apical surface", valueZh: "顶面" },
          { label: "Role", labelZh: "功能", value: "Surface area", valueZh: "增加表面积" },
        ],
        note:
          "Microvilli increase surface area for absorption and secretion along epithelial sheets.",
        noteZh:
          "微绒毛增加上皮层的表面积，促进吸收和分泌。",
        fact: "Intestinal microvilli form a dense brush border.",
        factZh: "肠道微绒毛形成密集的刷状缘。",
      },
      {
        id: "junctions",
        name: "Tight Junctions",
        nameZh: "紧密连接",
        subtitle: "The sealed seams",
        subtitleZh: "密封接缝",
        color: "#9f6cbd",
        attributes: [
          { label: "Position", labelZh: "位置", value: "Between cells", valueZh: "细胞之间" },
          { label: "Role", labelZh: "功能", value: "Barrier", valueZh: "屏障" },
          { label: "Visibility", labelZh: "可见性", value: "EM preferred", valueZh: "电镜首选" },
        ],
        note:
          "Tight junctions link neighboring epithelial cells and control what passes between them.",
        noteZh:
          "紧密连接连接相邻上皮细胞并控制物质通过。",
        fact: "Epithelial barriers are essential for organ boundaries.",
        factZh: "上皮屏障对器官边界至关重要。",
      },
      {
        id: "nucleus",
        name: "Nucleus",
        nameZh: "细胞核",
        subtitle: "The instruction store",
        subtitleZh: "指令仓库",
        color: "#7a4aa2",
        attributes: [
          { label: "Position", labelZh: "位置", value: "Basal to central", valueZh: "基底至中央" },
          { label: "Shape", labelZh: "形状", value: "Oval", valueZh: "椭圆形" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Yes", valueZh: "是" },
        ],
        note:
          "The epithelial nucleus stores genetic information and changes position depending on tissue shape.",
        noteZh:
          "上皮细胞核储存遗传信息，并根据组织形态改变位置。",
        fact: "Nuclear shape helps pathologists read tissue samples.",
        factZh: "核形态帮助病理学家判读组织样本。",
      },
    ],
  },
  {
    id: "bacteria",
    name: "Bacteria Cell",
    nameZh: "细菌细胞",
    type: "Prokaryotic Cell",
    typeZh: "原核细胞",
    accent: "#48a77d",
    accentSoft: "#dbf1e7",
    color: "#65b8ae",
    modelKind: "bacteria",
    defaultOrganelle: "nucleoid",
    comparison: "animal",
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
      titleZh: "土壤、水、肠道、皮肤",
      body: "Bacteria live in nearly every environment and can exist as independent single cells.",
      bodyZh: "细菌几乎存在于所有环境中，可以独立单细胞形式生存。",
      motif: "microbe",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#c7b8eb", pattern: "bacteria-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#dc6e96", pattern: "bacteria-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#8c8c8c", pattern: "electron" },
    ],
    organelles: [
      {
        id: "nucleoid",
        name: "Nucleoid",
        nameZh: "拟核",
        subtitle: "The naked genome",
        subtitleZh: "裸露的基因组",
        color: "#7a43ad",
        attributes: [
          { label: "Size", labelZh: "大小", value: "About 1 µm region", valueZh: "约 1 微米区域" },
          { label: "Membrane", labelZh: "膜", value: "None", valueZh: "无" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "No, EM only", valueZh: "否，仅电镜" },
        ],
        note:
          "Unlike eukaryotic cells, bacteria have no nuclear envelope. Their DNA floats in a cytoplasm region called the nucleoid.",
        noteZh:
          "与真核细胞不同，细菌没有核膜。其 DNA 漂浮在称为拟核的细胞质区域中。",
        fact: "There are more bacterial cells in your body than many people expect.",
        factZh: "人体内的细菌细胞数量远超许多人的想象。",
      },
      {
        id: "cellWall",
        name: "Cell Wall",
        nameZh: "细胞壁",
        subtitle: "The protective shell",
        subtitleZh: "保护外壳",
        color: "#55aa89",
        attributes: [
          { label: "Material", labelZh: "材质", value: "Peptidoglycan", valueZh: "肽聚糖" },
          { label: "Role", labelZh: "功能", value: "Shape and defense", valueZh: "形状与防御" },
          { label: "Position", labelZh: "位置", value: "Outside membrane", valueZh: "膜外侧" },
        ],
        note:
          "The bacterial cell wall helps cells resist pressure and gives many species their characteristic shapes.",
        noteZh:
          "细菌细胞壁帮助细胞抵抗压力，并赋予许多物种其特征形状。",
        fact: "Gram staining reveals differences in bacterial wall structure.",
        factZh: "革兰氏染色揭示细菌壁结构的差异。",
      },
      {
        id: "flagellum",
        name: "Flagellum",
        nameZh: "鞭毛",
        subtitle: "The swimming tail",
        subtitleZh: "游动的尾巴",
        color: "#b87438",
        attributes: [
          { label: "Role", labelZh: "功能", value: "Movement", valueZh: "运动" },
          { label: "Shape", labelZh: "形状", value: "Helical filament", valueZh: "螺旋丝状" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Special stain", valueZh: "特殊染色" },
        ],
        note:
          "Some bacteria rotate flagella like tiny motors to move through liquid environments.",
        noteZh:
          "一些细菌像微型马达一样旋转鞭毛在液体环境中移动。",
        fact: "Bacterial flagella are powered by ion gradients.",
        factZh: "细菌鞭毛由离子梯度驱动。",
      },
    ],
  },
  {
    id: "animal",
    name: "Animal Cell",
    nameZh: "动物细胞",
    type: "Eukaryotic Cell",
    typeZh: "真核细胞",
    accent: "#9b74b7",
    accentSoft: "#efe5f6",
    color: "#9db6dc",
    modelKind: "animal",
    defaultOrganelle: "mitochondrion",
    comparison: "plant",
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
      titleZh: "动物组织",
      body: "Animal cells form flexible tissues with membranes, internal organelles, and specialized signaling structures.",
      bodyZh: "动物细胞形成柔性组织，具有细胞膜、内部细胞器和专门信号结构。",
      motif: "animal",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#d9a7c7", pattern: "animal-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#b889da", pattern: "animal-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#8b8b8d", pattern: "electron" },
    ],
    organelles: [
      {
        id: "mitochondrion",
        name: "Mitochondrion",
        nameZh: "线粒体",
        subtitle: "The energy converter",
        subtitleZh: "能量转换器",
        color: "#cf6f42",
        attributes: [
          { label: "Length", labelZh: "长度", value: "1 to 10 µm", valueZh: "1 至 10 微米" },
          { label: "Membrane", labelZh: "膜", value: "Double", valueZh: "双层" },
          { label: "Role", labelZh: "功能", value: "ATP production", valueZh: "ATP 生产" },
        ],
        note:
          "Mitochondria convert fuel molecules into usable cellular energy through folded inner membranes.",
        noteZh:
          "线粒体通过折叠的内膜将燃料分子转化为可用的细胞能量。",
        fact: "Mitochondria contain their own small DNA genome.",
        factZh: "线粒体含有自己的小型 DNA 基因组。",
      },
      {
        id: "nucleus",
        name: "Nucleus",
        nameZh: "细胞核",
        subtitle: "The command room",
        subtitleZh: "指挥室",
        color: "#7a49b0",
        attributes: [
          { label: "Shape", labelZh: "形状", value: "Rounded", valueZh: "圆形" },
          { label: "Membrane", labelZh: "膜", value: "Double", valueZh: "双层" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Yes", valueZh: "是" },
        ],
        note:
          "The nucleus stores chromosomes and regulates which genes are active in a cell.",
        noteZh:
          "细胞核储存染色体并调控细胞中活跃的基因。",
        fact: "Not all animal cells keep a nucleus. Mature red blood cells lose theirs.",
        factZh: "并非所有动物细胞都保留细胞核。成熟的红细胞会失去细胞核。",
      },
      {
        id: "golgi",
        name: "Golgi Apparatus",
        nameZh: "高尔基体",
        subtitle: "The packaging stack",
        subtitleZh: "包装堆栈",
        color: "#d49057",
        attributes: [
          { label: "Shape", labelZh: "形状", value: "Flattened stacks", valueZh: "扁平堆叠" },
          { label: "Role", labelZh: "功能", value: "Modify and sort", valueZh: "修饰与分选" },
          { label: "Position", labelZh: "位置", value: "Near nucleus", valueZh: "靠近细胞核" },
        ],
        note:
          "The Golgi apparatus modifies, sorts, and ships proteins and lipids to their destinations.",
        noteZh:
          "高尔基体修饰、分选并将蛋白质和脂质运送到目的地。",
        fact: "Secretory cells often have a prominent Golgi apparatus.",
        factZh: "分泌细胞通常具有显著的高尔基体。",
      },
    ],
  },
  {
    id: "muscle",
    name: "Muscle Cell",
    nameZh: "肌肉细胞",
    type: "Muscle Fiber",
    typeZh: "肌纤维",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#ca6678",
    modelKind: "muscle",
    defaultOrganelle: "myofibril",
    comparison: "neuron",
    renderImage: {
      url: "/cell-renders-transparent/muscle.png",
      aspect: "wide",
    },
    occurrence: {
      title: "Skeletal muscles",
      titleZh: "骨骼肌",
      body: "Muscle fibers contain repeating contractile bundles that shorten to generate force.",
      bodyZh: "肌纤维包含重复的收缩束，通过缩短产生力量。",
      motif: "muscle",
    },
    microscope: [
      { label: "Light Microscope", labelZh: "光学显微镜", tone: "#ef9aab", pattern: "muscle-light" },
      { label: "Stained Selection", labelZh: "染色切片", tone: "#c7508d", pattern: "muscle-stain" },
      { label: "Electron Microscope", labelZh: "电子显微镜", tone: "#8d8d8d", pattern: "electron" },
    ],
    organelles: [
      {
        id: "myofibril",
        name: "Myofibril",
        nameZh: "肌原纤维",
        subtitle: "The contracting thread",
        subtitleZh: "收缩丝线",
        color: "#bd3d51",
        attributes: [
          { label: "Diameter", labelZh: "直径", value: "About 1 µm", valueZh: "约 1 微米" },
          { label: "Arrangement", labelZh: "排列", value: "Striated bundles", valueZh: "横纹束状" },
          { label: "Visible in LM", labelZh: "光镜下可见", value: "Yes, banded", valueZh: "是，呈带状" },
        ],
        note:
          "Each muscle fiber contains hundreds to thousands of myofibrils running its full length, packed tightly together.",
        noteZh:
          "每根肌纤维含有数百至数千条肌原纤维，贯穿全长并紧密排列。",
        fact: "A single muscle fiber can be up to 30 cm long.",
        factZh: "单根肌纤维可长达 30 厘米。",
      },
      {
        id: "sarcolemma",
        name: "Sarcolemma",
        nameZh: "肌膜",
        subtitle: "The excitable membrane",
        subtitleZh: "可兴奋膜",
        color: "#d7b284",
        attributes: [
          { label: "Position", labelZh: "位置", value: "Outer surface", valueZh: "外表面" },
          { label: "Role", labelZh: "功能", value: "Signal spread", valueZh: "信号传播" },
          { label: "Type", labelZh: "类型", value: "Cell membrane", valueZh: "细胞膜" },
        ],
        note:
          "The sarcolemma conducts electrical signals that trigger contraction throughout the muscle fiber.",
        noteZh:
          "肌膜传导电信号，触发整个肌纤维的收缩。",
        fact: "Membrane signals reach deep into fibers through T tubules.",
        factZh: "膜信号通过 T 管深入纤维内部。",
      },
      {
        id: "mitochondria",
        name: "Mitochondria",
        nameZh: "线粒体",
        subtitle: "The endurance supply",
        subtitleZh: "耐力供应者",
        color: "#cf7042",
        attributes: [
          { label: "Role", labelZh: "功能", value: "Energy supply", valueZh: "能量供应" },
          { label: "Position", labelZh: "位置", value: "Between fibers", valueZh: "纤维之间" },
          { label: "Density", labelZh: "密度", value: "Activity dependent", valueZh: "取决于活动量" },
        ],
        note:
          "Muscle cells need many mitochondria because contraction consumes large amounts of ATP.",
        noteZh:
          "肌肉细胞需要大量线粒体，因为收缩消耗大量 ATP。",
        fact: "Endurance training can increase mitochondrial density.",
        factZh: "耐力训练可以增加线粒体密度。",
      },
    ],
  },
];

export function getCellById(id: string) {
  return cells.find((cell) => cell.id === id) ?? cells[0];
}

export type Lang = "en" | "zh";

export function localizeCell(cell: CellItem, lang: Lang): CellItem {
  if (lang === "en") return cell;
  return {
    ...cell,
    name: cell.nameZh,
    type: cell.typeZh,
    occurrence: {
      ...cell.occurrence,
      title: cell.occurrence.titleZh,
      body: cell.occurrence.bodyZh,
    },
    microscope: cell.microscope.map((m) => ({
      ...m,
      label: m.labelZh,
    })),
    organelles: cell.organelles.map((o) => ({
      ...o,
      name: o.nameZh,
      subtitle: o.subtitleZh,
      note: o.noteZh,
      fact: o.factZh,
      attributes: o.attributes.map((a) => ({
        ...a,
        label: a.labelZh,
        value: a.valueZh,
      })),
    })),
  };
}
