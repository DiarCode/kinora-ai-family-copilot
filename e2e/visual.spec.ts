import { expect, test } from "@playwright/test";
import { gotoApp, revealWholePage, waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

test("desktop landing and app shell render without horizontal overflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Parenting is a team sport/ }),
  ).toBeVisible();
  const landingOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(landingOverflow).toBeLessThanOrEqual(1);
  await revealWholePage(page);
  await page.screenshot({
    path: "test-results/visual-landing-desktop.png",
    fullPage: true,
  });

  await gotoApp(page, "/app");
  await expect(
    page.getByRole("heading", { name: /Hello, Michael/ }),
  ).toBeVisible();
  const device = await page.locator(".app-device").boundingBox();
  expect(device).not.toBeNull();
  expect(device!.width).toBeGreaterThanOrEqual(430);
  expect(device!.width).toBeLessThanOrEqual(480);
  await page.screenshot({
    path: "test-results/visual-home-desktop.png",
    fullPage: false,
  });

  await gotoApp(page, "/app/assistant");
  await expect(page.getByText(/Hi Michael/)).toBeVisible();
  await page.screenshot({
    path: "test-results/visual-assistant-desktop.png",
    fullPage: false,
  });

  await gotoApp(page, "/app/sessions");
  await expect(
    page.getByRole("heading", { name: "A calmer conversation, together." }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/visual-sessions-desktop.png",
    fullPage: false,
  });

  await gotoApp(page, "/app/sessions/seed-session-bedtime");
  await expect(
    page.getByRole("heading", { name: "Session summary" }),
  ).toBeVisible();
  await expect(page.getByText("What we heard")).toBeVisible();
  await page.screenshot({
    path: "test-results/visual-summary-desktop.png",
    fullPage: false,
  });

  await gotoApp(page, "/app/children/seed-child-sophie");
  await expect(
    page.getByRole("heading", { name: /Kinora doesn't know Sophie yet/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Start the discovery" }).click();
  await page.getByRole("button", { name: "Let's begin" }).click();
  for (let index = 0; index < 10; index += 1) {
    await page.locator("button[aria-pressed]").first().click();
    await page
      .getByRole("button", { name: /Next question|See the map/ })
      .click();
  }
  await page.getByRole("link", { name: "See the full map" }).click();
  await expect(page).toHaveURL(/\/app\/children\/seed-child-sophie$/);
  await expect(page.getByText("Strengths map", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "test-results/visual-child-desktop.png",
    fullPage: false,
  });

  await gotoApp(page, "/app/courses/emotion-coaching-in-90-seconds");
  await expect(
    page.getByRole("heading", { name: "Name it to tame it." }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/visual-course-desktop.png",
    fullPage: false,
  });
});

test("mobile landing has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Parenting is a team sport/ }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await revealWholePage(page);
  await page.screenshot({
    path: "test-results/visual-landing-mobile.png",
    fullPage: true,
  });
});
