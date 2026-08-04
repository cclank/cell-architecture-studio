# Meshy AI Image-to-3D Prompts

Prompts for **Stage 3** of `ASSET_PIPELINE.md` — turning the ChatGPT concept
views (`CHATGPT_IMAGE_PROMPTS.md`) into a raw GLB in Meshy. The overriding goal
is a mesh whose required structures are **separable** (so Blender can split and
name them for the manifest) and whose anatomy is **readable and scientifically
accurate** for ages 14–16.

> Every mesh produced here becomes a project-owned original after Blender
> cleanup. Prompts describe the project's own specification; they never request
> reproduction of a specific copyrighted model, scan, or figure.

---

## General requirements (apply to every Meshy generation)

Include these as standing requirements for all models:

- **Scientifically accurate** proportions, shapes, and spatial relationships.
- **Age-appropriate (14–16):** clear, simplified, textbook-clean — not
  hyper-detailed or gory.
- **Clean silhouette:** a single readable object, no stray floaters.
- **Separated components:** each required structure a distinct, non-fused part
  with a clear boundary, so it can be isolated and named later. **Do not** merge
  structures into one watertight blob.
- **Controlled colour coding:** consistent with the catalogue scheme (membranes
  blue-grey, nucleus violet, mitochondria orange, chloroplasts green, cytoplasm
  pale teal, enzymes gold, arteries coral / veins blue).
- **Readable internal anatomy:** where a cutaway is used, internal structures
  are visible and distinct.
- **PBR materials:** physically based, matte-to-soft finish, low material count,
  one material per component.
- **Real-time web GLB, optimised:** sensible triangle budget, power-of-two
  textures, suitable for a mobile-capable WebGL viewer.
- **No** text, labels, letters, numbers, arrows, callouts, logos, watermarks,
  rulers, stands, bases, pedestals, hands, tools, scenery, or environment.
- **No** fantasy, stylised-cartoon, melted, fused, or distorted geometry; no
  extra invented anatomy.

Each prompt below ends with an explicit **Separable components** list — the parts
that MUST come out of Meshy as distinguishable geometry.

---

## Model prompts

### 1. Plant cell (`plant-cell`)
> "Generate a scientifically accurate 3D model of a single rectangular plant
> cell for a biology learning app, clean scientific-museum style, matte PBR
> materials, plain object only. Boxy angular cell with a rigid outer wall, a
> large central vacuole filling most of the interior, and other structures
> pushed to the edges. Distinct, separable, correctly coloured components."
> **Separable components:** cell wall, cell membrane, central vacuole, nucleus,
> chloroplasts (several), cytoplasm, mitochondrion.

### 2. Animal cell (`animal-cell`)
> "Scientifically accurate 3D model of a rounded animal cell, no wall and no
> large vacuole, soft irregular silhouette, cutaway to reveal organelles, matte
> PBR, plain object only."
> **Separable components:** cell membrane, nucleus, cytoplasm, mitochondria
> (several), Golgi apparatus, ribosomes, vesicles.

### 3. Bacterial cell (`bacterial-cell`)
> "Scientifically accurate 3D model of a rod-shaped bacterium, small elongated
> capsule, no nucleus and no membrane-bound organelles, cutaway showing a single
> coiled DNA loop and small circular plasmids, one flagellum tail, matte PBR,
> plain object only."
> **Separable components:** cell wall, cell membrane, cytoplasm, nucleoid (DNA
> loop), plasmid(s), flagellum, ribosomes.

### 4. Root hair cell (`root-hair-cell`)
> "Scientifically accurate 3D model of an elongated plant root hair cell with a
> single long thin projection extending to one side for absorption, large
> vacuole, matte PBR, plain object only."
> **Separable components:** root-hair projection, cell wall, cell membrane,
> vacuole, nucleus, cytoplasm.

### 5. Palisade mesophyll cell (`palisade-cell`)
> "Scientifically accurate 3D model of a tall column-shaped palisade leaf cell
> densely packed with chloroplasts near the walls, large vacuole, matte PBR,
> plain object only."
> **Separable components:** cell wall, cell membrane, chloroplasts (many),
> vacuole, nucleus, cytoplasm.

### 6. Red blood cell (`red-blood-cell`)
> "Scientifically accurate 3D model of a biconcave-disc red blood cell, dimpled
> on both faces, no nucleus, one cutaway showing solid haemoglobin-filled
> interior, coral-red, matte PBR, plain object only."
> **Separable components:** biconcave disc body, cytoplasm/haemoglobin interior.

### 7. Phagocyte / white blood cell (`phagocyte`)
> "Scientifically accurate 3D model of a phagocyte white blood cell with a
> flexible irregular membrane and pseudopodia reaching around a small engulfed
> bacterium, lobed nucleus, cutaway showing lysosomes, matte PBR, plain object
> only."
> **Separable components:** cell membrane (with pseudopodia), lobed nucleus,
> cytoplasm, lysosomes, engulfed pathogen.

