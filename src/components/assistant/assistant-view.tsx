"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  AudioLines,
  BookOpen,
  Copy,
  Info,
  Mic,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  UserRound,
  Share2,
  Sparkles,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ai-elements/message";
import { KinoraResponse } from "@/components/brand/kinora-response";
import { AppHeader, HeaderIconButton } from "@/components/app/app-header";
import { AppSheet } from "@/components/app/app-sheet";
import { AboutSheet } from "@/components/app/about-sheet";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { VoiceInputSheet } from "@/components/assistant/voice-input-sheet";
import { useFamily } from "@/components/providers/family-provider";
import type { AssistantMessage, AssistantThread } from "@/lib/types";
import type { AssistantReply } from "@/lib/engine/assistant";
import { apiFetch } from "@/lib/client-api";
import { cn, newId } from "@/lib/utils";

type AssistantResponse = {
  thread: AssistantThread;
  reply: AssistantMessage;
  mode: "engine" | "llm";
  memoryUsed: string[];
  suggestedPrompts: string[];
  ai: { mode: "engine" | "llm"; model: string };
};


function WelcomeMessage({
  welcome,
  suggestions,
  onSelect,
  onVoice,
}: {
  welcome: AssistantReply;
  suggestions: string[];
  onSelect: (prompt: string) => void;
  onVoice: () => void;
}) {
  return (
    <div className="animate-fade">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          <KinoraOrb size={30} glow={false} animated={false} label="Kinora" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-[#e4e2e8] bg-[#efeff1] px-3.5 py-3">
            <span className="text-[15px] font-semibold text-ink">Kinora</span>
            <KinoraResponse className="mt-2 text-[15px] leading-relaxed text-ink">
              {welcome.text}
            </KinoraResponse>
          </div>
        </div>
      </div>

      {suggestions.length ? (
        <div className="mt-4 ml-[40px]">
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelect(prompt)}
                className="focus-ring rounded-2xl border border-white bg-white p-3.5 text-left text-[14px] leading-snug text-ink-soft transition hover:-translate-y-0.5"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 ml-[40px] flex items-center gap-2">
        <button
          type="button"
          onClick={onVoice}
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink-soft transition hover:bg-white"
        >
          <AudioLines className="h-3.5 w-3.5" />
          Talk instead
        </button>
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex items-center gap-2.5 pl-0.5">
      <KinoraOrb size={28} glow={false} animated label="Kinora is thinking" />
      <span className="inline-flex items-center gap-1 text-[14px] font-medium text-kinora-800">
        Thinking
        <span className="inline-flex gap-0.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="typing-dot h-1 w-1 rounded-full bg-kinora-700"
              style={{ animationDelay: `${index * 0.16}s` }}
            />
          ))}
        </span>
      </span>
    </div>
  );
}

