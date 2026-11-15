"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useFamily } from "@/components/providers/family-provider";

export function QuickActions() {
  const { state } = useFamily();
  const child = state?.children[0];

  const cards = [
    {
      href: "/app/assistant",
      title: "Ask Kinora",
      description: "Talk through what is on your mind.",
      Icon: Sparkles,
    },
    {
      href: "/app/sessions/new",
      title: "Start a session",
      description: "A guided conversation for both of you.",
      Icon: AudioLines,
    },
    {
      href: child ? `/app/children/${child.id}` : "/app/children",
      title: child ? `Discover ${child.name}` : "Add a child",
      description: "A short strengths map.",
      Icon: UserRound,
    },
    {
      href: "/app/courses",
      title: "Courses",
      description: "Practical skills in minutes.",
      Icon: BookOpen,
    },
  ];

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.Icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group kinora-card relative flex min-h-[136px] flex-col p-4 transition hover:-translate-y-0.5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f4f1f8] text-kinora-800">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <p className="mt-3 text-[16px] font-semibold text-ink">
                {card.title}
              </p>
              <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-muted">
                {card.description}
              </p>
              <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-[#bdb7c7] transition group-hover:text-kinora-800" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
