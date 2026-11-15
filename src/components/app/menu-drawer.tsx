"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  BookOpen,
  House,
  Sparkles,
  Users,
} from "lucide-react";
import { AppSheet } from "@/components/app/app-sheet";
import { KinoraLogo } from "@/components/brand/kinora-logo";
import { useFamily } from "@/components/providers/family-provider";
import { cn, firstName } from "@/lib/utils";
import { todayKey } from "@/lib/date";

const navigation = [
  {
    href: "/app",
    label: "Home",
    description: "Moods, timeline, next best actions",
    icon: House,
  },
  {
    href: "/app/assistant",
    label: "Kinora",
    description: "Ask anything, with family memory",
    icon: Sparkles,
  },
  {
    href: "/app/sessions",
    label: "Sessions",
    description: "Talk it through, together",
    icon: AudioLines,
  },
  {
    href: "/app/children",
    label: "Children",
    description: "Strengths, interests, growth",
    icon: Users,
  },
  {
    href: "/app/courses",
    label: "Courses",
    description: "Five-minute skills reps",
    icon: BookOpen,
  },
];

export function MenuDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { state } = useFamily();
  const today = todayKey();
  const todayMoods =
    state?.moods.filter((mood) => mood.date === today) ?? [];

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="left"
      hideHeader
      hideClose
      className="bg-[#faf8ff]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <KinoraLogo size="md" />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-black/[0.05] text-ink-soft"
          >
            <span className="relative block h-3.5 w-3.5">
              <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 rotate-45 rounded bg-current" />
              <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 -rotate-45 rounded bg-current" />
            </span>
          </button>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2f1d55] via-[#4b2d91] to-[#7b4fe0] p-4 text-white shadow-[0_20px_45px_-24px_rgba(60,30,130,0.7)]">
          <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
          <p className="text-[13.5px] font-semibold text-white/60 ">
            Your family
          </p>
          <p className="mt-1 text-[24px] font-semibold ">
            {state?.family.name ?? "Your family"}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {state?.family.members.map((member) => {
                const mood = todayMoods.find(
                  (entry) => entry.memberId === member.id,
                );
                return (
                  <span
                    key={member.id}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#4b2d91] text-[15px] font-semibold text-white"
                    style={{ backgroundColor: member.avatarColor }}
                    title={`${member.name}: ${mood?.value ?? "not checked in"}`}
                  >
                    {firstName(member.name).charAt(0)}
                  </span>
                );
              })}
            </div>
            <div className="text-[15px] leading-tight text-white/70">
              {state?.family.members
                .map((member) => firstName(member.name))
                .join(" & ") ?? "Two parents"}
              <br />
              {state?.family.plan === "plus" ? "Kinora Plus" : "Family plan"}
            </div>
            <span className="ml-auto rounded-full bg-white/15 px-2.5 py-1 text-[13.5px] font-medium text-white/80">
              {state?.children.length ?? 0}{" "}
              {state?.children.length === 1 ? "child" : "children"}
            </span>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1.5" aria-label="Main">
          {navigation.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "focus-ring group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition",
                  active
                    ? "bg-white shadow-[0_10px_30px_-22px_rgba(50,30,100,0.5)]"
                    : "hover:bg-white/60",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl transition",
                    active
                      ? "bg-kinora-100 text-kinora-800"
                      : "bg-black/[0.04] text-ink-soft group-hover:bg-white",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[20px] font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="block truncate text-[15px] text-muted">
                    {item.description}
                  </span>
                </span>
                {active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-kinora-700" />
                ) : null}
              </Link>
            );
          })}
        </nav>

      </div>
    </AppSheet>
  );
}
