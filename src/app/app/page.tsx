"use client";

import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { useFamily } from "@/components/providers/family-provider";
import { MoodCheckIn } from "@/components/app/mood-check-in";
import { QuickActions } from "@/components/app/home/quick-actions";
import { NextActions } from "@/components/app/home/next-actions";
import { firstName } from "@/lib/utils";

export default function AppHomePage() {
  const { state } = useFamily();

  if (!state) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-kinora-300 border-t-kinora-700" />
      </div>
    );
  }

  const user = state.family.members[0];

  return (
    <AppPage header={<AppHeader variant="home" />}>
      <div className="px-5 pb-8">
        <section className="pt-2 pb-5">
          <h1 className="text-[32px] font-semibold text-ink">
            Hello, {firstName(user.name)}.
          </h1>
          <p className="mt-2 max-w-[320px] text-[16px] leading-relaxed text-muted">
            One clear next step for your family today.
          </p>
        </section>

        <MoodCheckIn />
        <QuickActions />
        <NextActions />
      </div>
    </AppPage>
  );
}
