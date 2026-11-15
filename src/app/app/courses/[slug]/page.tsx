"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Cloud,
  HeartHandshake,
  Loader2,
  RefreshCw,
  Scale,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { useFamily } from "@/components/providers/family-provider";
import { courseBySlug } from "@/content/courses";
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

type Stage = "slides" | "quiz" | "result";
type QuizResult = { passed: boolean; score: number; total: number };

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const { state, saveCourseSlide, submitCourseQuiz } = useFamily();
  const course = courseBySlug(params.slug);
  const progress = state?.courses.find((item) => item.slug === params.slug);
  const [stage, setStage] = useState<Stage>("slides");
  const [slideIndex, setSlideIndex] = useState(() =>
    Math.min(progress?.slideIndex ?? 0, (course?.slides.length ?? 1) - 1),
  );
  const [answers, setAnswers] = useState<number[]>(() =>
    Array.from({ length: course?.quiz.length ?? 0 }, () => -1),
  );
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const completed = Boolean(progress?.completedAt);
  const Icon = course ? iconMap[course.icon] : Sparkles;
  const answeredAll = useMemo(
    () => answers.every((answer) => answer >= 0),
    [answers],
  );

  if (!state) return null;
  if (!course) {
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref="/app/courses"
            title="Courses"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 py-10 text-center text-[15px] text-muted">
          This course could not be found.
        </div>
      </AppPage>
    );
  }

  const slide = course.slides[slideIndex];

  const goNext = () => {
    if (slideIndex < course.slides.length - 1) {
      const nextIndex = slideIndex + 1;
      setSlideIndex(nextIndex);
      void saveCourseSlide(course.slug, nextIndex);
      return;
    }
    setStage("quiz");
  };

  const goBack = () => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  const submit = async () => {
    if (!answeredAll) {
      toast.error("Answer all three questions first.");
      return;
    }
    setSubmitting(true);
    try {
      const outcome = await submitCourseQuiz(course.slug, answers);
      setResult(outcome);
      setStage("result");
      if (outcome.passed) {
        toast.success("Course complete. Saved to your memory.");
      } else {
        toast.error("Almost there — review the answers and try again.");
      }
    } catch {
      // The provider shows the error.
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => {
    setAnswers(Array.from({ length: course.quiz.length }, () => -1));
    setResult(null);
    setStage("quiz");
  };

  return (
    <AppPage
      header={
        <AppHeader
          variant="back"
          backHref="/app/courses"
          title={course.title}
          showMenu={false}
          showProfile={false}
          actions={
            completed ? (
              <span className="inline-flex h-8 items-center gap-1 rounded-full bg-[#eaf6ee] px-2.5 text-[13.5px] font-semibold text-[#3f8a5c]">
                <Check className="h-3 w-3" />
                Done
              </span>
            ) : null
          }
        />
      }
    >
      <div className="px-5 pb-8">
        {stage === "slides" ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ebe7f2]">
                <div
                  className="h-full rounded-full bg-ink transition-all duration-500"
                  style={{
                    width: `${((slideIndex + 1) / course.slides.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[13px] text-muted">
                {slideIndex + 1}/{course.slides.length}
              </span>
            </div>

            <article className="mt-3 overflow-hidden rounded-3xl border border-white bg-white shadow-[0_18px_44px_-34px_rgba(60,36,120,0.35)]">
              <div
                className="relative flex h-[112px] items-end overflow-hidden p-4"
                style={{
                  background: `radial-gradient(120% 120% at 20% 0%, ${course.accent}38, transparent 70%), linear-gradient(135deg, #f7f2ff, #ffffff)`,
                }}
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-lg"
                  style={{ backgroundColor: course.accent }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <p className="ml-3 text-[13.5px] font-semibold text-[#7b6a91] ">
                  {course.category} · {course.minutes} min
                </p>
                <span className="absolute right-4 bottom-4 text-[46.0px] font-semibold leading-none text-white/70">
                  0{slideIndex + 1}
                </span>
              </div>

              <div className="p-4">
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1 className="mt-1.5 text-[24px] font-semibold leading-snug text-ink">
                  {slide.title}
                </h1>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                  {slide.body}
                </p>
                {slide.bullets ? (
                  <div className="mt-3 space-y-2">
                    {slide.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-2.5">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-kinora-700" />
                        <p className="text-[13.5px] leading-relaxed text-muted">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {slide.takeaway ? (
                  <div className="mt-3 rounded-xl border border-[#e9e1fb] bg-[#faf7ff] px-3 py-2.5">
                    <p className="text-[13px] font-semibold text-kinora-800/70 ">
                      Takeaway
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                      {slide.takeaway}
                    </p>
                  </div>
                ) : null}
              </div>
            </article>

            <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
              <button
                type="button"
                onClick={goBack}
                disabled={slideIndex === 0}
                aria-label="Previous slide"
                className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-[#e4def0] bg-white text-ink-soft disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="focus-ring flex h-11 items-center justify-center gap-1.5 rounded-full bg-ink text-[15px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(120,70,230,0.9)]"
              >
                {slideIndex === course.slides.length - 1
                  ? "Take the quiz"
                  : "Next slide"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </>
        ) : null}

        {stage === "quiz" ? (
          <>
            <section className="rounded-3xl border border-white bg-gradient-to-br from-[#f4edff] via-[#fbf9ff] to-white p-4 text-center">
              <div className="flex justify-center">
                <KinoraOrb size={64} animated label="Course quiz" />
              </div>
              <p className="mt-1.5 text-[13.5px] font-semibold text-kinora-800/70 ">
                Three questions
              </p>
              <h1 className="mt-1 text-[24px] font-semibold text-ink">
                One last rep.
              </h1>
              <p className="mx-auto mt-1 max-w-[290px] text-[13.5px] leading-relaxed text-muted">
                Two correct answers passes. You can retry if you need to — the
                point is the practice, not the score.
              </p>
            </section>

            <div className="mt-3 space-y-3">
              {course.quiz.map((question, questionIndex) => (
                <section
                  key={question.question}
                  className="kinora-card p-3.5"
                >
                  <p className="text-[13px] font-semibold text-[#a09bab] ">
                    Question {questionIndex + 1}
                  </p>
                  <h2 className="mt-1 text-[15px] font-semibold leading-snug text-ink">
                    {question.question}
                  </h2>
                  <div className="mt-2.5 space-y-1.5">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[questionIndex] === optionIndex;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setAnswers((current) =>
                              current.map((answer, index) =>
                                index === questionIndex ? optionIndex : answer,
                              ),
                            )
                          }
                          aria-pressed={selected}
                          className={cn(
                            "flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition",
                            selected
                              ? "border-kinora-400 bg-[#f7f2ff]"
                              : "border-[#f0edf5] bg-[#faf9fc] hover:bg-white",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[13px] font-semibold",
                              selected
                                ? "border-kinora-700 bg-kinora-700 text-white"
                                : "border-[#d5cfdd] bg-white text-[#9b95a5]",
                            )}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="text-[13.5px] leading-relaxed text-ink-soft">
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <button
              type="button"
              disabled={!answeredAll || submitting}
              onClick={() => void submit()}
              className="focus-ring mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {submitting ? "Checking…" : "Check my answers"}
            </button>
            <button
              type="button"
              onClick={() => setStage("slides")}
              className="mt-2 flex h-9 w-full items-center justify-center rounded-full text-[13.5px] font-medium text-muted"
            >
              Back to the slides
            </button>
          </>
        ) : null}

        {stage === "result" && result ? (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-[#f4edff] via-[#fbf9ff] to-white p-4 text-center">
              <div className="absolute -top-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#d6c7fe]/50 blur-2xl" />
              <div className="relative flex justify-center">
                <KinoraOrb size={84} animated label="Quiz result" />
              </div>
              <p className="relative mt-2 text-[13.5px] font-semibold text-kinora-800/70 ">
                {course.title}
              </p>
              <h1 className="relative mt-1 text-[28px] font-semibold text-ink">
                {result.passed ? "Course complete." : "Almost there."}
              </h1>
              <p className="relative mt-1 text-[15px] text-muted">
                {result.score} of {result.total} correct ·{" "}
                {result.passed ? "passed" : "two needed to pass"}
              </p>
              <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13.5px] font-medium text-ink-soft shadow-sm">
                {result.passed ? (
                  <Check className="h-3 w-3 text-[#3f8a5c]" />
                ) : (
                  <RefreshCw className="h-3 w-3 text-[#a87106]" />
                )}
                {result.passed
                  ? "Saved to your family memory"
                  : "Review the answers, then retry"}
              </div>
            </section>

            <div className="mt-3 space-y-2">
              {course.quiz.map((question, questionIndex) => {
                const chosen = answers[questionIndex];
                const correct = chosen === question.correctIndex;
                return (
                  <section key={question.question} className="kinora-card p-3.5">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          correct
                            ? "bg-[#eaf6ee] text-[#3f8a5c]"
                            : "bg-[#fdecef] text-[#c34d68]",
                        )}
                      >
                        {correct ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold leading-snug text-ink">
                          {question.question}
                        </p>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                          <span className="font-medium text-ink-soft">
                            Correct:
                          </span>{" "}
                          {question.options[question.correctIndex]}
                        </p>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-[#8e8998]">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {!result.passed ? (
                <button
                  type="button"
                  onClick={retry}
                  className="focus-ring flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink text-[13.5px] font-semibold text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              ) : (
                <Link
                  href="/app/courses"
                  className="focus-ring flex h-10 items-center justify-center rounded-full bg-ink text-[13.5px] font-semibold text-white"
                >
                  Back to courses
                </Link>
              )}
              <Link
                href="/app"
                className="focus-ring flex h-10 items-center justify-center rounded-full border border-[#e4def0] bg-white text-[13.5px] font-semibold text-ink-soft"
              >
                Family home
              </Link>
            </div>

            <p className="mt-4 px-1 text-[13.5px] leading-relaxed text-[#a09bab]">
              The quiz is a learning check, not a certificate. The real practice
              is the one thing you try this week.
            </p>
          </>
        ) : null}
      </div>
    </AppPage>
  );
}
