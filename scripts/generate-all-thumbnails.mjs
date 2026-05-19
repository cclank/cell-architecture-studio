// Generate PNG thumbnails for every cells.ts entry whose renderImage.url file
// does not yet exist on disk. Parses cells.ts by splitting on TOP-LEVEL entry
// boundaries (lines matching `^  {$` and `^  },$`) so nested organelle braces
// don't confuse the matcher.
import { chromium } from "playwright-core";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";

const OUT_DIR = new URL("../public/cell-renders-transparent/library/", import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

const src = readFileSync(new URL("../src/data/cells.ts", import.meta.url).pathname, "utf8");

// Split the cells array into entry blocks by scanning for top-level "  {" ... "  }," boundaries.
function splitEntries(text) {
  const lines = text.split("\n");
  const out = [];
  let cur = null;
  for (const line of lines) {
    if (cur === null) {
      if (line === "  {") cur = [line];
    } else {
      cur.push(line);
      if (line === "  }," || line === "  }") {
        out.push(cur.join("\n"));
        cur = null;
      }
    }
  }
  return out;
}

const entries = splitEntries(src);
const targets = [];
for (const entry of entries) {
  const idM = entry.match(/^ {4}id:\s*"([^"]+)",/m);
  const nameM = entry.match(/^ {4}name:\s*"([^"]+)",/m);
  const renderM = entry.match(/^ {4}renderImage:\s*\{\s*url:\s*"\/cell-renders-transparent\/library\/([^"]+)\.png"/m);
  const glbM = entry.match(/\/models\/library\/[^"]+\.glb/);
  if (!idM || !nameM || !renderM || !glbM) continue;
  const id = idM[1];
  const name = nameM[1];
  const thumbSlug = renderM[1];
  if (existsSync(`${OUT_DIR}${thumbSlug}.png`)) continue;
  targets.push({ id, name, thumbSlug });
}
console.log(`${targets.length} thumbnails to generate`);

if (targets.length === 0) process.exit(0);

const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({
  executablePath: exe,
  headless: true,
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });

// Parallelism: run N pages in parallel against the dev server.
const PARALLELISM = 1;
const WAIT_MS = 4000;

async function makePage() {
  const page = await ctx.newPage();
  await page.goto("http://localhost:5174/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);
  return page;
}

async function processOne(page, t) {
  const search = page.locator(".specimen-strip-search input").first();
  await search.fill(t.name);
  await page.waitForTimeout(400);
  // Click via element.click() in the page context — bypasses every Playwright
  // actionability check that was causing 8s click timeouts on heavy-GLB stages.
  const clicked = await page.evaluate((name) => {
    const tiles = Array.from(document.querySelectorAll(".specimen-tile"));
    const match =
      tiles.find((el) => el.querySelector(".specimen-tile-label")?.textContent === name) ||
      tiles[0];
    if (!match) return false;
    match.scrollIntoView({ behavior: "auto", block: "center" });
    match.click();
    return true;
  }, t.name);
  if (!clicked) throw new Error(`no tile searching "${t.name}"`);
  await page.waitForTimeout(WAIT_MS);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  const canvas = page.locator("canvas").first();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("no canvas");
  await page.screenshot({
    path: `${OUT_DIR}${t.thumbSlug}.png`,
    clip: {
      x: box.x + box.width * 0.12,
      y: box.y + box.height * 0.05,
      width: box.width * 0.76,
      height: box.height * 0.88,
    },
  });
}

const queue = [...targets];
let ok = 0, fail = 0;

async function worker(id) {
  let page = await makePage();
  while (queue.length > 0) {
    const t = queue.shift();
    if (!t) break;
    try {
      await processOne(page, t);
      ok += 1;
      if (ok % 25 === 0 || ok < 10) console.log(`[${ok}/${targets.length}] ${t.thumbSlug} (w${id})`);
    } catch (e) {
      fail += 1;
      console.log(`[fail] ${t.thumbSlug} (${t.name}): ${e.message.split("\n")[0]}`);
      try { await page.close(); } catch {}
      page = await makePage();
    }
  }
  try { await page.close(); } catch {}
}

await Promise.all(Array.from({ length: PARALLELISM }, (_, i) => worker(i + 1)));

await browser.close();
console.log(`\ndone: ${ok} ok, ${fail} fail`);
