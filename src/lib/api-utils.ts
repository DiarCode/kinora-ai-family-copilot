import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseJson<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T; error?: never } | { data?: never; error: Response }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: jsonError("Request body must be valid JSON.") };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      error: jsonError(
        first ? `${first.path.join(".") || "body"}: ${first.message}` : "Invalid request.",
      ),
    };
  }
  return { data: parsed.data };
}

export function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
  } as const;
}

export function encodeHeader(value: string): string {
  return encodeURIComponent(value);
}
