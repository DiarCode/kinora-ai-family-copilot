"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AppSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  side?: "bottom" | "left";
  children: ReactNode;
  className?: string;
  hideClose?: boolean;
  hideHeader?: boolean;
};

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AppSheet({
  open,
  onOpenChange,
  title,
  description,
  side = "bottom",
  children,
  className,
  hideClose = false,
  hideHeader = false,
}: AppSheetProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(focusableSelector);
      first?.focus();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 animate-fade bg-[#241b36]/35 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Kinora"}
        className={cn(
          "absolute z-10 overflow-y-auto overscroll-contain border border-white/60 bg-[#faf8ff] text-ink no-scrollbar",
          side === "bottom"
            ? "inset-x-0 bottom-0 max-h-[90%] animate-[reveal-up_0.36s_cubic-bezier(0.22,1,0.36,1)] rounded-t-[30px] px-5 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-[0_-24px_70px_-20px_rgba(50,30,100,0.35)]"
            : "inset-y-0 left-0 w-[86%] animate-slide-left rounded-r-[30px] px-5 pt-5 pb-8 shadow-[24px_0_70px_-30px_rgba(50,30,100,0.45)]",
          className,
        )}
      >
        {side === "bottom" ? (
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/10" />
        ) : null}

        {!hideHeader ? (
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title ? (
                <h2 className="text-[24px] font-semibold ">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            {!hideClose ? (
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/[0.055] text-ink-soft transition hover:bg-black/[0.09]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            ) : null}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
