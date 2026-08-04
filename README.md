# IGCSE Biology Studio

> _Explore biology from molecules to ecosystems._
>
> An interactive visual studio for **Cambridge IGCSE Biology 0610** (examinations 2026, 2027 and 2028), evolved from the original Cell Architecture Studio. It reuses the polished 3D viewer, comparison and notebook systems and extends them across the whole syllabus: 21 topics, Core/Extended filtering, interactive processes, practicals and original exam-style questions.
>
> _Independent study tool — not endorsed by or affiliated with Cambridge International. No official logos and no copyrighted past-paper questions are used._
>
> See [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md), [`docs/IGCSE_REBUILD_AUDIT.md`](docs/IGCSE_REBUILD_AUDIT.md), [`docs/SYLLABUS_COVERAGE.md`](docs/SYLLABUS_COVERAGE.md) and [`docs/ASSET_PIPELINE.md`](docs/ASSET_PIPELINE.md).

---

The 3D foundation below (viewer, GLB assets, export, verification) is reused as the studio's rendering engine. The seven original specimens now serve as temporary development models for the cell topics while original assets are produced via the ChatGPT → Meshy pipeline.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=fff)
![Three.js](https://img.shields.io/badge/Three.js-0.181-000000?logo=threedotjs&logoColor=fff)
![3D Assets](https://img.shields.io/badge/GLB-native%20materials-4f8a3f)
![Verification](https://img.shields.io/badge/verification-playwright%20screenshots-2ea44f)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-local%20prototype-f59e0b)
[![Live Demo](https://img.shields.io/badge/live-demo-16a34a)](https://cell-architecture-studio.lanshuagent.com/)

An interactive cell architecture gallery built with React, Vite, Three.js, and staged GLB or procedural 3D cell assets. The project recreates a premium educational biology interface with selectable cell types, organelle details, comparison mode, responsive layout, and visual verification coverage.

## Live Demo

[Open the live deployment](https://cell-architecture-studio.lanshuagent.com/)

[![Cell Architecture Studio demo](docs/media/cell-architecture-studio-demo.gif)](https://cell-architecture-studio.lanshuagent.com/)

[View the MP4 demo file](docs/media/cell-architecture-studio-demo.mp4)

## Highlights

- Seven specimen views: plant cell, white blood cell, neuron, epithelial cell, bacteria cell, animal cell, and muscle cell.
- High fidelity Plant Cell and White Blood Cell GLB rendering with native texture preservation.
- Mesh first experience with 3D canvas rendering as the default view.
- AI Tutor panel with learning prompts, lesson focus, and mastery tracking.
- Quiz modes, flashcards, searchable gallery, favorites library, and study notebooks.
- Local XP progression, attainable achievements, daily challenges, and keyboard shortcuts.
- Screenshot and GLB export tools for the active specimen.
- Model loading overlay for large GLB assets on slower networks.
- Procedural fallback geometry for specimens that do not yet have production GLB assets.
- Detail panel for organelles, microscope modes, specimen metadata, and comparison workflow.
- Responsive desktop, compact, and mobile layouts with browser screenshot verification.

## Preview Modes

| Mode | Purpose |
| --- | --- |
| Mesh | Loads available GLB models or procedural Three.js geometry. |
| Focus | Emphasizes selected organelles and supporting biological details. |

## Tech Stack

| Layer | Tools |
| --- | --- |
| App | React 19, TypeScript, Vite |
| 3D | Three.js, React Three Fiber, Drei |
| UI | CSS modules in `src/styles.css`, Lucide icons |
| Assets | GLB models, transparent PNG thumbnails, NIH previews |
| Verification | Playwright Core, PNG pixel metrics |

## Project Structure

```text
.
|-- docs/
|   |-- media/
|   `-- ASSETS.md
|-- public/
|   |-- cell-renders/
|   |-- cell-renders-transparent/
|   |-- models/
|   `-- nih-previews/
|-- scripts/
|   `-- verify.mjs
`-- src/
    |-- App.tsx
    |-- components/
    |-- data/
    `-- styles.css
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open the app:

```text
http://127.0.0.1:5173/
```

Build for production:

```bash
npm run build
```

Run visual verification:

```bash
npm run verify
```

## Asset Notes

The highest fidelity specimens are loaded from `public/models/` and configured in `src/data/cells.ts`.

| Specimen | Current asset |
| --- | --- |
| Plant Cell | `public/models/plant-cell-first001.glb` |
| White Blood Cell | `public/models/white-blood-cell-user.glb` |
| Animal Cell | `public/models/animal-cell-nih.glb` |
| Neuron | `public/models/neuron-nih.glb` |
| Bacteria Wall | `public/models/bacteria-wall-nih.glb` |

Transparent PNG references in `public/cell-renders-transparent/` are used for thumbnails and model previews. Detailed provenance is tracked in `docs/ASSETS.md`.

## Verification

`npm run verify` expects the local app to already be running, captures desktop, compact, mobile, and interaction screenshots, then checks canvas pixel metrics to catch blank renders or major layout regressions.

Start the app before running visual verification:

```bash
npm run dev
```

By default, verification opens `http://127.0.0.1:5173/`. If Vite uses another port, pass the app URL explicitly:

```bash
APP_URL=http://127.0.0.1:5174/ npm run verify
```

The script uses Google Chrome through Playwright Core. If Chrome is installed in a non-default location, pass the executable path:

```bash
CHROME_PATH="/path/to/Google Chrome" npm run verify
```

Current coverage includes:

- Desktop, compact, and mobile smoke checks.
- Plant Cell GLB render check.
- White Blood Cell GLB render check.
- Bacteria mesh interaction check.
- Comparison modal check.

## Roadmap

- Add production quality GLB models for the remaining specimens.
- Further reduce and lazy-load the 3D vendor bundles.
- Expand educational annotations for each organelle.
- Add asset license metadata directly into the UI.

## License

The application code is licensed under the MIT License. Included GLB models and image assets retain their documented provenance in `docs/ASSETS.md`.

## Credits

Special thanks to the original creator [@DilumSanjaya](https://x.com/DilumSanjaya) for the source inspiration and visual direction.

The modular interface, study tools, progression system, and rendering improvements were contributed by [@niccomann](https://github.com/niccomann) in [PR #4](https://github.com/cclank/cell-architecture-studio/pull/4).

Additional 3D model provenance is documented in `docs/ASSETS.md`.
