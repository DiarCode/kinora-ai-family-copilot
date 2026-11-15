import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { KinoraLogo } from "@/components/brand/kinora-logo";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import {
  dayInLife,
  faqs,
  problemStats,
  sources,
  useCases,
  type UseCase,
} from "@/content/landing";

export const metadata: Metadata = {
  title: { absolute: "Kinora: the family copilot for parents" },
  description:
    "Kinora gives both parents one calm place to check in, talk through hard moments, and leave with one small next step. Five minutes at a time.",
};

const container = "mx-auto max-w-[1200px] px-6 lg:px-8";
const sectionHeading =
  "text-[32px] font-semibold leading-normal text-neutral-950 sm:text-[42px] lg:text-[50px]";
const bodyCopy =
  "text-[16px] leading-normal text-neutral-800 sm:text-[17px]";
const primaryButton =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-kinora-800 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-kinora-900";
const secondaryButton =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 text-[15px] font-semibold text-neutral-950 transition-colors hover:border-neutral-400 hover:bg-neutral-50";

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className={`${container} flex h-[72px] items-center justify-between`}>
        <Link href="/" className="focus-ring rounded-lg" aria-label="Kinora home">
          <KinoraLogo />
        </Link>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
          {[
            ["Product", "#product"],
            ["Sessions", "#sessions"],
            ["Children", "#children"],
            ["Pricing", "#pricing"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[15px] text-neutral-600 transition-colors hover:text-neutral-950"
            >
              {label}
            </a>
          ))}
        </nav>
        <Link
          href="/app"
          className={`${primaryButton} h-11 px-5 text-[15px]`}
        >
          Open the demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] font-medium text-kinora-800 ">{children}</p>
  );
}

function UseCaseCard({ item }: { item: UseCase }) {
  return (
    <Link
      href={item.href}
      className="group overflow-hidden rounded-[20px] border border-neutral-200 bg-white transition-colors hover:border-neutral-300"
    >
      <div className="aspect-[4/3] overflow-hidden border-b border-neutral-200 bg-neutral-100">
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={780}
          height={585}
          sizes="(min-width: 1024px) 370px, (min-width: 768px) 45vw, 100vw"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex items-center justify-between gap-4 p-6">
        <h3 className="text-[19px] font-semibold leading-normal text-neutral-950">
          {item.title}
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-kinora-800" />
      </div>
    </Link>
  );
}

function SessionMock() {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-5 text-neutral-950 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <KinoraOrb size={40} animated={false} glow={false} label="Kinora" />
          <div>
            <p className="text-[15px] font-semibold">
              Kinora session
            </p>
            <p className="mt-0.5 text-[14px] text-neutral-600">
              Tonight · 8:30 PM · voice
            </p>
          </div>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[13.5px] font-semibold text-neutral-800">
          12:04
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex gap-2">
          <KinoraOrb size={24} animated={false} glow={false} label="" />
          <div className="rounded-[16px] rounded-tl-[6px] bg-neutral-100 px-3.5 py-2.5 text-[15px] leading-normal text-neutral-800">
            Michael, what did you need in that moment that you didn&apos;t get?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[84%] rounded-[16px] rounded-tr-[6px] bg-neutral-200 px-3.5 py-2.5 text-[15px] leading-normal text-neutral-800">
            I wanted to help without being told I was doing it wrong.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[84%] rounded-[16px] rounded-tr-[6px] bg-neutral-200 px-3.5 py-2.5 text-[15px] leading-normal text-neutral-800">
            I wanted to not be the default parent for one night.
          </div>
        </div>
        <div className="flex gap-2">
          <KinoraOrb size={24} animated={false} glow={false} label="" />
          <div className="rounded-[16px] rounded-tl-[6px] bg-neutral-100 px-3.5 py-2.5 text-[15px] leading-normal text-neutral-800">
            I hear a shared need: rest, and shared ownership of the noticing.
            Here is one small agreement that fits you both.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[18px] border border-kinora-200 bg-kinora-50 p-4">
        <p className="text-[15px] font-medium text-kinora-800">
          Proposed agreement
        </p>
        <p className="mt-1.5 text-[15px] leading-normal text-neutral-800">
          By 5pm each day, the parent who owns bedtime confirms the plan in the
          family chat. The other parent is off duty unless asked.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-full bg-neutral-100 px-4 py-2">
        <span className="text-[14px] text-neutral-600">Speaking as Michael</span>
        <span className="flex items-center gap-1.5 text-[14px] font-semibold text-kinora-800">
          <AudioLines className="h-3.5 w-3.5" />
          Kinora is listening
        </span>
      </div>
    </div>
  );
}

