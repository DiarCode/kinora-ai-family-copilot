import { KinoraOrb } from "@/components/brand/kinora-orb";
import { cn } from "@/lib/utils";

export function KinoraMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <KinoraOrb size={size} animated={false} glow={false} label="" />
    </span>
  );
}

export function KinoraLogo({
  className,
  size = "md",
  mark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  mark?: boolean;
}) {
  const text =
    size === "lg" ? "text-[26px]" : size === "sm" ? "text-[17px]" : "text-[21px]";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark ? <KinoraMark size={size === "lg" ? 34 : size === "sm" ? 22 : 28} /> : null}
      <span
        className={cn(
          "font-semibold tracking-[-0.055em] text-ink lowercase",
          text,
        )}
      >
        kinora
      </span>
    </span>
  );
}
