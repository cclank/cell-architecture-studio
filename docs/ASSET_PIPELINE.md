# Asset Pipeline — ChatGPT → Meshy → Blender → GLB

How every project-owned 3D model in IGCSE Biology Studio is produced, from a
scientific specification to an optimised, viewer-ready GLB. The goal is
consistent, scientifically accurate, mobile-friendly models with **named,
individually selectable structures** that plug straight into the existing
`CellScene` loader.

> Every model produced by this pipeline is a **project-owned original**. Concept
> illustrations are generated to the project's own specification; no copyrighted
> reference art, textbook figures, or scanned specimens are traced or ingested.
> See `ASSET_LICENCES.md`.

---

## Pipeline overview

```
1. Scientific specification   (what must be true and selectable)
2. ChatGPT concept art        (CHATGPT_IMAGE_PROMPTS.md → reference views)
3. Meshy image-to-3D          (MESHY_PROMPTS.md → raw GLB)
4. Blender cleanup            (orient, name, separate, repair, optimise)
5. GLB optimisation           (meshoptimizer, texture compression, LOD)
6. Integration                (manifest.json + BiologyVisual record)
7. Scientific review          (accuracy + exam alignment sign-off)
```

Each stage has an exit condition; a model does not advance until it is met.

---

## 1. Scientific specification

Before any art is generated, write the spec as data — the `VisualStructure[]`
for the target `BiologyVisual`. This fixes, up front:

- the **required selectable structures** (what a learner must be able to click);
- each structure's **function** and **structure→function link** (the
  exam-critical `adaptationExplanation`);
- the **course tier** of each structure (Core vs Supplement);
- **scale, proportion, and spatial relationships** that must be scientifically
  correct (e.g. a root hair cell is elongated; alveoli are grouped clusters with
  a capillary network);
- **colour coding** to apply consistently across the catalogue (see §Colour).

**Exit condition:** the structure list is agreed and every structure has a
target mesh name (§Naming). This spec drives both the ChatGPT and Meshy prompts.

## 2. ChatGPT concept illustration

Generate clean reference views to feed image-to-3D. Prompts live in
`CHATGPT_IMAGE_PROMPTS.md`. Each model needs:

- a **three-quarter hero** view (primary reconstruction reference);
- **orthographic front / side / top** views for silhouette accuracy;
- a **cutaway** view where internal structures matter.

Requirements: premium scientific-museum style, controlled biological colour
coding, clear boundaries between components (so the reconstructor separates
them), a plain neutral background, and **no labels, arrows, text, logos, stands,
or scenery**.

**Exit condition:** a consistent set of clean, label-free reference images with
unambiguous component boundaries.

## 3. Meshy image-to-3D

Feed the reference views into Meshy AI to produce a raw textured mesh. Prompts
and per-model separable-component lists live in `MESHY_PROMPTS.md`. Target: a
clean silhouette, readable internal anatomy, separated components, PBR
materials, and no fantasy/fused/melted geometry.

**Exit condition:** a raw GLB whose major structures are distinguishable enough
to separate in Blender.

## 4. Blender cleanup

The manual craftsmanship stage. Every model passes through this checklist:

1. **Orientation** — align to the viewer's axes (Y up, sensible facing); the
   default camera sits at `[0, 0.2, 5.8]` looking down −Z, so the model's "front"
   should face +Z.
2. **Origin / pivot** — set the origin to the model's visual centre so
   drei `<Center>` and auto-rotate behave; rotation should look intentional.
3. **Remove stray geometry** — delete stands, bases, backing planes, floaters,
   and reconstruction artefacts.
4. **Separate selectable components** — split the mesh so every required
   structure is its own object, ready to be named and independently
   highlighted/dimmed by the viewer.
5. **Repair normals** — recalculate outside, fix inverted faces (matches the
   viewer's `computeVertexNormals()` expectations for non-native materials).
6. **Simplify topology** — decimate/retopologise to a sane triangle budget while
   preserving silhouette and the readable internal anatomy.
7. **UVs** — unwrap cleanly where textures are used.
8. **Materials** — assign one PBR material per component; keep material count
   low and named. These map to the viewer's material modes (`native` keeps
   these; `studio`/`solid` re-tint them).
9. **Texture compression** — bake/resize textures to power-of-two, compress;
   prefer small atlases over many large maps.
10. **Mobile LOD** — export a reduced-triangle, reduced-texture variant for
    `BiologyVisual.mobileModelUrl`.
11. **Poster / thumbnail** — render a poster image (hero) and a small thumbnail
    from the same lighting as the app, for `posterUrl` / `thumbnailUrl` and as
    the loading/fallback image.
12. **GLB export** — export binary glTF with the named meshes intact.

**Exit condition:** a named, separated, correctly oriented GLB plus its poster
and thumbnail and a mobile LOD variant.

