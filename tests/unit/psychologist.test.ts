import { describe, expect, it } from "vitest";
import {
  buildSessionSummary,
  classifyProblem,
  createSession,
  nextKinoraTurn,
} from "@/lib/engine/psychologist";
import type { Session, Turn } from "@/lib/types";
import { lucyId, michaelId, NOW, seed } from "../helpers";

const family = seed().family;

function parentTurn(
  session: Session,
  speakerId: string,
  text: string,
): Turn {
  return {
    id: `turn-${session.turns.length + 1}`,
    speakerId,
    speakerName:
      speakerId === michaelId ? "Michael Bennett" : "Lucy Bennett",
    text,
    at: NOW.toISOString(),
    kind: "reflection",
    phase: session.phase,
  };
}

describe("psychologist session creation", () => {
  it("opens with a neutral frame and invites the first parent", () => {
    const session = createSession({
      family,
      problem: "Bedtime has become a fight every night.",
      mode: "text",
      now: NOW,
    });
    expect(session.status).toBe("active");
    expect(session.title).toBe("The bedtime handoff");
    expect(session.phase).toBe("story");
    expect(session.turns).toHaveLength(1);
    expect(session.turns[0].speakerId).toBe("kinora");
    expect(session.turns[0].invite).toBe(michaelId);
    expect(session.turns[0].text).toContain("not to decide who is right");
    expect(session.turns[0].text).toContain("Michael");
  });

  it("creates a scheduled session without starting it", () => {
    const session = createSession({
      family,
      problem: "We keep arguing about screens.",
      mode: "voice",
      scheduledFor: "2026-11-15T19:30:00.000Z",
      now: NOW,
    });
    expect(session.status).toBe("scheduled");
    expect(session.mode).toBe("voice");
    expect(session.scheduledFor).toBe("2026-11-15T19:30:00.000Z");
  });
});

describe("psychologist conversation arc", () => {
  it("alternates speakers and moves through the phases", () => {
    const session = createSession({
      family,
      problem: "The load feels unfair and I am tired of asking.",
      mode: "text",
      now: NOW,
    });

    session.turns.push(
      parentTurn(
        session,
        michaelId,
        "I try to help but I feel like I am doing it wrong.",
      ),
    );
    const first = nextKinoraTurn(session, family, NOW);
    expect(first?.phase).toBe("story");
    expect(first?.turn.invite).toBe(lucyId);

    session.turns.push(first!.turn);
    session.phase = first!.phase;
    session.turns.push(
      parentTurn(
        session,
        lucyId,
        "I carry the schedule and I am exhausted. I do not want to have to ask.",
      ),
    );
    const second = nextKinoraTurn(session, family, NOW);
    expect(second?.phase).toBe("emotion");
    expect(second?.turn.text).toContain("protecting");

    session.turns.push(second!.turn);
    session.phase = second!.phase;
    session.turns.push(
      parentTurn(session, michaelId, "I was protecting myself from criticism."),
    );
    const third = nextKinoraTurn(session, family, NOW);
    expect(third?.phase).toBe("emotion");
    expect(third?.turn.invite).toBe(lucyId);

    session.turns.push(third!.turn);
    session.phase = third!.phase;
    session.turns.push(
      parentTurn(session, lucyId, "I was protecting the little rest I had."),
    );
    const fourth = nextKinoraTurn(session, family, NOW);
    expect(fourth?.phase).toBe("needs");
    expect(fourth?.turn.text).toContain("need");

    session.turns.push(fourth!.turn);
    session.phase = fourth!.phase;
    session.turns.push(
      parentTurn(session, lucyId, "I needed rest and shared ownership."),
    );
    const fifth = nextKinoraTurn(session, family, NOW);
    expect(fifth?.phase).toBe("needs");

    session.turns.push(fifth!.turn);
    session.phase = fifth!.phase;
    session.turns.push(
      parentTurn(session, michaelId, "I needed to feel useful, not corrected."),
    );
    const sixth = nextKinoraTurn(session, family, NOW);
    expect(sixth?.phase).toBe("common-ground");

    session.turns.push(sixth!.turn);
    session.phase = sixth!.phase;
    session.turns.push(parentTurn(session, michaelId, "That feels fair."));
    const seventh = nextKinoraTurn(session, family, NOW);
    expect(seventh?.phase).toBe("agreement");
    expect(seventh?.turn.kind).toBe("agreement");
    expect(seventh?.turn.text.toLowerCase()).toContain("agreement");
  });

  it("returns null when there is no parent turn to answer", () => {
    const session = createSession({
      family,
      problem: "We disagree about school.",
      mode: "text",
      now: NOW,
    });
    expect(nextKinoraTurn({ ...session, turns: [] }, family, NOW)).toBeNull();
  });
});

