# 3D Asset Provenance

> Last updated: 2026-05-16 15:30

The prototype uses local GLB files for the highest fidelity cell specimens. These files are loaded from `public/models/` and paired with preview images in `public/nih-previews/`.

| Specimen | Local files | Source |
| --- | --- | --- |
| Plant Cell | `public/models/plant-cell-first001.glb` | Local user-provided GLB: `/Users/lank/Downloads/first001.glb` |
| White Blood Cell | `public/models/white-blood-cell-user.glb` | Local user-provided GLB: `/Users/lank/Downloads/second.glb` |
| Animal Cell | `public/models/animal-cell-nih.glb`, `public/nih-previews/animal-cell-nih.png` | NIH 3D entry: https://3d.nih.gov/entries/3DPX-015797/2 |
| Neuron | `public/models/neuron-nih.glb`, `public/nih-previews/neuron-nih.png` | NIH 3D entry: https://3d.nih.gov/entries/3DPX-015796/2 |
| Gram Positive Cell Wall | `public/models/bacteria-wall-nih.glb`, `public/nih-previews/bacteria-wall-nih.png` | NIH 3D entry: https://3d.nih.gov/entries/3DPX-010752/2 |

The remaining cell types still use procedural Three.js geometry so the experience remains complete while more licensed GLB assets are sourced.

## Model Library (`public/models/library/`)

A staging area for additional GLB models downloaded from the NIH 3D Print Exchange. These are **not yet wired into the app sidebar**, but are available locally for future inclusion. The full inventory is tracked in `public/models/library/manifest.json`.