## 5. GLB optimisation

`meshoptimizer` (`^1.1.1`) is already a project dependency and is applied to
every production GLB:

- vertex cache / overdraw / fetch optimisation and vertex+index quantisation;
- geometry compression (Meshopt) — the loader already enables the Meshopt and
  Draco decoders via `useGLTF(url, true, true)`;
- strip unused nodes, cameras, lights, and animation the viewer does not use;
- verify the byte size against a per-model budget (desktop and mobile).

**Exit condition:** the optimised GLB decodes with the existing loader and meets
its byte budget on both desktop and mobile variants.

## 6. Integration

- Add/replace the `BiologyVisual` record (model url, mobile url, poster,
  thumbnail, `structures[]`, `assetStatus`, `assetCredit`).
- Register mesh mappings in `public/models/manifest.json` (§Manifest).
- Set `assetStatus` to `CONCEPT` while a temporary dev asset stands in, or
  `PRODUCTION` once the original ships.

**Exit condition:** the model loads in the app, every structure highlights on
selection, and the info panel reads the right content.

## 7. Scientific review

A final accuracy + exam-alignment pass: structures are correctly shaped, scaled,
positioned and coloured; the structure→function claims are right; nothing
implies content beyond the syllabus tier. On sign-off the linked objectives move
to `REVIEWED` in `SYLLABUS_COVERAGE.md`.

---

## Mesh naming convention

Meshes are named so the viewer can map a `VisualStructure.id` to concrete mesh
names via the manifest. Convention:

```
<visualSlug>__<structureId>
```

- lowerCamelCase on both sides, double underscore separator;
- the left side is the visual's slug, the right side is the structure id;
- multiple meshes for one structure share the prefix and get a numeric suffix:
  `<visualSlug>__<structureId>_01`, `_02`, …

Examples:

| Mesh name | Visual | Structure |
| --- | --- | --- |
| `plantCell__nucleus` | Plant cell | Nucleus |
| `plantCell__chloroplast_01` | Plant cell | One of several chloroplasts |
| `heart__leftAtrium` | Mammalian heart | Left atrium |
| `heart__aorta` | Mammalian heart | Aorta |
| `leafCrossSection__palisadeMesophyll` | Leaf cross-section | Palisade mesophyll |
| `nephron__glomerulus` | Nephron | Glomerulus |
| `villus__lacteal` | Villus | Lacteal |

## Manifest usage

`public/models/manifest.json` (to be created) maps, per visual, each structure
id to the mesh name(s) in the GLB. It is the single indirection between data ids
and geometry, so the viewer never hard-codes mesh names.

Shape:

```json
{
  "plant-cell": {
    "modelUrl": "/models/plant-cell/plant-cell-v1.glb",
    "structures": {
      "nucleus": ["plantCell__nucleus"],
      "chloroplast": ["plantCell__chloroplast_01", "plantCell__chloroplast_02"],
      "vacuole": ["plantCell__vacuole"],
      "cellWall": ["plantCell__cellWall"]
    }
  }
}
```

At load time the viewer traverses the cloned scene, and a mesh is treated as
part of `activeStructure` when its name is listed under that structure id in the
manifest — generalising today's per-mesh `id` comparison in `CellScene`.

**Manifest validation** should be enforced by a test: every structure id in a
`BiologyVisual` must have a manifest entry, and every mesh name in the manifest
must exist in the GLB.

---

## Viewer robustness requirements

The loader must **never leave a blank canvas**. The current `CellScene` already
proves this pattern (procedural fallback models + `ModelLoadingOverlay`); the
production contract formalises it. For every failure mode there is a defined
graceful behaviour:

| Failure mode | Required behaviour |
| --- | --- |
| **Missing model** (no/404 GLB) | Show the poster image + text alternative; fall back to a procedural stand-in where one exists; never a blank canvas |
| **Invalid / corrupt GLB** | Catch the decode error, log it, fall back to poster or procedural model, keep the app interactive |
| **Slow load** | Show `ModelLoadingOverlay` with progress + MB counter + source label (already implemented via `useProgress`) |
| **Unnamed meshes** (no manifest match) | Render the model whole; disable per-structure highlight gracefully rather than crashing; surface a dev warning |
| **Missing textures** | Fall back to the studio/solid material mode (flat tinted look) instead of black/undefined materials |
| **Unsupported WebGL** | Detect context-creation failure and present the poster + text alternative as a static experience |
| **Mobile / low power** | Load the `mobileModelUrl` LOD, cap `dpr` at 2, reduce shadow cost; keep interaction responsive |

**The poster / procedural fallback rule:** every `BiologyVisual` must carry a
`posterUrl` and, wherever practical, a procedural or dev-asset fallback, so the
learner always sees the specimen even when the optimal 3D asset is unavailable.
