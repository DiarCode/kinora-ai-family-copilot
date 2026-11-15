"use client";

import { useMemo, useState } from "react";
import { Cloud, CloudRain, Loader2, Sun } from "lucide-react";
import { toast } from "sonner";
import { useFamily } from "@/components/providers/family-provider";
import { WeatherIcon, moodMeta } from "@/components/ui/weather-icon";
import { formatDayShort, lastNDays, todayKey } from "@/lib/date";
import type { MoodValue, Parent } from "@/lib/types";
import { cn, firstName } from "@/lib/utils";

const moodOptions: {
  value: MoodValue;
  label: string;
  Icon: typeof Sun;
}[] = [
  { value: "sunny", label: "Sunny", Icon: Sun },
  { value: "cloudy", label: "Cloudy", Icon: Cloud },
  { value: "rainy", label: "Rainy", Icon: CloudRain },
];

function MemberAvatar({ member, size = 36 }: { member: Parent; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-[13px] font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: member.avatarColor,
      }}
      aria-hidden
    >
      {firstName(member.name).charAt(0)}
    </span>
  );
}

export function MoodCheckIn() {
  const { state, setMood } = useFamily();
  const [pending, setPending] = useState<string | null>(null);
  const today = todayKey();

  const days = useMemo(() => lastNDays(7), []);

  if (!state) return null;

  const moodsFor = (memberId: string, date: string) =>
    state.moods.find(
      (mood) => mood.memberId === memberId && mood.date === date,
    );

  const handleSelect = async (member: Parent, value: MoodValue) => {
    setPending(`${member.id}-${value}`);
    try {
      await setMood(member.id, value);
      const meta = moodMeta(value);
      toast.success(
        `${firstName(member.name)}'s weather is ${meta.label.toLowerCase()}.`,
        { duration: 1800 },
      );
    } catch {
      // The provider already shows the error toast.
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-5">
      <h2 className="text-[24px] font-semibold text-ink">How are you both?</h2>

      <div className="mt-4 space-y-3">
        {state.family.members.map((member) => {
          const mood = moodsFor(member.id, today);
          return (
            <div key={member.id} className="rounded-2xl bg-[#f8f7fa] p-4">
              <div className="flex items-center gap-3">
                <MemberAvatar member={member} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold text-ink">
                    {firstName(member.name)}
                  </p>
                  <p className="text-[14px] text-muted">
                    {mood ? moodMeta(mood.value).label : "Not checked in"}
                  </p>
                </div>
              </div>
              <div
                className="mt-3 grid grid-cols-3 gap-2"
                role="group"
                aria-label={`${firstName(member.name)}'s mood today`}
              >
                {moodOptions.map((option) => {
                  const active = mood?.value === option.value;
                  const meta = moodMeta(option.value);
                  const isPending = pending === `${member.id}-${option.value}`;
                  const Icon = option.Icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => void handleSelect(member, option.value)}
                      aria-pressed={active}
                      aria-label={`${firstName(member.name)} feels ${option.label.toLowerCase()} today`}
                      className={cn(
                        "focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-full border px-2 text-[14px] font-medium transition active:scale-[0.97]",
                        active
                          ? `${meta.bg} ${meta.text} border-transparent`
                          : "border-transparent bg-white text-[#8b8794] hover:bg-white/70",
                      )}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      )}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[#eeebf4] pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium text-ink-soft">
            The last seven days
          </p>
          <div className="flex items-center gap-3">
            {state.family.members.map((member) => (
              <span
                key={member.id}
                className="inline-flex items-center gap-1.5 text-[13px] text-muted"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: member.avatarColor }}
                />
                {firstName(member.name)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[20px_repeat(7,minmax(0,1fr))] items-center gap-1.5">
          <span />
          {days.map((day) => (
            <span
              key={`label-${day}`}
              className={cn(
                "text-center text-[12px] font-medium",
                day === today ? "text-ink" : "text-[#aaa6b4]",
              )}
            >
              {formatDayShort(day).slice(0, 1)}
            </span>
          ))}
          {state.family.members.map((member) => (
            <div key={member.id} className="contents">
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: member.avatarColor }}
                title={firstName(member.name)}
              >
                {firstName(member.name).charAt(0)}
              </span>
              {days.map((day) => {
                const mood = moodsFor(member.id, day);
                return (
                  <span
                    key={`${member.id}-${day}`}
                    title={`${firstName(member.name)}: ${
                      mood ? moodMeta(mood.value).label : "no check-in"
                    }`}
                    className={cn(
                      "mx-auto grid h-8 w-full max-w-[40px] place-items-center rounded-lg",
                      day === today ? "bg-[#f7f3ff]" : "bg-transparent",
                    )}
                  >
                    {mood ? (
                      <WeatherIcon value={mood.value} size={16} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7d3dd]" />
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
