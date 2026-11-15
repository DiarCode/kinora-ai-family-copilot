"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Share2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader, HeaderIconButton } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { KinoraResponse } from "@/components/brand/kinora-response";
import { useFamily } from "@/components/providers/family-provider";
import { courseBySlug } from "@/content/courses";
import { formatFriendlyDateTime } from "@/lib/date";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SessionSummary({ session }: { session: Session }) {
  const { updateSession } = useFamily();
  const summary = session.summary;
  const [selected, setSelected] = useState<string[]>(
    session.acceptedAgreements?.length
      ? session.acceptedAgreements
      : (summary?.agreements ?? []),
  );
  const [saving, setSaving] = useState(false);
  const saved = Boolean(session.acceptedAgreements?.length);
  const course = summary?.recommendedCourseSlug
    ? courseBySlug(summary.recommendedCourseSlug)
    : undefined;

  if (!summary) {
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref="/app/sessions"
            title="Session"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 py-10 text-center text-[15px] text-muted">
          This session does not have a summary yet.
        </div>
      </AppPage>
    );
  }

  const toggle = (agreement: string) => {
    if (saved) return;
    setSelected((current) =>
      current.includes(agreement)
        ? current.filter((item) => item !== agreement)
        : [...current, agreement],
    );
  };

  const save = async () => {
    if (!selected.length) {
      toast.error("Choose at least one agreement to save.");
      return;
    }
    setSaving(true);
    try {
      await updateSession(session.id, "accept", selected);
      toast.success("Agreements saved to your family memory.");
    } catch {
      // The provider surfaces the error.
    } finally {
      setSaving(false);
    }
  };

  const summaryText = `${summary.title}\n\nWhat we heard:\n${summary.whatWeHeard}\n\nAgreements:\n${summary.agreements
    .map((agreement, index) => `${index + 1}. ${agreement}`)
    .join("\n")}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success("Summary copied.");
    } catch {
      toast.error("Could not copy the summary.");
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: summary.title, text: summaryText });
        return;
      } catch {
        return;
      }
    }
    await copy();
  };

  return (
    <AppPage
      header={
        <AppHeader
          variant="back"
          backHref="/app/sessions"
          title="Session summary"
          showMenu={false}
          showProfile={false}
          actions={
            <HeaderIconButton label="Share summary" onClick={() => void share()}>
              <Share2 className="h-[17px] w-[17px]" strokeWidth={1.8} />
            </HeaderIconButton>
          }
        />
      }
    >
      <div className="px-5 pb-8">
        {session.safetyFlagged ? (
          <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#f0d3da] bg-[#fff6f8] p-4">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b34c77]" />
            <p className="text-[14px] leading-relaxed text-[#7d5a66]">
              This session was paused for safety. Coaching did not continue.
              Please use the crisis resources in the session if they are still
              relevant.
            </p>
          </div>
        ) : null}

        <section className="relative overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-[#f4edff] via-[#fbf9ff] to-white p-4 text-center">
          <div className="absolute -top-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#d6c7fe]/50 blur-2xl" />
          <div className="relative mx-auto flex justify-center">
            <KinoraOrb size={90} animated label="Kinora summary" />
          </div>
          <h1 className="relative mt-3 text-[28px] font-semibold text-ink">
            {summary.title}
          </h1>
          <p className="relative mt-2 text-[14px] text-muted">
            {formatFriendlyDateTime(
              session.completedAt ?? session.createdAt,
            )}{" "}
            · {session.mode === "voice" ? "Voice" : "Text"} ·{" "}
            {session.participants.length} parents
          </p>
        </section>

        <section className="kinora-card mt-3 p-4">
          <p className="eyebrow">What we heard</p>
          <KinoraResponse className="mt-3 text-[15px] leading-relaxed">
            {summary.whatWeHeard}
          </KinoraResponse>
        </section>

        <section className="kinora-card mt-3 p-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Agreements</p>
            <span className="text-[13px] text-muted">
              {selected.length} of {summary.agreements.length} selected
            </span>
          </div>
          <div className="mt-2.5 space-y-2">
            {summary.agreements.map((agreement, index) => {
              const checked = selected.includes(agreement);
              return (
                <button
                  key={agreement}
                  type="button"
                  onClick={() => toggle(agreement)}
                  disabled={saved}
                  aria-pressed={checked}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-2xl border p-2.5 text-left transition",
                    checked
                      ? "border-[#ddccfb] bg-[#faf7ff]"
                      : "border-[#ece8f4] bg-white",
                    saved && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      checked
                        ? "border-kinora-700 bg-kinora-700 text-white"
                        : "border-[#d5cfdd] bg-white",
                    )}
                  >
                    {checked ? <Check className="h-2.5 w-2.5" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-[#8e8998]">
                      Agreement {index + 1}
                    </span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-ink-soft">
                      {agreement}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={saved || saving}
            onClick={() => void save()}
            className={cn(
              "focus-ring mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition",
              saved
                ? "bg-[#eff8f2] text-[#2f7a4a]"
                : "bg-ink text-white",
            )}
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Saved to family memory
              </>
            ) : saving ? (
              "Saving…"
            ) : (
              "Save these agreements"
            )}
          </button>
        </section>

        {course ? (
          <Link
            href={`/app/courses/${course.slug}`}
            className="group mt-3 flex items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4 transition hover:-translate-y-0.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f1eaff] text-kinora-800">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-[#8e8998]">
                Recommended course
              </span>
              <span className="mt-0.5 block truncate text-[16px] font-semibold text-ink">
                {course.title}
              </span>
              <span className="block text-[13px] text-muted">
                {course.minutes} minutes · ends with a quiz
              </span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[#c3bdcb] transition group-hover:translate-x-0.5" />
          </Link>
        ) : null}


        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full border border-[#e4def0] bg-white text-[14px] font-semibold text-ink-soft"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy summary
          </button>
          <Link
            href="/app/sessions"
            className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-semibold text-white"
          >
            Back to sessions
          </Link>
        </div>

      </div>
    </AppPage>
  );
}
