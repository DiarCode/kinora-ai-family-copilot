import { AssistantView } from "@/components/assistant/assistant-view";
import { buildAssistantWelcome } from "@/lib/engine/assistant";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kinora assistant",
};

export default async function AssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string; voice?: string }>;
}) {
  const params = await searchParams;
  const state = await getStore().read();
  const latestThread =
    [...state.threads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ??
    null;

  return (
    <AssistantView
      initialThread={latestThread}
      welcome={buildAssistantWelcome(state)}
      initialPrompt={params.prompt}
      startVoice={params.voice === "1"}
    />
  );
}
