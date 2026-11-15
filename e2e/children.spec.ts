import { expect, test } from "@playwright/test";
import { gotoApp, waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

test("a child discovery produces a persistent strengths map", async ({
  page,
}) => {
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

  await expect(
    page.getByRole("heading", { name: /Meet The Creative Director/ }),
  ).toBeVisible({ timeout: 15_000 });
  await page.getByRole("link", { name: "See the full map" }).click();
  await expect(page).toHaveURL(/\/app\/children\/seed-child-sophie$/);

  await expect(page.getByText("Strengths map", { exact: true })).toBeVisible();
  await expect(page.getByText("The Creative Director").first()).toBeVisible();
  await expect(page.getByText("Try this week", { exact: true })).toBeVisible();

  await page.reload();
  await waitForApp(page);
  await expect(page.getByText("The Creative Director").first()).toBeVisible();
  await expect(page.getByText("Strengths map", { exact: true })).toBeVisible();
});

test("a parent can add a second child and sees the unknown state", async ({
  page,
}) => {
  await gotoApp(page, "/app/children");
  await page.getByRole("button", { name: "Add a child" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Add a child")).toBeVisible();

  await dialog.getByLabel("First name").fill("Noah");
  await dialog.getByLabel("Birth date").fill("2021-03-10");
  await dialog.getByRole("button", { name: "Add to the family" }).click();

  await expect(page).toHaveURL(/\/app\/children\/child_/);
  await expect(
    page.getByRole("heading", { name: /Kinora doesn't know Noah yet/ }),
  ).toBeVisible();

  await gotoApp(page, "/app/children");
  await expect(page.getByText("Noah").first()).toBeVisible();
  await expect(page.getByText("Sophie").first()).toBeVisible();
});

test("a profile is explicitly non-diagnostic and retakeable", async ({
  page,
}) => {
  await gotoApp(page, "/app/children/seed-child-sophie");
  await page.getByRole("link", { name: "Start the discovery" }).click();
  await page.getByRole("button", { name: "Let's begin" }).click();
  for (let index = 0; index < 10; index += 1) {
    await page.locator("button[aria-pressed]").first().click();
    await page
      .getByRole("button", { name: /Next question|See the map/ })
      .click();
  }
  await page.getByRole("link", { name: "See the full map" }).click();

  await expect(page.getByText("A conversation starter, not a diagnosis")).toBeVisible();
  await expect(page.getByRole("link", { name: "Retake" }).first()).toBeVisible();
  await expect(page.getByText(/Next refresh after/)).toBeVisible();
});
