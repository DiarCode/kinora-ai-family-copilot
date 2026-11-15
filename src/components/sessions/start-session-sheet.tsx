"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AudioLines,
  CalendarClock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppSheet } from "@/components/app/app-sheet";
import { useFamily } from "@/components/providers/family-provider";
import { cn } from "@/lib/utils";

const starters = [
  "Bedtime has become a fight every night.",
  "We keep arguing about screens and limits.",
  "The load feels unfair, and I am tired of asking.",
  "We disagree about how to handle a school problem.",
];

function defaultScheduleValue(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(19, 30, 0, 0);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function StartSessionSheet({
  open,
  onOpenChange,
  initialSchedule = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSchedule?: boolean;
}) {
  const router = useRouter();
  const { state, createSession } = useFamily();
  const [problem, setProblem] = useState("");
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [when, setWhen] = useState(defaultScheduleValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Sync the requested entry mode when the sheet opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setSchedule(initialSchedule);
  }, [open, initialSchedule]);

  if (!state) return null;

  const create = async (scheduledFor?: string) => {
    if (problem.trim().length < 3) {
      toast.error("Add one sentence about what you want to understand.");
      return;
    }
    setSaving(true);
    try {
      const session = await createSession({
        problem: problem.trim(),
        mode,
        scheduledFor,
      });
      toast.success(
        scheduledFor
          ? "Session scheduled. It is on the calendar."
          : "Your session is ready.",
      );
      setProblem("");
      setSchedule(false);
      onOpenChange(false);
      router.push(`/app/sessions/${session.id}`);
    } catch {
      // The provider surfaces the error.
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Start a session"
      description="Kinora will guide both of you. Start now or put it on the calendar."
    >
      <label className="text-[15px] font-semibold text-ink">
        What do you want to work through?
      </label>
      <textarea
        value={problem}
        onChange={(event) => setProblem(event.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="A sentence is enough."
        className="focus-ring mt-2 w-full resize-none rounded-2xl border border-[#e7e2f0] bg-white p-4 text-[15px] leading-relaxed text-ink placeholder:text-[#a09bab]"
      />

      <div className="mt-2 flex flex-wrap gap-1.5">
        {starters.map((starter) => (
          <button
            key={starter}
            type="button"
            onClick={() => setProblem(starter)}
            className="rounded-full bg-[#f4f0fa] px-3 py-1.5 text-[13px] text-ink-soft transition hover:bg-[#ede6f8]"
          >
            {starter}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {[
          {
            value: "voice" as const,
            title: "Voice",
            body: "One phone between you. Kinora listens and speaks.",
            Icon: AudioLines,
          },
          {
            value: "text" as const,
            title: "Text",
            body: "Type at your own pace.",
            Icon: MessageSquare,
          },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            aria-pressed={mode === option.value}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              mode === option.value
                ? "border-kinora-400 bg-[#f7f2ff] ring-1 ring-kinora-300"
                : "border-[#e7e2f0] bg-white hover:bg-[#fbf9ff]",
            )}
          >
            <option.Icon
              className={cn(
                "h-4 w-4",
                mode === option.value ? "text-kinora-800" : "text-[#8d8796]",
              )}
            />
            <p className="mt-2 text-[15px] font-semibold">{option.title}</p>
            <p className="mt-1 text-[13px] leading-snug text-muted">
              {option.body}
            </p>
          </button>
        ))}
      </div>

      {schedule ? (
        <div className="mt-5 rounded-2xl border border-[#e7e2f0] bg-white p-4">
          <label className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
            <CalendarClock className="h-3.5 w-3.5 text-kinora-700" />
            When should Kinora hold the space?
          </label>
          <input
            type="datetime-local"
            value={when}
            onChange={(event) => setWhen(event.target.value)}
            className="focus-ring mt-3 w-full rounded-xl border border-[#e7e2f0] bg-[#faf9fc] px-3 py-2.5 text-[14px] text-ink"
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              const date = new Date(when);
              if (Number.isNaN(date.getTime())) {
                toast.error("Choose a valid date and time.");
                return;
              }
              void create(date.toISOString());
            }}
            className="focus-ring mt-3 flex h-12 w-full items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Scheduling…" : "Confirm schedule"}
          </button>
        </div>
      ) : null}

      {!schedule ? (
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void create()}
            className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {saving ? "Opening…" : "Start now"}
          </button>
          <button
            type="button"
            onClick={() => setSchedule(true)}
            className="focus-ring flex h-12 items-center justify-center gap-1.5 rounded-full border border-[#e4def0] bg-white px-4 text-[14px] font-semibold text-ink-soft"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Schedule
          </button>
        </div>
      ) : null}

    </AppSheet>
  );
}
