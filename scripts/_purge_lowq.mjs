// Remove low-quality / non-biology entries from cells.ts and delete their PNG/GLB.
import { readFileSync, writeFileSync, existsSync, unlinkSync, lstatSync } from "node:fs";

const SRC = "/Users/nicco/Desktop/cell-architecture-studio/src/data/cells.ts";
const PUB_PNG = "/Users/nicco/Desktop/cell-architecture-studio/public/cell-renders-transparent/library/";
const PUB_GLB = "/Users/nicco/Desktop/cell-architecture-studio/public/models/library/";

// Explicit IDs to drop (devices, blue-sphere eyes, broken renders).
const DROP_IDS = new Set([
  "axonloopchippdms",
  "alligator-head-scan",
  "kernel-security-module",
  "light-box-complete-build",
  "ringbearer-rodsv2-70mm",
  "rear-plate",
  "meyelens",
  "15aefemur",
  "3d-vh-f-eye-l",
  "3d-vh-f-eye-r",
  "3d-vh-m-eye-l",
  "3d-vh-m-eye-r",
  "zerna-erecta",
  "zerna-ramosa",
  "eye-right",
  "blood-vessel-outline",
  "cervical-spinal-pathways-dual-surface",
  "elbow-ulnar-nerve",
  "lymph-vessel",
  "pug-jaw",
  "feline-jaw-fracture",
]);

// Regex patterns for whole categories to drop (PPE/COVID gear)
const DROP_PATTERNS = [
  /covid/i,
  /ear[- ]?saver/i,
  /^ear-?2520(relief|sore|saver)/i,
  /face[- ]?shield/i,
  /face[- ]?mask/i,
  /^mask-2520/i,
  /^mask-/i,
  /sore[- ]?relief/i,
  /surgical[- ]?mask/i,
  /^surgical-2520/i,
  /^shorter-2520surgical/i,
  /^dia-2520covid/i,
  /^custom-2520fit-2520mask/i,
  /flexi-turtle-?2520ear/i,
];

function shouldDrop(id) {
  if (DROP_IDS.has(id)) return true;
  for (const pat of DROP_PATTERNS) if (pat.test(id)) return true;
  return false;
}

const src = readFileSync(SRC, "utf8");
const lines = src.split("\n");

// Find the cells array boundaries
let arrayStart = -1;
let arrayEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^export const cells:/)) arrayStart = i;
  if (arrayStart > -1 && lines[i] === "];" && arrayEnd === -1) arrayEnd = i;
}
if (arrayStart < 0 || arrayEnd < 0) {
  console.error("Cannot locate cells array");
  process.exit(1);
}
console.log(`cells array: lines ${arrayStart + 1}..${arrayEnd + 1}`);

// Split entries inside
const kept = [];
const dropped = [];
let cur = null;
for (let i = arrayStart + 1; i < arrayEnd; i++) {
  const line = lines[i];
  if (cur === null) {
    if (line === "  {") cur = [line];
  } else {
    cur.push(line);
    if (line === "  }," || line === "  }") {
      const block = cur.join("\n");
      const idM = block.match(/^ {4}id:\s*"([^"]+)",/m);
      const id = idM ? idM[1] : "?";
      if (shouldDrop(id)) {
        dropped.push(id);
      } else {
        kept.push(block);
      }
      cur = null;
    }
  }
}

console.log(`Kept: ${kept.length}, Dropped: ${dropped.length}`);
console.log(`Dropped IDs:`);
for (const id of dropped) console.log(`  ${id}`);

// Rebuild file
const newSrc =
  lines.slice(0, arrayStart + 1).join("\n") +
  "\n" +
  kept.join(",\n").replace(/,$/, "") +
  ",\n" +
  lines.slice(arrayEnd).join("\n");

writeFileSync(SRC, newSrc);
console.log(`\nWrote ${SRC}`);

// Delete corresponding PNG and GLB files
let pngDel = 0,
  glbDel = 0;
for (const id of dropped) {
  // try id, id-nih3d, and rebuild from typical patterns
  for (const candidate of [id, `${id}-nih3d`]) {
    const png = PUB_PNG + candidate + ".png";
    const glb = PUB_GLB + candidate + ".glb";
    if (existsSync(png)) {
      unlinkSync(png);
      pngDel++;
    }
    if (existsSync(glb) || (existsSync(glb) === false && safeLstat(glb))) {
      try {
        unlinkSync(glb);
        glbDel++;
      } catch {}
    }
  }
}

function safeLstat(p) {
  try {
    lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

console.log(`Deleted ${pngDel} PNGs, ${glbDel} GLBs`);
