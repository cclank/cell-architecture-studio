# 3D Asset Provenance

The prototype uses local GLB files for the highest fidelity cell specimens. These files are loaded from `public/models/` and paired with preview images in `public/nih-previews/`.

| Specimen | Local files | Source |
| --- | --- | --- |
| Plant Cell | `public/models/plant-cell-first001.glb` | Local user-provided GLB: `/Users/lank/Downloads/first001.glb` |
| White Blood Cell | `public/models/white-blood-cell-user.glb` | Local user-provided GLB: `/Users/lank/Downloads/second.glb` |
| Animal Cell | `public/models/animal-cell-nih.glb`, `public/nih-previews/animal-cell-nih.png` | NIH 3D entry: https://3d.nih.gov/entries/3DPX-015797/2 |
| Neuron | `public/models/neuron-nih.glb`, `public/nih-previews/neuron-nih.png` | NIH 3D entry: https://3d.nih.gov/entries/3DPX-015796/2 |
| Gram Positive Cell Wall | `public/models/bacteria-wall-nih.glb`, `public/nih-previews/bacteria-wall-nih.png` | NIH 3D entry: https://3d.nih.gov/entries/3DPX-010752/2 |

The remaining cell types still use procedural Three.js geometry so the experience remains complete while more licensed GLB assets are sourced.

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
