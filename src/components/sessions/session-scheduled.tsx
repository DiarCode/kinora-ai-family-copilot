"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  MessageSquare,
  AudioLines,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { useFamily } from "@/components/providers/family-provider";
import { formatFriendlyDateTime } from "@/lib/date";
import type { Session } from "@/lib/types";

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsDate(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function downloadCalendar(session: Session) {
  if (!session.scheduledFor) return;
  const start = new Date(session.scheduledFor);
  const end = new Date(start.getTime() + 30 * 60_000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kinora//Family Sessions//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${session.id}@kinora.app`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(`Kinora session — ${session.title}`)}`,
    `DESCRIPTION:${escapeIcs(
      `A structured coaching session led by Kinora.\n\n${session.problem}\n\nCoaching, not therapy.`,
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "kinora-session.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SessionScheduled({ session }: { session: Session }) {
  const { updateSession } = useFamily();
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    try {
      await updateSession(session.id, "start");
    } catch {
      // The provider shows the error.
    } finally {
      setStarting(false);
    }
  };

  const when = session.scheduledFor ? new Date(session.scheduledFor) : null;

  return (
    <AppPage
      header={
        <AppHeader
          variant="back"
          backHref="/app/sessions"
          title="Scheduled session"
          showMenu={false}
          showProfile={false}
        />
      }
    >
      <div className="px-5 pb-8">
        <section className="relative overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-[#f4edff] via-[#fbf9ff] to-white p-4 text-center">
          <div className="absolute -top-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#d6c7fe]/50 blur-2xl" />
          <div className="relative mx-auto flex justify-center">
            <KinoraOrb size={86} animated label="Scheduled session" />
          </div>
          <p className="relative mt-3 text-[14px] font-medium text-kinora-800">
            Scheduled
          </p>
          <h1 className="relative mt-1 text-[26px] font-semibold text-ink">
            The room is ready.
          </h1>
          <p className="relative mt-2 text-[14px] text-muted">
            {when ? formatFriendlyDateTime(session.scheduledFor ?? "") : "No time set"}
          </p>
        </section>

        <section className="kinora-card mt-3 p-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow">The problem</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f2fa] px-3 py-1 text-[13px] text-ink-soft">
              {session.mode === "voice" ? (
                <AudioLines className="h-2.5 w-2.5" />
              ) : (
                <MessageSquare className="h-2.5 w-2.5" />
              )}
              {session.mode === "voice" ? "Voice" : "Text"}
            </span>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {session.problem}
          </p>
        </section>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            disabled={starting}
            onClick={() => void start()}
            className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-60"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {starting ? "Opening…" : "Start now"}
          </button>
          <button
            type="button"
            onClick={() => {
              downloadCalendar(session);
              toast.success("Calendar file downloaded.");
            }}
            aria-label="Add to calendar"
            className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-[#e4def0] bg-white text-ink-soft"
          >
            <CalendarPlus className="h-4 w-4" />
          </button>
        </div>



        <Link
          href="/app/sessions"
          className="mt-4 flex h-12 items-center justify-center rounded-full border border-[#e4def0] bg-white text-[14px] font-semibold text-ink-soft"
        >
          Back to sessions
        </Link>
      </div>
    </AppPage>
  );
}
