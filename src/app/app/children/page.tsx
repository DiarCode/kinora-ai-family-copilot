"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Plus,
  UserRound,
} from "lucide-react";
import { AppHeader, HeaderIconButton } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { AddChildSheet } from "@/components/children/add-child-sheet";
import { useFamily } from "@/components/providers/family-provider";
import { topTraits } from "@/lib/engine/child-profile";
import { ageFromBirthDate, isProfileStale } from "@/lib/date";

export default function ChildrenPage() {
  const { state } = useFamily();
  const [addOpen, setAddOpen] = useState(false);

  if (!state) return null;

  return (
    <AppPage
      header={
        <AppHeader
          variant="plain"
          title="Children"
          showProfile={false}
          actions={
            <HeaderIconButton
              label="Add a child"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </HeaderIconButton>
          }
        />
      }
    >
      <div className="px-5 pb-8">
        <section className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#fff8e8] via-[#fbf9ff] to-white p-4">
          <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-[#f5b942]/20 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <KinoraOrb size={76} animated label="Kinora child discovery" />
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-[26px] font-semibold text-ink">
                A clearer view of your child.
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Turn what you already notice into a strengths map.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink">Your children</h2>
            <span className="text-[13px] text-muted">
              {state.children.length}{" "}
              {state.children.length === 1 ? "profile" : "profiles"}
            </span>
          </div>

          {state.children.length ? (
            <div className="mt-2 space-y-2">
              {state.children.map((child) => {
                const age = ageFromBirthDate(child.birthDate);
                const profile = child.profile;
                const stale = profile
                  ? isProfileStale(profile.retakeAfter)
                  : false;
                const top = profile ? topTraits(profile.traits, 2) : [];
                return (
                  <Link
                    key={child.id}
                    href={`/app/children/${child.id}`}
                    className="group block rounded-3xl border border-white bg-white p-4 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[20px] font-semibold text-white"
                        style={{ backgroundColor: child.avatarColor }}
                      >
                        {child.name.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[17px] font-semibold text-ink">
                            {child.name}
                          </p>
                          <span className="rounded-full bg-[#f5f2fa] px-2 py-1 text-[13px] text-muted">
                            {age} yrs
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[14px] text-muted">
                          {profile
                            ? profile.archetype
                            : "Kinora doesn't know them yet"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#c3bdcb] transition group-hover:translate-x-0.5" />
                    </div>

                    {profile ? (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {top.map((item) => (
                          <span
                            key={item.trait}
                            className="rounded-full bg-[#f5f1ff] px-2.5 py-1 text-[13px] font-medium text-kinora-800"
                          >
                            {item.label}
                          </span>
                        ))}
                        {stale ? (
                          <span className="rounded-full bg-[#fff4d6] px-2.5 py-1 text-[13px] font-medium text-[#a87106]">
                            Refresh suggested
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-2.5 flex items-center justify-between rounded-[12px] bg-[#fbf8ff] px-2.5 py-2">
                        <p className="text-[13px] text-[#7b6a91]">
                          Start a three-minute discovery
                        </p>
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-kinora-800">
                          Start
                          <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-3xl border border-dashed border-[#ded7ea] bg-white/60 p-6 text-center">
              <UserRound className="mx-auto h-7 w-7 text-[#b7b0c3]" />
              <p className="mt-3 text-[16px] font-semibold text-ink">
                Add your first child
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                A first name, a birth date, and three minutes of what you
                already notice.
              </p>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="focus-ring mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Add a child
              </button>
            </div>
          )}
        </section>



      </div>

      <AddChildSheet open={addOpen} onOpenChange={setAddOpen} />
    </AppPage>
  );
}
