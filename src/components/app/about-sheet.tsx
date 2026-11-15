"use client";

import Link from "next/link";
import { ArrowUpRight, MemoryStick, ShieldCheck, Sparkles } from "lucide-react";
import { AppSheet } from "@/components/app/app-sheet";
import { useFamily } from "@/components/providers/family-provider";

export function AboutSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { ai, state } = useFamily();
  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="About Kinora"
      description="A calm copilot for the parent team."
    >
      <div className="rounded-2xl border border-[#e9e1fb] bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1eaff] text-kinora-800">
            <Sparkles className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[16px] font-semibold text-ink">Kinora</p>
            <p className="text-[14px] text-muted">
              {ai.mode === "llm" ? ai.model : "Kinora Engine"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          {ai.mode === "llm"
            ? "Answers use a configured language model. Family context is sent only to that provider."
            : "Answers use the Kinora Engine, a deterministic family model. Family data stays in the app."}
        </p>
      </div>

      <div className="mt-3 space-y-2.5">
        <div className="flex gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4">
          <MemoryStick className="mt-0.5 h-5 w-5 shrink-0 text-kinora-700" />
          <p className="text-[14px] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">Memory you can see.</strong>{" "}
            Answers cite the moods, sessions, child profiles and courses they
            used.
          </p>
        </div>
        <div className="flex gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-kinora-700" />
          <p className="text-[14px] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">Two-sided by design.</strong>{" "}
            Shared sessions hear both partners and never declare a winner.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Link
          href="/#evidence"
          onClick={() => onOpenChange(false)}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-kinora-800"
        >
          Research and safety
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <span className="text-[13px] text-muted">
          {state?.family.name ?? "Kinora"}
        </span>
      </div>
    </AppSheet>
  );
}
