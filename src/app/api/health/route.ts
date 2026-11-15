import { NextResponse } from "next/server";
import { aiStatus } from "@/lib/engine/assistant-service";
import { getStore, storeBackend } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  let storage = "ok";
  try {
    await getStore().read();
  } catch {
    storage = "error";
  }
  return NextResponse.json(
    {
      ok: storage === "ok",
      service: "kinora",
      time: new Date().toISOString(),
      storage,
      storageBackend: storeBackend(),
      ai: aiStatus(),
      livekit: Boolean(
        process.env.LIVEKIT_URL &&
          process.env.LIVEKIT_API_KEY &&
          process.env.LIVEKIT_API_SECRET,
      ),
      latencyMs: Date.now() - started,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
