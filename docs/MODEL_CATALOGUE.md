# Model Catalogue — Priority List

The priority production list of **60 project-owned 3D models** for IGCSE Biology
Studio, grouped by subject area. Milestone 1 models are built first and, where a
suitable legacy GLB exists, reuse it as a **temporary development asset** until
the original is produced through the ChatGPT → Meshy → Blender pipeline
(`ASSET_PIPELINE.md`).

**Columns**

- **Model id** — internal project slug (also the mesh-name prefix).
- **Topic** — syllabus topic number(s) it serves.
- **Tier** — C (Core) / S (Supplement) / C+S.
- **Selectable structures** — the required clickable components (brief).
- **Target GLB** — final production path under `/models/…`.
- **Poster** — poster/thumbnail image path.
- **Status** — `PLACEHOLDER` (dev asset in use), `CONCEPT` (art/spec done, model
  in production), or `PLANNED` (specced only).

> All identifiers are internal project IDs, not Cambridge codes. Dev-asset reuse
> is noted per row and detailed in `ASSET_LICENCES.md`.

---

## Group A — Cells (14)

| Model id | Title | Topic | Tier | Selectable structures | Target GLB | Poster | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `plant-cell` | Plant cell | 2 | C+S | Cell wall, cell membrane, nucleus, chloroplast, vacuole, cytoplasm, mitochondrion | `/models/plant-cell/plant-cell-v1.glb` | `/models/plant-cell/poster.png` | PLACEHOLDER — reuses `plant-cell-first001.glb` (user GLB) |
| `animal-cell` | Animal cell | 2 | C+S | Cell membrane, nucleus, cytoplasm, mitochondrion, ribosomes, Golgi, vesicles | `/models/animal-cell/animal-cell-v1.glb` | `/models/animal-cell/poster.png` | PLACEHOLDER — reuses `animal-cell-nih.glb` (NIH) |
| `bacterial-cell` | Bacterial cell | 1,2 | C+S | Cell wall, cell membrane, cytoplasm, nucleoid (circular DNA), plasmid, flagellum, ribosomes | `/models/bacterial-cell/bacterial-cell-v1.glb` | `/models/bacterial-cell/poster.png` | PLACEHOLDER — reuses `bacteria-wall-nih.glb` (NIH) |
| `specialised-cells` | Specialised cells set | 2 | C | Ciliated cell, root hair cell, xylem vessel, palisade cell, red blood cell, sperm & egg, nerve cell (as a selectable set) | `/models/specialised-cells/specialised-cells-v1.glb` | `/models/specialised-cells/poster.png` | CONCEPT |
| `red-blood-cell` | Red blood cell | 2,9 | C | Biconcave disc, cytoplasm (haemoglobin), absent nucleus (annotation) | `/models/red-blood-cell/red-blood-cell-v1.glb` | `/models/red-blood-cell/poster.png` | PLANNED |
| `phagocyte` | Phagocyte (white blood cell) | 2,10 | C+S | Flexible membrane, lobed nucleus, cytoplasm, lysosomes, engulfed pathogen | `/models/phagocyte/phagocyte-v1.glb` | `/models/phagocyte/poster.png` | PLACEHOLDER — reuses `white-blood-cell-user.glb` (user GLB) |
| `lymphocyte` | Lymphocyte | 10 | S | Large round nucleus, thin cytoplasm, membrane | `/models/lymphocyte/lymphocyte-v1.glb` | `/models/lymphocyte/poster.png` | PLANNED |
| `neurone` | Motor neurone | 2,14 | C | Cell body (soma), nucleus, dendrites, axon, myelin sheath, axon terminals | `/models/neurone/neurone-v1.glb` | `/models/neurone/poster.png` | PLACEHOLDER — reuses `neuron-nih.glb` (NIH) |
| `root-hair-cell` | Root hair cell | 2,8 | C | Elongated projection, cell wall, membrane, large vacuole, nucleus, cytoplasm | `/models/root-hair-cell/root-hair-cell-v1.glb` | `/models/root-hair-cell/poster.png` | CONCEPT |
| `palisade-cell` | Palisade mesophyll cell | 2,6 | C | Cell wall, membrane, many chloroplasts, vacuole, nucleus, cytoplasm | `/models/palisade-cell/palisade-cell-v1.glb` | `/models/palisade-cell/poster.png` | CONCEPT |
| `ciliated-cell` | Ciliated epithelial cell | 2,11 | C | Cilia, membrane, nucleus, cytoplasm, mitochondria | `/models/ciliated-cell/ciliated-cell-v1.glb` | `/models/ciliated-cell/poster.png` | PLANNED |
| `sperm-egg-cell` | Sperm & egg cells | 2,16 | C | Sperm: head/acrosome, nucleus, midpiece (mitochondria), tail. Egg: cytoplasm, nucleus, jelly coat | `/models/sperm-egg-cell/sperm-egg-cell-v1.glb` | `/models/sperm-egg-cell/poster.png` | PLANNED |
| `xylem-vessel-cell` | Xylem vessel element | 2,8 | C | Hollow lumen, lignified wall, no end walls, no cytoplasm (annotation) | `/models/xylem-vessel-cell/xylem-vessel-cell-v1.glb` | `/models/xylem-vessel-cell/poster.png` | PLANNED |
| `plant-vs-animal-cell` | Plant vs animal cell (paired) | 2 | C | Both cells side by side with shared + unique structures highlighted | `/models/plant-vs-animal-cell/plant-vs-animal-cell-v1.glb` | `/models/plant-vs-animal-cell/poster.png` | CONCEPT |