function ProfileMock() {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-7 text-neutral-950 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-kinora-800 text-[20px] font-semibold text-white">
          S
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-semibold">
            Sophie, 6
          </p>
          <p className="text-[15px] text-kinora-800">The Storyteller</p>
          <p className="mt-1 text-[14px] leading-normal text-neutral-800">
            Turns ideas into experiences other people want to join.
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[13.5px] text-neutral-600">
          Discovery
        </span>
      </div>

      <div className="mt-6 space-y-3.5">
        {[
          { label: "Creativity", value: 88 },
          { label: "Social connection", value: 79 },
          { label: "Analytical thinking", value: 62 },
          { label: "Focus", value: 48 },
        ].map((trait) => (
          <div key={trait.label}>
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-neutral-800">{trait.label}</p>
              <span className="text-[14px] text-neutral-500">{trait.value}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-kinora-800"
                style={{ width: `${trait.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {["Storytelling", "Drawing", "Pretend worlds", "Group games"].map(
          (interest) => (
            <span
              key={interest}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[14px] text-neutral-800"
            >
              {interest}
            </span>
          ),
        )}
      </div>

      <div className="mt-5 rounded-[16px] bg-neutral-50 p-4">
        <p className="text-[13px] font-semibold text-neutral-500 ">
          Try this week
        </p>
        <p className="mt-1.5 text-[15px] leading-normal text-neutral-800">
          Make a ten-minute comic together where Sophie invents the hero.
        </p>
      </div>
      <p className="mt-4 text-[13.5px] text-neutral-500">
        Illustrative profile. Not a real child. Not a diagnosis.
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <Nav />

      <main className="pt-[72px]">
        <section className="pt-20 pb-24 sm:pt-28 lg:pt-32 lg:pb-36">
          <div className={container}>
            <div className="mx-auto max-w-[860px] text-center">
              <h1
                className="text-balance text-[38px] font-semibold text-neutral-950 sm:text-[54px] lg:text-[68px]"
                style={{ lineHeight: 0.95, letterSpacing: "-0.045em" }}
              >
                Parenting is a team sport.
                <span className="block text-kinora-800">
                  Kinora keeps you on the same page.
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-[620px] text-[17px] leading-normal text-neutral-700 sm:text-[19px]">
                One private place for both parents to check in, talk through the
                hard moments, and leave with one small next step. Built for real
                weeknights, not perfect ones.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/app" className={primaryButton}>
                  Open the demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#product" className={secondaryButton}>
                  See how it works
                  <ChevronDown className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto mt-16 max-w-[1120px] sm:mt-20">
              <div className="overflow-hidden rounded-[28px] bg-white p-2 ring-1 ring-neutral-200 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.35)]">
                <Image
                  src="/images/kinora-kitchen-conversation.webp"
                  alt="Two parents sitting at a kitchen island, talking through a bedtime plan with Kinora between them"
                  width={1774}
                  height={887}
                  priority
                  sizes="(min-width: 1200px) 1120px, 100vw"
                  className="h-auto w-full rounded-[20px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${container} scroll-mt-20 py-24 lg:py-36`}
          id="problem"
        >
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
            <div>
              <SectionLabel>The problem</SectionLabel>
              <h2 className={`${sectionHeading} mt-5`}>
                The hardest job in the house{" "}
                <span className="whitespace-nowrap text-kinora-800">has no training.</span>
              </h2>
            </div>
            <div className="max-w-[560px] space-y-5 lg:pt-12">
              <p className={bodyCopy}>
                62% of parents say the job is harder than they expected. About
                two in three couples see relationship satisfaction drop after a
                first baby, and most wait years before asking for help.
              </p>
              <p className={bodyCopy}>
                The problem is rarely love or information. It is the absence of
                practice, a shared language, and a place to repair.
              </p>
            </div>
          </div>

          <div className="mt-20 grid gap-x-10 gap-y-12 border-t border-neutral-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {problemStats.map((stat) => (
              <div key={stat.value}>
                <p className="text-[40px] font-semibold leading-none text-neutral-950 sm:text-[44px]">
                  {stat.value}
                </p>
                <p className="mt-4 text-[15px] leading-normal text-neutral-800">
                  {stat.label}
                </p>
                {stat.detail ? (
                  <p className="mt-1.5 text-[14px] text-neutral-600">
                    {stat.detail}
                  </p>
                ) : null}
                <p className="mt-4 text-[14px] text-neutral-500">
                  {stat.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="product"
          className="scroll-mt-20 border-y border-neutral-200 bg-neutral-100 py-24 lg:py-36"
        >
          <div className={container}>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-[700px]">
                <SectionLabel>The product</SectionLabel>
                <h2 className={`${sectionHeading} mt-5`}>
                  Six small tools.{" "}
                  <span className="whitespace-nowrap text-kinora-800">One calmer team.</span>
                </h2>
                <p className={`${bodyCopy} mt-6 max-w-[620px]`}>
                  One shared loop: notice how the team is doing, choose one
                  small next step, practice it, and keep what worked. No
                  leaderboards. No parent scores. No feed.
                </p>
                <p className="mt-4 text-[13px] text-neutral-500">
                  Real screens from the demo workspace.
                </p>
              </div>
              <Link
                href="/app"
                className="focus-ring inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-kinora-800 transition-colors hover:text-kinora-900"
              >
                Open the demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((item) => (
                <UseCaseCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className={`${container} py-24 lg:py-36`}>
          <div className="max-w-[760px]">
            <SectionLabel>A day with Kinora</SectionLabel>
            <h2 className={`${sectionHeading} mt-5`}>
              <span className="block">Ten seconds at breakfast.</span>
              <span className="block text-kinora-800">
                Twenty minutes after bedtime.
              </span>
            </h2>
            <p className={`${bodyCopy} mt-6 max-w-[620px]`}>
              Kinora fits inside a real Tuesday: a check-in over coffee, one
              useful nudge, a conversation after the kids are down.
            </p>
          </div>

          <div className="relative mt-16 lg:mt-20">
            <div className="absolute top-[5px] left-0 right-[calc(20%-1.2rem)] hidden border-t border-neutral-200 lg:block" />
            <div className="absolute top-2 bottom-2 left-[4.5px] w-px bg-neutral-200 lg:hidden" />
            <ol className="relative grid gap-12 lg:grid-cols-5 lg:gap-6">
              {dayInLife.map((step) => (
                <li
                  key={step.time}
                  className="relative pl-7 lg:pl-0 lg:pt-8"
                >
                  <span className="absolute top-1 left-0 h-2.5 w-2.5 rounded-full bg-kinora-800 ring-4 ring-white lg:top-0" />
                  <p className="text-[14px] font-semibold text-kinora-800">
                    {step.time}
                  </p>
                  <h3 className="mt-3 text-[19px] font-semibold leading-snug text-neutral-950">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-normal text-neutral-800">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="sessions"
          className="scroll-mt-20 border-y border-neutral-200 bg-neutral-100 py-24 lg:py-36"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24 lg:px-8">
            <div>
              <SectionLabel>Sessions</SectionLabel>
              <h2 className={`${sectionHeading} mt-5`}>
                A calm structure,{" "}
                <span className="whitespace-nowrap text-kinora-800">not a referee.</span>
              </h2>
              <p className="mt-6 max-w-[520px] text-[16px] leading-normal text-neutral-800 sm:text-[17px]">
                Start with the problem written down, or begin now. Kinora leads
                a structured conversation, knows which parent is speaking,
                reflects both sides, and ends with one agreement you can keep.
              </p>
              <ul className="mt-9 space-y-4">
                {[
                  "Both partners get equal airtime. No verdicts, no side-taking.",
                  "A 20-minute pause is built in, because flooding is biology.",
                  "A written summary, one agreement, and a course to go deeper.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-kinora-800">
                      <Check className="h-3 w-3" strokeWidth={2.4} />
                    </span>
                    <p className="text-[15px] leading-normal text-neutral-800">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex items-start gap-3 rounded-[18px] border border-neutral-200 bg-white p-5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-kinora-800" />
                <p className="text-[14px] leading-normal text-neutral-600">
                  Kinora is coaching, not therapy or mediation. Language about
                  crisis or abuse stops the session and surfaces real resources.
                </p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[520px]">
              <SessionMock />
            </div>
          </div>
        </section>

        <section
          id="children"
          className="scroll-mt-20 py-24 lg:py-36"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:px-8">
            <div>
              <SectionLabel>Children</SectionLabel>
              <h2 className={`${sectionHeading} mt-5`}>
                See the child{" "}
                <span className="whitespace-nowrap text-kinora-800">in front of you.</span>
              </h2>
              <p className={`${bodyCopy} mt-6 max-w-[540px]`}>
                Age-banded discovery turns what you already notice into a
                strengths map: what comes naturally, where to make room, and
                three things to try this week. Not a label. Not a score. A
                better conversation.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Little Explorer · 2–5",
                  "Discovery Quest · 6–9",
                  "Potential Map · 10–13",
                ].map((band) => (
                  <span
                    key={band}
                    className="rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-[15px] text-neutral-800"
                  >
                    {band}
                  </span>
                ))}
              </div>
              <ul className="mt-9 space-y-3.5">
                {[
                  "Picture-first questions for younger children, richer scenarios for older kids.",
                  "Explicitly a conversation starter, never a clinical diagnosis.",
                  "Retake every 90 days, because interests and skills move.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neutral-100 text-kinora-800">
                      <Check className="h-3 w-3" strokeWidth={2.4} />
                    </span>
                    <p className="text-[15px] leading-normal text-neutral-800">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
              <Link href="/app/children" className={`${secondaryButton} mt-9`}>
                Explore the children module
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mx-auto w-full max-w-[400px]">
              <ProfileMock />
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="scroll-mt-20 border-y border-neutral-200 bg-neutral-100 py-24 lg:py-36"
        >
          <div className={container}>
            <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-24">
              <div>
                <SectionLabel>Pricing</SectionLabel>
                <h2 className={`${sectionHeading} mt-5`}>
                  One plan for{" "}
                  <span className="whitespace-nowrap text-kinora-800">both parents.</span>
                </h2>
                <p className={`${bodyCopy} mt-6 max-w-[480px]`}>
                  A Family License is $149 a year, about $12 a month. That is
                  less than one couples-therapy session, and it covers every
                  course, session, and child profile. Cancel anytime.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {[
                    "Both partners included",
                    "Every course and session",
                    "No parent scores",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-[15px] text-neutral-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-neutral-200 bg-white p-8 text-neutral-950 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.3)] sm:p-10">
                <p className="text-[13.5px] font-semibold text-kinora-800">
                  Family license
                </p>
                <p className="mt-4 text-[56px] font-semibold leading-none sm:text-[64px]">
                  $149
                  <span className="text-[16px] font-normal tracking-normal text-neutral-500">
                    {" "}
                    / year
                  </span>
                </p>
                <p className="mt-4 text-[15px] text-neutral-600">
                  Both partners. Every module. Cancel anytime.
                </p>

                <div className="mt-8 space-y-3 border-t border-neutral-200 pt-7">
                  {[
                    "Daily mood check-ins and a private timeline",
                    "Next best actions that open the right page",
                    "Shared voice or text sessions with summaries",
                    "Age-banded children's strengths maps",
                    "Six evidence-grounded courses with quizzes",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neutral-100 text-kinora-800">
                        <Check className="h-3 w-3" strokeWidth={2.4} />
                      </span>
                      <p className="text-[15px] text-neutral-800">{feature}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/app"
                  className="focus-ring mt-8 flex h-12 items-center justify-center gap-2 rounded-full bg-kinora-800 text-[15px] font-semibold text-white transition-colors hover:bg-kinora-900"
                >
                  Open the demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-4 text-center text-[14px] text-neutral-500">
                  The demo does not charge.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-24 lg:px-8 lg:py-36">
          <div>
            <SectionLabel>Questions</SectionLabel>
            <h2 className={`${sectionHeading} mt-5`}>
              Questions, <span className="text-kinora-800">answered.</span>
            </h2>
          </div>
          <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-neutral-300 bg-white text-[18px] text-neutral-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[760px] pr-10 text-[15.5px] leading-normal text-neutral-800">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className={`${container} pb-24 lg:pb-36`}>
          <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-neutral-100 px-6 py-16 text-center sm:px-10 sm:py-20">
            <div className="mx-auto flex justify-center">
              <KinoraOrb size={88} animated label="Kinora" />
            </div>
            <h2 className="mt-6 text-[32px] font-semibold leading-normal text-neutral-950 sm:text-[42px]">
              Start with{" "}
              <span className="whitespace-nowrap text-kinora-800">tonight&apos;s check-in.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[480px] text-[16px] leading-normal text-neutral-800 sm:text-[17px]">
              Open the demo as Michael. Lucy is already there. Set a mood, see
              the next best action, or start a session together.
            </p>
            <Link href="/app" className={`${primaryButton} mt-9`}>
              Open the demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-100">
        <div className={`${container} py-16 lg:py-20`}>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1.2fr]">
            <div>
              <KinoraLogo size="md" />
              <p className="mt-5 max-w-[280px] text-[15px] leading-normal text-neutral-800">
                A private space for both parents to check in, repair, and
                practice the parts of parenting nobody trains you for.
              </p>
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-neutral-600 ">
                Product
              </p>
              <div className="mt-5 flex flex-col gap-3 text-[15px] text-neutral-800">
                <Link href="/app" className="transition-colors hover:text-neutral-950">
                  Family home
                </Link>
                <Link
                  href="/app/assistant"
                  className="transition-colors hover:text-neutral-950"
                >
                  Kinora assistant
                </Link>
                <Link
                  href="/app/sessions"
                  className="transition-colors hover:text-neutral-950"
                >
                  Sessions
                </Link>
                <Link
                  href="/app/children"
                  className="transition-colors hover:text-neutral-950"
                >
                  Children
                </Link>
                <Link
                  href="/app/courses"
                  className="transition-colors hover:text-neutral-950"
                >
                  Courses
                </Link>
              </div>
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-neutral-600 ">
                Company
              </p>
              <div className="mt-5 flex flex-col gap-3 text-[15px] text-neutral-800">
                <a
                  href="#pricing"
                  className="transition-colors hover:text-neutral-950"
                >
                  Pricing
                </a>
                <a
                  href="#safety"
                  className="transition-colors hover:text-neutral-950"
                >
                  Safety
                </a>
                <Link href="/app" className="transition-colors hover:text-neutral-950">
                  Demo workspace
                </Link>
              </div>
            </div>
            <div id="safety" className="scroll-mt-20">
              <p className="text-[13.5px] font-semibold text-neutral-600 ">
                Safety
              </p>
              <p className="mt-5 text-[15px] leading-normal text-neutral-800">
                Kinora is coaching and skills education, not therapy, diagnosis,
                or crisis care. If you are in danger, call 911. Crisis support:{" "}
                <a href="tel:988" className="font-semibold text-kinora-800">
                  988
                </a>
                . Domestic violence support:{" "}
                <a
                  href="tel:18007997233"
                  className="font-semibold text-kinora-800"
                >
                  1-800-799-7233
                </a>
                .
              </p>
            </div>
          </div>

          <details className="mt-14 rounded-[18px] border border-neutral-200 bg-white p-5">
            <summary className="cursor-pointer text-[14px] font-semibold text-neutral-800">
              Research sources ({sources.length})
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] leading-normal text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-950"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </details>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-7 text-[14px] text-neutral-600">
            <p>© 2026 Kinora. A demo built for the parent team.</p>
            <p>No leaderboards. No parent scores. No guilt-trip streaks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