| Specimen | File | NIH 3D Entry |
| --- | --- | --- |
| Human Heart | `library/human-heart.glb` | [3DPX-022787](https://3d.nih.gov/entries/3DPX-022787) |
| Detailed Human Brain | `library/human-brain-detailed.glb` | [3DPX-021161](https://3d.nih.gov/entries/3DPX-021161) |
| Liver (Visible Human Male) | `library/liver-male.glb` | [3DPX-021007](https://3d.nih.gov/entries/3DPX-021007) |
| Lung (Visible Human Male) | `library/lung-male.glb` | [3DPX-021008](https://3d.nih.gov/entries/3DPX-021008) |
| Small Intestine (Visible Human Male) | `library/small-intestine-male.glb` | [3DPX-021017](https://3d.nih.gov/entries/3DPX-021017) |
| Large Intestine | `library/large-intestine.glb` | [3DPX-002736](https://3d.nih.gov/entries/3DPX-002736) |
| Human Skull | `library/human-skull.glb` | [3DPX-016801](https://3d.nih.gov/entries/3DPX-016801) |
| Scapula | `library/scapula.glb` | [3DPX-016813](https://3d.nih.gov/entries/3DPX-016813) |
| Female Thigh, Knee, Leg Bones | `library/female-thigh-knee-leg.glb` | [3DPX-016666](https://3d.nih.gov/entries/3DPX-016666) |
| SARS-CoV-2 Virion (NIAID) | `library/sars-cov-2-virion.glb` | [3DPX-013323](https://3d.nih.gov/entries/3DPX-013323) |
| Hemoglobin | `library/hemoglobin.glb` | [3DPX-011342](https://3d.nih.gov/entries/3DPX-011342) |
| 70S Ribosome | `library/ribosome-70s.glb` | [3DPX-016628](https://3d.nih.gov/entries/3DPX-016628) |
| Influenza Virion | `library/influenza-virion.glb` | [3DPX-013373](https://3d.nih.gov/entries/3DPX-013373) |
| Ebola Virion Cutaway | `library/ebola-virion.glb` | [3DPX-008050](https://3d.nih.gov/entries/3DPX-008050) |
| HIV Cutaway Model | `library/hiv-virion.glb` | [3DPX-007838](https://3d.nih.gov/entries/3DPX-007838) |
| Pancreas (Visible Human Male) | `library/pancreas-male.glb` | [3DPX-021013](https://3d.nih.gov/entries/3DPX-021013) |
| Human Kidney Model | `library/human-kidney.glb` | [3DPX-023373](https://3d.nih.gov/entries/3DPX-023373) |
| Adult Female Pelvis | `library/female-pelvis.glb` | [3DPX-014841](https://3d.nih.gov/entries/3DPX-014841) |
| Cervical Vertebra C2 | `library/cervical-vertebra-c2.glb` | [3DPX-001315](https://3d.nih.gov/entries/3DPX-001315) |
| Insulin | `library/insulin.glb` | [3DPX-002845](https://3d.nih.gov/entries/3DPX-002845) |
| Collagen Triple Helix | `library/collagen-triple-helix.glb` | [3DPX-009367](https://3d.nih.gov/entries/3DPX-009367) |
| Folding DNA Model | `library/folding-dna.glb` | [3DPX-001475](https://3d.nih.gov/entries/3DPX-001475) |
| Spermatozoon (Flexi) | `library/sperm-flexi.glb` | [3DPX-022779](https://3d.nih.gov/entries/3DPX-022779) |
| Upper Dental Tooth | `library/upper-tooth.glb` | [3DPX-003002](https://3d.nih.gov/entries/3DPX-003002) |
| Urinary Bladder (Male) | `library/urinary-bladder-male.glb` | [3DPX-021025](https://3d.nih.gov/entries/3DPX-021025) |
| Larynx | `library/larynx.glb` | [3DPX-014756](https://3d.nih.gov/entries/3DPX-014756) |
| ATP Molecule | `library/atp-molecule.glb` | [3DPX-007806](https://3d.nih.gov/entries/3DPX-007806) |
| Escherichia coli | `library/ecoli.glb` | [3DPX-016305](https://3d.nih.gov/entries/3DPX-016305) |
| Salmonella Flagellar Basal Body | `library/salmonella-flagellar.glb` | [3DPX-016805](https://3d.nih.gov/entries/3DPX-016805) |
| IgG Antibody (PDB 1IGT) | `library/igg-antibody.glb` | [3DPX-015035](https://3d.nih.gov/entries/3DPX-015035) |
| Antibody–Antigen Complex | `library/antibody-antigen.glb` | [3DPX-015554](https://3d.nih.gov/entries/3DPX-015554) |
| Blood Vasculature (VH Male) | `library/blood-vasculature.glb` | [3DPX-020997](https://3d.nih.gov/entries/3DPX-020997) |
| Human Eye (VH Male) | `library/eye-right.glb` | [3DPX-020999](https://3d.nih.gov/entries/3DPX-020999) |
| Prostate (VH Male) | `library/prostate.glb` | [3DPX-021015](https://3d.nih.gov/entries/3DPX-021015) |
| Uterus (VH Female) | `library/uterus.glb` | [3DPX-020996](https://3d.nih.gov/entries/3DPX-020996) |
| Placenta (VH Female) | `library/placenta.glb` | [3DPX-020985](https://3d.nih.gov/entries/3DPX-020985) |
| Spleen (VH Female) | `library/spleen.glb` | [3DPX-020989](https://3d.nih.gov/entries/3DPX-020989) |
| Thymus (VH Female) | `library/thymus.glb` | [3DPX-020990](https://3d.nih.gov/entries/3DPX-020990) |
| Spinal Cord (VH Female) | `library/spinal-cord.glb` | [3DPX-020988](https://3d.nih.gov/entries/3DPX-020988) |
| Lymph Node | `library/lymph-node.glb` | [3DPX-020975](https://3d.nih.gov/entries/3DPX-020975) |
| Trachea (VH Male) | `library/trachea.glb` | [3DPX-021021](https://3d.nih.gov/entries/3DPX-021021) |
| Main Bronchus (VH Female) | `library/main-bronchus.glb` | [3DPX-020976](https://3d.nih.gov/entries/3DPX-020976) |
| Ovary (VH Female) | `library/ovary.glb` | [3DPX-020979](https://3d.nih.gov/entries/3DPX-020979) |
| Skin (VH Female) | `library/skin.glb` | [3DPX-020986](https://3d.nih.gov/entries/3DPX-020986) |
| Knee Joint (VH Female) | `library/knee-joint.glb` | [3DPX-020970](https://3d.nih.gov/entries/3DPX-020970) |

### Bulk-scraped library (~250 additional)

Beyond the curated entries above, the library directory now holds ~250 more GLBs scraped automatically from the NIH 3D Print Exchange across these ID ranges:

- `3DPX-009000` – `3DPX-014000` (older PathogenAR + biology)
- `3DPX-020950` – `3DPX-023500` (Human Reference Atlas / Visible Human Project)
- `3DPX-016000` – `3DPX-017500` (varied biomedical)

The fetcher `scripts/fetch-nih-models.mjs` discovers the GLB via `/api/files/<id>` endpoint, and PNG thumbnails are produced by `scripts/generate-thumbnails.mjs` / `scripts/generate-all-thumbnails.mjs`. Auto-generated entries get a generic category-based template — refine per entry if you want richer narration.

PNG thumbnails for sidebar previews are generated into `public/cell-renders-transparent/library/` by `scripts/generate-thumbnails.mjs`. Re-run that script whenever new library entries are added.

Each entry's license should be re-checked on its NIH 3D page before use (most are CC-BY or CC0; a few may have author-specific terms). The fetcher used to download them is at `scripts/fetch-nih-models.mjs`.

### Procedural Specimens (improved)

- **Muscle Fiber** — striated fiber with seven parallel myofibrils, each composed of alternating A-band / I-band / Z-disc segments (sarcomere units), three peripheral nuclei and inter-fibrillar mitochondria. Implemented in `src/components/CellScene.tsx` (`MuscleModel`).
- **Epithelial Cell** — columnar cell with apical brush border (36 microvilli over a hex-grid disc), basal nucleus, lateral tight junctions, and partial neighbor cells for the sheet context. Implemented in `src/components/CellScene.tsx` (`EpithelialModel`).

## Reference Renders

The app also includes single-subject generated reference images for thumbnails, model previews, and downstream 3D asset experiments.

| Specimen | Local file |
| --- | --- |
| Plant Cell | `public/cell-renders/plant.png` |
| White Blood Cell | `public/cell-renders/white-blood.png` |
| Neuron | `public/cell-renders/neuron.png` |
| Epithelial Cell | `public/cell-renders/epithelial.png` |
| Bacteria Cell | `public/cell-renders/bacteria.png` |
| Animal Cell | `public/cell-renders/animal.png` |
| Muscle Cell | `public/cell-renders/muscle.png` |

Transparent-background versions live in `public/cell-renders-transparent/` and are used by sidebar thumbnails and GLB preview metadata.
