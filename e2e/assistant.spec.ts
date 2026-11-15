import { expect, test } from "@playwright/test";
import { gotoApp, waitForApp } from "./utils";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

test("the assistant answers with family memory and persists the thread", async ({
  page,
}) => {
  await gotoApp(page, "/app/assistant");
  await expect(page.getByText(/Hi Michael/)).toBeVisible();

  const input = page.getByRole("textbox", { name: "Ask Kinora anything" });
  await input.fill("What did we agree in our last session?");
  await input.press("Enter");

  await expect(page.getByText(/The last session was/)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText(/Your agreements/)).toBeVisible();

  await page.reload();
  await waitForApp(page);
  await expect(page.getByText(/The last session was/)).toBeVisible({
    timeout: 15_000,
  });
});

test("one-sided venting is redirected to a two-sided session", async ({
  page,
}) => {
  await gotoApp(page, "/app/assistant");
  const input = page.getByRole("textbox", { name: "Ask Kinora anything" });
  await input.fill("My wife always says I do nothing around the house.");
  await input.press("Enter");

  await expect(page.getByText(/not going to decide who's right/i)).toBeVisible({
    timeout: 15_000,
  });
  const shared = page.getByRole("link", { name: "Start a shared session" });
  await expect(shared).toBeVisible();
  await shared.click();
  await expect(page).toHaveURL(/\/app\/sessions\/new/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("Start a session"),
  ).toBeVisible();
});

test("crisis language stops coaching and surfaces 988", async ({ page }) => {
  await gotoApp(page, "/app/assistant");
  const input = page.getByRole("textbox", { name: "Ask Kinora anything" });
  await input.fill("I want to kill myself.");
  await input.press("Enter");

  await expect(page.getByText(/988/).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/safety/i).first()).toBeVisible();
});

test("the voice sheet offers a working path even without browser speech", async ({
  page,
}) => {
  await gotoApp(page, "/app/assistant");
  await page.getByRole("button", { name: "Talk instead" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Talk to Kinora")).toBeVisible();
  await expect(dialog.getByText(/Speak naturally/)).toBeVisible();
  await dialog.getByRole("button", { name: "Type instead" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("textbox", { name: "Ask Kinora anything" })).toBeFocused();
});

test("a new conversation clears the thread while keeping the history on the server", async ({
  page,
}) => {
  await gotoApp(page, "/app/assistant");
  const input = page.getByRole("textbox", { name: "Ask Kinora anything" });
  await input.fill("Give us a ten-minute reset for a rainy day.");
  await input.press("Enter");
  await expect(page.getByText(/rainy-day kind of day/i)).toBeVisible({
    timeout: 15_000,
  });

  await page.getByRole("button", { name: "New conversation" }).click();
  await expect(page.getByText(/Hi Michael/)).toBeVisible();
  await expect(page.getByText(/rainy-day kind of day/i)).toBeHidden();
});

test("the assistant back button returns to the family home", async ({ page }) => {
  await gotoApp(page, "/app/assistant");
  await page.getByRole("link", { name: "Go back" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole("heading", { name: /Hello, Michael/ }),
  ).toBeVisible();
});
