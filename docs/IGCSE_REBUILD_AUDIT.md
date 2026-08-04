# IGCSE Rebuild Audit

Audit of the existing **Cell Architecture Studio** codebase as it is being
converted into **IGCSE Biology Studio** — a full visual learning platform for
Cambridge IGCSE Biology 0610 (examinations 2026, 2027, 2028).

This document records what exists today, what is reusable as-is, what must be
generalised, and what cell-only assumptions must be removed. It is written to be
read alongside the new curriculum data backbone in
`src/data/curriculum/types.ts`.

> **Provenance note.** Every identifier used in the new architecture is an
> *internal project ID*. None of them are official Cambridge objective codes,
> and no Cambridge branding, logos, or verbatim syllabus wording are used
> anywhere in this project.

---

## 1. Existing reusable components

All UI lives in `src/components/` and is composed by `src/App.tsx` (a single
page; there is no router library — overlays are driven by the `useOverlays`
hook). The current component inventory:

| Component | Responsibility | Reuse verdict |
| --- | --- | --- |
| `Header` | Top bar: title, progress/XP, and buttons that open overlays (quiz, gallery, library, notebooks, flashcards, achievements, about), accent picker, reset controls | Reuse, relabel + add navigation modes |
| `SpecimenStrip` | Horizontal strip of selectable specimens with favourite toggles | Reuse, rename to a "visuals strip" |
| `Sidebar` | Lists the selectable structures (currently organelles) for the active specimen + a top slot (Daily Challenge) | Reuse, generalise "organelle" → "structure" |
| `Stage` | Wraps the 3D canvas with view-mode controls (mesh/focus), cross-section, auto-rotate, reset, screenshot | Reuse |
| `CellScene` | The R3F `<Canvas>` — loads GLB or renders a procedural fallback model | Reuse core, generalise (see §11) |
| `RightPanel` | Info panel for the active structure (details, attributes, notes, tutor prompts) | Reuse, replace with tabbed info panel |
| `BottomPanels` | Two panels: microscope image row (with user uploads) + compare launcher | Reuse, split into Microscope + Compare features |
| `ComparisonModal` | Side-by-side comparison of the active specimen and its paired comparison specimen | Reuse, drive from `Comparison` data records |
| `SpecimenGridModal` | Reusable searchable/sectioned gallery+library grid of specimen tiles | Reuse directly (already generic over sections) |
| `NotebooksModal` | Per-specimen notes browser | Reuse, key by visual id |
| `FlashcardsModal` | Flashcard study surface | Reuse, source from curriculum data |
| `SpecimenQuiz` (lazy) | Quiz flow, code-split via `React.lazy` | Reuse, source from `PracticeQuestion` bank |
| `AchievementsPanel`, `DailyChallenge`, `WelcomeTour`, `ShortcutsHelp`, `AboutModal` | Progression / onboarding surfaces | Reuse |
| `MiniCell` | Small procedural specimen thumbnail used in tiles/compare | Reuse; will fall back to poster images for non-cell visuals |
| `Toast`, `Confetti`, `CelebrationBanner`, `Modal` | Shared primitives | Reuse unchanged |

Supporting hooks (`src/hooks/`): `useProgression`, `useOverlays`,
`useKeyboardShortcuts`. Supporting libs (`src/lib/`): `storage.ts`,
`storageKeys.ts`, `theme.ts`, `cellMaterials.ts`, `progression.ts`, `daily.ts`.

The ~3722-line `src/styles.css` design system (warm ivory background, rounded
scientific cards) is a major reusable asset and is preserved wholesale.

## 2. Three.js / R3F architecture

The rendering stack is `three ^0.181`, `@react-three/fiber ^9`, and
`@react-three/drei ^10`. `CellScene` is the only file that touches Three.js
directly and is self-contained:

- A single `<Canvas>` with `dpr={[1, 2]}`, `shadows`, ACES filmic tone mapping,
  and a `camera` at `[0, 0.2, 5.8]`, `fov: 38`.
- Lighting rig: `<Environment preset="studio">`, ambient + hemisphere lights, a
  key `directionalLight` (with shadow map 1024²), a fill spot, and a point
  light. Light intensities and background differ between "native asset" mode
  and the procedural/studio mode (`nativeMaterial` branch).