describe("psychologist safety routing", () => {
  it("pauses a session created from an abuse disclosure", () => {
    const session = createSession({
      family,
      problem: "He hit me last night and I am afraid of him.",
      mode: "text",
      now: NOW,
    });
    expect(session.safetyFlagged).toBe(true);
    expect(session.phase).toBe("safety");
    expect(session.turns[0].kind).toBe("safety");
    expect(session.turns[0].text).toContain("1-800-799-7233");
    expect(nextKinoraTurn(session, family, NOW)).toBeNull();
  });

  it("pauses a live session when a parent discloses danger", () => {
    const session = createSession({
      family,
      problem: "We keep arguing about bedtime.",
      mode: "text",
      now: NOW,
    });
    session.turns.push(
      parentTurn(session, lucyId, "Sometimes he threatens me when I disagree."),
    );
    const reply = nextKinoraTurn(session, family, NOW);
    expect(reply?.safetyFlagged).toBe(true);
    expect(reply?.phase).toBe("safety");
    expect(reply?.turn.text).toContain("1-800-799-7233");
  });
});

describe("session summary", () => {
  it("creates a neutral summary with quotes, two agreements, and a next step", () => {
    const session = createSession({
      family,
      problem: "Bedtime has become a fight every night.",
      mode: "text",
      now: NOW,
    });
    session.turns.push(
      parentTurn(
        session,
        michaelId,
        "I try to help but I feel like anything I do is wrong.",
      ),
    );
    session.turns.push(
      parentTurn(
        session,
        lucyId,
        "I am touched out and I do not want to have to ask.",
      ),
    );

    const summary = buildSessionSummary(session, family, NOW);
    expect(summary.title).toBe("The bedtime handoff");
    expect(summary.whatWeHeard).toContain("In their own words");
    expect(summary.whatWeHeard).toContain("Michael");
    expect(summary.agreements).toHaveLength(2);
    expect(summary.agreements[0]).toContain("5pm");
    expect(summary.nextStep).toContain("Repair After the Storm");
    expect(summary.recommendedCourseSlug).toBe("repair-after-the-storm");
  });

  it("returns an existing summary unchanged", () => {
    const state = seed();
    const session = state.sessions[0];
    const summary = buildSessionSummary(session, family, NOW);
    expect(summary).toBe(session.summary);
  });
});

describe("problem classification", () => {
  it.each([
    ["Bedtime is a nightly battle.", "bedtime"],
    ["We fight about screen time and the tablet.", "screens"],
    ["I do all the chores and the mental load.", "load"],
    ["We cannot agree about money and spending.", "money"],
    ["His mother visits and it always goes wrong.", "family"],
    ["We disagree about discipline and consequences.", "discipline"],
    ["We never have any intimacy or closeness.", "intimacy"],
    ["We want to understand the pattern in our arguments.", "communication"],
  ])("classifies %s", (problem, expected) => {
    const domain = classifyProblem(problem);
    expect(domain.key).toBe(expected);
    expect(domain.courseSlug.length).toBeGreaterThan(3);
  });

  it("falls back to a general team check-in", () => {
    expect(classifyProblem("Something feels off and I cannot name it.").key).toBe(
      "general",
    );
  });
});
