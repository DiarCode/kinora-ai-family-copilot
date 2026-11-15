import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("pitch-deck");
const OUT = path.join(ROOT, "review");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
  colorScheme: "light",
  reducedMotion: "reduce",
});
await page.goto(`file://${path.join(ROOT, "index.html")}`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const count = await page.locator(".slide").count();
const requested = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= count);
const list = requested.length ? requested : Array.from({ length: count }, (_, i) => i + 1);

for (const n of list) {
  await page.evaluate((slide) => {
    location.hash = String(slide);
  }, n);
  await page.waitForTimeout(350);
  const file = path.join(OUT, `slide-${String(n).padStart(2, "0")}.png`);
  await page.screenshot({ path: file, animations: "disabled" });
  console.log(`captured ${file}`);
}

await browser.close();
