"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { useFamily } from "@/components/providers/family-provider";
import { bandForAge } from "@/content/assessments";
import { topTraits } from "@/lib/engine/child-profile";
import { ageFromBirthDate } from "@/lib/date";
import type { ChildProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stage = "intro" | "questions" | "result";

export default function DiscoverPage() {
  const params = useParams<{ id: string }>();
  const { state, submitAssessment } = useFamily();
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ChildProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const child = state?.children.find((item) => item.id === params.id);
  const age = child ? ageFromBirthDate(child.birthDate) : 6;
  const band = bandForAge(age);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document
      .querySelector<HTMLElement>("[class*='overflow-y-auto']")
      ?.scrollTo({ top: 0 });
  }, [stage, index]);

  if (!state) return null;

  if (!child) {
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref="/app/children"
            title="Discovery"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 py-10 text-center text-[15px] text-muted">
          This child could not be found.
        </div>
      </AppPage>
    );
  }

  const question = band.questions[index];
  const currentAnswer = question ? answers[question.id] : undefined;
  const progress = Math.round(((index + (currentAnswer !== undefined ? 1 : 0)) / band.questions.length) * 100);

  const choose = (optionIndex: number) => {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  };

  const next = async () => {
    if (currentAnswer === undefined) {
      toast.error("Choose the answer that sounds most like your child.");
      return;
    }
    if (index < band.questions.length - 1) {
      setIndex((current) => current + 1);
      return;
    }
    setSubmitting(true);
    try {
      const payload = band.questions.map((item) => ({
        questionId: item.id,
        optionIndex: answers[item.id] ?? 0,
      }));
      const { profile } = await submitAssessment(child.id, payload);
      setResult(profile);
      setStage("result");
      toast.success(`${child.name}'s strengths map is ready.`);
    } catch {
      // The provider surfaces the error.
    } finally {
      setSubmitting(false);
    }
  };

  const previous = () => {
    if (index === 0) {
      setStage("intro");
      return;
    }
    setIndex((current) => current - 1);
  };

  if (stage === "intro") {
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref={`/app/children/${child.id}`}
            title="Discovery"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 pb-8">
          <section className="relative overflow-hidden rounded-3xl border border-white bg-white p-6 text-center">
            <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#f5b942]/20 blur-2xl" />
            <div className="relative mx-auto flex justify-center">
              <KinoraOrb size={96} animated label="Kinora discovery" />
            </div>
            <p className="relative mt-3 text-[14px] font-medium text-[#a87106]">
              {band.name} · {band.ages}
            </p>
            <h1 className="relative mt-1 text-[28px] font-semibold text-ink">
              Let&apos;s map {child.name}.
            </h1>
            <p className="relative mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted">
              {band.intro.replaceAll("{name}", child.name)}
            </p>
            <button
              type="button"
              onClick={() => setStage("questions")}
              className="relative mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white"
            >
              Let&apos;s begin
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>



          <Link
            href={`/app/children/${child.id}`}
            className="mt-4 flex h-12 items-center justify-center rounded-full border border-[#e4def0] bg-white text-[14px] font-semibold text-ink-soft"
          >
            Not now
          </Link>
        </div>
      </AppPage>
    );
  }

  if (stage === "result" && result) {
    const top = topTraits(result.traits, 2);
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref={`/app/children/${child.id}`}
            title="Discovery complete"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 pb-8">
          <section className="relative overflow-hidden rounded-3xl border border-white bg-white p-6 text-center">
            <div className="absolute -top-10 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#d6c7fe]/60 blur-2xl" />
            <div className="relative mx-auto flex justify-center">
              <KinoraOrb size={112} animated label="Discovery complete" />
            </div>
            <p className="relative mt-3 text-[14px] font-medium text-kinora-800">
              {child.name}&apos;s map is ready
            </p>
            <h1 className="relative mt-1 text-[28px] font-semibold text-ink">
              Meet {result.archetype}.
            </h1>
            <p className="relative mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted">
              {result.archetypeLine}
            </p>
            <div className="relative mt-3 flex flex-wrap justify-center gap-1.5">
              {top.map((item) => (
                <span
                  key={item.trait}
                  className="rounded-full bg-[#f5f1ff] px-3 py-1.5 text-[13px] font-medium text-kinora-800"
                >
                  {item.label} · {item.value}
                </span>
              ))}
            </div>
          </section>

          <section className="kinora-card mt-3 p-4">
            <h2 className="text-[16px] font-semibold text-ink">What stands out</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {result.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-[#f5f1ff] px-3 py-1.5 text-[13px] font-medium text-kinora-800"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>

          <section className="kinora-card mt-3 p-4">
            <h2 className="text-[16px] font-semibold text-ink">One thing to try this week</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {result.activities[0]}
            </p>
          </section>

          <div className="mt-4 grid gap-2">
            <Link
              href={`/app/children/${child.id}`}
              className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white"
            >
              See the full map
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/app/children"
              className="focus-ring flex h-12 items-center justify-center rounded-full border border-[#e4def0] bg-white text-[14px] font-semibold text-ink-soft"
            >
              Back to children
            </Link>
          </div>

        </div>
      </AppPage>
    );
  }

  return (
    <AppPage
      header={
        <AppHeader
          variant="back"
          backHref={`/app/children/${child.id}`}
          title={`${band.name} · ${index + 1}/${band.questions.length}`}
          showMenu={false}
          showProfile={false}
        />
      }
    >
      <div className="flex min-h-full flex-col px-5 pb-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ebe7f2]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#b089fd] to-[#8b5cf6] transition-all duration-500"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <button
            type="button"
            onClick={previous}
            className="focus-ring inline-flex items-center gap-1.5 text-[14px] font-medium text-muted"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
          <span className="text-[13px] text-muted">
            Question {index + 1} of {band.questions.length}
          </span>
        </div>

        <div className="mt-5">
          <h1 className="text-[22px] font-semibold text-ink">
            {question.prompt.replaceAll("{name}", child.name)}
          </h1>
          {question.helper ? (
            <p className="mt-2 text-[14px] text-muted">{question.helper}</p>
          ) : null}
        </div>

        <div className="mt-4 space-y-2">
          {question.options.map((option, optionIndex) => {
            const selected = currentAnswer === optionIndex;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => choose(optionIndex)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.995]",
                  selected
                    ? "border-kinora-400 bg-[#f7f2ff] ring-1 ring-kinora-300"
                    : "border-white bg-white hover:bg-[#fbf9ff]",
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[21px]",
                    selected ? "bg-white" : "bg-[#f7f5fa]",
                  )}
                >
                  {option.emoji}
                </span>
                <span className="flex-1 text-[15px] leading-snug text-ink-soft">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                    selected
                      ? "border-kinora-700 bg-kinora-700 text-white"
                      : "border-[#d5cfdd] bg-white",
                  )}
                >
                  {selected ? <Check className="h-2.5 w-2.5" /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => void next()}
            disabled={currentAnswer === undefined || submitting}
            className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : index === band.questions.length - 1 ? (
              <Sparkles className="h-4 w-4" />
            ) : null}
            {submitting
              ? "Building the map…"
              : index === band.questions.length - 1
                ? "See the map"
                : "Next question"}
          </button>
        </div>
      </div>
    </AppPage>
  );
}
