import { Cloud, CloudRain, Sun } from "lucide-react";
import type { MoodValue } from "@/lib/types";
import { cn } from "@/lib/utils";

const config: Record<
  MoodValue,
  {
    Icon: typeof Sun;
    label: string;
    text: string;
    bg: string;
    ring: string;
    iconClass: string;
  }
> = {
  sunny: {
    Icon: Sun,
    label: "Sunny",
    text: "text-[#9a6a08]",
    bg: "bg-[#fff4d6]",
    ring: "ring-[#f5b942]/30",
    iconClass: "text-[#e6a21b]",
  },
  cloudy: {
    Icon: Cloud,
    label: "Cloudy",
    text: "text-[#5e5a68]",
    bg: "bg-[#eeecf2]",
    ring: "ring-[#a8a3b5]/30",
    iconClass: "text-[#8d8898]",
  },
  rainy: {
    Icon: CloudRain,
    label: "Rainy",
    text: "text-[#3d5da8]",
    bg: "bg-[#e8eeff]",
    ring: "ring-[#7c9cf5]/30",
    iconClass: "text-[#6d8ee8]",
  },
};

export function WeatherIcon({
  value,
  size = 18,
  withBackground = false,
  className,
}: {
  value: MoodValue;
  size?: number;
  withBackground?: boolean;
  className?: string;
}) {
  const item = config[value];
  const Icon = item.Icon;
  if (!withBackground) {
    return (
      <Icon
        className={cn(item.iconClass, className)}
        width={size}
        height={size}
        strokeWidth={1.9}
        aria-hidden
      />
    );
  }
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full ring-1",
        item.bg,
        item.ring,
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Icon
        className={item.iconClass}
        width={size * 0.55}
        height={size * 0.55}
        strokeWidth={2}
      />
    </span>
  );
}

export function moodMeta(value: MoodValue) {
  return config[value];
}
