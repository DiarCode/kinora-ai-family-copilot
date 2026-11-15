import { NextResponse } from "next/server";
import { readStatePayload } from "@/lib/server/state";
import { noStoreHeaders } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await readStatePayload();
  return NextResponse.json(payload, { headers: noStoreHeaders() });
}