- `<OrbitControls makeDefault>` with damping, pan enabled, and clamped
  `minDistance`/`maxDistance`.
- A `<Float>` wrapper gives the model gentle idle motion; `<ContactShadows>`
  ground it.
- The whole `<Canvas>` is re-mounted via a `key={resetKey}` when the user resets
  the view.

The scene graph is intentionally shallow: one rotating `<group>` (auto-rotate is
applied in a `useFrame` tick) containing either a loaded GLB or a
procedurally-authored fallback model.

## 3. How models are loaded (CellScene / useGLTF / material modes / fallbacks)

Model loading is decided per specimen inside `CellModel`:

- **If `cell.modelAsset` exists** → `AssetCellModel` calls
  `useGLTF(asset.url, true, true)` (Draco + Meshopt decoders enabled). The
  loaded `scene` is `clone(true)`d, then traversed; every mesh gets
  `castShadow`/`receiveShadow` and a material chosen by `asset.materialMode`:
  - `"native"` → `createNativeAssetMaterial` (keeps the GLB's own textures/
    colours; used for the user plant and white-blood GLBs).
  - `"solid"` → `createSolidAssetMaterial` (recomputes normals, flat tint).
  - default/`"studio"` → `applyAssetVertexColors` + `createAssetMaterial`
    (studio-tinted look keyed to the specimen accent, per-mesh index).
  - The asset is positioned/rotated/scaled from `asset.position/rotation/scale`
    and re-centred with drei `<Center>`.
- **If `cell.modelAsset` is absent** → a hand-authored procedural model is
  rendered by `modelKind` (`PlantModel`, `WhiteBloodModel`, `NeuronModel`,
  `EpithelialModel`, `BacteriaModel`, `AnimalModel`, `MuscleModel`). These are
  built from primitives (`RoundedBox`, spheres, capsules, tori, `CurveTube`
  tubes, scattered `Dots`) and are the *fallback* rendering path for specimens
  with no GLB (currently `epithelial` and `muscle`).
- **Loading UX**: a `<Suspense fallback={<ModelLoadingOverlay>}>` shows a
  progress bar driven by drei's `useProgress` (percentage + MB loaded/total +
  the model's `sourceLabel`).

Key observation: the procedural models are a genuine fallback system already —
there is never a blank canvas while a GLB is missing or loading. This is exactly
the robustness contract the new pipeline formalises (see `ASSET_PIPELINE.md`).

## 4. How biological structures are selected (activeOrganelle state)

Selection is a single string of state, `activeOrganelle`, owned by `App.tsx`:

- Initialised to the specimen's `defaultOrganelle`.
- Reset to the new specimen's default whenever the specimen changes (effect on
  `selectedCell`).
- Written by the `Sidebar` (clicking a structure) and read by `CellScene`,
  `RightPanel`, and progression tracking.
- Inside `CellScene`, every material compares its own `id` to `activeOrganelle`
  to decide *active* (emissive highlight) vs *dimmed* (in `viewMode === "focus"`
  non-active structures drop to ≤0.18 opacity).
- Structure-view coverage is tracked as a `Set` of `"${cellId}:${organelleId}"`
  keys feeding the mastery percentage.

This is a clean, general pattern: "one active structure id per visual". The
rename `activeOrganelle` → `activeStructure` is cosmetic; the mechanism carries
over directly to `VisualStructure[]`.

## 5. How info panels get content (RightPanel from cells.ts)

`RightPanel` receives the whole `CellItem` plus `activeOrganelle`. It finds the
matching `OrganelleItem` (`cell.organelles.find(...)`) and renders its `name`,
`subtitle`, `color`, `attributes[]` (label/value pairs), `note`, and `fact`. It
also builds tutor prompt suggestions from the cell + organelle names.

All info content is therefore read straight out of `src/data/cells.ts`. There is
no CMS, no fetch, no markdown — the data object *is* the content. This is the
critical fact for the conversion: swapping the data layer swaps the content, and
the new `BiologyVisual`/`VisualStructure` types carry richer fields (function,
`structureDescription`, `adaptationExplanation`, `examLanguage`,
`commonMistakes`, `courseTier`) that map onto a tabbed info panel.

