# ChatGPT Concept-Art Prompts

Prompts for generating the **concept illustrations** that feed Meshy image-to-3D
(Stage 2 of `ASSET_PIPELINE.md`). The output is a set of clean reference views —
not finished art — engineered so the reconstructor produces a model with
**clearly separable, correctly proportioned structures**.

> All concept art is generated to the project's own specification and is
> project-owned. Prompts must produce original illustrations only — never trace,
> reproduce, or restyle a specific copyrighted figure, textbook plate, or
> photograph. No labels, arrows, text, or logos in any output (see the reusable
> template).

---

## Reusable general prompt template

Use this skeleton for every model; fill the `<…>` slots from the model's
specification. Generate the four view types as a consistent set.

> **Prompt template**
>
> "A scientifically accurate concept illustration of **`<subject>`** for a
> premium biology learning app, drawn in a clean **scientific-museum** style:
> smooth surfaces, soft studio lighting, gentle shadows, matte finish, high
> clarity.
>
> Produce these views as a consistent set of the same object:
> 1. a **three-quarter hero** view (main reconstruction reference),
> 2. **orthographic front, side, and top** views,
> 3. a **cutaway** view revealing the internal structures.
>
> The object must clearly show these distinct, separable structures, each with a
> **clear visible boundary** between it and its neighbours so they can be
> separated in 3D reconstruction: **`<structure list>`**.
>
> Use **controlled biological colour coding**: `<colour scheme>`. Keep colours
> distinct between structures but natural and calm, not neon.
>
> Proportions and scale must be biologically correct: **`<scale/shape notes>`**.
>
> Plain, uniform **neutral background** (soft off-white). The object fills the
> frame, centred, well lit from the front-upper-left.
>
> **Do NOT include**: labels, text, letters, numbers, arrows, leader lines,
> callouts, logos, watermarks, rulers, stands, bases, pedestals, hands, tools,
> scenery, or any background environment. No annotations of any kind."

**Colour-coding convention** (kept consistent across the catalogue):

- membranes / boundaries — soft blue-grey
- nucleus / genetic material — violet
- energy structures (mitochondria) — warm orange
- photosynthetic structures (chloroplasts) — green
- fluid / cytoplasm / water — pale teal
- proteins / enzymes — muted gold
- blood / muscle / arteries — coral-red; deoxygenated / veins — blue

---

## Filled-in concept prompts

Each entry gives the subject, structures, colour scheme, and scale notes to drop
into the template.

### 1. Plant cell (`plant-cell`) — Topic 2
- **Subject:** a single rectangular plant cell.
- **Structures:** cell wall (outer rigid frame), cell membrane (just inside the
  wall), large central vacuole, nucleus, several chloroplasts, cytoplasm, one
  mitochondrion.
- **Colour:** wall pale green, membrane blue-grey, vacuole pale teal, nucleus
  violet, chloroplasts green (with faint internal stacks), mitochondrion orange.
- **Scale:** boxy/angular overall shape; vacuole occupies most of the interior,
  pushing other structures to the edges.

### 2. Animal cell (`animal-cell`) — Topic 2
- **Subject:** a rounded animal cell.
- **Structures:** cell membrane, nucleus (central), cytoplasm, several
  mitochondria, Golgi apparatus (stacked plates), ribosomes (fine dots),
  vesicles.
- **Colour:** membrane blue-grey, nucleus violet, mitochondria orange, Golgi
  muted gold, cytoplasm pale teal.
- **Scale:** irregular rounded blob (no wall, no chloroplasts, no large
  vacuole); softer silhouette than the plant cell.

### 3. Bacterial cell (`bacterial-cell`) — Topics 1–2
- **Subject:** a single rod-shaped (bacillus) bacterium.
- **Structures:** cell wall, cell membrane inside it, cytoplasm, nucleoid
  (single coiled loop of DNA, no membrane), one or two small circular plasmids,
  a flagellum tail, scattered ribosomes.
- **Colour:** wall teal-green, membrane blue-grey, nucleoid violet loop,
  plasmids brighter violet rings, flagellum tan.
- **Scale:** small, elongated capsule; emphasise no nucleus and no membrane-bound
  organelles.

### 4. Root hair cell (`root-hair-cell`) — Topics 2, 8
- **Subject:** an elongated plant cell with a long thin projection.
- **Structures:** long root-hair projection, cell wall, membrane, large vacuole,
  nucleus, cytoplasm.
- **Colour:** wall pale green, projection same wall colour, vacuole pale teal,
  nucleus violet.
- **Scale:** very elongated with a single narrow hair extending far to one side
  (large surface area for absorption).

### 5. Palisade mesophyll cell (`palisade-cell`) — Topics 2, 6
- **Subject:** a tall column-shaped leaf cell packed with chloroplasts.
- **Structures:** cell wall, membrane, many chloroplasts arranged near the
  edges, large vacuole, nucleus, cytoplasm.
- **Colour:** chloroplasts vivid green and numerous; wall pale green; vacuole
  pale teal.
- **Scale:** tall, narrow, brick-like; dense chloroplasts are the visual focus.

### 6. Red blood cell (`red-blood-cell`) — Topics 2, 9
- **Subject:** a biconcave-disc red blood cell, with one shown in cutaway.
- **Structures:** biconcave disc shape, cytoplasm filled with haemoglobin, clear
  absence of a nucleus (hollow-centred).
- **Colour:** coral-red throughout, slightly deeper at the thick rim.
- **Scale:** flattened disc, dimpled on both faces; no nucleus, no organelles.

