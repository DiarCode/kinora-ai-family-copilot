import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test/reset");
  expect(response.ok()).toBeTruthy();
});

test("health reports storage, AI mode, and LiveKit", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const health = await response.json();
  expect(health.ok).toBe(true);
  expect(health.storage).toBe("ok");
  expect(health.ai.mode).toBe("engine");
  expect(health.livekit).toBe(true);
});

test("LiveKit tokens are scoped to the room and participant", async ({
  request,
}) => {
  const stateResponse = await request.get("/api/state");
  const state = await stateResponse.json();
  const michael = state.state.family.members[0];

  const created = await request.post("/api/sessions", {
    data: { problem: "We want a calmer morning routine.", mode: "voice" },
  });
  expect(created.ok()).toBeTruthy();
  const session = (await created.json()).session;

  const response = await request.post("/api/livekit/token", {
    data: {
      roomName: session.roomName,
      identity: michael.id,
      name: michael.name,
    },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.url).toContain("livekit");
  expect(body.token.split(".")).toHaveLength(3);
  const payload = JSON.parse(
    Buffer.from(body.token.split(".")[1], "base64url").toString("utf8"),
  );
  expect(payload.sub).toBe(michael.id);
  expect(payload.video.roomJoin).toBe(true);
  expect(payload.video.room).toBe(session.roomName);

  const unknownRoom = await request.post("/api/livekit/token", {
    data: {
      roomName: "kinora-not-a-session",
      identity: michael.id,
      name: michael.name,
    },
  });
  expect(unknownRoom.status()).toBe(404);

  const outsider = await request.post("/api/livekit/token", {
    data: {
      roomName: session.roomName,
      identity: "not-a-family-member",
      name: "Outsider",
    },
  });
  expect(outsider.status()).toBe(403);
});

test("the full session API produces a neutral summary and stored agreements", async ({
  request,
}) => {
  const stateResponse = await request.get("/api/state");
  const state = await stateResponse.json();
  const michael = state.state.family.members[0];

  const created = await request.post("/api/sessions", {
    data: {
      problem: "Bedtime has become a fight every night.",
      mode: "text",
    },
  });
  expect(created.ok()).toBeTruthy();
  const createdBody = await created.json();
  const session = createdBody.session;
  expect(session.status).toBe("active");
  expect(session.turns).toHaveLength(1);

  const turn = await request.post(`/api/sessions/${session.id}/turn`, {
    data: {
      speakerId: michael.id,
      text: "I try to help but feel like anything I do is wrong.",
    },
  });
  expect(turn.ok()).toBeTruthy();
  const turnBody = await turn.json();
  expect(turnBody.session.turns).toHaveLength(3);
  expect(turnBody.session.turns[2].invite).toBe("member_lucy");

  const completed = await request.patch(`/api/sessions/${session.id}`, {
    data: { action: "complete" },
  });
  expect(completed.ok()).toBeTruthy();
  const completedBody = await completed.json();
  expect(completedBody.session.status).toBe("completed");
  expect(completedBody.session.summary.agreements).toHaveLength(2);
  expect(completedBody.session.summary.whatWeHeard).toContain("In their own words");

  const accepted = await request.patch(`/api/sessions/${session.id}`, {
    data: {
      action: "accept",
      agreements: completedBody.session.summary.agreements,
    },
  });
  expect(accepted.ok()).toBeTruthy();
  const acceptedBody = await accepted.json();
  expect(acceptedBody.session.acceptedAgreements).toHaveLength(2);
});

test("the API validates input with clear errors", async ({ request }) => {
  const mood = await request.post("/api/mood", {
    data: { memberId: "not-a-parent", value: "sunny" },
  });
  expect(mood.status()).toBe(400);

  const assistant = await request.post("/api/assistant", { data: {} });
  expect(assistant.status()).toBe(400);

  const course = await request.patch(
    "/api/courses/emotion-coaching-in-90-seconds",
    { data: { answers: [1] } },
  );
  expect(course.status()).toBe(400);

  const child = await request.post("/api/children", {
    data: { name: "", birthDate: "not-a-date" },
  });
  expect(child.status()).toBe(400);

  const missingSession = await request.get("/api/sessions/nope");
  expect(missingSession.status()).toBe(404);

  const missingCourse = await request.patch("/api/courses/nope", {
    data: { slideIndex: 0 },
  });
  expect(missingCourse.status()).toBe(404);
});

test("moods, children, and course progress round-trip through the API", async ({
  request,
}) => {
  const stateResponse = await request.get("/api/state");
  const state = await stateResponse.json();
  const michael = state.state.family.members[0];

  const mood = await request.post("/api/mood", {
    data: { memberId: michael.id, value: "rainy", note: "Long day." },
  });
  expect(mood.ok()).toBeTruthy();
  const moodBody = await mood.json();
  const todayMood = moodBody.state.moods.find(
    (entry: { memberId: string; date: string }) =>
      entry.memberId === michael.id && entry.date === moodBody.today,
  );
  expect(todayMood.value).toBe("rainy");
  expect(todayMood.note).toBe("Long day.");

  const child = await request.post("/api/children", {
    data: { name: "Noah", birthDate: "2021-03-10", avatarColor: "#7C9CF5" },
  });
  expect(child.ok()).toBeTruthy();
  const childBody = await child.json();
  expect(childBody.child.name).toBe("Noah");

  const slide = await request.patch("/api/courses/emotion-coaching-in-90-seconds", {
    data: { slideIndex: 2 },
  });
  expect(slide.ok()).toBeTruthy();

  const quiz = await request.patch("/api/courses/emotion-coaching-in-90-seconds", {
    data: { answers: [1, 1, 1] },
  });
  expect(quiz.ok()).toBeTruthy();
  const quizBody = await quiz.json();
  expect(quizBody.passed).toBe(true);
  expect(quizBody.score).toBe(3);
  expect(quizBody.progress.completedAt).toBeTruthy();
});