## 6. How comparison mode works (ComparisonModal / BottomPanels)

Comparison is currently hard-wired to a single paired specimen:

- Each `CellItem` has a `comparison` field naming another cell's id
  (e.g. `plant.comparison = "animal"`).
- `BottomPanels` shows a "Compare Cells" card with the current specimen VS
  `getCellById(cell.comparison)` and a button that opens the modal.
- `ComparisonModal` renders two columns (current + compared) each showing the
  default-focus structure, its subtitle, and where the specimen occurs.

Limitations to remove: only one comparison per specimen, exactly two items, and
comparison targets are baked into `cells.ts`. The new `Comparison` type supports
N items (`itemIds`, `itemLabels`), a `differences` matrix (`ComparisonRow[]`),
`similarities`, and an `examSummary` — enough to express "diffusion vs osmosis vs
active transport" and "carbohydrate vs protein vs lipid".

## 7. How notebook data is stored (storage.ts / localStorage keys)

All persistence is `localStorage`, wrapped in try/catch, with keys centralised in
`src/lib/storageKeys.ts` (`STORAGE_KEYS`, all `cas-*` prefixed):

| Concern | Key | Notes |
| --- | --- | --- |
| Favourites | `cas-favorites` | JSON array of specimen ids, filtered to existing cells on load |
| Last specimen | `cas-last-cell` | restored on boot |
| Recently viewed | `cas-recent` | capped at 24 |
| Notes | `cas-notes` | `Record<specimenId, string>` (the "notebook") |
| Progress/XP | `cas-progress` | progression state |
| Daily | `cas-daily` | streak + claim state |
| Accent | `cas-accent` | chosen UI accent |
| Onboarded | `cas-onboarded` | welcome-tour dismissal |
| Quiz | `cas-quiz-*` | muted flag, history, and `cas-quiz-best:<category>:<mode>` |

`storage.ts` exposes typed `load*`/`save*` helpers and `clearAllData()` (which
also bulk-removes anything under the `cas-quiz` prefix). Notes are keyed by
specimen id today; under the new model they key by *visual id*, which is a
drop-in change. The `cas-` prefix will be retained or migrated to an `igb-`
namespace — a one-line decision documented when made.

## 8. How gallery/library are organised (SpecimenGridModal)

`SpecimenGridModal` is already generic. It takes:

- `sections: { label, items: CellItem[], emptyHint? }[]`
- optional `searchable`, `selectedId`, `title`, `subtitle`, `footer`.

`App.tsx` mounts it twice: once as **Gallery** (one section = all cells,
searchable by name/type) and once as **Your Library** (two sections =
favourites + recently viewed). Each tile renders a `MiniCell` thumbnail plus
name/type. Because it is section-driven, it can present curriculum groupings
(by topic, by `VisualGroup`, by course tier) with zero structural change — only
the item type widens from `CellItem` to the visual record.

`src/data/cells.ts` also already declares a `CellCategory` union
(`Cells | Organs | Body Systems | Bones & Joints | Macromolecules | Viruses |
Botanical Specimens`) and a `categorize()` helper, showing the project was
already anticipating a broader library than cells.

## 9. Which content is hard-coded

- **The seven specimens** and every organelle, attribute, note, fact,
  microscope swatch, and comparison target live inline in `src/data/cells.ts`.
- **Procedural model geometry** for all seven `modelKind`s is hand-authored in
  `CellScene.tsx` (positions, colours, primitive counts).
- **Microscope "images"** are not images at all — they are CSS pattern classes
  (`pattern-plant-light`, etc.) with a tone colour, rendered by `BottomPanels`.
- **Accent themes** are a fixed list in `theme.ts`.
- **Initial specimen** is hard-coded as `"animal"` in `App.tsx` and
  `storage.ts`.
- **Tutor prompts** are string-built in `RightPanel`.
- **The word "cell"/"organelle"/"specimen"** appears in UI copy throughout.

## 10. Which systems can remain unchanged

- The R3F canvas, lighting rig, orbit controls, float/contact-shadow staging.
- The GLB loading path (`useGLTF` + clone + traverse + material modes) and the
  `ModelLoadingOverlay` progress UI.
