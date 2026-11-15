"use client";

import Link from "next/link";
import {
  AudioLines,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Cloud,
  CloudRain,
  HeartHandshake,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { useFamily } from "@/components/providers/family-provider";
import type { NextAction } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  calendar: CalendarDays,
  heart: HeartHandshake,
  sparkles: Sparkles,
  user: UserRound,
  book: BookOpen,
  voice: AudioLines,
};

const toneMap: Record<NextAction["tone"], string> = {
  purple: "bg-[#f1eaff] text-[#6d3fe0]",
  sun: "bg-[#fff4d6] text-[#a87106]",
  rain: "bg-[#e8eeff] text-[#3d5da8]",
  cloud: "bg-[#eeecf2] text-[#5e5a68]",
};

export function NextActions() {
  const { actions } = useFamily();
  const items = actions.slice(0, 3);

  return (
    <section className="mt-6" aria-label="Today's suggestions">
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="kinora-card p-4 text-[15px] leading-relaxed text-muted">
            Nothing needs your attention right now.
          </div>
        ) : (
          items.map((action) => {
            const Icon = iconMap[action.icon] ?? Sparkles;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="group flex items-center gap-3 rounded-2xl border border-white bg-white p-4 transition hover:-translate-y-0.5"
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    toneMap[action.tone],
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink">
                    {action.title}
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">
                    {action.reason}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#bdb7c7] transition group-hover:translate-x-0.5 group-hover:text-kinora-800" />
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
