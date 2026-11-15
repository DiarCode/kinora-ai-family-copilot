import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppPage({
  header,
  children,
  footer,
  className,
  contentClassName,
}: {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {header}
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain no-scrollbar",
          contentClassName,
        )}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}
