import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.KINORA_TEST_MODE !== "1") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const state = await getStore().reset();
  return NextResponse.json(
    { ok: true, seeded: Boolean(state.family) },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
