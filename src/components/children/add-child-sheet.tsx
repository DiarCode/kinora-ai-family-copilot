"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppSheet } from "@/components/app/app-sheet";
import { useFamily } from "@/components/providers/family-provider";
import { todayKey } from "@/lib/date";
import { cn } from "@/lib/utils";

const palette = [
  "#F5B942",
  "#7C9CF5",
  "#E88AAE",
  "#8B5CF6",
  "#5CB88A",
  "#EF8A62",
];

export function AddChildSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { addChild } = useFamily();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [color, setColor] = useState(palette[0]);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (name.trim().length < 1) {
      toast.error("Add a first name.");
      return;
    }
    if (!birthDate) {
      toast.error("Add a birth date so Kinora can choose the right discovery.");
      return;
    }
    if (birthDate > todayKey()) {
      toast.error("A birth date cannot be in the future.");
      return;
    }
    setSaving(true);
    try {
      const child = await addChild({
        name: name.trim(),
        birthDate,
        avatarColor: color,
      });
      toast.success(`${child.name} added to the family.`);
      setName("");
      setBirthDate("");
      setColor(palette[0]);
      onOpenChange(false);
      router.push(`/app/children/${child.id}`);
    } catch {
      // The provider surfaces the error.
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add a child"
      description="A first name and a birth date. That is all Kinora needs."
    >
      <label className="text-[15px] font-semibold text-ink" htmlFor="child-name">
        First name
      </label>
      <input
        id="child-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Sophie"
        maxLength={40}
        className="focus-ring mt-2 h-12 w-full rounded-2xl border border-[#e7e2f0] bg-white px-4 text-[15px] text-ink placeholder:text-[#a09bab]"
      />

      <label
        className="mt-4 block text-[15px] font-semibold text-ink"
        htmlFor="child-birth"
      >
        Birth date
      </label>
      <input
        id="child-birth"
        type="date"
        value={birthDate}
        max={todayKey()}
        onChange={(event) => setBirthDate(event.target.value)}
        className="focus-ring mt-2 h-12 w-full rounded-2xl border border-[#e7e2f0] bg-white px-4 text-[15px] text-ink"
      />

      <p className="mt-5 text-[15px] font-semibold text-ink">Avatar color</p>
      <div className="mt-2 flex items-center gap-2.5">
        {palette.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setColor(item)}
            aria-label={`Choose ${item}`}
            aria-pressed={color === item}
            className={cn(
              "focus-ring grid h-9 w-9 place-items-center rounded-full text-white transition",
              color === item && "ring-2 ring-offset-2 ring-ink/20",
            )}
            style={{ backgroundColor: item }}
          >
            {color === item ? <Check className="h-3.5 w-3.5" /> : null}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={() => void submit()}
        className="focus-ring mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {saving ? "Adding…" : "Add to the family"}
      </button>
    </AppSheet>
  );
}
