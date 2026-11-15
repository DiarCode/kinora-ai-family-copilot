import type { Metadata } from "next";
import { FamilyProvider } from "@/components/providers/family-provider";
import { readStatePayload } from "@/lib/server/state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your family",
  description: "Kinora app",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await readStatePayload();

  return (
    <FamilyProvider initialData={initialData}>
      <div className="app-canvas w-full md:flex md:min-h-dvh md:items-center md:justify-center md:p-6">
        <div className="app-device app-surface relative h-dvh w-full overflow-hidden md:h-[min(920px,92dvh)] md:w-[460px] md:rounded-[44px] md:ring-1 md:ring-white/30">
          <div className="relative flex h-full flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </FamilyProvider>
  );
}