## Group B — Plant structures (11)

| Model id | Title | Topic | Tier | Selectable structures | Target GLB | Poster | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `leaf-cross-section` | Leaf cross-section | 6 | C+S | Waxy cuticle, upper epidermis, palisade mesophyll, spongy mesophyll, air spaces, vascular bundle (xylem/phloem), lower epidermis, stoma, guard cells | `/models/leaf-cross-section/leaf-cross-section-v1.glb` | `/models/leaf-cross-section/poster.png` | CONCEPT |
| `stoma-guard-cells` | Stoma & guard cells | 6,8 | C | Two guard cells, stomatal pore, epidermal cells, chloroplasts in guard cells | `/models/stoma-guard-cells/stoma-guard-cells-v1.glb` | `/models/stoma-guard-cells/poster.png` | CONCEPT |
| `root-hair-zone` | Root & root-hair zone | 8 | C | Root tip, root hairs, epidermis, cortex, xylem, phloem | `/models/root-hair-zone/root-hair-zone-v1.glb` | `/models/root-hair-zone/poster.png` | PLANNED |
| `stem-cross-section` | Stem vascular bundle | 8 | C+S | Xylem, phloem, cambium, epidermis, cortex | `/models/stem-cross-section/stem-cross-section-v1.glb` | `/models/stem-cross-section/poster.png` | PLANNED |
| `xylem-phloem` | Xylem & phloem tissue | 8 | C+S | Xylem vessels, phloem sieve tubes, companion cells, sieve plates | `/models/xylem-phloem/xylem-phloem-v1.glb` | `/models/xylem-phloem/poster.png` | PLANNED |
| `chloroplast` | Chloroplast (organelle) | 6 | S | Outer/inner membrane, stroma, grana (thylakoid stacks), starch grain | `/models/chloroplast/chloroplast-v1.glb` | `/models/chloroplast/poster.png` | PLANNED |
| `flower-structure` | Insect-pollinated flower | 16 | C | Petal, sepal, stamen (anther, filament), carpel (stigma, style, ovary, ovule), nectary | `/models/flower-structure/flower-structure-v1.glb` | `/models/flower-structure/poster.png` | PLANNED |
| `wind-pollinated-flower` | Wind-pollinated flower | 16 | C | Feathery stigma, exposed anthers, small petals | `/models/wind-pollinated-flower/wind-pollinated-flower-v1.glb` | `/models/wind-pollinated-flower/poster.png` | PLANNED |
| `seed-structure` | Seed (germination) | 16 | C | Testa, micropyle, radicle, plumule, cotyledon | `/models/seed-structure/seed-structure-v1.glb` | `/models/seed-structure/poster.png` | PLANNED |
| `whole-leaf` | Whole leaf & adaptations | 6 | C | Lamina, midrib, veins, petiole, stomatal surface | `/models/whole-leaf/whole-leaf-v1.glb` | `/models/whole-leaf/poster.png` | PLANNED |
| `plant-shoot-tropism` | Shoot showing phototropism | 14 | S | Shoot tip, zone of elongation, auxin distribution (annotation) | `/models/plant-shoot-tropism/plant-shoot-tropism-v1.glb` | `/models/plant-shoot-tropism/poster.png` | PLANNED |

