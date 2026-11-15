"use client";

import type { Session } from "@/lib/types";
import { SessionRoom } from "@/components/sessions/session-room";
import { SessionSummary } from "@/components/sessions/session-summary";
import { SessionScheduled } from "@/components/sessions/session-scheduled";
import { SessionSafety } from "@/components/sessions/session-safety";

export function SessionView({ session }: { session: Session }) {
  if (session.safetyFlagged) return <SessionSafety session={session} />;
  if (session.status === "completed") return <SessionSummary session={session} />;
  if (session.status === "scheduled") return <SessionScheduled session={session} />;
  return <SessionRoom session={session} />;
}