- The material system in `cellMaterials.ts` (native/solid/studio modes).
- `SpecimenGridModal`, `Modal`, `Toast`, `Confetti`, `CelebrationBanner`.
- `storage.ts` mechanics and the `storageKeys.ts` pattern.
- `useOverlays`, `useKeyboardShortcuts`, `useProgression`, `daily.ts`,
  `progression.ts` logic.
- The `styles.css` design system and warm-ivory visual identity.

## 11. Which systems require generalisation

| System | Change |
| --- | --- |
| Data layer | Replace/augment `cells.ts` with the curriculum data set built on `src/data/curriculum/types.ts` (`SyllabusTopic`, `BiologyVisual`, `BiologyProcess`, `PracticalActivity`, `Comparison`, `PracticeQuestion`, `GlossaryTerm`). Legacy `cells.ts` stays as a bridge/dev-asset source via `BiologyVisual.specimenId`. |
| Info panel | `RightPanel` → tabbed panel (Overview, Structure, Function, Syllabus, Exam Skills, Practical Link, Notes) sourced from `VisualStructure` fields. |
| Selection | `activeOrganelle` → `activeStructure`, iterating `visual.structures[]`. |
| Comparison | Data-driven N-item `Comparison` records instead of a single `comparison` field. |
| Rendering | `CellScene` must render `VisualFormat` variants — not only `3D_MODEL` but `3D_PROCESS`, `2D_DIAGRAM`, `GRAPH`, `MICROSCOPE`, `SIMULATION`, `PRACTICAL`. Mesh selection driven by a `public/models/manifest.json` mapping structure ids → mesh names (does not exist yet). |
| Navigation | Add Syllabus / Visuals / Processes / Practicals modes and Learn / Revise / Exam modes (single-page, overlay-based, no router needed). |
| Microscope | Move from CSS patterns to `MicroscopeImage` records with procedural placeholders until licensed images exist. |
| Course level | Thread `CourseTier`/`CourseLevel` (Core/Extended/All) through filtering and badges. |
| Copy | Replace cell-only vocabulary with general biology vocabulary. |

## 12. Cell-specific assumptions to remove

- "A visual is always a cell with organelles." → a visual is any biology
  subject (molecule, tissue, organ, organism, ecosystem, process, graph).
- "There are exactly 7 specimens." → dozens of visuals across 21 topics.
- "Every specimen has a `defaultOrganelle`." → every visual has a
  default/first structure, but some formats (graphs, processes) have none.
- "Comparison is one-to-one and pre-paired." → comparisons are standalone
  data records over N items.
- "Microscope = three CSS swatches." → curated microscope image sets per visual.
- "Structures are called organelles." → general `VisualStructure`.
- Hard-coded initial specimen `"animal"` and cell-count-based mastery maths.

## 13. Current asset licences & provenance

Full detail is in `ASSET_LICENCES.md`. Summary:

- **NIH 3D models** (`animal-cell-nih.glb`, `bacteria-wall-nih.glb`,
  `neuron-nih.glb`) come from the NIH 3D Print Exchange (`3d.nih.gov`). Their
  entry URLs are recorded in `cells.ts` (`sourceUrl`). Used as **temporary
  development assets**.
- **User-supplied GLBs** (`plant-cell-first001.glb`, `white-blood-cell-user.glb`)
  are local uploads (`sourceLabel: "User …"`, `sourceUrl: local:…`). Also
  temporary development assets.
- **Renders/posters**: `public/cell-renders-transparent/*.png`,
  `public/cell-renders/*.png`, `public/nih-previews/*.png` — project-created
  poster/thumbnail imagery.
- No Cambridge logos, no copyrighted past-paper questions, and no third-party
  microscope photographs are bundled. All future 3D assets are project-owned
  originals produced through the ChatGPT → Meshy → Blender pipeline.

## 14. Current mobile / responsive behaviour

- Layout is a CSS grid shell (`.app-shell` → `.app-grid` with left sidebar,
  centre stage, right rail) defined in `styles.css`, which collapses on narrow
  viewports. The design system uses relative units and rounded cards.