## Group C — Human structures (19)

| Model id | Title | Topic | Tier | Selectable structures | Target GLB | Poster | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `mammalian-heart` | Mammalian heart | 9 | C+S | Left/right atrium, left/right ventricle, aorta, vena cava, pulmonary artery/vein, valves, septum, coronary arteries | `/models/mammalian-heart/mammalian-heart-v1.glb` | `/models/mammalian-heart/poster.png` | CONCEPT |
| `blood-vessels` | Artery, vein & capillary | 9 | C | Artery (thick muscular wall, narrow lumen), vein (thin wall, valve, wide lumen), capillary (single cell wall) | `/models/blood-vessels/blood-vessels-v1.glb` | `/models/blood-vessels/poster.png` | PLANNED |
| `circulatory-system` | Double circulation | 9 | C | Heart, lungs, body, pulmonary & systemic circuits | `/models/circulatory-system/circulatory-system-v1.glb` | `/models/circulatory-system/poster.png` | PLANNED |
| `villus` | Intestinal villus | 7 | C+S | Epithelium, microvilli, capillary network, lacteal, goblet cells | `/models/villus/villus-v1.glb` | `/models/villus/poster.png` | CONCEPT |
| `alimentary-canal` | Digestive system | 7 | C | Mouth, oesophagus, stomach, small intestine, large intestine, liver, pancreas, gall bladder | `/models/alimentary-canal/alimentary-canal-v1.glb` | `/models/alimentary-canal/poster.png` | PLANNED |
| `tooth` | Tooth structure | 7 | C | Enamel, dentine, pulp cavity, cement, gum, nerves/blood vessels | `/models/tooth/tooth-v1.glb` | `/models/tooth/poster.png` | PLANNED |
| `breathing-system` | Human breathing system | 11 | C | Trachea, bronchi, bronchioles, lungs, alveoli, diaphragm, ribs, intercostal muscles | `/models/breathing-system/breathing-system-v1.glb` | `/models/breathing-system/poster.png` | PLANNED |
| `alveoli` | Alveoli & gas exchange | 11 | C | Alveolar sac, alveolus, capillary, red blood cell, thin moist wall | `/models/alveoli/alveoli-v1.glb` | `/models/alveoli/poster.png` | CONCEPT |
| `nephron` | Nephron (kidney) | 13 | S | Glomerulus, Bowman's capsule, proximal tubule, loop of Henlé, distal tubule, collecting duct, capillaries | `/models/nephron/nephron-v1.glb` | `/models/nephron/poster.png` | CONCEPT |
| `kidney-urinary` | Urinary system & kidney | 13 | C | Kidney (cortex, medulla, pelvis), ureter, bladder, urethra, renal artery/vein | `/models/kidney-urinary/kidney-urinary-v1.glb` | `/models/kidney-urinary/poster.png` | PLANNED |
| `brain` | Human brain | 14 | C+S | Cerebrum, cerebellum, medulla, hypothalamus, pituitary | `/models/brain/brain-v1.glb` | `/models/brain/poster.png` | PLANNED |
| `reflex-arc` | Reflex arc | 14 | C | Receptor, sensory neurone, relay neurone, motor neurone, effector, spinal cord, synapses | `/models/reflex-arc/reflex-arc-v1.glb` | `/models/reflex-arc/poster.png` | PLANNED |
| `synapse` | Synapse | 14 | S | Presynaptic terminal, vesicles, neurotransmitter, synaptic gap, receptors | `/models/synapse/synapse-v1.glb` | `/models/synapse/poster.png` | PLANNED |
| `eye` | Human eye | 14 | C+S | Cornea, iris, pupil, lens, retina, optic nerve, ciliary muscle, sclera, fovea, blind spot | `/models/eye/eye-v1.glb` | `/models/eye/poster.png` | PLANNED |
| `skin` | Skin & temperature control | 14 | S | Epidermis, dermis, hair, sweat gland, blood vessels, receptors, fatty tissue | `/models/skin/skin-v1.glb` | `/models/skin/poster.png` | PLANNED |
| `endocrine-glands` | Endocrine glands | 14 | C | Pituitary, thyroid, adrenal, pancreas, ovaries, testes | `/models/endocrine-glands/endocrine-glands-v1.glb` | `/models/endocrine-glands/poster.png` | PLANNED |
| `male-reproductive` | Male reproductive system | 16 | C | Testes, scrotum, sperm duct, prostate, urethra, penis | `/models/male-reproductive/male-reproductive-v1.glb` | `/models/male-reproductive/poster.png` | PLANNED |
| `female-reproductive` | Female reproductive system | 16 | C | Ovaries, oviducts, uterus, cervix, vagina | `/models/female-reproductive/female-reproductive-v1.glb` | `/models/female-reproductive/poster.png` | PLANNED |
| `skeletal-muscle` | Skeletal muscle fibre | 12 | C | Muscle fibre, sarcolemma, myofibrils, nuclei, mitochondria | `/models/skeletal-muscle/skeletal-muscle-v1.glb` | `/models/skeletal-muscle/poster.png` | PLANNED (procedural `muscle` model available as fallback) |