function ChatMessage({
  message,
  onCopy,
  onRegenerate,
  onShare,
  onFlag,
  onMore,
  pending,
}: {
  message: AssistantMessage;
  onCopy: (text: string) => void;
  onRegenerate: () => void;
  onShare: (text: string) => void;
  onFlag: () => void;
  onMore: () => void;
  pending: boolean;
}) {
  if (message.role === "user") {
    return (
      <div className="flex animate-[reveal-up_0.35s_ease] justify-end">
        <div className="max-w-[84%] rounded-2xl rounded-tr-md bg-white px-4 py-3 text-[15px] leading-relaxed text-ink ring-1 ring-black/[0.03]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-[reveal-up_0.35s_ease] items-start gap-2.5">
      <div className="mt-0.5 shrink-0">
        <KinoraOrb size={30} glow={false} animated={false} label="Kinora" />
      </div>
      <div className="min-w-0 flex-1">
        <Message
          from="assistant"
          className="max-w-full animate-fade gap-0"
        >
          <MessageContent className="w-full max-w-full overflow-visible rounded-2xl border border-[#e4e2e8] bg-[#efeff1] px-4 py-3.5 text-[15px] text-ink">
            <KinoraResponse className="text-[15px] leading-relaxed">
              {message.content}
            </KinoraResponse>
          </MessageContent>
        </Message>

        <MessageActions className="relative z-10 -mt-2 ml-1 w-fit gap-0.5 rounded-full bg-white px-1.5 py-1 shadow-[0_8px_20px_-16px_rgba(50,30,100,0.5)] ring-1 ring-black/[0.03]">
          <MessageAction
            tooltip="Copy"
            label="Copy"
            onClick={() => onCopy(message.content)}
            className="h-7 w-7 rounded-full text-[#6f6a78] hover:bg-black/[0.04]"
          >
            <Copy className="h-3.5 w-3.5" />
          </MessageAction>
          <MessageAction
            tooltip="Regenerate"
            label="Regenerate"
            disabled={pending}
            onClick={onRegenerate}
            className="h-7 w-7 rounded-full text-[#6f6a78] hover:bg-black/[0.04] disabled:opacity-40"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </MessageAction>
          <MessageAction
            tooltip="Share"
            label="Share"
            onClick={() => onShare(message.content)}
            className="h-7 w-7 rounded-full text-[#6f6a78] hover:bg-black/[0.04]"
          >
            <Share2 className="h-3.5 w-3.5" />
          </MessageAction>
          <MessageAction
            tooltip={message.flagged ? "Saved" : "Save for later"}
            label="Save"
            onClick={onFlag}
            className={cn(
              "h-6 w-6 rounded-full hover:bg-black/[0.04]",
              message.flagged ? "text-kinora-700" : "text-[#6f6a78]",
            )}
          >
            <Flag
              className={cn("h-3.5 w-3.5", message.flagged && "fill-current")}
            />
          </MessageAction>
          <MessageAction
            tooltip="More"
            label="More"
            onClick={onMore}
            className="h-7 w-7 rounded-full text-[#6f6a78] hover:bg-black/[0.04]"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </MessageAction>
        </MessageActions>
      </div>
    </div>
  );
}

export function AssistantView({
  initialThread,
  welcome,
  initialPrompt,
  startVoice,
}: {
  initialThread: AssistantThread | null;
  welcome: AssistantReply;
  initialPrompt?: string;
  startVoice?: boolean;
}) {
  const router = useRouter();
  const { state } = useFamily();
  const [messages, setMessages] = useState<AssistantMessage[]>(
    initialThread?.messages ?? [],
  );
  const [threadId, setThreadId] = useState<string | null>(
    initialThread?.id ?? null,
  );
  const [pending, setPending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(
    initialThread?.messages.length ? [] : welcome.suggestedPrompts,
  );
  const [voiceOpen, setVoiceOpen] = useState(Boolean(startVoice));
  const [moreOpen, setMoreOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialSent = useRef(false);
  const child = state?.children[0];

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;
      setValue("");
      setPending(true);
      setSuggestions([]);
      const optimistic: AssistantMessage = {
        id: newId("msg"),
        role: "user",
        content: text,
        at: new Date().toISOString(),
      };
      setMessages((current) => [...current, optimistic]);

      try {
        const [response] = await Promise.all([
          apiFetch<AssistantResponse>("/api/assistant", {
            method: "POST",
            body: JSON.stringify({ message: text, threadId: threadId ?? undefined }),
          }),
          new Promise((resolve) => setTimeout(resolve, 620)),
        ]);
        setThreadId(response.thread.id);
        setMessages(response.thread.messages);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Kinora could not answer.";
        toast.error(message);
        setMessages((current) => [
          ...current,
          {
            id: newId("msg"),
            role: "assistant",
            content:
              "I couldn't answer just now. Your message is still here — try sending it again in a moment.",
            at: new Date().toISOString(),
          },
        ]);
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [pending, threadId],
  );

  const startNewChat = useCallback(() => {
    setMessages([]);
    setThreadId(null);
    setSuggestions(welcome.suggestedPrompts);
    setPending(false);
    setMoreOpen(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/app/assistant");
    }
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [welcome.suggestedPrompts]);

  useEffect(() => {
    if (initialSent.current) return;
    if (!initialPrompt && !startVoice) return;
    initialSent.current = true;
    // The prompt arrives from another page via the URL; send it once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialPrompt) void sendMessage(initialPrompt);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/app/assistant");
    }
  }, [initialPrompt, sendMessage, startVoice]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        startNewChat();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startNewChat]);

  const regenerate = async () => {
    if (!threadId || pending) return;
    setPending(true);
    try {
      const response = await apiFetch<AssistantResponse>("/api/assistant", {
        method: "POST",
        body: JSON.stringify({ threadId, regenerate: true }),
      });
      setMessages(response.thread.messages);
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "Could not regenerate.",
      );
    } finally {
      setPending(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard.", { duration: 1500 });
    } catch {
      toast.error("Could not copy.");
    }
  };

  const share = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Kinora", text });
        return;
      } catch {
        return;
      }
    }
    await copy(text);
  };

  const toggleFlag = async (message: AssistantMessage) => {
    if (!threadId) return;
    const next = !message.flagged;
    setMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, flagged: next } : item,
      ),
    );
    try {
      await apiFetch("/api/assistant/flag", {
        method: "PATCH",
        body: JSON.stringify({
          threadId,
          messageId: message.id,
          flagged: next,
        }),
      });
      toast.success(next ? "Saved for later." : "Removed from saved.", {
        duration: 1500,
      });
    } catch (cause) {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, flagged: !next } : item,
        ),
      );
      toast.error(cause instanceof Error ? cause.message : "Could not save.");
    }
  };

  const copyTranscript = async () => {
    if (!messages.length) {
      toast.error("There is nothing to copy yet.");
      return;
    }
    const text = messages
      .map(
        (message) =>
          `${message.role === "user" ? "You" : "Kinora"}: ${message.content}`,
      )
      .join("\n\n");
    await copy(text);
    setMoreOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(value);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AppHeader
        variant="back"
        backHref="/app"
        showMenu={false}
        showProfile={false}
        actions={
          <>
            <HeaderIconButton label="New conversation" onClick={startNewChat}>
              <Pencil className="h-[17px] w-[17px]" strokeWidth={1.8} />
            </HeaderIconButton>
            <HeaderIconButton
              label="Conversation options"
              onClick={() => setMoreOpen(true)}
            >
              <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </HeaderIconButton>
          </>
        }
      />

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-4 px-5 pt-1 pb-5">
          {messages.length === 0 ? (
            <WelcomeMessage
              welcome={welcome}
              suggestions={suggestions}
              onSelect={(prompt) => void sendMessage(prompt)}
              onVoice={() => setVoiceOpen(true)}
            />
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                pending={pending}
                onCopy={(text) => void copy(text)}
                onRegenerate={() => void regenerate()}
                onShare={(text) => void share(text)}
                onFlag={() => void toggleFlag(message)}
                onMore={() => setMoreOpen(true)}
              />
            ))
          )}
          {pending ? <ThinkingBubble /> : null}
        </ConversationContent>
        <ConversationScrollButton className="bottom-3 border border-[#e4e2e8] bg-white/90 text-ink shadow-md backdrop-blur" />
      </Conversation>

      <div className="relative z-20 shrink-0 bg-gradient-to-t from-[#f3f3f3] via-[#f3f3f3]/96 to-transparent px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="rounded-3xl bg-white p-1.5">
          <div className="flex items-end gap-2 rounded-2xl bg-[#f3f3f3] p-1.5 pl-2">
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              aria-label="Quick actions"
              className="focus-ring mb-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e9e7ec] text-ink-soft transition hover:bg-[#dedbe4]"
            >
              <Plus className="h-4 w-4" strokeWidth={1.9} />
            </button>
            <textarea
              ref={inputRef}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                event.currentTarget.style.height = "auto";
                event.currentTarget.style.height = `${Math.min(
                  event.currentTarget.scrollHeight,
                  96,
                )}px`;
              }}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask anything..."
              aria-label="Ask Kinora anything"
              className="max-h-24 min-h-9 flex-1 resize-none bg-transparent py-2 text-[16px] leading-relaxed text-ink placeholder:text-[#94909c] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              aria-label="Voice input"
              className="focus-ring mb-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#7c7884] transition hover:bg-black/[0.04]"
            >
              <Mic className="h-[17px] w-[17px]" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (value.trim()) void sendMessage(value);
                else setVoiceOpen(true);
              }}
              disabled={pending}
              aria-label={value.trim() ? "Send message" : "Talk to Kinora"}
              className="focus-ring mb-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition active:scale-[0.96] disabled:opacity-60"
            >
              {pending ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/50 border-t-white" />
              ) : value.trim() ? (
                <ArrowUp className="h-[17px] w-[17px]" strokeWidth={2.2} />
              ) : (
                <AudioLines className="h-[17px] w-[17px]" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      <VoiceInputSheet
        open={voiceOpen}
        onOpenChange={setVoiceOpen}
        onSubmit={(text) => void sendMessage(text)}
        onTypeInstead={() => {
          window.setTimeout(() => inputRef.current?.focus(), 80);
        }}
      />

      <AboutSheet open={aboutOpen} onOpenChange={setAboutOpen} />

      <AppSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        title="Conversation"
        description="A private thread with Kinora. Your family state stays in the app."
      >
        <div className="space-y-2">
          <button
            type="button"
            onClick={startNewChat}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4 text-left"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-kinora-100 text-kinora-800">
              <Pencil className="h-4 w-4" />
            </span>
            <span className="flex-1 text-[15px] font-medium">
              Start a new conversation
            </span>
            <span className="text-[13px] text-muted">⌘K</span>
          </button>
          <button
            type="button"
            onClick={() => void copyTranscript()}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4 text-left"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f3f0f8] text-ink-soft">
              <Copy className="h-4 w-4" />
            </span>
            <span className="flex-1 text-[15px] font-medium">
              Copy the whole transcript
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMoreOpen(false);
              setAboutOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4 text-left"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f3f0f8] text-ink-soft">
              <Info className="h-4 w-4" />
            </span>
            <span className="flex-1 text-[15px] font-medium">
              About Kinora
            </span>
          </button>
        </div>
      </AppSheet>

      <AppSheet
        open={quickOpen}
        onOpenChange={setQuickOpen}
        title="Quick actions"
      >
        <div className="space-y-2">
          {[
            {
              href: "/app/sessions/new",
              title: "Start a session",
              body: "A guided conversation for both of you.",
              Icon: AudioLines,
              tone: "bg-[#fdeef4] text-[#b34c77]",
            },
            {
              href: child ? `/app/children/${child.id}` : "/app/children",
              title: child ? `Discover ${child.name}` : "Add a child",
              body: "A short strengths map.",
              Icon: UserRound,
              tone: "bg-[#fff4d6] text-[#a87106]",
            },
            {
              href: "/app/courses",
              title: "Browse courses",
              body: "Practical skills with a quiz.",
              Icon: BookOpen,
              tone: "bg-[#e8eeff] text-[#3d5da8]",
            },
            {
              href: "/app",
              title: "Go to the family home",
              body: "Moods and next steps.",
              Icon: Sparkles,
              tone: "bg-[#f1eaff] text-kinora-800",
            },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                setQuickOpen(false);
                router.push(item.href);
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-4 text-left"
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl",
                  item.tone,
                )}
              >
                <item.Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">
                  {item.title}
                </span>
                <span className="block truncate text-[13.5px] text-muted">
                  {item.body}
                </span>
              </span>
            </button>
          ))}
        </div>
      </AppSheet>
    </div>
  );
}
