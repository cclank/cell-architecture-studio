// Compress every GLB > 5MB in public/models/library/ via gltfpack -cc (meshopt).
// Skips symlinks (they reuse the actual file's compression).
import { readdirSync, statSync, renameSync, lstatSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const DIR = "/Users/nicco/Desktop/cell-architecture-studio/public/models/library";
const MIN = 5 * 1024 * 1024;

const files = readdirSync(DIR).filter((f) => f.endsWith(".glb"));
const targets = files
  .map((f) => ({ f, path: join(DIR, f), stat: lstatSync(join(DIR, f)) }))
  .filter((t) => !t.stat.isSymbolicLink() && t.stat.size >= MIN)
  .sort((a, b) => b.stat.size - a.stat.size);

console.log(`${targets.length} GLBs to compress`);
let beforeTotal = 0;
let afterTotal = 0;
let fail = 0;
for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  const tmp = t.path + ".pack.glb";
  const beforeMB = (t.stat.size / 1024 / 1024).toFixed(1);
  beforeTotal += t.stat.size;
  try {
    execSync(`./node_modules/.bin/gltfpack -i "${t.path}" -o "${tmp}" -cc -kn`, {
      stdio: ["ignore", "ignore", "pipe"],
      timeout: 300000,
      cwd: "/Users/nicco/Desktop/cell-architecture-studio",
    });
    const afterSize = statSync(tmp).size;
    if (afterSize < t.stat.size) {
      renameSync(tmp, t.path);
      afterTotal += afterSize;
      const afterMB = (afterSize / 1024 / 1024).toFixed(1);
      const pct = ((1 - afterSize / t.stat.size) * 100).toFixed(0);
      console.log(`[${i + 1}/${targets.length}] ${t.f}  ${beforeMB}M -> ${afterMB}M  (-${pct}%)`);
    } else {
      // No improvement; keep original
      execSync(`rm -f "${tmp}"`);
      afterTotal += t.stat.size;
      console.log(`[${i + 1}/${targets.length}] ${t.f}  ${beforeMB}M  (no gain, kept)`);
    }
  } catch (e) {
    fail++;
    afterTotal += t.stat.size;
    console.log(`[${i + 1}/${targets.length}] ${t.f}  FAILED: ${e.message.split("\n")[0].slice(0, 80)}`);
    try { execSync(`rm -f "${tmp}"`); } catch {}
  }
}

console.log(`\n=== summary ===`);
console.log(`Before: ${(beforeTotal / 1024 / 1024).toFixed(0)} MB`);
console.log(`After:  ${(afterTotal / 1024 / 1024).toFixed(0)} MB`);
console.log(`Saved:  ${((1 - afterTotal / beforeTotal) * 100).toFixed(1)}%  (${((beforeTotal - afterTotal) / 1024 / 1024).toFixed(0)} MB)`);
console.log(`Failures: ${fail}`);
