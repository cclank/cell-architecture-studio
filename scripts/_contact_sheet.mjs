// Generate contact sheet PNG screenshots of all library thumbnails so they can
// be visually reviewed in batches.
import { chromium } from "playwright-core";
import { homedir } from "node:os";
import { readdirSync, writeFileSync } from "node:fs";

const PUB = "/Users/nicco/Desktop/cell-architecture-studio/public/cell-renders-transparent/library";
const files = readdirSync(PUB).filter((f) => f.endsWith(".png")).sort();
console.log(`${files.length} thumbnails`);

// Bigger tiles so labels and visual quality are readable.
const PER_SHEET = 48;
const COLS = 6;
const TILE = 260;
const sheets = [];
for (let i = 0; i < files.length; i += PER_SHEET) sheets.push(files.slice(i, i + PER_SHEET));

const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--no-sandbox"] });

for (let s = 0; s < sheets.length; s++) {
  const list = sheets[s];
  const rows = Math.ceil(list.length / COLS);
  const html = `<!doctype html><html><head><style>
    body{margin:0;background:#1a1a1a;font-family:monospace;color:#eee;font-size:11px}
    .grid{display:grid;grid-template-columns:repeat(${COLS}, ${TILE}px);gap:6px;padding:6px}
    .cell{background:#2a2a2a;padding:4px;border-radius:6px;display:flex;flex-direction:column;align-items:center}
    .cell img{width:${TILE - 8}px;height:${TILE - 8}px;object-fit:contain;background:#fff}
    .cell span{margin-top:2px;font-size:14px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:${TILE - 8}px}
    .idx{position:absolute;color:#fff;font-weight:bold;background:rgba(0,150,0,0.92);padding:2px 6px;border-radius:0 0 6px 0;font-size:13px}
  </style></head><body><div class="grid">
  ${list.map((f, i) => {
    const idx = s * PER_SHEET + i + 1;
    return `<div class="cell"><span class="idx">${idx}</span><img src="/cell-renders-transparent/library/${f}" /><span>${f.replace(".png","")}</span></div>`;
  }).join("")}
  </div></body></html>`;
  const fname = `/tmp/contact_sheet_${s + 1}.html`;
  writeFileSync(fname, html);
  const page = await browser.newPage({ viewport: { width: COLS * (TILE + 6) + 12, height: rows * (TILE + 30) + 20 } });
  await page.goto(`http://localhost:5174/contact_sheet_${s + 1}.html`).catch(() => {});
  // Serve via file URL instead since the HTML is in /tmp
  await page.setContent(html.replace(/\/cell-renders-transparent/g, "http://localhost:5174/cell-renders-transparent"), { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/contact_${s + 1}.png`, fullPage: true });
  await page.close();
  console.log(`/tmp/contact_${s + 1}.png  (${list.length} thumbs, idx ${s * PER_SHEET + 1}-${s * PER_SHEET + list.length})`);
}

await browser.close();
