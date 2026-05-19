import { chromium } from "playwright-core";
import { homedir } from "node:os";
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on("pageerror", e => console.log("PAGEERROR:\n" + e.stack));
await page.goto("http://localhost:5174/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(3000);
await browser.close();
