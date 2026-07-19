import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import { formatTargetHelp, hasExpectedAppIdentity } from "./verify-preflight.mjs";

const url = process.env.APP_URL ?? "http://127.0.0.1:5173/";
const chromePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const navigationTimeoutMs = Number(process.env.VERIFY_NAVIGATION_TIMEOUT_MS ?? 12000);
const outDir = new URL("../verification/", import.meta.url);
const modelCanvasSelector = 'canvas[data-engine^="three.js"]';

function outPath(fileName) {
  return fileURLToPath(new URL(fileName, outDir));
}

function assert(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

function preflightError(message, cause) {
  const details = [message, formatTargetHelp({ url, chromePath })];
  if (cause?.message) {
    details.push(`Original error: ${cause.message}`);
  }
  return new Error(details.join("\n\n"));
}

async function openVerifiedPage(browser, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultNavigationTimeout(navigationTimeoutMs);
  await page.addInitScript(() => localStorage.setItem("cas-onboarded", "1"));

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: navigationTimeoutMs });
  } catch (error) {
    await page.close();
    throw preflightError(`Unable to open APP_URL ${url}.`, error);
  }

  const title = await page.title();
  const bodyText = await page.locator("body").innerText({ timeout: 3000 }).catch(() => "");
  if (!hasExpectedAppIdentity({ title, bodyText })) {
    await page.close();
    throw preflightError(
      `APP_URL ${url} did not load Cell Architecture Studio. Received page title: "${title || "(empty)"}".`,
    );
  }

  try {
    await page.waitForSelector(modelCanvasSelector, { timeout: 15000 });
  } catch (error) {
    await page.close();
    throw preflightError(`Cell Architecture Studio loaded, but no canvas appeared at ${url}.`, error);
  }

  return page;
}

async function readVisualMetrics(page, selector) {
  const box = await page.locator(selector).boundingBox();
  const buffer = await page.locator(selector).screenshot();
  const png = PNG.sync.read(buffer);
  const left = Math.floor(png.width * 0.18);
  const right = Math.floor(png.width * 0.82);
  const top = Math.floor(png.height * 0.16);
  const bottom = Math.floor(png.height * 0.86);

  let nonPaper = 0;
  let sum = 0;
  let sumSquares = 0;
  let alphaPixels = 0;
  let count = 0;

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const index = (png.width * y + x) * 4;
      const r = png.data[index];
      const g = png.data[index + 1];
      const b = png.data[index + 2];
      const a = png.data[index + 3];
      const brightness = (r + g + b) / 3;
      if (a > 0) {
        alphaPixels += 1;
      }
      if (Math.abs(r - 251) + Math.abs(g - 247) + Math.abs(b - 238) > 26) {
        nonPaper += 1;
      }
      sum += brightness;
      sumSquares += brightness * brightness;
      count += 1;
    }
  }

  const mean = sum / count;
  const variance = sumSquares / count - mean * mean;

  return {
    width: box?.width ?? png.width,
    height: box?.height ?? png.height,
    alphaRatio: alphaPixels / count,
    nonPaperRatio: nonPaper / count,
    variance,
  };
}

async function verifyViewport(browser, name, viewport) {
  const page = await openVerifiedPage(browser, viewport);
  await page.waitForTimeout(1600);

  const title = await page.locator(".stage-title h2").innerText();
  const cellCount = await page.locator(".specimen-tile").count();
  const tutorText = await page.locator(".learning-panel").innerText();
  const modeTitles = await page.locator(".mode-switcher button").evaluateAll((buttons) =>
    buttons.map((button) => button.getAttribute("title")),
  );
  const activeMode = await page.locator(".mode-switcher button.is-active").getAttribute("title");
  const visualBox = await page.locator(modelCanvasSelector).boundingBox();
  await page.screenshot({ path: outPath(`${name}.png`), fullPage: true });
  await page.locator(modelCanvasSelector).screenshot({ path: outPath(`${name}-visual.png`) });
  const metrics = await readVisualMetrics(page, modelCanvasSelector);

  assert(title.includes("Animal Cell"), `${name}: initial title mismatch`);
  assert(cellCount === 7, `${name}: expected 7 cells, received ${cellCount}`);
  assert(tutorText.toLowerCase().includes("ai tutor"), `${name}: AI tutor panel is missing`);
  assert(tutorText.toLowerCase().includes("mastery"), `${name}: mastery tracker is missing`);
  assert(activeMode === "Mesh", `${name}: default mode should be Mesh`);
  assert(modeTitles.length === 2 && modeTitles.includes("Mesh") && modeTitles.includes("Focus"), `${name}: unexpected mode buttons`);
  assert(visualBox && visualBox.width > 260 && visualBox.height > 220, `${name}: visual is too small`);
  const visibleCanvasHeight = visualBox
    ? Math.min(viewport.height, visualBox.y + visualBox.height) - Math.max(0, visualBox.y)
    : 0;
  assert(visibleCanvasHeight > Math.min(220, (visualBox?.height ?? 0) * 0.55), `${name}: canvas is mostly outside the viewport`);
  assert(metrics, `${name}: missing visual metrics`);
  assert(metrics.nonPaperRatio > 0.05, `${name}: visual appears blank`);
  assert(metrics.variance > 120, `${name}: visual has too little pixel variation`);
  await page.close();

  return { name, title, cellCount, activeMode, modeTitles, visualBox, metrics };
}

