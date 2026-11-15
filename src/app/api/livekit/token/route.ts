import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, parseJson } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getStore } from "@/lib/store";
import {
  createLiveKitToken,
  liveKitConfigFromEnv,
} from "@/lib/livekit";
import {
  SHARED_PHONE_IDENTITY,
  SHARED_PHONE_NAME,
} from "@/lib/livekit-constants";

export const dynamic = "force-dynamic";

const schema = z.object({
  roomName: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{3,64}$/, "Room names use letters, numbers, _ and -."),
  identity: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(64).optional(),
});

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, RATE_LIMITS.livekitToken);
  if (limited) return limited;

  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  const config = liveKitConfigFromEnv();
  if (!config) {
    return jsonError(
      "LiveKit is not configured. The session still works in device voice and text mode.",
      503,
    );
  }

  const { roomName, identity } = parsed.data;

  const state = await getStore().read();
  const session = state.sessions.find((item) => item.roomName === roomName);
  if (!session) {
    return jsonError("Session not found for this room.", 404);
  }

  const isSharedPhone = identity === SHARED_PHONE_IDENTITY;
  const member = state.family.members.find((item) => item.id === identity);
  if (!isSharedPhone && (!member || !session.participants.includes(member.id))) {
    return jsonError("This person is not part of the session.", 403);
  }

  try {
    const identityValue = isSharedPhone
      ? SHARED_PHONE_IDENTITY
      : member?.id;
    const nameValue = isSharedPhone ? SHARED_PHONE_NAME : member?.name;
    if (!identityValue || !nameValue) {
      return jsonError("This person is not part of the session.", 403);
    }
    const result = await createLiveKitToken({
      config,
      roomName: session.roomName,
      identity: identityValue,
      name: nameValue,
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return jsonError("Could not create a room token.", 500);
  }
}
