import { NextResponse } from "next/server";
import { z } from "zod";
import { AgentDispatchClient, RoomServiceClient } from "livekit-server-sdk";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  hasActiveAgentDispatch,
  liveKitConfigFromEnv,
} from "@/lib/livekit";

export const dynamic = "force-dynamic";

const schema = z.object({
  roomName: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{3,64}$/, "Room names use letters, numbers, _ and -."),
});

const agentName = () => process.env.KINORA_AGENT_NAME ?? "kinora-agent";

/**
 * Explicit dispatch of the Kinora voice agent into a session room.
 *
 * The agent receives the session problem, both parents' names, the opening
 * line, and who has the floor first. It never needs to call back into the app:
 * the browser publishes LiveKit transcriptions back to the session transcript.
 */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, RATE_LIMITS.livekitDispatch);
  if (limited) return limited;

  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;
  const { roomName } = parsed.data;

  const config = liveKitConfigFromEnv();
  if (!config) {
    return jsonError("LiveKit is not configured.", 503);
  }

  const state = await getStore().read();
  const session =
    state.sessions.find((item) => item.roomName === roomName) ??
    // Backward compatibility for rooms created before roomName was stored.
    state.sessions.find(
      (item) => item.id === roomName.replace(/^kinora-/, ""),
    );
  if (!session) {
    return jsonError("Session not found for this room.", 404);
  }

  const openingTurn = session.turns.find((turn) => turn.speakerId === "kinora");
  const participants = session.participants
    .map((id) => state.family.members.find((member) => member.id === id))
    .filter((member): member is NonNullable<typeof member> => Boolean(member));
  const firstSpeakerId = openingTurn?.invite ?? participants[0]?.id;
  const firstSpeaker = participants.find((member) => member.id === firstSpeakerId);

  const metadata = JSON.stringify({
    sessionId: session.id,
    title: session.title,
    problem: session.problem,
    opening: openingTurn?.text ?? "",
    participants: participants.map((member) => ({
      id: member.id,
      name: member.name,
    })),
    firstSpeakerId: firstSpeakerId ?? "",
    firstSpeakerName: firstSpeaker?.name ?? "",
  });

  try {
    const host = config.url.replace(/^wss:/, "https:").replace(/^ws:/, "http:");

    // Explicit dispatch requires the room to exist. A parent normally joins
    // first, but creating it makes the API safe to call from either device.
    try {
      const roomService = new RoomServiceClient(
        host,
        config.apiKey,
        config.apiSecret,
      );
      await roomService.createRoom({ name: roomName, emptyTimeout: 600 });
    } catch {
      // The room already exists, or the server will report a clearer error
      // from the dispatch call below.
    }

    const client = new AgentDispatchClient(host, config.apiKey, config.apiSecret);
    const existing = await client.listDispatch(roomName);
    const already = hasActiveAgentDispatch(existing, agentName());
    if (already) {
      return NextResponse.json(
        { dispatched: false, already: true, agentName: agentName(), roomName },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      );
    }

    const dispatch = await client.createDispatch(roomName, agentName(), {
      metadata,
      deployment: process.env.KINORA_AGENT_DEPLOYMENT || undefined,
    });

    return NextResponse.json(
      {
        dispatched: true,
        already: false,
        agentName: agentName(),
        roomName,
        dispatchId: dispatch.id,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? `Could not dispatch the Kinora voice agent: ${error.message}`
        : "Could not dispatch the Kinora voice agent.",
      502,
    );
  }
}
