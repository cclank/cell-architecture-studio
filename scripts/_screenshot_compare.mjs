import { chromium } from "playwright-core";
import { homedir } from "node:os";
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on("pageerror", e => console.log("ERR:", e.message));
await page.goto("http://localhost:5174/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(3000);

// Click a few representative cells and screenshot
const targets = ["Animal Cell", "Heart", "Human Brain", "Hemoglobin"];
for (const name of targets) {
  await page.locator(".specimen-strip-search input").first().fill(name);
  await page.waitForTimeout(500);
  const tile = page.locator(".specimen-tile").first();
  if (await tile.count() === 0) { console.log("no tile for", name); continue; }
  await tile.click({ noWaitAfter: true, force: true });
  await page.waitForTimeout(4500);
  const slug = name.toLowerCase().replace(/\s+/g, "_");
  await page.screenshot({ path: `/tmp/scene_${slug}.png`, fullPage: false });
  console.log(`captured /tmp/scene_${slug}.png`);
}
await browser.close();
