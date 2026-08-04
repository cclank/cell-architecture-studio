# Asset Licence & Provenance Record

Origin, licence basis, and replacement status for every asset currently bundled
in the repository. This is the authoritative provenance record for the
conversion to IGCSE Biology Studio.

Source labels and URLs for the GLBs are taken directly from
`src/data/cells.ts` (`modelAsset.sourceLabel` / `modelAsset.sourceUrl`).

> **Standing statements.**
> - **No Cambridge branding.** No Cambridge logos, marks, or verbatim syllabus
>   wording appear in any asset or in the app.
> - **No copyrighted past-paper questions.** All practice questions are original,
>   project-authored items.
> - **All future models are project-owned originals** produced through the
>   ChatGPT → Meshy → Blender pipeline (`ASSET_PIPELINE.md`).
> - **Microscope images** are project-created procedural placeholders until any
>   licensed images are sourced and documented here.

---

## 1. 3D models (GLB)

Located in `public/models/`.

### NIH 3D Print Exchange models — temporary development assets

Sourced from the U.S. National Institutes of Health **3D Print Exchange**
(`3d.nih.gov`), a public repository of 3D bioscientific models. Used **only as
temporary development assets** so Milestone 1 renders in a real viewer; each is
scheduled for replacement by a project-owned original.

| File | Source label (cells.ts) | Source entry (cells.ts) | Origin | Usage basis | Replacement |
| --- | --- | --- | --- | --- | --- |
| `animal-cell-nih.glb` | NIH 3D Animal Cell | https://3d.nih.gov/entries/3DPX-015797/2 | NIH 3D Print Exchange (US Government / public health resource) | Temporary development / reference asset; verify the specific entry's stated licence before any public release | Replace with `animal-cell` original (`MODEL_CATALOGUE.md` Group A) |
| `bacteria-wall-nih.glb` | NIH 3D Gram Positive Cell Wall | https://3d.nih.gov/entries/3DPX-010752/2 | NIH 3D Print Exchange | Temporary development / reference asset; verify the entry licence before public release | Replace with `bacterial-cell` original |
| `neuron-nih.glb` | NIH 3D Neuron | https://3d.nih.gov/entries/3DPX-015796/2 | NIH 3D Print Exchange | Temporary development / reference asset; verify the entry licence before public release | Replace with `neurone` original |

> **Action before public release:** confirm the exact licence recorded on each
> NIH entry page (NIH 3D hosts a mix of public-domain and third-party-licensed
> submissions). These are treated as dev-only until replaced regardless, so no
> third-party mesh ships in the released product.

### User-supplied models — temporary development assets

Local GLBs supplied by the project owner. `sourceUrl` records the original local
path only; there is no external hosting.

| File | Source label (cells.ts) | Source (cells.ts) | Origin | Usage basis | Replacement |
| --- | --- | --- | --- | --- | --- |
| `plant-cell-first001.glb` | User Plant Cell GLB first001 | `local:/Users/lank/Downloads/first001.glb` | User-supplied GLB | Project-controlled development asset; provenance of its original creation to be confirmed by the owner before release | Replace with `plant-cell` original |
| `white-blood-cell-user.glb` | User White Blood Cell GLB | `local:/Users/lank/Downloads/second.glb` | User-supplied GLB | Project-controlled development asset; provenance to be confirmed by the owner before release | Replace with `phagocyte` original |

## 2. Render / poster / thumbnail images (PNG)

Project-created poster and thumbnail imagery used for previews, tiles, and
loading/fallback states.

| Location | Files | Origin | Usage basis | Notes |
| --- | --- | --- | --- | --- |
| `public/cell-renders-transparent/` | `animal.png`, `bacteria.png`, `epithelial.png`, `muscle.png`, `neuron.png`, `plant.png`, `white-blood.png` | Project-created renders | Project-owned | Transparent-background specimen renders (`renderImage`/`previewUrl` in cells.ts) |
| `public/cell-renders/` | `animal.png`, `bacteria.png`, `epithelial.png`, `muscle.png`, `neuron.png`, `plant.png`, `white-blood.png` | Project-created renders | Project-owned | Opaque-background variants |
| `public/nih-previews/` | `animal-cell-nih.png`, `bacteria-wall-nih.png`, `neuron-nih.png` | Project-created preview renders **of the NIH dev-asset models** | Project-owned render; depicts a dev-asset model | Retire alongside the NIH GLBs they preview |

> The `nih-previews` PNGs are project-rendered images, but because they depict
> the temporary NIH development models, they are retired when those models are
> replaced by originals.

## 3. Other assets

| Asset | Location | Origin | Usage basis |
| --- | --- | --- | --- |
| Favicon | `public/favicon.svg` | Project-created SVG (gradient cell mark) | Project-owned |
| Texture references | `public/texture-references/…` | Project-generated concept/texture reference material (ChatGPT-generated to project spec) + local `annotation-hotspots.json`/index files | Project-owned working references, not shipped as end-user content |

## 4. Microscope images

There are currently **no bundled microscope photographs**. In the existing app,
"microscope views" are CSS pattern swatches (`BottomPanels`), not images. Under
the new architecture (`MicroscopeImage` in `src/data/curriculum/types.ts`) each
microscope view is a **procedural placeholder** (`placeholderPattern` + tone,
`assetStatus: PLACEHOLDER`) until a licensed or project-created image is sourced.

**Policy:** any real microscope image added later must be either project-created
or explicitly licensed, and must be recorded in this file (source, licence,
attribution) before use. No unlicensed third-party microscopy is bundled.

## 5. Summary — replacement roadmap

| Category | Current basis | Target |
| --- | --- | --- |
| NIH GLBs (3 files) | Temporary dev assets from `3d.nih.gov` | Project-owned Meshy originals |
| User GLBs (2 files) | Temporary dev assets (local, owner-supplied) | Project-owned Meshy originals |
| Render/poster PNGs | Project-owned | Kept; NIH-preview renders retired with their models |
| Favicon / texture refs | Project-owned | Kept |
| Microscope images | Procedural placeholders (none bundled) | Project-created or licensed, documented here |

Every asset either is already project-owned or is a clearly flagged temporary
development asset with a defined project-owned replacement. No Cambridge assets,
no copyrighted questions, and no unlicensed third-party media ship in the
released product.
