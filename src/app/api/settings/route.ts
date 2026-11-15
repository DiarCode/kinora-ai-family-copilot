import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { parseJson } from "@/lib/api-utils";
import { stateView } from "@/lib/server/state";

export const dynamic = "force-dynamic";

const schema = z.object({
  assistantName: z.string().trim().min(1).max(24).optional(),
  plan: z.enum(["family", "plus"]).optional(),
});

export async function PATCH(request: Request) {
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  const { state } = await getStore().mutate((state) => {
    if (parsed.data.assistantName !== undefined) {
      state.settings.assistantName = parsed.data.assistantName;
    }
    if (parsed.data.plan !== undefined) {
      state.family.plan = parsed.data.plan;
    }
    return true;
  });

  return NextResponse.json(stateView(state), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