## Group D — Molecular & microscopic (9)

| Model id | Title | Topic | Tier | Selectable structures | Target GLB | Poster | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dna-double-helix` | DNA double helix | 4,17 | S | Sugar-phosphate backbones (x2), base pairs (A-T, C-G), hydrogen bonds, antiparallel strands | `/models/dna-double-helix/dna-double-helix-v1.glb` | `/models/dna-double-helix/poster.png` | CONCEPT |
| `enzyme-substrate` | Enzyme & substrate (lock and key) | 5 | C+S | Enzyme, active site, substrate, enzyme-substrate complex, products | `/models/enzyme-substrate/enzyme-substrate-v1.glb` | `/models/enzyme-substrate/poster.png` | CONCEPT |
| `enzyme-denaturation` | Denatured enzyme | 5 | S | Enzyme before/after, distorted active site | `/models/enzyme-denaturation/enzyme-denaturation-v1.glb` | `/models/enzyme-denaturation/poster.png` | PLANNED |
| `carbohydrate-molecule` | Carbohydrate (starch/glucose) | 4 | C | Glucose units, chain/branch structure | `/models/carbohydrate-molecule/carbohydrate-molecule-v1.glb` | `/models/carbohydrate-molecule/poster.png` | CONCEPT |
| `protein-molecule` | Protein (amino-acid chain) | 4 | C | Amino acids, peptide chain, folded shape | `/models/protein-molecule/protein-molecule-v1.glb` | `/models/protein-molecule/poster.png` | CONCEPT |
| `lipid-molecule` | Lipid (fat) molecule | 4 | C | Glycerol, three fatty-acid chains | `/models/lipid-molecule/lipid-molecule-v1.glb` | `/models/lipid-molecule/poster.png` | CONCEPT |
| `cell-membrane` | Cell membrane (bilayer) | 3 | C+S | Phospholipid bilayer, protein channels, carrier proteins | `/models/cell-membrane/cell-membrane-v1.glb` | `/models/cell-membrane/poster.png` | CONCEPT |
| `virus` | Virus particle | 1,10 | S | Protein coat (capsid), genetic material, attachment proteins | `/models/virus/virus-v1.glb` | `/models/virus/poster.png` | PLANNED |
| `mitosis-cell` | Cell in mitosis | 17 | S | Chromosomes, spindle fibres, centromere, nuclear stages | `/models/mitosis-cell/mitosis-cell-v1.glb` | `/models/mitosis-cell/poster.png` | PLANNED |

## Group E — Ecology & biotechnology (7)

| Model id | Title | Topic | Tier | Selectable structures | Target GLB | Poster | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `food-web-scene` | Food web / ecosystem scene | 19 | C | Producer, primary/secondary/tertiary consumer, decomposer (selectable trophic roles) | `/models/food-web-scene/food-web-scene-v1.glb` | `/models/food-web-scene/poster.png` | PLANNED |
| `carbon-cycle-scene` | Carbon cycle | 19 | C | Plants, animals, atmosphere, combustion, decomposers, fossil fuels | `/models/carbon-cycle-scene/carbon-cycle-scene-v1.glb` | `/models/carbon-cycle-scene/poster.png` | PLANNED |
| `nitrogen-cycle-scene` | Nitrogen cycle | 19 | S | Nitrogen-fixing/nitrifying/denitrifying bacteria, plants, decomposers | `/models/nitrogen-cycle-scene/nitrogen-cycle-scene-v1.glb` | `/models/nitrogen-cycle-scene/poster.png` | PLANNED |
| `industrial-fermenter` | Industrial fermenter | 21 | S | Vessel, stirrer, water jacket, air/nutrient inlets, probes, outlet | `/models/industrial-fermenter/industrial-fermenter-v1.glb` | `/models/industrial-fermenter/poster.png` | PLANNED |
| `yeast-cell` | Yeast cell (fermentation) | 21 | C | Cell wall, membrane, nucleus, cytoplasm, vacuole, budding scar | `/models/yeast-cell/yeast-cell-v1.glb` | `/models/yeast-cell/poster.png` | PLANNED |
| `genetic-modification` | Bacterium producing insulin | 21 | C+S | Bacterial cell, plasmid, inserted human gene, restriction site | `/models/genetic-modification/genetic-modification-v1.glb` | `/models/genetic-modification/poster.png` | PLANNED |
| `pyramid-of-biomass` | Pyramid of numbers/biomass | 19 | C | Stacked trophic tiers (producer → top consumer) | `/models/pyramid-of-biomass/pyramid-of-biomass-v1.glb` | `/models/pyramid-of-biomass/poster.png` | PLANNED |

---

## Milestone 1 dev-asset reuse

The Milestone 1 slice (Topics 1–5) renders in a real viewer immediately by
mapping some `BiologyVisual`s to existing legacy GLBs via `specimenId`. These are
**temporary development assets** flagged `assetStatus: PLACEHOLDER`
(or `CONCEPT`) and scheduled for replacement by project-owned originals:

| Milestone-1 model | Temporary dev asset | Source |
| --- | --- | --- |
| `plant-cell` | `plant-cell-first001.glb` | User-supplied GLB |
| `animal-cell` | `animal-cell-nih.glb` | NIH 3D Print Exchange |
| `bacterial-cell` | `bacteria-wall-nih.glb` | NIH 3D Print Exchange |
| `phagocyte` | `white-blood-cell-user.glb` | User-supplied GLB |
| `neurone` | `neuron-nih.glb` | NIH 3D Print Exchange |

The remaining Milestone 1 visuals — specialised cells, magnification visual,
dichotomous-key activity, diffusion / osmosis / active transport processes,
biological-molecule comparison, food-test practical, `enzyme-substrate`,
temperature-enzyme graph, pH-enzyme graph — are delivered as `CONCEPT`-stage
originals, process animations, comparisons, or graph/practical visual formats
rather than reused legacy GLBs.

Every dev asset's origin and licence basis is recorded in `ASSET_LICENCES.md`.
No production model in this catalogue ships on a third-party mesh: each
`PLACEHOLDER`/`CONCEPT` row resolves to a project-owned original before its
linked objectives reach `REVIEWED` in `SYLLABUS_COVERAGE.md`.
