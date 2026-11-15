import { expect, test } from "@playwright/test";
import { gotoApp, waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

test("moods persist and drive the next best actions", async ({ page }) => {
  await gotoApp(page, "/app");
  await expect(
    page.getByRole("heading", { name: /Hello, Michael/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Michael feels sunny today" }).click();
  await page.getByRole("button", { name: "Lucy feels cloudy today" }).click();

  await expect(
    page.getByRole("button", { name: "Michael feels sunny today" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Lucy feels cloudy today" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await waitForApp(page);
  await expect(
    page.getByRole("button", { name: "Michael feels sunny today" }),
  ).toHaveAttribute("aria-pressed", "true");

  await expect(page.getByText("Discover Sophie's strengths").first()).toBeVisible();
  await expect(
    page.getByText("Continue “Repair After the Storm”").first(),
  ).toBeVisible();
});

test("two rainy days surface resets and a team check-in", async ({ page }) => {
  await gotoApp(page, "/app");
  await page.getByRole("button", { name: "Michael feels rainy today" }).click();
  await page.getByRole("button", { name: "Lucy feels rainy today" }).click();

  await expect(
    page.getByText("A ten-minute reset for Michael").first(),
  ).toBeVisible();
  await expect(
    page.getByText("A ten-minute reset for Lucy").first(),
  ).toBeVisible();
  await expect(
    page.getByText("Book a ten-minute team check-in").first(),
  ).toBeVisible();
});

test("the menu reaches every module", async ({ page }) => {
  await gotoApp(page, "/app");
  const drawer = page.getByRole("dialog");

  for (const [label, url, heading] of [
    ["Courses", /\/app\/courses/, "Courses"],
    ["Children", /\/app\/children/, "Children"],
    ["Sessions", /\/app\/sessions/, "Sessions"],
  ] as const) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Kinora", { exact: true })).toBeVisible();
    await drawer.getByRole("link", { name: new RegExp(label) }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await expect(drawer).toBeHidden();
  }
});