async function verifyInteractions(browser) {
  const page = await openVerifiedPage(browser, { width: 1440, height: 1000 });
  await page.waitForTimeout(600);

  await page.locator(".specimen-tile").filter({ hasText: "Plant Cell" }).click();
  await page.waitForSelector(modelCanvasSelector, { timeout: 15000 });
  await page.waitForTimeout(7000);
  const plantModelMetrics = await readVisualMetrics(page, modelCanvasSelector);
  assert(plantModelMetrics.nonPaperRatio > 0.05, "plant GLB appears blank");
  assert(plantModelMetrics.variance > 120, "plant GLB has too little pixel variation");

  await page.locator(".specimen-tile").filter({ hasText: "White Blood Cell" }).click();
  await page.waitForSelector(modelCanvasSelector, { timeout: 15000 });
  await page.waitForTimeout(7000);
  const whiteBloodModelMetrics = await readVisualMetrics(page, modelCanvasSelector);
  assert(whiteBloodModelMetrics.nonPaperRatio > 0.05, "white blood GLB appears blank");
  assert(whiteBloodModelMetrics.variance > 120, "white blood GLB has too little pixel variation");

  await page.locator(".specimen-tile").filter({ hasText: "Bacteria Cell" }).click();
  await page.waitForSelector(modelCanvasSelector, { timeout: 15000 });
  await page.waitForTimeout(800);

  const title = await page.locator(".stage-title h2").innerText();
  assert(title.includes("Bacteria Cell"), "cell switch did not update title");
  const bacteriaMeshMetrics = await readVisualMetrics(page, modelCanvasSelector);
  assert(bacteriaMeshMetrics.nonPaperRatio > 0.05, "bacteria mesh appears blank");
  assert(bacteriaMeshMetrics.variance > 120, "bacteria mesh has too little pixel variation");

  await page.locator(".organelle-row").filter({ hasText: "Flagellum" }).click();
  await page.waitForTimeout(250);
  const detailTitle = await page.locator(".detail-hero h3").innerText();
  assert(detailTitle.includes("Flagellum"), "organelle switch did not update details");

  await page.locator(".prompt-list button").first().click();
  await page.waitForTimeout(250);
  const tutorPrompt = await page.locator(".tutor-prompt p").innerText();
  assert(tutorPrompt.includes("Flagellum"), "AI tutor prompt did not update");

  await page.getByRole("button", { name: /Open Comparison View/ }).click();
  await page.waitForTimeout(250);
  const modalTitle = await page.locator(".comparison-modal h3").innerText();
  assert(modalTitle.includes("Comparison View"), "comparison modal did not open");

  await page.screenshot({ path: outPath("interaction.png"), fullPage: true });
  await page.locator(modelCanvasSelector).screenshot({ path: outPath("interaction-canvas.png") });
  await page.close();

  return {
    title,
    detailTitle,
    tutorPrompt,
    modalTitle,
    plantModelMetrics,
    whiteBloodModelMetrics,
    bacteriaMeshMetrics,
  };
}

await mkdir(outDir, { recursive: true });

let browser;

try {
  browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
} catch (error) {
  throw preflightError(`Unable to launch Chrome at ${chromePath}.`, error);
}

try {
  const desktop = await verifyViewport(browser, "desktop", { width: 1440, height: 1000 });
  const compact = await verifyViewport(browser, "compact", { width: 1280, height: 720 });
  const mobile = await verifyViewport(browser, "mobile", { width: 390, height: 900 });
  const interactions = await verifyInteractions(browser);

  console.log(
    JSON.stringify(
      {
        ok: true,
        url,
        screenshots: [
          "verification/desktop.png",
          "verification/desktop-visual.png",
          "verification/compact.png",
          "verification/compact-visual.png",
          "verification/mobile.png",
          "verification/mobile-visual.png",
          "verification/interaction.png",
          "verification/interaction-canvas.png",
        ],
        desktop,
        compact,
        mobile,
        interactions,
      },
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
}