### 7. Phagocyte (`phagocyte`) — Topics 2, 10
- **Subject:** a white blood cell engulfing a small pathogen.
- **Structures:** flexible irregular membrane with pseudopodia, lobed nucleus,
  cytoplasm, several lysosomes, an engulfed bacterium in a vacuole.
- **Colour:** membrane pale blue-grey, lobed nucleus violet, lysosomes gold,
  engulfed pathogen teal-green.
- **Scale:** larger than a red blood cell; amoeba-like reaching shape.

### 8. Neurone (`neurone`) — Topics 2, 14
- **Subject:** a motor neurone.
- **Structures:** cell body (soma) with nucleus, branching dendrites, a long
  axon, myelin sheath segments along the axon, axon terminals at the far end.
- **Colour:** soma/dendrites soft violet-blue, nucleus violet, myelin pale
  cream segments, axon core light blue.
- **Scale:** very long axon relative to the cell body; many fine dendrites at one
  end, branched terminals at the other.

### 9. Leaf cross-section (`leaf-cross-section`) — Topic 6
- **Subject:** a cut-through slab of a leaf.
- **Structures:** waxy cuticle (top), upper epidermis, palisade mesophyll layer
  (tall green cells), spongy mesophyll with air spaces, vascular bundle (xylem
  above, phloem below), lower epidermis, a stoma flanked by two guard cells.
- **Colour:** cuticle pale glossy, epidermis translucent, palisade vivid green,
  spongy paler green with open gaps, xylem tan, phloem gold.
- **Scale:** horizontal slab; palisade layer densest with chloroplasts; clear
  air spaces around spongy cells; stoma on the lower surface.

### 10. Stoma & guard cells (`stoma-guard-cells`) — Topics 6, 8
- **Subject:** a stoma on a leaf surface, open.
- **Structures:** two curved guard cells, the stomatal pore between them,
  surrounding epidermal cells, chloroplasts inside the guard cells.
- **Colour:** guard cells green with chloroplasts, epidermal cells pale
  translucent, pore dark opening.
- **Scale:** two kidney/sausage-shaped guard cells bowing apart to open the pore;
  epidermal cells jigsaw-shaped around them.

### 11. Mammalian heart (`mammalian-heart`) — Topic 9
- **Subject:** an external + cutaway mammalian heart.
- **Structures:** left and right atria, left and right ventricles (thicker left
  wall), aorta, vena cava, pulmonary artery, pulmonary vein, atrioventricular and
  semilunar valves, septum, coronary arteries on the surface.
- **Colour:** oxygenated left side coral-red, deoxygenated right side blue,
  muscle deep red, valves pale, coronary arteries bright red on the surface.
- **Scale:** anatomically correct chambers; left ventricle wall visibly thicker;
  great vessels emerging from the top.

### 12. Villus (`villus`) — Topic 7
- **Subject:** a single intestinal villus in cutaway.
- **Structures:** epithelial cell layer, microvilli brush border, internal
  capillary network, central lacteal, goblet cells.
- **Colour:** epithelium coral, microvilli fine coral fringe, capillaries red,
  lacteal pale cream, goblet cells teal.
- **Scale:** finger-like projection; dense microvilli fringe; lacteal running up
  the centre with capillaries around it.

### 13. Nephron (`nephron`) — Topic 13
- **Subject:** a single nephron with its blood supply.
- **Structures:** glomerulus (capillary knot), Bowman's capsule, proximal
  convoluted tubule, loop of Henlé, distal convoluted tubule, collecting duct,
  surrounding capillaries.
- **Colour:** tubule segments distinct pale blues/greens, glomerulus red
  capillary tangle, collecting duct gold.
- **Scale:** correct looping path from capsule down the loop and into the
  collecting duct; capillaries wrapping the tubule.

### 14. DNA double helix (`dna-double-helix`) — Topics 4, 17
- **Subject:** a short segment of a DNA double helix.
- **Structures:** two sugar-phosphate backbones twisting antiparallel, base
  pairs as rungs (A-T and C-G), hydrogen bonds between paired bases.
- **Colour:** backbones two distinct calm colours (e.g. teal and blue-grey), the
  four bases in four muted distinct colours, rungs clearly paired.
- **Scale:** regular right-handed double helix, evenly spaced rungs, clean
  ladder-twist; a few turns only.

### 15. Enzyme & substrate (`enzyme-substrate`) — Topic 5
- **Subject:** an enzyme and its complementary substrate (lock-and-key), shown as
  a small sequence: apart, bound as a complex, then products.
- **Structures:** enzyme body, active site (a specific notch), substrate that
  fits the notch, enzyme-substrate complex, resulting products.
- **Colour:** enzyme muted gold, active site slightly darker recess, substrate
  contrasting teal, products two teal fragments.
- **Scale:** the substrate shape must visibly match the active site; keep both as
  clean rounded solids so the fit reads instantly.

---

## Rule for process illustrations

Processes (diffusion, osmosis, active transport, photosynthesis, respiration,
digestion, the reflex arc, phagocytosis, cycles) are illustrated as **separate
frames, one per stage — never one cluttered composite image**. Each stage frame:

- shows a single moment in the sequence with a clear before/after difference from
  the previous frame;
- keeps the same viewpoint, scale, and colour coding across all frames so the
  change is legible;
- carries no labels/arrows/text (motion and captions are added in-app via
  `ProcessStage.caption` and `transcript`).

Generate one prompt per stage, referencing the prior frame ("same scene as the
previous frame, but now …"), so the app can present them as an animated or
step-through process with a reduced-motion, captioned fallback.
