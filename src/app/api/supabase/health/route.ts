import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Confirms that the Supabase SSR connection is configured and that the
 * Kinora table has been created. It is safe to expose; it only checks schema.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { configured: false, tableReady: false, error: "Supabase env is missing." },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase
      .from("kinora_state")
      .select("id")
      .limit(1);

    return NextResponse.json(
      {
        configured: true,
        tableReady: !error,
        table: "kinora_state",
        error: error?.message ?? null,
        hint: error
          ? "Run supabase/migrations/0001_kinora_state.sql with a secret key, then set DATA_BACKEND=supabase."
          : null,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        tableReady: false,
        error: error instanceof Error ? error.message : "Supabase check failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
