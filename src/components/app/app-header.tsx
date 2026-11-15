"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Sparkles, UserRound } from "lucide-react";
import { MenuDrawer } from "@/components/app/menu-drawer";
import { ProfileSheet } from "@/components/app/profile-sheet";
import { cn } from "@/lib/utils";

export function HeaderIconButton({
  label,
  href,
  onClick,
  children,
  className,
  active = false,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  const classes = cn(
    "focus-ring grid h-[46px] w-[46px] place-items-center rounded-full bg-white/85 text-ink shadow-[0_10px_24px_-18px_rgba(50,30,100,0.35)] backdrop-blur-md transition hover:bg-white active:scale-[0.97]",
    active && "bg-white",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function MenuGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("relative block h-3.5 w-5", className)} aria-hidden>
      <span className="absolute top-[3px] left-0 h-[1.5px] w-full rounded-full bg-current" />
      <span className="absolute bottom-[3px] left-0 h-[1.5px] w-full rounded-full bg-current" />
    </span>
  );
}

type AppHeaderProps = {
  variant?: "home" | "back" | "plain";
  title?: string;
  backHref?: string;
  actions?: ReactNode;
  showMenu?: boolean;
  showProfile?: boolean;
  className?: string;
  centerTitle?: boolean;
};

export function AppHeader({
  variant = "home",
  title,
  backHref,
  actions,
  showMenu = true,
  showProfile = true,
  className,
  centerTitle = false,
}: AppHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const goBack = () => {
    if (backHref) {
      router.push(backHref);
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/app");
    }
  };

  return (
    <>
      <header
        className={cn(
          "relative z-30 flex shrink-0 items-center gap-2 px-5 pt-5 pb-2",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {variant === "back" ? (
            backHref ? (
              <HeaderIconButton label="Go back" href={backHref}>
                <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </HeaderIconButton>
            ) : (
              <HeaderIconButton label="Go back" onClick={goBack}>
                <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </HeaderIconButton>
            )
          ) : showMenu ? (
            <HeaderIconButton label="Open menu" onClick={() => setMenuOpen(true)}>
              <MenuGlyph />
            </HeaderIconButton>
          ) : (
            <span className="w-[46px]" />
          )}
        </div>

        {title ? (
          <h1
            className={cn(
              "max-w-[58%] truncate text-center text-[15px] font-semibold text-ink",
              centerTitle ? "absolute left-1/2 -translate-x-1/2" : "",
            )}
          >
            {title}
          </h1>
        ) : null}

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          {actions}
          {variant === "home" && showProfile ? (
            <>
              <HeaderIconButton label="Open Kinora assistant" href="/app/assistant">
                <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </HeaderIconButton>
              <HeaderIconButton
                label="Open family profile"
                onClick={() => setProfileOpen(true)}
              >
                <UserRound className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </HeaderIconButton>
            </>
          ) : null}
        </div>
      </header>

      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} />
      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
