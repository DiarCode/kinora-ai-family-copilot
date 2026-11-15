import { AccessToken, type AgentDispatch } from "livekit-server-sdk";

export type LiveKitConfig = {
  url: string;
  apiKey: string;
  apiSecret: string;
};

export function liveKitConfigFromEnv(
  env: Record<string, string | undefined> = process.env,
): LiveKitConfig | null {
  const url = env.LIVEKIT_URL;
  const apiKey = env.LIVEKIT_API_KEY;
  const apiSecret = env.LIVEKIT_API_SECRET;
  if (!url || !apiKey || !apiSecret) return null;
  return { url, apiKey, apiSecret };
}

/**
 * Returns true only when a dispatch still has a pending or running job.
 * A completed job leaves its dispatch record behind; treating that as
 * "already dispatched" would silently block re-joining a room after the
 * agent session ended.
 */
export function hasActiveAgentDispatch(
  dispatches: AgentDispatch[],
  agentName: string,
): boolean {
  return dispatches.some((dispatch) => {
    if (dispatch.agentName !== agentName) return false;
    return (dispatch.state?.jobs ?? []).some((job) => {
      const status = job.state?.status;
      // JS_PENDING = 0, JS_RUNNING = 1
      return status === 0 || status === 1;
    });
  });
}

export async function createLiveKitToken({
  config,
  roomName,
  identity,
  name,
}: {
  config: LiveKitConfig;
  roomName: string;
  identity: string;
  name: string;
}): Promise<{ token: string; url: string; roomName: string }> {
  const token = new AccessToken(config.apiKey, config.apiSecret, {
    identity,
    name,
    ttl: "2h",
  });
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  return {
    token: await token.toJwt(),
    url: config.url,
    roomName,
  };
}
