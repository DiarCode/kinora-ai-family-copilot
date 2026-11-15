"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { AppPage } from "@/components/app/app-page";
import { useFamily } from "@/components/providers/family-provider";
import { SessionView } from "@/components/sessions/session-view";

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const { state } = useFamily();

  if (!state) return null;
  const session = state.sessions.find((item) => item.id === params.id);

  if (!session) {
    return (
      <AppPage
        header={
          <AppHeader
            variant="back"
            backHref="/app/sessions"
            title="Session"
            showMenu={false}
            showProfile={false}
          />
        }
      >
        <div className="px-5 py-10 text-center">
          <p className="text-[15px] font-semibold text-ink">
            This session could not be found.
          </p>
          <Link
            href="/app/sessions"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[15px] font-semibold text-white"
          >
            Back to sessions
          </Link>
        </div>
      </AppPage>
    );
  }

  return <SessionView session={session} />;
}
