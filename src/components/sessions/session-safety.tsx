"use client";

import Link from "next/link";
import { Phone, ShieldAlert } from "lucide-react";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import type { Session } from "@/lib/types";

const resources = [
  {
    label: "Crisis support — call or text 988",
    body: "Suicide & Crisis Lifeline. Free, confidential, 24/7.",
    href: "tel:988",
    cta: "Call 988",
  },
  {
    label: "Domestic violence support — 1-800-799-7233",
    body: "National Domestic Violence Hotline, or text START to 88788.",
    href: "tel:18007997233",
    cta: "Call the hotline",
  },
  {
    label: "Immediate danger — call 911",
    body: "If someone is in immediate physical danger, call emergency services.",
    href: "tel:911",
    cta: "Call 911",
  },
];

export function SessionSafety({ session }: { session: Session }) {
  const safetyTurn = session.turns.find((turn) => turn.kind === "safety");

  return (
    <AppPage
      header={
        <AppHeader
          variant="back"
          backHref="/app/sessions"
          title="Session paused"
          showMenu={false}
          showProfile={false}
        />
      }
    >
      <div className="px-5 pb-8">
        <section className="rounded-3xl border border-[#f0d3da] bg-[#fff6f8] p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#b34c77]">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-[#b34c77] ">
                Safety first
              </p>
              <h1 className="text-[20px] font-semibold text-[#3f1f2a]">
                Kinora has paused this session.
              </h1>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[#6f4a55]">
            {safetyTurn?.text ??
              "What you described may involve your safety. Kinora will not continue a joint coaching session while safety is in question. Please use the resources below."}
          </p>
        </section>

        <div className="mt-3 space-y-2">
          {resources.map((resource) => (
            <a
              key={resource.label}
              href={resource.href}
              className="flex items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-3.5 transition hover:bg-[#fbf9ff]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f1eaff] text-kinora-800">
                <Phone className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink">
                  {resource.label}
                </span>
                <span className="mt-0.5 block text-[13.5px] leading-relaxed text-muted">
                  {resource.body}
                </span>
              </span>
              <span className="rounded-full bg-[#f5f2fa] px-2 py-1 text-[13.5px] font-medium text-ink-soft">
                {resource.cta}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-[#e9e1fb] bg-[#faf7ff] p-3 text-[13.5px] leading-relaxed text-ink-soft">
          This is not a clinical assessment. If you are safe and want to talk
          later, you can start a new session when you are ready. Your private
          reflections remain private.
        </div>

        <Link
          href="/app/sessions"
          className="mt-3 flex h-10 items-center justify-center rounded-full bg-ink text-[13.5px] font-semibold text-white"
        >
          Back to sessions
        </Link>
      </div>
    </AppPage>
  );
}
