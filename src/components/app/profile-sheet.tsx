"use client";

import { AppSheet } from "@/components/app/app-sheet";
import { useFamily } from "@/components/providers/family-provider";
import { WeatherIcon, moodMeta } from "@/components/ui/weather-icon";
import { todayKey } from "@/lib/date";
import { firstName } from "@/lib/utils";

export function ProfileSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state } = useFamily();
  if (!state) return null;
  const today = todayKey();
  const todayMoods = state.moods.filter((mood) => mood.date === today);

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Your family"
      description="Your family, plan, and preferences."
    >
      <div className="space-y-3">
        {state.family.members.map((member) => {
          const mood = todayMoods.find((entry) => entry.memberId === member.id);
          const meta = mood ? moodMeta(mood.value) : null;
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white px-3.5 py-3"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-full text-[16px] font-semibold text-white"
                style={{ backgroundColor: member.avatarColor }}
              >
                {firstName(member.name).charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[20px] font-semibold ">
                  {member.name}
                </p>
                <p className="text-[15px] text-muted capitalize">
                  {member.role === "husband" ? "Partner · Dad" : "Partner · Mom"}
                </p>
              </div>
              {mood ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[15px] font-medium ${meta?.bg} ${meta?.text}`}
                >
                  <WeatherIcon value={mood.value} size={13} />
                  {meta?.label}
                </span>
              ) : (
                <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[15px] text-muted">
                  No check-in
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-[#e9e1fb] bg-gradient-to-br from-[#f6f0ff] to-[#fbf9ff] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13.5px] font-semibold text-kinora-800/70">
              Plan
            </p>
            <p className="mt-1 text-[20px] font-semibold text-ink">
              {state.family.plan === "plus" ? "Kinora Plus" : "Family license"}
            </p>
            <p className="mt-0.5 text-[15px] text-muted">
              Both partners · {state.children.length} child
              {state.children.length === 1 ? "" : "ren"}
            </p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[13.5px] font-semibold text-kinora-800 shadow-sm">
            Active
          </span>
        </div>
      </div>

    </AppSheet>
  );
}
