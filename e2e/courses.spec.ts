import { expect, test } from "@playwright/test";
import { gotoApp, waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

async function reachQuiz(page: import("@playwright/test").Page) {
  await gotoApp(page, "/app/courses/emotion-coaching-in-90-seconds");
  await expect(page.getByText("Emotion Coaching in 90 Seconds").first()).toBeVisible();
  for (let index = 0; index < 3; index += 1) {
    await page.getByRole("button", { name: "Next slide" }).click();
  }
  await page.getByRole("button", { name: "Take the quiz" }).click();
  await expect(page.getByText("One last rep.")).toBeVisible();
}

test("slides save progress and a passing quiz completes the course", async ({
  page,
}) => {
  await gotoApp(page, "/app/courses");
  await expect(page.getByText("Repair After the Storm").first()).toBeVisible();
  await expect(page.getByText("Emotion Coaching in 90 Seconds").first()).toBeVisible();
  await expect(page.getByText("Screens, Boundaries & Big Feelings").first()).toBeVisible();

  await reachQuiz(page);

  for (const question of [1, 2, 3]) {
    const section = page.locator("section").filter({ hasText: `Question ${question}` });
    await section.getByRole("button").nth(1).click();
  }
  await page.getByRole("button", { name: "Check my answers" }).click();

  await expect(
    page.getByRole("heading", { name: "Course complete." }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("3 of 3 correct")).toBeVisible();
  await expect(page.getByText("Saved to your family memory")).toBeVisible();

  await gotoApp(page, "/app/courses");
  await expect(page.getByText("3/3").first()).toBeVisible();
});

test("a failing quiz can be reviewed and retried", async ({ page }) => {
  await reachQuiz(page);
  for (const question of [1, 2, 3]) {
    const section = page.locator("section").filter({ hasText: `Question ${question}` });
    await section.getByRole("button").first().click();
  }
  await page.getByRole("button", { name: "Check my answers" }).click();

  await expect(
    page.getByRole("heading", { name: "Almost there." }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("0 of 3 correct")).toBeVisible();
  await expect(page.getByText("Naming the emotion helps")).toBeVisible();

  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("One last rep.")).toBeVisible();
});
