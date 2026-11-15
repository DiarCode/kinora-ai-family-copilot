"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Cloud,
  HeartHandshake,
  Scale,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { useFamily } from "@/components/providers/family-provider";
import { courseCategories, courses } from "@/content/courses";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<Course["icon"], typeof Sparkles> = {
  heart: HeartHandshake,
  cloud: Cloud,
  scale: Scale,
  sparkles: Sparkles,
  calendar: CalendarDays,
  phone: Smartphone,
};

export default function CoursesPage() {
  const { state } = useFamily();
  const [filter, setFilter] = useState<string>("All");

  if (!state) return null;
  const progressFor = (slug: string) =>
    state.courses.find((item) => item.slug === slug);
  const completedCount = state.courses.filter((item) => item.completedAt).length;
  const inProgress = state.courses.filter((item) => !item.completedAt);
  const visible =
    filter === "All"
      ? courses
      : courses.filter((course) => course.category === filter);

  return (
    <AppPage
      header={
        <AppHeader
          variant="plain"
          title="Courses"
          showProfile={false}
        />
      }
    >
      <div className="px-5 pb-8">
        <section className="rounded-3xl bg-white p-5">
          <div className="flex items-start gap-4">
            <KinoraOrb size={72} animated label="Kinora courses" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[26px] font-semibold text-ink">
                Small skills. Calmer days.
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Practical courses for the moments that repeat.
              </p>
            </div>
          </div>
          <div className="relative mt-3 flex items-center gap-4">
            <div>
              <p className="text-[20px] font-semibold text-ink">
                {completedCount}
              </p>
              <p className="text-[13px] text-muted">completed</p>
            </div>
            <div className="h-6 w-px bg-[#e9e3f2]" />
            <div>
              <p className="text-[20px] font-semibold text-ink">
                {inProgress.length}
              </p>
              <p className="text-[13px] text-muted">in progress</p>
            </div>
            <div className="h-6 w-px bg-[#e9e3f2]" />
            <div>
              <p className="text-[20px] font-semibold text-ink">
                {courses.length}
              </p>
              <p className="text-[13px] text-muted">in the library</p>
            </div>
          </div>
        </section>

        <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {["All", ...courseCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={cn(
                "focus-ring shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                filter === category
                  ? "bg-ink text-white"
                  : "bg-white/70 text-ink-soft hover:bg-white",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-2.5 space-y-2">
          {visible.map((course) => {
            const progress = progressFor(course.slug);
            const Icon = iconMap[course.icon];
            const complete = Boolean(progress?.completedAt);
            return (
              <Link
                key={course.slug}
                href={`/app/courses/${course.slug}`}
                className="group block rounded-2xl border border-white bg-white p-4 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{
                      backgroundColor: `${course.accent}1f`,
                      color: course.accent,
                    }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-medium text-[#8e8998]">
                        {course.category}
                      </p>
                      <span className="text-[13px] text-[#c0bbc8]">·</span>
                      <p className="text-[13px] text-[#8e8998]">
                        {course.minutes} min · {course.quiz.length} questions
                      </p>
                    </div>
                    <p className="mt-1 text-[17px] font-semibold text-ink">
                      {course.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-muted">
                      {course.subtitle}
                    </p>
                    {progress ? (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1eef6]">
                          <div
                            className="h-full rounded-full bg-ink"
                            style={{
                              width: complete
                                ? "100%"
                                : `${((progress.slideIndex + 1) / course.slides.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[13px] text-[#8e8998]">
                          {complete
                            ? `${progress.score}/${progress.total}`
                            : `${progress.slideIndex + 1}/${course.slides.length}`}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {complete ? (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#eaf6ee] text-[#3f8a5c]">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : (
                    <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#c3bdcb] transition group-hover:translate-x-0.5" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </AppPage>
  );
}
