// Debug: load Liver and inspect canvas
import { chromium } from "playwright-core";
import { homedir } from "node:os";
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({
  executablePath: exe, headless: true,
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log(`PAGEERROR: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") console.log(`[${m.type()}] ${m.text().slice(0, 200)}`);
});
page.on("requestfailed", (r) => console.log(`REQ FAIL: ${r.url().slice(0, 120)} - ${r.failure()?.errorText}`));

await page.goto("http://localhost:5174/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
console.log("loaded page. canvas count:", await page.locator("canvas").count());

const search = page.locator(".specimen-strip-search input").first();
await search.fill("Liver");
await page.waitForTimeout(500);
console.log("after filter, specimen-tile count:", await page.locator(".specimen-tile").count());
console.log("first tile text:", await page.locator(".specimen-tile").first().innerText());

await page.locator(".specimen-tile").first().click({ timeout: 3000, noWaitAfter: true });
console.log("clicked. waiting 4s for GLB load...");
await page.waitForTimeout(4000);

console.log("canvas count:", await page.locator("canvas").count());
const canvas = page.locator("canvas").first();
try {
  const box = await canvas.boundingBox({ timeout: 5000 });
  console.log("canvas box:", box);
} catch (e) {
  console.log("boundingBox err:", e.message);
}

await page.screenshot({ path: "/tmp/debug-liver.png", fullPage: true });
console.log("screenshot at /tmp/debug-liver.png");

// inspect html structure
const html = await page.evaluate(() => {
  const wrap = document.querySelector(".canvas-wrap");
  return {
    wrapRect: wrap?.getBoundingClientRect(),
    wrapChildren: wrap ? wrap.innerHTML.slice(0, 500) : null,
  };
});
console.log("canvas-wrap:", JSON.stringify(html, null, 2));

await browser.close();
