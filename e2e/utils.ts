import { expect, type Page } from "@playwright/test";

export async function waitForApp(page: Page) {
  await expect(page.locator('html[data-kinora-ready="true"]')).toHaveCount(1, {
    timeout: 20_000,
  });
}

export async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await waitForApp(page);
}

export async function resetDemo(request: import("@playwright/test").APIRequestContext) {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
}

/**
 * Trigger IntersectionObserver-based reveals before a full-page screenshot.
 * Playwright captures the whole document at once, so below-the-fold sections
 * would otherwise still be at opacity 0.
 */
export async function revealWholePage(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((position) => window.scrollTo(0, position), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}
