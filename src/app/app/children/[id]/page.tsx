"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  RefreshCw,
  Sprout,
  Target,
} from "lucide-react";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { useFamily } from "@/components/providers/family-provider";
import { bandForAge, traitLabels } from "@/content/assessments";
import {
  topTraits,
  traitKeysOrdered,
} from "@/lib/engine/child-profile";
import {
  ageFromBirthDate,
  formatFriendlyDate,
  isProfileStale,
} from "@/lib/date";
import { cn } from "@/lib/utils";

export default function ChildPage() {
  const params = useParams<{ id: string }>();
  const { state } = useFamily();
  const [tried, setTried] = useState<string[]>([]);

  if (!state) return null;
  const child = state.children.find((item) => item.id === params.id);

  if (!child) {
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref="/app/children"
            title="Child"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] font-semibold text-ink">
            This child could not be found.
          </p>
          <Link
            href="/app/children"
            className="mt-3 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[12px] font-semibold text-white"
          >
            Back to children
          </Link>
        </div>
      </AppPage>
    );
  }

  const age = ageFromBirthDate(child.birthDate);
  const band = bandForAge(age);
  const profile = child.profile;
  const stale = profile ? isProfileStale(profile.retakeAfter) : false;
  const top = profile ? topTraits(profile.traits, 2) : [];
  const orderedTraits = profile
    ? [...traitKeysOrdered].sort(
        (a, b) => profile.traits[b] - profile.traits[a],
      )
    : [];

  return (
    <AppPage
      header={
        <AppHeader
          variant="back"
          backHref="/app/children"
          title={child.name}
          showMenu={false}
          showProfile={false}
          actions={
            profile ? (
              <Link
                href={`/app/children/${child.id}/discover?retake=1`}
                className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-kinora-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retake
              </Link>
            ) : null
          }
        />
      }
    >
      <div className="px-5 pb-8">
        {!profile ? (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-white bg-white p-6 text-center">
              <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#f5b942]/20 blur-2xl" />
              <div
                className="relative mx-auto grid h-20 w-20 place-items-center rounded-full text-[28px] font-semibold text-white"
                style={{ backgroundColor: child.avatarColor }}
              >
                {child.name.charAt(0)}
              </div>
              <h1 className="relative mt-3 text-[28px] font-semibold text-ink">
                Kinora doesn&apos;t know {child.name} yet.
              </h1>
              <p className="relative mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted">
                {band.questions.length} questions turn what you already notice
                into a strengths map.
              </p>
              <Link
                href={`/app/children/${child.id}/discover`}
                className="relative mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white"
              >
                Start the discovery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>



          </>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-white bg-white p-5">
              <div className="absolute -top-9 -right-6 h-28 w-28 rounded-full bg-[#d6c7fe]/50 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <span
                  className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full text-[24px] font-semibold text-white"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {child.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[26px] font-semibold text-ink">
                      {child.name}
                    </h1>
                    <span className="rounded-full bg-[#f5f2fa] px-2.5 py-1 text-[13px] text-muted">
                      {age} yrs
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] font-medium text-kinora-800">
                    {profile.archetype}
                  </p>
                  <p className="text-[14px] text-muted">{profile.archetypeLine}</p>
                </div>
              </div>
              <p className="relative mt-4 text-[15px] leading-relaxed text-ink-soft">
                {profile.summary}
              </p>
              <div className="relative mt-2.5 flex flex-wrap gap-1.5">
                {top.map((item) => (
                  <span
                    key={item.trait}
                    className="rounded-full bg-[#f5f1ff] px-2.5 py-1 text-[13px] font-medium text-kinora-800"
                  >
                    {item.label}
                  </span>
                ))}
                <span className="rounded-full bg-[#fff4d6] px-2.5 py-1 text-[13px] font-medium text-[#a87106]">
                  {profile.ageBand === "early"
                    ? "Ages 2–5"
                    : profile.ageBand === "middle"
                      ? "Ages 6–9"
                      : "Ages 10–13"}
                </span>
              </div>
              <p className="relative mt-3 text-[13px] text-muted">
                A conversation starter, not a diagnosis.
              </p>
            </section>

            <section className="kinora-card mt-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-ink">Strengths map</h2>
                <span className="text-[14px] text-muted">
                  Observed {formatFriendlyDate(profile.completedAt.slice(0, 10))}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {orderedTraits.map((trait, index) => (
                  <div key={trait}>
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          "text-[14px] font-medium",
                          index < 2 ? "text-ink" : "text-muted",
                        )}
                      >
                        {traitLabels[trait]}
                      </p>
                      <span className="text-[13px] text-[#8e8998]">
                        {profile.traits[trait]}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#f1eef6]">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          index < 2
                            ? "bg-gradient-to-r from-[#b089fd] to-[#8b5cf6]"
                            : "bg-[#d8d1e3]",
                        )}
                        style={{ width: `${profile.traits[trait]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="kinora-card mt-3 p-5">
              <h2 className="text-[16px] font-semibold text-ink">What comes naturally</h2>
              <div className="mt-2.5 space-y-2">
                {profile.strengths.slice(0, 3).map((strength) => {
                  const [title, ...rest] = strength.split(" — ");
                  return (
                    <div key={strength} className="flex gap-2.5">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f1eaff] text-kinora-800">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <p className="text-[14px] leading-relaxed text-ink-soft">
                        <strong className="font-semibold text-ink">{title}</strong>
                        {rest.length ? ` — ${rest.join(" — ")}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="kinora-card mt-3 p-5">
              <div className="flex items-center gap-1.5">
                <Sprout className="h-4 w-4 text-[#5c9b74]" />
                <h2 className="text-[16px] font-semibold text-ink">Stretch zones</h2>
              </div>
              <div className="mt-2.5 space-y-2">
                {profile.growth.map((item) => (
                  <p
                    key={item}
                    className="rounded-2xl bg-[#f7fbf8] px-3 py-3 text-[14px] leading-relaxed text-[#4e6b58]"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>

            <section className="kinora-card mt-3 p-5">
              <h2 className="text-[16px] font-semibold text-ink">Interests and possibilities</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-[#f5f1ff] px-3 py-1.5 text-[13px] font-medium text-kinora-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.careerSeeds.map((career) => (
                  <span
                    key={career}
                    className="rounded-full border border-[#e9e1fb] bg-white px-3 py-1.5 text-[13px] text-ink-soft"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </section>

            <section className="kinora-card mt-3 p-5">
              <div className="flex items-center gap-1.5">
                <Target className="h-4 w-4 text-kinora-700" />
                <h2 className="text-[16px] font-semibold text-ink">Try this week</h2>
              </div>
              <div className="mt-2.5 space-y-2">
                {profile.activities.map((activity) => {
                  const done = tried.includes(activity);
                  return (
                    <button
                      key={activity}
                      type="button"
                      onClick={() =>
                        setTried((current) =>
                          current.includes(activity)
                            ? current.filter((item) => item !== activity)
                            : [...current, activity],
                        )
                      }
                      aria-pressed={done}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition",
                        done
                          ? "border-[#cfe8d8] bg-[#f4fbf6]"
                          : "border-[#f0edf5] bg-[#faf9fc]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                          done
                            ? "border-[#5c9b74] bg-[#5c9b74] text-white"
                            : "border-[#d5cfdd] bg-white",
                        )}
                      >
                        {done ? <Check className="h-2 w-2" /> : null}
                      </span>
                      <span
                        className={cn(
                          "text-[14px] leading-relaxed",
                          done ? "text-[#4e6b58]" : "text-ink-soft",
                        )}
                      >
                        {activity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="kinora-card mt-3 p-5">
              <h2 className="text-[16px] font-semibold text-ink">For you, as the parent</h2>
              <div className="mt-2.5 space-y-2">
                {profile.parentingTips.map((tip, index) => (
                  <div key={tip} className="flex gap-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f5f2fa] text-[12px] font-semibold text-ink-soft">
                      {index + 1}
                    </span>
                    <p className="text-[14px] leading-relaxed text-muted">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="kinora-card mt-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-ink">Discovery history</h2>
                <span className="text-[14px] text-muted">
                  {child.assessments.length} total
                </span>
              </div>
              <div className="mt-2.5 space-y-1.5">
                {child.assessments.map((assessment, index) => (
                  <div
                    key={assessment.id}
                    className="flex items-center gap-3 rounded-2xl bg-[#faf9fc] px-3 py-3"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[12px] font-semibold text-kinora-800">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-[14px] text-ink-soft">
                      {assessment.archetype}
                    </p>
                    <span className="text-[13px] text-[#8e8998]">
                      {formatFriendlyDate(assessment.completedAt.slice(0, 10))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#faf7ff] px-3 py-3">
                <p className="text-[13px] text-[#7b6a91]">
                  {stale
                    ? "This map is ready for a refresh."
                    : `Next refresh after ${formatFriendlyDate(profile.retakeAfter)}`}
                </p>
                <Link
                  href={`/app/children/${child.id}/discover?retake=1`}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-kinora-800"
                >
                  Retake
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </section>

          </>
        )}
      </div>
    </AppPage>
  );
}
