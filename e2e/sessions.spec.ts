import { expect, test } from "@playwright/test";
import { gotoApp, waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

async function startTextSession(page: import("@playwright/test").Page) {
  await gotoApp(page, "/app/sessions");
  await page.getByRole("button", { name: "Start now" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Bedtime has become a fight every night." })
    .click();
  await dialog.getByRole("button", { name: /^Text/ }).click();
  await dialog.getByRole("button", { name: "Start now" }).click();
  await expect(page).toHaveURL(/\/app\/sessions\/session_/);
  await expect(page.getByText(/you have the floor/i)).toBeVisible();
}

test("a voice session falls back honestly when LiveKit is unavailable", async ({
  page,
}) => {
  await gotoApp(page, "/app/sessions");
  await page.getByRole("button", { name: "Start now" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Bedtime has become a fight every night." })
    .click();
  await dialog.getByRole("button", { name: /^Voice/ }).click();
  await dialog.getByRole("button", { name: "Start now" }).click();

  await expect(page).toHaveURL(/\/app\/sessions\/session_/);
  await expect(page.getByText("Voice session")).toBeVisible();
  await expect(page.getByText(/Thank you both for making this time/)).toBeVisible();
  await expect(page.getByText("The meeting could not start.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByRole("button", { name: "Start the voice meeting" }),
  ).toBeVisible();
});

test("a session hears both sides, ends with a summary, and saves agreements", async ({
  page,
}) => {
  await startTextSession(page);

  const input = page.getByRole("textbox", { name: "Your message" });
  await input.fill(
    "I try to help but feel like anything I do is wrong, so I step back.",
  );
  await input.press("Enter");
  await expect(page.getByText(/Lucy, what did that look like/)).toBeVisible({
    timeout: 15_000,
  });

  await expect(page.getByRole("button", { name: "L Lucy" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await input.fill(
    "I am touched out by bedtime and I do not want to have to ask.",
  );
  await input.press("Enter");
  await expect(
    page.getByText(/what do you think each of you was protecting/i),
  ).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "End", exact: true }).click();
  await expect(page.getByRole("dialog").getByText("End and reflect?")).toBeVisible();
  await page.getByRole("button", { name: "End and reflect" }).click();

  await expect(
    page.getByRole("heading", { name: "Session summary" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("What we heard")).toBeVisible();
  await expect(page.getByText(/In their own words/)).toBeVisible();
  await expect(page.getByText("Agreement 1")).toBeVisible();
  await expect(page.getByText("Agreement 2")).toBeVisible();

  await page.getByRole("button", { name: "Save these agreements" }).click();
  await expect(page.getByText("Saved to family memory")).toBeVisible();

  await gotoApp(page, "/app/sessions");
  await expect(page.getByText("The bedtime handoff")).toHaveCount(2);
  await expect(page.getByText("2 agreements").first()).toBeVisible();
});

test("a session can be scheduled and started early", async ({ page }) => {
  await gotoApp(page, "/app/sessions");
  await page.getByRole("button", { name: "Schedule" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "We keep arguing about screens and limits." })
    .click();
  await dialog.getByRole("button", { name: /^Text/ }).click();
  await expect(dialog.getByText("When should Kinora hold the space?")).toBeVisible();
  await dialog.getByRole("button", { name: "Confirm schedule" }).click();

  await expect(page).toHaveURL(/\/app\/sessions\/session_/);
  await expect(page.getByRole("heading", { name: "The room is ready." })).toBeVisible();
  await page.getByRole("button", { name: "Start now" }).click();
  await expect(page.getByText(/you have the floor/i)).toBeVisible();

  await gotoApp(page, "/app/sessions");
});

test("the safety view pauses a session and surfaces real resources", async ({
  page,
}) => {
  await gotoApp(page, "/app/sessions");
  await page.getByRole("button", { name: "Start now" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "The load feels unfair, and I am tired of asking." })
    .click();
  await dialog.getByRole("textbox").fill("He hit me last night and I am afraid.");
  await dialog.getByRole("button", { name: "Start now" }).click();

  await expect(page.getByText("Kinora has paused this session.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Call the hotline/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Call 988/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Call 911/ })).toBeVisible();
});
