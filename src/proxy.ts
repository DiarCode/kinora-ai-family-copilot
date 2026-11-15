import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * Next.js 16 renamed Middleware to Proxy. This is the single request boundary:
 * 1. cheap global abuse protection for API routes,
 * 2. Supabase Auth session refresh when an auth cookie exists.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const limited = enforceRateLimit(request, RATE_LIMITS.global);
    if (limited) return limited;
  }

  const hasAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"),
    );

  if (!hasAuthCookie) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
