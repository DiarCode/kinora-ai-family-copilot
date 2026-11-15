import { chromium } from "@playwright/test";
import path from "node:path";

const ROOT = path.resolve("pitch-deck");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto(`file://${path.join(ROOT, "index.html")}`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.emulateMedia({ media: "print" });
await page.pdf({
  path: path.join(ROOT, "kinora-seed-2026-long.pdf"),
  width: "13.333in",
  height: "7.5in",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
console.log("wrote pitch-deck/kinora-seed-2026-long.pdf");
await browser.close();
