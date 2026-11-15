"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AudioLines,
  CalendarClock,
  ChevronRight,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { AppHeader, HeaderIconButton } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { useFamily } from "@/components/providers/family-provider";
import { StartSessionSheet } from "@/components/sessions/start-session-sheet";
import {
  formatFriendlyDate,
  formatFriendlyDateTime,
} from "@/lib/date";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";

function SessionCard({ session }: { session: Session }) {
  const Icon = session.mode === "voice" ? AudioLines : MessageSquare;
  const completed = session.status === "completed";
  return (
    <Link
      href={`/app/sessions/${session.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-white bg-white p-4 transition hover:-translate-y-0.5"
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          completed
            ? "bg-[#f3f0f8] text-kinora-800"
            : "bg-[#fff4d6] text-[#a87106]",
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold text-ink">
          {session.title}
        </span>
        <span className="mt-0.5 block truncate text-[13.5px] text-muted">
          {completed
            ? `${formatFriendlyDate(
                (session.completedAt ?? session.createdAt).slice(0, 10),
              )} · ${session.summary?.agreements.length ?? 0} agreements`
            : session.scheduledFor
              ? formatFriendlyDateTime(session.scheduledFor)
              : "Session in progress"}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#bdb7c7] transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SessionsView({ initialOpen = false }: { initialOpen?: boolean }) {
  const { state } = useFamily();
  const router = useRouter();
  const [startOpen, setStartOpen] = useState(initialOpen);
  const [initialSchedule, setInitialSchedule] = useState(false);

  if (!state) return null;

  const upcoming = state.sessions
    .filter((session) => session.status === "scheduled")
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));
  const active = state.sessions.filter((session) => session.status === "active");
  const past = state.sessions
    .filter((session) => session.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

  return (
    <AppPage
      header={
        <AppHeader
          variant="plain"
          title="Sessions"
          showProfile={false}
          actions={
            <HeaderIconButton
              label="Start a session"
              onClick={() => setStartOpen(true)}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </HeaderIconButton>
          }
        />
      }
    >
      <div className="px-5 pb-8">
        <section className="rounded-3xl bg-white p-5">
          <div className="flex items-start gap-4">
            <KinoraOrb size={72} animated label="Kinora session" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[24px] font-semibold text-ink">
                A calmer conversation, together.
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Kinora guides both sides and helps you leave with one agreement
                you can keep.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2.5">
            <button
              type="button"
              onClick={() => {
                setInitialSchedule(false);
                setStartOpen(true);
              }}
              className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white transition hover:bg-black"
            >
              <Sparkles className="h-4 w-4" />
              Start now
            </button>
            <button
              type="button"
              onClick={() => {
                setInitialSchedule(true);
                setStartOpen(true);
              }}
              className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full border border-[#e4def0] bg-white px-4 text-[14px] font-semibold text-ink-soft"
            >
              <CalendarClock className="h-4 w-4" />
              Schedule
            </button>
          </div>
        </section>

        {active.length ? (
          <section className="mt-6">
            <h2 className="text-[15px] font-semibold text-ink">In progress</h2>
            <div className="mt-3 space-y-2.5">
              {active.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>
        ) : null}

        {upcoming.length ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-ink">
                On the calendar
              </h2>
              <span className="text-[13px] text-muted">
                {upcoming.length} scheduled
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              {upcoming.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">
              Past sessions
            </h2>
            <span className="text-[13px] text-muted">
              {past.length} {past.length === 1 ? "summary" : "summaries"}
            </span>
          </div>
          {past.length ? (
            <div className="mt-3 space-y-2.5">
              {past.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-[#ded7ea] bg-white/60 p-4 text-[14px] leading-relaxed text-muted">
              Your first session will live here.
            </div>
          )}
        </section>
      </div>

      <StartSessionSheet
        open={startOpen}
        onOpenChange={(next) => {
          setStartOpen(next);
          if (!next) {
            setInitialSchedule(false);
            if (initialOpen) router.replace("/app/sessions");
          }
        }}
        initialSchedule={initialSchedule}
      />
    </AppPage>
  );
}