### 8. Neurone (`neurone`)
> "Scientifically accurate 3D model of a motor neurone with a compact cell body,
> many fine branching dendrites at one end, and a very long axon wrapped in
> segmented myelin sheath ending in branched axon terminals, matte PBR, plain
> object only."
> **Separable components:** cell body (soma), nucleus, dendrites, axon, myelin
> sheath segments, axon terminals.

### 9. Leaf cross-section (`leaf-cross-section`) — *worked example from the brief*
> "Generate a scientifically accurate 3D cross-section slab of a leaf for a
> biology learning app, clean scientific-museum style, matte PBR materials,
> plain object only, no labels or text. Show, as clearly separated horizontal
> layers from top to bottom: a thin glossy waxy cuticle, a single-cell upper
> epidermis, a dense layer of tall green palisade mesophyll cells, a looser
> spongy mesophyll layer with open air spaces, a vascular bundle (xylem above,
> phloem below), and a lower epidermis containing a stoma flanked by two guard
> cells. Palisade cells are the most chloroplast-dense. Controlled biological
> colour coding, readable internal anatomy, real-time web GLB optimised."
> **Separable components:** waxy cuticle, upper epidermis, palisade mesophyll,
> spongy mesophyll, air spaces, xylem, phloem, lower epidermis, stoma pore,
> guard cells.

### 10. Stoma & guard cells (`stoma-guard-cells`)
> "Scientifically accurate 3D model of an open stoma on a leaf surface: two
> kidney-shaped guard cells bowing apart around a central pore, surrounded by
> jigsaw-shaped epidermal cells, chloroplasts visible inside the guard cells,
> matte PBR, plain object only."
> **Separable components:** guard cell 1, guard cell 2, stomatal pore, epidermal
> cells, guard-cell chloroplasts.

### 11. Mammalian heart (`mammalian-heart`)
> "Scientifically accurate 3D model of a mammalian heart, external form plus a
> cutaway revealing all four chambers, left ventricle wall clearly thicker than
> the right, great vessels emerging from the top, valves between chambers,
> coronary arteries on the surface, oxygenated side coral-red and deoxygenated
> side blue, matte PBR, plain object only."
> **Separable components:** left atrium, right atrium, left ventricle, right
> ventricle, aorta, vena cava, pulmonary artery, pulmonary vein, valves, septum,
> coronary arteries.

### 12. Villus (`villus`)
> "Scientifically accurate 3D model of a single intestinal villus in cutaway,
> finger-like projection with a dense microvilli brush border, an internal
> capillary network, a central lacteal running up the middle, and goblet cells
> in the epithelium, matte PBR, plain object only."
> **Separable components:** epithelium, microvilli, capillary network, lacteal,
> goblet cells.

### 13. Nephron (`nephron`)
> "Scientifically accurate 3D model of a single kidney nephron with its blood
> supply: a glomerulus capillary knot inside a cup-shaped Bowman's capsule
> leading through a proximal tubule, a long loop of Henlé, a distal tubule, and
> a collecting duct, with capillaries wrapping the tubule, tubule segments in
> distinct calm colours, matte PBR, plain object only."
> **Separable components:** glomerulus, Bowman's capsule, proximal tubule, loop
> of Henlé, distal tubule, collecting duct, surrounding capillaries.

### 14. DNA double helix (`dna-double-helix`)
> "Scientifically accurate 3D model of a short right-handed DNA double helix, two
> antiparallel sugar-phosphate backbones twisting evenly, base pairs as rungs
> between them with the two backbones in distinct calm colours and the four bases
> in four distinct muted colours, a few turns only, matte PBR, plain object
> only."
> **Separable components:** backbone strand 1, backbone strand 2, base-pair rungs
> (paired), hydrogen-bond links.

### 15. Enzyme & substrate (`enzyme-substrate`)
> "Scientifically accurate 3D model illustrating enzyme lock-and-key action as a
> small set of separable solids: an enzyme with a specific active-site notch, a
> substrate whose shape exactly fits that notch, the two joined as an
> enzyme-substrate complex, and the resulting product fragments, enzyme in muted
> gold and substrate in contrasting teal, clean rounded shapes so the fit reads
> instantly, matte PBR, plain object only."
> **Separable components:** enzyme body, active site, substrate, enzyme-substrate
> complex, product fragments.

---

## Working with Meshy output

- Expect to iterate: regenerate if structures come out fused or the silhouette is
  wrong; the **Separable components** list is the acceptance test.
- Meshy output is always a *raw* mesh — separation, precise naming
  (`<visualSlug>__<structureId>`), normal repair, decimation, texture
  compression, mobile LOD, and GLB optimisation all happen in Blender +
  `meshoptimizer` (see `ASSET_PIPELINE.md` §4–5).
- For process illustrations, models are static; the motion between stages is
  authored in-app from `ProcessStage` data, not baked into the GLB.
