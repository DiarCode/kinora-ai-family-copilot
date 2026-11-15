import { expect, test } from "@playwright/test";
import { waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

test("the landing page tells the research-backed story and opens the demo", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Parenting is a team sport[\s\S]*Kinora keeps you on the same page/,
    }),
  ).toBeVisible();
  await expect(page.getByText("48%").first()).toBeVisible();
  await expect(page.getByText("62%").first()).toBeVisible();
  await expect(page.getByText("~2 in 3").first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Six small tools. One calmer team./ }),
  ).toBeVisible();
  await expect(page.getByText(/No leaderboards/).first()).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByRole("link", { name: "Open the demo" }).first().click();
  await expect(page).toHaveURL(/\/app$/);
  await waitForApp(page);
  await expect(
    page.getByRole("heading", { name: /Hello, Michael/ }),
  ).toBeVisible();
});

test("the FAQ discloses that Kinora is coaching, not therapy", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("summary").filter({ hasText: "Is Kinora therapy?" }).click();
  await expect(
    page.getByText(/Kinora is coaching and skills education for parents/),
  ).toBeVisible();
  await expect(page.getByText(/It does not diagnose or treat/)).toBeVisible();
});

test("the pricing anchor and safety resources are present", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("$149").first()).toBeVisible();
  await expect(page.getByText(/less than one couples-therapy session/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /988/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "1-800-799-7233" }).first()).toBeVisible();
});