- The canvas uses `dpr={[1, 2]}`, so it caps device-pixel ratio at 2 to protect
  fill-rate on high-density mobile screens.
- Keyboard shortcuts (`useKeyboardShortcuts`) are desktop-oriented; touch relies
  on OrbitControls' built-in gestures.
- There is currently **no mobile-specific model LOD** and **no reduced-motion
  path** for the auto-rotate/float animation — both are commitments for the new
  build (mobile LOD is part of the asset pipeline; a reduced-motion transcript
  path is already anticipated by `ProcessStage.transcript` in the new types).

## 15. Current test coverage

`npm test` runs two suites:

- **Vitest** (`vitest run`) over `src/**/*.test.ts` (jsdom environment):
  - `src/lib/storage.test.ts`
  - `src/lib/progression.test.ts`
  - `src/lib/daily.test.ts`
- **Node test runner** over `scripts/*.test.mjs`:
  - `scripts/verify-preflight.test.mjs`

Verified count: **27 tests passing, 3 vitest files** (`vitest run` reported
`Tests 27 passed (27)`), plus the Node preflight suite. Coverage is concentrated
on the persistence, progression, and daily-streak logic plus a build/preflight
check — the pure logic layer. Components and the 3D scene are not yet unit
tested. New curriculum data should ship with schema/consistency tests (id
uniqueness, topic↔visual linkage, mesh-name↔manifest validation).

## 16. Current performance risks

- **GLB weight / count**: as the catalogue grows to dozens of models, total
  bytes are the main risk. `meshoptimizer ^1.1.1` is already a dependency and
  must be applied to every production GLB; mobile LOD variants
  (`BiologyVisual.mobileModelUrl`) are part of the type contract.
- **DPR**: capped at 2, good — but shadow maps (1024²), `<ContactShadows
  resolution={512}>`, and multiple real-time lights are per-frame costs that
  should be tuned down on low-power devices.
- **Auto-rotate + `<Float>`** run a `useFrame` tick continuously; there is no
  pause-when-hidden or reduced-motion gate yet.
- **Canvas remount on reset** (`key={resetKey}`) forces a full GL context
  rebuild — fine occasionally, but should not be used for routine state changes.
- **Material cloning**: `AssetCellModel` clones and re-materialises the scene in
  a `useMemo` keyed on `viewMode`/`crossSection`; large scenes will re-run this.
- **`preserveDrawingBuffer: true`** (needed for screenshot export) disables some
  driver optimisations and increases memory — acceptable but worth noting.

---

## Conversion approach

The conversion is **additive and evolutionary, not a rewrite**. The working 3D
viewer, model-loading pipeline, comparison and notebook systems, progression,
and the entire `styles.css` design language are proven assets and are kept.

The strategy has three moves:

1. **New curriculum data layer.** Author the whole syllabus as data against
   `src/data/curriculum/types.ts` — topics, objectives, visuals, processes,
   practicals, comparisons, questions, glossary. This is where the product's
   content lives; the UI becomes a renderer of that data.
2. **Generalise the UI in place.** Rename cell-only concepts to general biology
   concepts, add the tabbed info panel, N-item comparisons, navigation/study
   modes, and `VisualFormat` rendering — all reusing existing components.
3. **Reuse legacy specimens as development assets.** The seven `CellItem`s and
   their GLBs (via `BiologyVisual.specimenId`) become live placeholders so
   Milestone 1 topics render in a real viewer immediately, and are replaced
   model-by-model with project-owned originals from the ChatGPT → Meshy →
   Blender pipeline (`ASSET_PIPELINE.md`, `MODEL_CATALOGUE.md`).

Milestone 1 (the current vertical slice) delivers complete working content for
Topics 1–5 (Characteristics & classification, Organisation, Movement in/out of
cells, Biological molecules, Enzymes) with 14 visuals and 4 comparisons,
proving the full data-driven path end-to-end.

## Current build status

- **Type-check**: `tsc -b` passes.
- **Unit tests**: 27 vitest tests pass (3 files) plus the Node preflight suite —
  `npm test` green.
- **Production build**: `npm run build` (`tsc -b && vite build`) is the release
  target and the baseline the conversion must keep green at every step.
