import { mkdir, writeFile, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const OUT_DIR = new URL("../public/models/library/", import.meta.url).pathname;
await mkdir(OUT_DIR, { recursive: true });

const ENTRIES = [
  { id: "3DPX-022787", slug: "human-heart", label: "Human Heart" },
  { id: "3DPX-021161", slug: "human-brain-detailed", label: "Detailed Human Brain" },
  { id: "3DPX-021007", slug: "liver-male", label: "Liver (Visible Human Male)" },
  { id: "3DPX-021008", slug: "lung-male", label: "Lung (Visible Human Male)" },
  { id: "3DPX-021017", slug: "small-intestine-male", label: "Small Intestine (Visible Human Male)" },
  { id: "3DPX-002736", slug: "large-intestine", label: "Large Intestine" },
  { id: "3DPX-016801", slug: "human-skull", label: "Human Skull" },
  { id: "3DPX-016813", slug: "scapula", label: "Scapula" },
  { id: "3DPX-016666", slug: "female-thigh-knee-leg", label: "Female Thigh, Knee, Leg Bones" },
  { id: "3DPX-013323", slug: "sars-cov-2-virion", label: "SARS-CoV-2 Virion (NIAID)" },
  { id: "3DPX-011342", slug: "hemoglobin", label: "Hemoglobin" },
  { id: "3DPX-016628", slug: "ribosome-70s", label: "70S Ribosome" },
  { id: "3DPX-013373", slug: "influenza-virion", label: "Influenza Virion (PathogenAR)" },
  { id: "3DPX-008050", slug: "ebola-virion", label: "Ebola Virion Cutaway" },
  { id: "3DPX-007838", slug: "hiv-virion", label: "HIV Cutaway Model" },
  { id: "3DPX-021013", slug: "pancreas-male", label: "Pancreas (Visible Human Male)" },
  { id: "3DPX-023373", slug: "human-kidney", label: "Human Kidney Model" },
  { id: "3DPX-014841", slug: "female-pelvis", label: "Adult Female Pelvis" },
  { id: "3DPX-001315", slug: "cervical-vertebra-c2", label: "Cervical Vertebra C2" },
  { id: "3DPX-002845", slug: "insulin", label: "Insulin" },
  { id: "3DPX-009367", slug: "collagen-triple-helix", label: "Collagen Triple Helix" },
  { id: "3DPX-001475", slug: "folding-dna", label: "Folding DNA Model" },
  { id: "3DPX-022779", slug: "sperm-flexi", label: "Spermatozoon (Flexi)" },
  { id: "3DPX-003002", slug: "upper-tooth", label: "Upper Dental Tooth" },
  { id: "3DPX-021025", slug: "urinary-bladder-male", label: "Urinary Bladder (Male)" },
  { id: "3DPX-014756", slug: "larynx", label: "Interactive Larynx" },
  { id: "3DPX-007806", slug: "atp-molecule", label: "ATP Molecule" },
  { id: "3DPX-016305", slug: "ecoli", label: "Escherichia coli" },
  { id: "3DPX-016805", slug: "salmonella-flagellar", label: "Salmonella Flagellar Basal Body" },
  { id: "3DPX-015035", slug: "igg-antibody", label: "IgG Antibody (PDB 1IGT)" },
  { id: "3DPX-015554", slug: "antibody-antigen", label: "Antibodies Interacting with Antigen" },
  // Batch 5 — molecular biology + extra anatomy
  { id: "3DPX-008047", slug: "dna-3-2", label: "DNA 3-2 Helix Model" },
  { id: "3DPX-008053", slug: "z-rna", label: "Z-RNA" },
  { id: "3DPX-008056", slug: "trna", label: "Transfer RNA (tRNA)" },
  { id: "3DPX-008057", slug: "rna-polymerase", label: "RNA Polymerase" },
  { id: "3DPX-008145", slug: "fetal-skull", label: "Fetal Skull" },
  { id: "3DPX-008880", slug: "ssdna", label: "Single-Stranded DNA" },
  { id: "3DPX-008908", slug: "horseshoe-kidney", label: "Horseshoe Kidney" },
  { id: "3DPX-007207", slug: "heart-pt2", label: "Heart Cross-Section" },
  { id: "3DPX-007404", slug: "bacterial-flagellum", label: "Bacterial Flagellum" },
  { id: "3DPX-004645", slug: "pelvis-sacrum", label: "Pelvis with Sacrum" },
  { id: "3DPX-014845", slug: "hollow-femur", label: "Simplified Hollow Femur" },
  { id: "3DPX-014934", slug: "influenza-capsid-rna", label: "Influenza Capsid RNA" },
  { id: "3DPX-015914", slug: "synthetic-dna", label: "Synthetic DNA Model" },
  { id: "3DPX-015984", slug: "generic-virion", label: "Generic Virion" },
  { id: "3DPX-015988", slug: "relaxed-dna", label: "Relaxed DNA" },
  { id: "3DPX-015990", slug: "condensed-dna", label: "Condensed DNA" },
  { id: "3DPX-017680", slug: "blood-vessel-outline", label: "Blood Vessel Outline" },
  { id: "3DPX-008469", slug: "heart-long-axis", label: "Heart Parasternal Long Axis" },
  { id: "3DPX-000142", slug: "eyewire-neuron", label: "Eyewire Neuron" },
  { id: "3DPX-000268", slug: "organs-combined", label: "Organs Combined" },
  { id: "3DPX-000307", slug: "lumbar-vertebra-l1", label: "First Lumbar Vertebra L1" },
  { id: "3DPX-000320", slug: "full-brain", label: "Full Brain" },
  { id: "3DPX-000451", slug: "lymph-vessel", label: "Lymph Vessel" },
  { id: "3DPX-000452", slug: "heart-valve", label: "Heart Valve" },
  { id: "3DPX-000522", slug: "elbow-ulnar-nerve", label: "Elbow with Ulnar Nerve" },
  { id: "3DPX-000528", slug: "vertebrae-disks", label: "Vertebrae with Intervertebral Disks" },
  { id: "3DPX-000789", slug: "cajal-neurons", label: "Cajal Neurons (Historical)" },
  { id: "3DPX-000900", slug: "heart-classic", label: "Heart (Classic Print)" },
  { id: "3DPX-003854", slug: "kidney-renal-tumor", label: "Kidney with Renal Cell Tumour" },
  { id: "3DPX-003892", slug: "brainstem", label: "Brainstem (Half)" },
  // Batch 4 — Visible Human body systems
  { id: "3DPX-020997", slug: "blood-vasculature", label: "Blood Vasculature (VH Male)" },
  { id: "3DPX-020999", slug: "eye-right", label: "Eye Right (VH Male)" },
  { id: "3DPX-021015", slug: "prostate", label: "Prostate (VH Male)" },
  { id: "3DPX-020996", slug: "uterus", label: "Uterus (VH Female)" },
  { id: "3DPX-020985", slug: "placenta", label: "Placenta (VH Female)" },
  { id: "3DPX-020989", slug: "spleen", label: "Spleen (VH Female)" },
  { id: "3DPX-020990", slug: "thymus", label: "Thymus (VH Female)" },
  { id: "3DPX-020988", slug: "spinal-cord", label: "Spinal Cord (VH Female)" },
  { id: "3DPX-020975", slug: "lymph-node", label: "Lymph Node (VH Female)" },
  { id: "3DPX-021021", slug: "trachea", label: "Trachea (VH Male)" },
  { id: "3DPX-020976", slug: "main-bronchus", label: "Main Bronchus (VH Female)" },
  { id: "3DPX-020979", slug: "ovary", label: "Ovary Left (VH Female)" },
  { id: "3DPX-020986", slug: "skin", label: "Skin (VH Female)" },
  { id: "3DPX-020970", slug: "knee-joint", label: "Knee Right (VH Female)" },
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15",
  Accept: "text/html,application/xhtml+xml",
};

function extractApiUrls(html) {
  // S3 references give us the fileId. NIH 3D serves files via two endpoints:
  //  - /api/files/<id> for inputFiles (the original upload, what we want)
  //  - /api/submissions/<sid>/runs/<uuid>/output-files/<id> for derived files
  // We probe both; the first that returns a glTF binary wins.
  const s3Pattern = /persist-3d-media\.s3\.amazonaws\.com\/(\d+)\/([^"\\&]+\.glb)/g;
  const s3Matches = [...html.matchAll(s3Pattern)];
  if (s3Matches.length === 0) return null;
  const glbFileId = s3Matches[0][1];
  const glbFilename = s3Matches[0][2];
  const urls = [`https://3d.nih.gov/api/files/${glbFileId}`];
  const apiPattern = /\/api\/submissions\/(\d+)\/runs\/([a-f0-9-]+)\/output-files\/(\d+)/;
  const apiMatch = html.match(apiPattern);
  if (apiMatch) {
    urls.push(
      `https://3d.nih.gov/api/submissions/${apiMatch[1]}/runs/${apiMatch[2]}/output-files/${glbFileId}`,
    );
  }
  return { urls, glbFilename };
}

async function fetchEntry(entry) {
  const pageUrl = `https://3d.nih.gov/entries/${entry.id}`;
  const res = await fetch(pageUrl, { headers: HEADERS });
  if (!res.ok) throw new Error(`page HTTP ${res.status}`);
  const html = await res.text();
  const info = extractApiUrls(html);
  if (!info) throw new Error("no GLB URL found in page");
  const dest = OUT_DIR + entry.slug + ".glb";
  let lastErr = "";
  for (const apiUrl of info.urls) {
    const dl = await fetch(apiUrl, { headers: HEADERS });
    if (!dl.ok) {
      lastErr = `HTTP ${dl.status}`;
      continue;
    }
    await pipeline(dl.body, createWriteStream(dest));
    const s = await stat(dest);
    return { dest, size: s.size, glbFilename: info.glbFilename, apiUrl };
  }
  throw new Error(`all endpoints failed (last: ${lastErr})`);
}

const manifest = [];
for (const entry of ENTRIES) {
  process.stdout.write(`[${entry.id}] ${entry.label} ... `);
  try {
    const r = await fetchEntry(entry);
    const sizeMb = (r.size / 1024 / 1024).toFixed(2);
    process.stdout.write(`OK ${sizeMb} MB\n`);
    manifest.push({
      id: entry.id,
      slug: entry.slug,
      label: entry.label,
      file: `library/${entry.slug}.glb`,
      sourceFilename: r.glbFilename,
      sourceUrl: `https://3d.nih.gov/entries/${entry.id}`,
      sizeBytes: r.size,
      license: "Inherit from NIH 3D entry — verify per entry",
    });
  } catch (err) {
    process.stdout.write(`FAIL ${err.message}\n`);
    manifest.push({ id: entry.id, slug: entry.slug, label: entry.label, error: err.message });
  }
}
await writeFile(OUT_DIR + "manifest.json", JSON.stringify(manifest, null, 2));
console.log(`\nwrote manifest -> ${OUT_DIR}manifest.json`);
console.log(`successful: ${manifest.filter((m) => !m.error).length}/${manifest.length}`);
