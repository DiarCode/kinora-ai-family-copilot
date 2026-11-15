import { describe, expect, it } from "vitest";
import type { AgentDispatch } from "livekit-server-sdk";
import {
  createLiveKitToken,
  hasActiveAgentDispatch,
  liveKitConfigFromEnv,
} from "@/lib/livekit";

const config = {
  url: "wss://kinora-test.livekit.cloud",
  apiKey: "test-key",
  apiSecret: "test-secret-with-enough-length",
};

function decode(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    sub: string;
    name?: string;
    video: Record<string, unknown>;
  };
}

describe("LiveKit integration", () => {
  it("reads configuration from the environment", () => {
    expect(
      liveKitConfigFromEnv({
        LIVEKIT_URL: config.url,
        LIVEKIT_API_KEY: config.apiKey,
        LIVEKIT_API_SECRET: config.apiSecret,
      }),
    ).toEqual(config);
    expect(liveKitConfigFromEnv({ LIVEKIT_URL: config.url })).toBeNull();
    expect(liveKitConfigFromEnv({})).toBeNull();
  });

  it("creates a scoped room token with the right identity and grants", async () => {
    const result = await createLiveKitToken({
      config,
      roomName: "kinora-test-room",
      identity: "member_michael",
      name: "Michael Bennett",
    });

    expect(result.url).toBe(config.url);
    expect(result.roomName).toBe("kinora-test-room");
    expect(result.token.split(".")).toHaveLength(3);

    const payload = decode(result.token);
    expect(payload.sub).toBe("member_michael");
    expect(payload.name).toBe("Michael Bennett");
    expect(payload.video.roomJoin).toBe(true);
    expect(payload.video.room).toBe("kinora-test-room");
    expect(payload.video.canPublish).toBe(true);
    expect(payload.video.canSubscribe).toBe(true);
  });
});

function makeDispatch(agentName: string, statuses: number[]): AgentDispatch {
  return {
    agentName,
    state: {
      jobs: statuses.map((status) => ({ state: { status } })),
    },
  } as unknown as AgentDispatch;
}

describe("LiveKit agent dispatch state", () => {
  it("treats pending and running jobs as active", () => {
    expect(hasActiveAgentDispatch([makeDispatch("kinora-agent", [0])], "kinora-agent")).toBe(true);
    expect(hasActiveAgentDispatch([makeDispatch("kinora-agent", [1])], "kinora-agent")).toBe(true);
  });

  it("allows a new dispatch when the previous job finished", () => {
    expect(hasActiveAgentDispatch([makeDispatch("kinora-agent", [2])], "kinora-agent")).toBe(false);
    expect(hasActiveAgentDispatch([makeDispatch("kinora-agent", [3])], "kinora-agent")).toBe(false);
    expect(hasActiveAgentDispatch([makeDispatch("kinora-agent", [])], "kinora-agent")).toBe(false);
  });

  it("ignores dispatches for other agents", () => {
    expect(hasActiveAgentDispatch([makeDispatch("other-agent", [1])], "kinora-agent")).toBe(false);
  });

  it("finds an active job among several dispatches", () => {
    const dispatches = [
      makeDispatch("kinora-agent", [2]),
      makeDispatch("kinora-agent", [1]),
    ];
    expect(hasActiveAgentDispatch(dispatches, "kinora-agent")).toBe(true);
  });
});
