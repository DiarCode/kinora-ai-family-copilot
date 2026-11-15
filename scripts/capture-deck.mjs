import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3200";
const OUT = path.resolve("pitch-deck/assets/screens");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  colorScheme: "light",
  reducedMotion: "reduce",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
});
const page = await context.newPage();
page.setDefaultTimeout(20_000);

async function reset() {
  const res = await page.request.post(`${BASE}/api/test/reset`);
  if (!res.ok()) throw new Error(`Reset failed: ${res.status()}`);
}

async function goto(urlPath) {
  await page.goto(`${BASE}${urlPath}`, { waitUntil: "domcontentloaded" });
  await page.locator('html[data-kinora-ready="true"]').waitFor();
  await page.waitForTimeout(500);
}

async function shot(name, { wait = 500, scrollTo } = {}) {
  if (scrollTo) {
    const el = page.getByText(scrollTo, { exact: false }).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
    }
  }
  await page.waitForTimeout(wait);
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    animations: "disabled",
  });
  console.log(`captured ${name}`);
}

async function home() {
  await reset();
  await goto("/app");
  await page.getByRole("button", { name: "Michael feels sunny today" }).click();
  await page.getByRole("button", { name: "Lucy feels cloudy today" }).click();
  await page.waitForTimeout(4200);
  await shot("home-moods", { wait: 200 });
  await shot("home-next", { scrollTo: "Next best" });
}

async function assistant() {
  await reset();
  await goto("/app/assistant");
  const input = page.getByRole("textbox", { name: "Ask Kinora anything" });
  await input.fill("What did we agree in our last session?");
  await input.press("Enter");
  await page.getByText(/The last session was/).waitFor();
  await page.waitForTimeout(1400);
  await page.getByText(/The last session was/).scrollIntoViewIfNeeded();
  await shot("assistant-memory");
}

async function sessionText() {
  await reset();
  await goto("/app/sessions");
  await page.getByRole("button", { name: "Start now" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Bedtime has become a fight every night." })
    .click();
  await dialog.getByRole("button", { name: /^Text/ }).click();
  await dialog.getByRole("button", { name: "Start now" }).click();
  await page.getByText(/you have the floor/i).waitFor();
  const input = page.getByRole("textbox", { name: "Your message" });
  await input.fill(
    "I try to help but feel like anything I do is wrong, so I step back.",
  );
  await input.press("Enter");
  await page.getByText(/Lucy, what did that look like/).waitFor();
  await input.fill("I am touched out by bedtime and I do not want to have to ask.");
  await input.press("Enter");
  await page.getByText(/what do you think each of you was protecting/i).waitFor();
  await page.waitForTimeout(4500);
  await page
    .getByText(/what do you think each of you was protecting/i)
    .scrollIntoViewIfNeeded();
  await shot("session-room");
}

async function sessionVoice() {
  await reset();
  await goto("/app/sessions");
  await page.getByRole("button", { name: "Start now" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Bedtime has become a fight every night." })
    .click();
  await dialog.getByRole("button", { name: /^Voice/ }).click();
  await dialog.getByRole("button", { name: "Start now" }).click();
  await page.waitForTimeout(4500);
  await shot("session-voice", { wait: 200 });
}

async function summary() {
  await reset();
  await goto("/app/sessions/seed-session-bedtime");
  await page.getByRole("heading", { name: "Session summary" }).waitFor();
  await shot("session-summary", { scrollTo: "What we heard" });
}

async function child() {
  await reset();
  await goto("/app/children/seed-child-sophie");
  await page.getByRole("link", { name: "Start the discovery" }).click();
  await page.getByRole("button", { name: "Let's begin" }).click();
  await page.waitForTimeout(600);
  await shot("child-question");

  for (let i = 0; i < 10; i += 1) {
    await page.locator("button[aria-pressed]").first().click();
    await page
      .getByRole("button", { name: /Next question|See the map/ })
      .click();
    await page.waitForTimeout(120);
  }
  await page.getByRole("heading", { name: /Meet The Creative Director/ }).waitFor();
  await page.waitForTimeout(4500);
  await shot("child-result", { wait: 200 });
  await page.getByRole("link", { name: "See the full map" }).click();
  await page.waitForTimeout(4500);
  await shot("child-profile", { scrollTo: "Strengths map" });
}

async function course() {
  await reset();
  await goto("/app/courses/emotion-coaching-in-90-seconds");
  await page.getByRole("heading", { name: "Name it to tame it." }).waitFor();
  await shot("course-slide");
  for (let i = 0; i < 3; i += 1) {
    await page.getByRole("button", { name: "Next slide" }).click();
    await page.waitForTimeout(180);
  }
  await page.getByRole("button", { name: "Take the quiz" }).click();
  await page.getByText("One last rep.").waitFor();
  await shot("course-quiz");
}

async function safety() {
  await reset();
  await goto("/app/sessions");
  await page.getByRole("button", { name: "Start now" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "The load feels unfair, and I am tired of asking." })
    .click();
  await dialog.getByRole("textbox").fill("He hit me last night and I am afraid.");
  await dialog.getByRole("button", { name: "Start now" }).click();
  await page.getByText("Kinora has paused this session.").waitFor();
  await page.waitForTimeout(4500);
  await shot("safety-pause", { wait: 200 });
}

async function pricing() {
  await reset();
  await goto("/app");
  await page.getByRole("button", { name: /Upgrade to Kinora Plus/ }).click();
  await page.getByText("Family license").waitFor();
  await page.waitForTimeout(500);
  await shot("pricing");
}

async function lists() {
  await reset();
  await goto("/app/children");
  await shot("children-list");
  await goto("/app/courses");
  await shot("courses-list");
  await goto("/app/sessions");
  await shot("sessions-list");
}

async function landing() {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: /Parenting is a team sport/ }).waitFor();
  await page.waitForTimeout(900);
  await shot("landing-hero");
}

const only = process.argv[2];
const flows = {
  landing,
  home,
  assistant,
  "session-text": sessionText,
  "session-voice": sessionVoice,
  summary,
  child,
  course,
  safety,
  pricing,
  lists,
};

try {
  if (only) {
    if (!flows[only]) throw new Error(`Unknown flow: ${only}`);
    await flows[only]();
  } else {
    for (const [name, run] of Object.entries(flows)) {
      console.log(`— ${name}`);
      await run();
    }
  }
} finally {
  await browser.close();
}
