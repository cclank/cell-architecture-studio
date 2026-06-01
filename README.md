# Active Deployments

- [Bio Demo](https://ewbio.vercel.app/)
- [Chem Demo](https://ewchem.vercel.app/)
<!-- [![Star Demo](https://img.shields.io/badge/live-demo-16a34a)]() -->

## Chemistry Variant

[![Live Demo](https://img.shields.io/badge/live-demo-16a34a)](https://ewchem.vercel.app/)

Chemistry variant with molecules instead of cells. All made for EW ;)

----
## Deployment Steps

### Chemistry Branch

[![Chem Demo](https://img.shields.io/badge/live-demo-16a34a)](https://ewchem.vercel.app/)

Deploy the chemistry branch to [https://ewchem.vercel.app/](https://ewchem.vercel.app/):
```bash
git checkout chemistry
npm i -g vercel
vercel
```

[Full prod link (chem).](https://ewchem-k9ulmpxuk-cmutsites-8435s-projects.vercel.app)

### Bio Branch

[![Bio Demo](https://img.shields.io/badge/live-demo-16a34a)](https://ewbio.vercel.app/)

We want the bio deployment to be at [https://ewbio.vercel.app/](https://ewbio.vercel.app/) so we need to remove the gitignored `.vercel/` dir:

```bash
git checkout main
rm -rf .vercel
vercel
```

[Full prod link (bio).](https://ewbio-po8c1lcm6-cmutsites-8435s-projects.vercel.app)

----
## Dev Work

### Local

The following are necessary steps for launching and viewing this on localhost. From the root of the repo:

```bash
npm install      # only needed once / after pulling
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Container

```bash
docker build -t cosmic-explorer -f deploy/Dockerfile .
docker run -p 5174:5174 -p 5173:5173 cosmic-explorer
```

----

# Cell Architecture Studio

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=fff)
![Three.js](https://img.shields.io/badge/Three.js-0.181-000000?logo=threedotjs&logoColor=fff)
![3D Assets](https://img.shields.io/badge/GLB-native%20materials-4f8a3f)
![Verification](https://img.shields.io/badge/verification-playwright%20screenshots-2ea44f)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-local%20prototype-f59e0b)
[![Live Demo](https://img.shields.io/badge/live-demo-16a34a)](https://cell-architecture-studio-inky.vercel.app)

An interactive cell architecture gallery built with React, Vite, Three.js, and staged GLB or procedural 3D cell assets. The project recreates a premium educational biology interface with selectable cell types, organelle details, comparison mode, responsive layout, and visual verification coverage.

## Live Demo

[Open the live Vercel deployment](https://cell-architecture-studio-inky.vercel.app)

[![Cell Architecture Studio demo](docs/media/cell-architecture-studio-demo.gif)](https://cell-architecture-studio-inky.vercel.app)

[View the MP4 demo file](docs/media/cell-architecture-studio-demo.mp4)

## Highlights

- Seven specimen views: plant cell, white blood cell, neuron, epithelial cell, bacteria cell, animal cell, and muscle cell.
- High fidelity Plant Cell and White Blood Cell GLB rendering with native texture preservation.
- Mesh first experience with 3D canvas rendering as the default view.
- AI Tutor panel with learning prompts, lesson focus, and mastery tracking.
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

`npm run verify` launches the local app, captures desktop, compact, mobile, and interaction screenshots, then checks canvas pixel metrics to catch blank renders or major layout regressions.

Current coverage includes:

- Desktop, compact, and mobile smoke checks.
- Plant Cell GLB render check.
- White Blood Cell GLB render check.
- Bacteria mesh interaction check.
- Comparison modal check.

## Roadmap

- Add production quality GLB models for the remaining specimens.
- Add lazy loading and route level code splitting for 3D bundles.
- Expand educational annotations for each organelle.
- Add screenshot export and 3D export workflows.
- Add asset license metadata directly into the UI.

## License

The application code is licensed under the MIT License. Included GLB models and image assets retain their documented provenance in `docs/ASSETS.md`.

## Credits

Special thanks to the original creator [@DilumSanjaya](https://x.com/DilumSanjaya) for the source inspiration and visual direction.

Additional 3D model provenance is documented in `docs/ASSETS.md`.
