// Walk every interactive UI category and verify a toast appears.
import { chromium } from "playwright-core";
import { homedir } from "node:os";

const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({
  executablePath: exe,
  headless: true,
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
const consoleErrs = [];
page.on("pageerror", (e) => consoleErrs.push(`PAGEERROR: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrs.push(`CONSOLE ERROR: ${m.text()}`);
});
await page.goto("http://localhost:5174/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(3000);

const results = [];

async function checkToast(label, action, { expectText } = {}) {
  try {
    await page.locator(".toast").first().waitFor({ state: "detached", timeout: 3500 });
  } catch {}
  await action();
  let ok = false;
  let text = "";
  try {
    const t = page.locator(".toast").first();
    await t.waitFor({ state: "visible", timeout: 1500 });
    text = (await t.innerText()).trim();
    ok = expectText ? text.toLowerCase().includes(expectText.toLowerCase()) : true;
  } catch (e) {
    ok = false;
  }
  results.push({ label, ok, text });
  console.log(`${ok ? "OK  " : "FAIL"} ${label}  ->  ${text || "(no toast)"}`);
}

// Header nav (Gallery/Library/Notebooks/About) and the avatar now open modals
// or a menu — their feedback is the opened UI, verified in _test_roadmap.mjs.
for (const [label, panel] of [
  ["Gallery", ".browser-modal"],
  ["Notebooks", ".notebooks-modal"],
]) {
  try {
    await page.locator(".top-nav button", { hasText: label }).click({ timeout: 2000 });
    await page.locator(panel).first().waitFor({ state: "visible", timeout: 2000 });
    results.push({ label: `header: ${label}`, ok: true, text: "opened panel" });
    console.log(`OK   header: ${label}  ->  opened panel`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  } catch {
    results.push({ label: `header: ${label}`, ok: false, text: "no panel" });
    console.log(`FAIL header: ${label}  ->  no panel`);
  }
}
await checkToast("specimen tile: select Neuron", async () => {
  await page.locator(".specimen-tile", { hasText: /^Neuron$/ }).first().click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "neuron" });
await checkToast("specimen tile: favorite Neuron", async () => {
  await page.locator(".specimen-tile.is-active .favorite-pin").first().click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "favorites" });
await checkToast("sidebar: switch organelle", async () => {
  const rows = page.locator(".organelle-row");
  const count = await rows.count();
  if (count >= 2) await rows.nth(1).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "focus" });
await checkToast("sidebar: organelles header chev", async () => {
  await page.locator(".panel-heading-chev").first().click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "organelles available" });
await checkToast("stage: view mode Focus", async () => {
  await page.locator(".mode-switcher button").nth(1).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "view" });
await checkToast("stage: view mode Mesh", async () => {
  await page.locator(".mode-switcher button").nth(0).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "view" });
await checkToast("stage: cross section toggle", async () => {
  await page.locator(".toggle-line").click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "cross section" });
await checkToast("stage: rotate toggle", async () => {
  await page.locator(".stage-toolbar button", { hasText: "Rotate" }).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "rotate" });
await checkToast("stage: isolate", async () => {
  await page.locator(".stage-toolbar button", { hasText: "Isolate" }).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "isolat" });
await checkToast("stage: hide others", async () => {
  await page.locator(".stage-toolbar button", { hasText: "Hide Others" }).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "hide" });
await checkToast("stage: reset view", async () => {
  await page.locator(".stage-toolbar button", { hasText: "Reset View" }).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "reset" });
await checkToast("stage: screenshot", async () => {
  await page.locator(".export-toolbar button", { hasText: "Screenshot" }).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "saved" });
await checkToast("stage: GLB export", async () => {
  await page.locator(".export-toolbar button", { hasText: "GLB Export" }).click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "model" });
await checkToast("bottom: micro-card", async () => {
  await page.locator(".micro-card:not(.add-card)").first().click({ timeout: 2000, noWaitAfter: true });
});
// Add Image opens a native file dialog (feedback = upload, see _test_roadmap.mjs).
try {
  const present = await page.locator(".micro-card-row input[type=file]").count();
  results.push({ label: "bottom: add image (file input)", ok: present > 0, text: present > 0 ? "file input present" : "missing" });
  console.log(`${present > 0 ? "OK  " : "FAIL"} bottom: add image (file input)`);
} catch {
  results.push({ label: "bottom: add image (file input)", ok: false, text: "missing" });
}
await checkToast("bottom: open comparison", async () => {
  await page.locator(".comparison-button").click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "comparison" });
await checkToast("modal: close comparison", async () => {
  await page.locator(".modal-close").click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "closed" });
await checkToast("right: heart favorite", async () => {
  await page.locator(".detail-heading button[aria-label='Toggle favorite']").click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "favorites" });
await checkToast("right: tutor prompt", async () => {
  await page.locator(".prompt-list button").first().click({ timeout: 2000, noWaitAfter: true });
}, { expectText: "tutor" });

await page.screenshot({ path: "/tmp/ui-final.png", fullPage: true });

console.log(`\n=== summary ===`);
const pass = results.filter((r) => r.ok).length;
console.log(`${pass}/${results.length} interactive elements emit feedback`);
const fails = results.filter((r) => !r.ok);
if (fails.length > 0) {
  console.log("\nFAILURES:");
  fails.forEach((f) => console.log(`  - ${f.label}: ${f.text || "no toast"}`));
}
if (consoleErrs.length > 0) {
  console.log("\nCONSOLE ERRORS:");
  consoleErrs.slice(0, 10).forEach((e) => console.log(`  ${e}`));
}

await browser.close();
process.exit(fails.length === 0 ? 0 : 1);
