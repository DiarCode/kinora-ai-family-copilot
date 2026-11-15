"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowUp,
  AudioLines,
  Check,
  Info,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader, HeaderIconButton } from "@/components/app/app-header";
import { AppSheet } from "@/components/app/app-sheet";
import { AboutSheet } from "@/components/app/about-sheet";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { KinoraResponse } from "@/components/brand/kinora-response";
import { useFamily } from "@/components/providers/family-provider";
import { apiFetch } from "@/lib/client-api";
import { useSpeechRecognition } from "@/hooks/use-speech";
import { useLiveKitRoom } from "@/hooks/use-livekit";
import {
  SHARED_PHONE_IDENTITY,
  SHARED_PHONE_NAME,
} from "@/lib/livekit-constants";

const normalizeTranscript = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
import type { Session, StateResponse, Turn } from "@/lib/types";
import { cn, firstName } from "@/lib/utils";

function TurnBubble({ turn, memberColor }: { turn: Turn; memberColor?: string }) {
  const isKinora = turn.speakerId === "kinora";
  const agreement = turn.kind === "agreement";
  const safety = turn.kind === "safety";

  if (isKinora) {
    return (
      <div className="flex items-start gap-2">
        <div className="mt-0.5 shrink-0">
          <KinoraOrb size={24} glow={false} animated={false} label="Kinora" />
        </div>
        <div
          className={cn(
            "max-w-[86%] rounded-2xl border border-[#e4e2e8] bg-[#efeff1] px-3 py-2.5",
            agreement && "border-[#ddccfb] bg-[#f7f2ff]",
            safety && "border-[#f0d3da] bg-[#fff6f8]",
          )}
        >
          <p className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#9b95a5] ">
            Kinora
            {agreement ? (
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[12px] text-kinora-800">
                Agreement
              </span>
            ) : null}
            {safety ? (
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[12px] text-[#b34c77]">
                Safety
              </span>
            ) : null}
          </p>
          <KinoraResponse className="text-[15px] leading-relaxed">
            {turn.text}
          </KinoraResponse>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[84%]">
        <p className="mb-1 text-right text-[12px] font-medium text-[#9b95a5]">
          {firstName(turn.speakerName)}
        </p>
        <div className="rounded-2xl rounded-tr-[5px] bg-white px-3 py-2.5 text-[15px] leading-relaxed text-ink shadow-[0_10px_24px_-24px_rgba(50,30,100,0.5)] ring-1 ring-black/[0.03]">
          <span
            className="mb-1 block h-1 w-5 rounded-full"
            style={{ backgroundColor: memberColor ?? "#8b5cf6" }}
          />
          {turn.text}
        </div>
      </div>
    </div>
  );
}

function LiveKitSheet({
  open,
  onOpenChange,
  session,
  livekit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
  livekit: ReturnType<typeof useLiveKitRoom>;
}) {
  const {
    status,
    participants,
    localIdentity,
    error,
    connect,
    disconnect,
    agentPresent,
    dispatchStatus,
    audioBlocked,
    startAudio,
    retryDispatch,
  } = livekit;

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Voice room"
      description="Join the shared phone."
    >
      {status === "idle" ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#ece8f4] bg-white p-4">
            <p className="text-[15px] font-semibold text-ink">
              One phone, both parents
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
              Put this phone between you and speak in turns. Kinora hears the
              room, tells your voices apart, and answers out loud. The phone
              publishes captions back to the session, so the summary still
              works.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              void connect({
                roomName: session.roomName,
                identity: SHARED_PHONE_IDENTITY,
                name: SHARED_PHONE_NAME,
              })
            }
            className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white"
          >
            <AudioLines className="h-4 w-4" />
            Start the voice meeting
          </button>
        </div>
      ) : null}

      {status === "connecting" ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-kinora-700" />
          <p className="text-[15px] text-muted">Joining the room…</p>
        </div>
      ) : null}

      {status === "connected" ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#e4f0e8] bg-[#f4fbf6] p-3">
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-[#2f7a4a]">
              <Check className="h-3.5 w-3.5" />
              Connected to the room
            </p>
            <p className="mt-1 text-[13.5px] text-[#5f7a68]">
              {localIdentity ? "You are in. " : ""}Speak naturally — captions
              are posted into the transcript.
            </p>
          </div>

          {audioBlocked ? (
            <button
              type="button"
              onClick={() => void startAudio()}
              className="focus-ring w-full rounded-2xl border border-[#f3e4c4] bg-[#fffaef] p-3 text-left"
            >
              <p className="flex items-center gap-1.5 text-[15px] font-semibold text-[#8a6a2a]">
                <Volume2 className="h-3.5 w-3.5" />
                Tap to enable sound
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#8a6a2a]">
                This browser paused Kinora&apos;s audio. One tap restores it.
              </p>
            </button>
          ) : null}

          {agentPresent ? (
            <div className="rounded-2xl border border-[#ddccfb] bg-[#faf7ff] p-3">
              <p className="flex items-center gap-1.5 text-[15px] font-semibold text-kinora-900">
                <Sparkles className="h-3.5 w-3.5" />
                Kinora voice agent connected
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#6f5a91]">
                Kinora is listening and speaking in the room. She follows who
                is speaking; use the parent buttons in the session to correct
                her if needed.
              </p>
            </div>
          ) : dispatchStatus === "requested" ? (
            <div className="rounded-2xl border border-[#e9e1fb] bg-[#faf7ff] p-3 text-[13.5px] leading-relaxed text-[#6f5a91]">
              Dispatching Kinora&apos;s voice agent into the room…
            </div>
          ) : dispatchStatus === "timeout" ? (
            <div className="rounded-2xl border border-[#f3e4c4] bg-[#fffaef] p-3 text-[13.5px] leading-relaxed text-[#8a6a2a]">
              <p>Kinora&apos;s voice agent has not joined yet.</p>
              <button
                type="button"
                onClick={() => void retryDispatch()}
                className="focus-ring mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[#e6d4a8] bg-white text-[13.5px] font-semibold text-[#8a6a2a]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask Kinora to join again
              </button>
            </div>
          ) : dispatchStatus === "failed" ? (
            <div className="rounded-2xl border border-[#f0dfe3] bg-[#fff8f9] p-3 text-[13.5px] leading-relaxed text-[#7d5a66]">
              <p>Kinora could not be dispatched into the room.</p>
              <button
                type="button"
                onClick={() => void retryDispatch()}
                className="focus-ring mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[#eccfd7] bg-white text-[13.5px] font-semibold text-[#7d5a66]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          ) : null}

          <div className="space-y-1.5">
            {participants.map((participant) => (
              <div
                key={participant.identity}
                className="flex items-center gap-2 rounded-xl bg-[#f7f5fa] px-3 py-2 text-[13.5px]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#43a367]" />
                {participant.isAgent ? "Kinora voice agent" : participant.name}
                {participant.isLocal ? " (this phone)" : ""}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              disconnect();
              onOpenChange(false);
            }}
            className="focus-ring flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[#f0dfe3] bg-white text-[15px] font-semibold text-[#b34c77]"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            Leave the room
          </button>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-2xl border border-[#f0dfe3] bg-[#fff8f9] p-3">
          <p className="text-[15px] font-semibold text-[#b34c77]">
            Could not join the room
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[#7d5a66]">
            {error}
          </p>
          <p className="mt-2 text-[13.5px] text-[#9b7e87]">
            Allow the microphone and try again, or keep the session in text.
          </p>
          <button
            type="button"
            onClick={() =>
              void connect({
                roomName: session.roomName,
                identity: SHARED_PHONE_IDENTITY,
                name: SHARED_PHONE_NAME,
              })
            }
            className="focus-ring mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-semibold text-white"
          >
            <AudioLines className="h-4 w-4" />
            Start the voice meeting
          </button>
        </div>
      ) : null}
    </AppSheet>
  );
}

export function SessionRoom({ session }: { session: Session }) {
  const {
    state,
    sendTurn,
    updateSession,
    refresh,
    applyPayload,
  } = useFamily();
  const livekit = useLiveKitRoom({
    onSpeakerDetected: (speaker) => {
      if (session.mode !== "voice") return;
      if (!session.participants.includes(speaker.identity)) return;
      activeSpeakerRef.current = speaker.identity;
      setSpeakerId(speaker.identity);
    },
  });
  const agentPresent = livekit.agentPresent;
  const livekitStatus = livekit.status;
  const livekitTranscriptions = livekit.transcriptions;
  const selectLiveKitSpeaker = livekit.selectSpeaker;
  const connectLiveKit = livekit.connect;
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ending, setEnding] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [livekitOpen, setLivekitOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const activeSpeakerRef = useRef(session.participants[0]);
  const [speakerId, setSpeakerId] = useState(
    session.participants[0] ?? "member_michael",
  );
  const transcriptEnd = useRef<HTMLDivElement>(null);
  const voiceAutoConnect = useRef(false);
  const postedSegments = useRef<Set<string>>(new Set());
  const openingSkipped = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const speech = useSpeechRecognition({
    onFinal: (transcript) => setText(transcript),
  });
  const stopListening = speech.stop;

  const members = useMemo(
    () =>
      state?.family.members.filter((member) =>
        session.participants.includes(member.id),
      ) ?? [],
    [state?.family.members, session.participants],
  );
  const activeMember =
    members.find((member) => member.id === speakerId) ?? members[0];
  const activeName = activeMember ? firstName(activeMember.name) : "You";
  const lastTurn = session.turns[session.turns.length - 1];
  const liveCaption = [...livekitTranscriptions]
    .reverse()
    .find((item) => item.text.trim());

  const postTranscript = useCallback(
    async (speaker: string, transcript: string) => {
      const payload = await apiFetch<StateResponse & { session: Session }>(
        `/api/sessions/${session.id}/transcript`,
        {
          method: "POST",
          body: JSON.stringify({ speakerId: speaker, text: transcript }),
        },
      );
      applyPayload(payload);
    },
    [applyPayload, session.id],
  );

  useEffect(() => {
    activeSpeakerRef.current = speakerId;
  }, [speakerId]);

  useEffect(() => {
    // In text mode, Kinora's latest turn tells us who should speak next.
    // Voice mode follows the agent's live speaker detection instead.
    if (session.mode !== "text") return;
    if (lastTurn?.speakerId === "kinora" && lastTurn.invite) {
      setSpeakerId(lastTurn.invite);
    }
  }, [lastTurn?.id, lastTurn?.invite, lastTurn?.speakerId, session.mode]);

  useEffect(() => {
    if (!agentPresent) return;
    stopListening();
  }, [agentPresent, stopListening]);

  const startVoiceMeeting = useCallback(() => {
    void connectLiveKit({
      roomName: session.roomName,
      identity: SHARED_PHONE_IDENTITY,
      name: SHARED_PHONE_NAME,
    });
  }, [connectLiveKit, session.roomName]);

  useEffect(() => {
    // One phone sits between the parents. Join the room automatically as the
    // shared phone; if the browser blocks the microphone, the UI offers one
    // retry button. There is deliberately no robotic device-voice fallback.
    if (session.mode !== "voice" || session.status !== "active") return;
    if (livekitStatus !== "idle") return;
    if (voiceAutoConnect.current) return;
    voiceAutoConnect.current = true;
    startVoiceMeeting();
  }, [session.mode, session.status, livekitStatus, startVoiceMeeting]);

  const chooseSpeaker = (identity: string) => {
    setSpeakerId(identity);
    if (session.mode === "voice" && livekitStatus === "connected") {
      void selectLiveKitSpeaker(identity);
    }
  };

  useEffect(() => {
    if (!agentPresent) return;
    const opening =
      session.turns.find((turn) => turn.speakerId === "kinora")?.text ?? "";

    for (const segment of livekitTranscriptions) {
      if (
        !segment.final ||
        !segment.text.trim() ||
        postedSegments.current.has(segment.id)
      ) {
        continue;
      }

      const isOpening =
        segment.isAgent &&
        opening.length > 0 &&
        normalizeTranscript(segment.text) === normalizeTranscript(opening);
      if (isOpening && !openingSkipped.current) {
        openingSkipped.current = true;
        postedSegments.current.add(segment.id);
        continue;
      }

      // The shared phone has one LiveKit identity. Attribute parent speech to
      // whichever parent the agent's diarization last detected, falling back to
      // the manually selected parent.
      const speaker = segment.isAgent ? "kinora" : activeSpeakerRef.current;

      postedSegments.current.add(segment.id);
      void postTranscript(speaker, segment.text).catch(() => {
        postedSegments.current.delete(segment.id);
      });
    }
  }, [agentPresent, livekitTranscriptions, postTranscript, session.turns]);

  useEffect(() => {
    const start = session.startedAt
      ? new Date(session.startedAt).getTime()
      : Date.now();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [session.startedAt]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [session.turns.length, thinking]);

  const timer = `${Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`;

  const send = async () => {
    const clean = text.trim();
    if (!clean || thinking) return;
    speech.stop();
    speech.reset();
    setText("");
    setThinking(true);
    try {
      await sendTurn(session.id, speakerId, clean);
    } catch {
      setText(clean);
    } finally {
      setThinking(false);
      textareaRef.current?.focus();
    }
  };

  const end = async () => {
    setEnding(true);
    try {
      livekit.endRoom();
      await updateSession(session.id, "complete");
      setEndOpen(false);
      stop();
      toast.success("Summary ready.");
    } catch {
      // The provider shows the error.
    } finally {
      setEnding(false);
    }
  };

  const toggleVoice = () => {
    if (!agentPresent) return;
    livekit.toggleMuted();
  };

  const voiceMuted = livekit.muted;

  const toggleListening = () => {
    if (agentPresent) {
      toast.info(
        "Kinora's voice agent is listening in the room. Just speak — she follows who is talking.",
      );
      return;
    }
    if (speech.listening) {
      speech.stop();
      return;
    }
    if (!speech.supported) {
      toast.error(
        "Voice input is not available in this browser. You can type instead.",
      );
      return;
    }
    setText("");
    speech.start();
    window.setTimeout(() => textareaRef.current?.focus(), 60);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  const status = agentPresent
    ? "Kinora is listening in the meeting."
    : thinking
      ? "Kinora is thinking…"
      : speech.listening
        ? `Listening to ${activeName}…`
        : `${activeName}, you have the floor.`;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AppHeader
        variant="back"
        backHref="/app/sessions"
        showMenu={false}
        showProfile={false}
        actions={
          <>
            {agentPresent ? (
              <HeaderIconButton
                label={
                  voiceMuted ? "Unmute Kinora's voice" : "Mute Kinora's voice"
                }
                onClick={toggleVoice}
              >
                {!voiceMuted ? (
                  <Volume2 className="h-[17px] w-[17px]" strokeWidth={1.8} />
                ) : (
                  <VolumeX className="h-[17px] w-[17px]" strokeWidth={1.8} />
                )}
              </HeaderIconButton>
            ) : null}
            <button
              type="button"
              onClick={() => setEndOpen(true)}
              className="focus-ring h-11 rounded-full bg-white px-4 text-[15px] font-semibold text-[#b34c77]"
            >
              End
            </button>
          </>
        }
      />

      <section className="mx-5 shrink-0 rounded-3xl border border-white bg-white/70 p-3.5 shadow-[0_18px_40px_-34px_rgba(60,36,120,0.4)] backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f0fa] px-2 py-1 text-[12px] font-semibold text-ink-soft ">
            {session.mode === "voice" ? (
              <AudioLines className="h-3 w-3 text-kinora-700" />
            ) : (
              <MessageSquare className="h-3 w-3 text-kinora-700" />
            )}
            {session.mode === "voice" ? "Voice session" : "Text session"}
          </span>
          <span className="font-mono text-[13.5px] tabular-nums text-[#9b95a5]">
            {timer}
          </span>
        </div>

        <div className="relative mt-2 flex justify-center">
          {speech.listening || thinking || agentPresent ? (
            <>
              <span className="absolute top-1/2 left-1/2 h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 animate-[ring-pulse_2.2s_ease-out_infinite] rounded-full border border-kinora-500/40" />
              <span className="absolute top-1/2 left-1/2 h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 animate-[ring-pulse_2.2s_ease-out_0.7s_infinite] rounded-full border border-kinora-500/25" />
            </>
          ) : null}
          <KinoraOrb size={92} animated label="Kinora session" />
        </div>

        <p
          className="mt-1.5 text-center text-[15px] font-medium text-kinora-900"
          aria-live="polite"
        >
          {status}
        </p>

        <div className="mt-3 flex items-center justify-center gap-2">
          {members.map((member) => {
            const active = member.id === speakerId;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => chooseSpeaker(member.id)}
                aria-pressed={active}
                className={cn(
                  "focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[13.5px] font-medium transition",
                  active
                    ? "border-kinora-300 bg-white text-ink shadow-sm"
                    : "border-transparent bg-white/60 text-[#8e8998]",
                )}
              >
                <span
                  className="grid h-4 w-4 place-items-center rounded-full text-[12px] font-semibold text-white"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {firstName(member.name).charAt(0)}
                </span>
                {firstName(member.name)}
                {active ? (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#43a367]" />
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[12px] leading-relaxed text-[#a09bab]">
          {agentPresent
            ? "One phone between you. Kinora follows who is speaking — tap a name to correct her."
            : "One phone between you. Both of you speak in turns."}
        </p>
      </section>

      <div className="mt-2 min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-3 no-scrollbar">
        {session.turns.map((turn) => (
          <TurnBubble
            key={turn.id}
            turn={turn}
            memberColor={
              members.find((member) => member.id === turn.speakerId)
                ?.avatarColor
            }
          />
        ))}
        {thinking ? (
          <div className="flex items-center gap-2 pl-1">
            <KinoraOrb size={22} glow={false} animated label="Kinora is thinking" />
            <span className="inline-flex items-center gap-1 text-[13.5px] font-medium text-kinora-800">
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
        ) : null}
        <div ref={transcriptEnd} />
      </div>

      {agentPresent ? (
        <div className="relative z-20 shrink-0 bg-gradient-to-t from-[#f3f3f3] via-[#f3f3f3]/96 to-transparent px-4 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))]">
          {liveCaption ? (
            <div className="mb-2 flex items-start gap-2 rounded-xl border border-[#e4e2e8] bg-white/90 px-3 py-2 text-[13.5px] leading-relaxed text-ink-soft shadow-sm">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#43a367]" />
              <span className="line-clamp-2">{liveCaption.text}</span>
            </div>
          ) : null}
          <div className="rounded-2xl bg-white p-3.5 shadow-[0_22px_55px_-32px_rgba(50,30,100,0.4)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#43a367] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#43a367]" />
              </span>
              <p className="text-[15px] font-semibold text-ink">
                Kinora voice agent connected
              </p>
              {livekit.muted ? (
                <span className="ml-auto rounded-full bg-[#f5f2fa] px-2 py-0.5 text-[12px] text-muted">
                  Muted
                </span>
              ) : null}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLivekitOpen(true)}
                className="focus-ring flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#e4def0] bg-white text-[14px] font-semibold text-ink-soft"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Room details
              </button>
              <button
                type="button"
                onClick={() => livekit.disconnect()}
                className="focus-ring flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#f0dfe3] bg-[#fff8f9] text-[14px] font-semibold text-[#b34c77]"
              >
                <PhoneOff className="h-3.5 w-3.5" />
                Leave voice room
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setLivekitOpen(true)}
              className="focus-ring inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#8e8998]"
            >
              <Smartphone className="h-3 w-3" />
              Voice room
            </button>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="focus-ring inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#8e8998]"
            >
              <Info className="h-3 w-3" />
              Safety & info
            </button>
          </div>
        </div>
      ) : (
      <div className="relative z-20 shrink-0 bg-gradient-to-t from-[#f3f3f3] via-[#f3f3f3]/96 to-transparent px-4 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))]">
        {session.mode === "voice" && livekitStatus !== "connected" ? (
          <div className="mb-2 rounded-2xl border border-[#ddccfb] bg-[#faf7ff] px-3 py-2.5">
            {livekitStatus === "connecting" ? (
              <p className="flex items-center justify-center gap-2 text-[13.5px] font-semibold text-kinora-900">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting the meeting…
              </p>
            ) : (
              <>
                <p className="text-center text-[13.5px] font-semibold text-kinora-900">
                  {livekitStatus === "error"
                    ? "The meeting could not start."
                    : "Start the voice meeting."}
                </p>
                <p className="mt-1 text-center text-[12px] leading-relaxed text-[#6f5a91]">
                  One phone between you. Kinora listens and speaks.
                </p>
                {livekit.error ? (
                  <p className="mt-1 text-center text-[11px] text-[#b34c77]">
                    {livekit.error}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={startVoiceMeeting}
                  className="focus-ring mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13.5px] font-semibold text-white"
                >
                  <AudioLines className="h-4 w-4" />
                  Start the voice meeting
                </button>
              </>
            )}
          </div>
        ) : null}
        <div className="rounded-2xl bg-white p-1.5 shadow-[0_22px_55px_-32px_rgba(50,30,100,0.4)]">
          <div className="rounded-2xl bg-[#f3f3f3] p-2">
            {speech.listening ? (
              <div className="mb-1.5 flex items-center gap-2 rounded-lg bg-white/70 px-2 py-1 text-[13.5px] text-kinora-900">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e0576f]" />
                Recording live…
                <span className="truncate text-muted">
                  {speech.interim || "Speak naturally."}
                </span>
              </div>
            ) : null}
            {speech.error ? (
              <p className="mb-1.5 rounded-lg bg-[#fff6f8] px-2 py-1 text-[13.5px] text-[#b34c77]">
                {speech.error}
              </p>
            ) : null}
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  event.currentTarget.style.height = "auto";
                  event.currentTarget.style.height = `${Math.min(
                    event.currentTarget.scrollHeight,
                    88,
                  )}px`;
                }}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder={`What do you want ${activeName} to say?`}
                aria-label="Your message"
                className="max-h-[88px] min-h-8 flex-1 resize-none bg-transparent px-1 py-1.5 text-[15px] leading-relaxed text-ink placeholder:text-[#94909c] focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleListening}
                aria-label={speech.listening ? "Stop listening" : "Speak"}
                className={cn(
                  "focus-ring mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition",
                  speech.listening
                    ? "bg-[#fdecef] text-[#c34d68]"
                    : "text-[#7c7884] hover:bg-black/[0.04]",
                )}
              >
                {speech.listening ? (
                  <MicOff className="h-[16px] w-[16px]" strokeWidth={1.9} />
                ) : (
                  <Mic className="h-[16px] w-[16px]" strokeWidth={1.8} />
                )}
              </button>
              <button
                type="button"
                onClick={() => void send()}
                disabled={!text.trim() || thinking}
                aria-label="Send message"
                className="focus-ring mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ink text-white shadow-[0_8px_18px_-12px_rgba(120,70,230,0.85)] disabled:opacity-50"
              >
                {thinking ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-white/50 border-t-white" />
                ) : (
                  <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setLivekitOpen(true)}
            className="focus-ring inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#8e8998]"
          >
            <Smartphone className="h-3 w-3" />
            Voice room
          </button>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-label="Session information"
            className="focus-ring inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#8e8998]"
          >
            <Info className="h-3 w-3" />
            Safety & info
          </button>
        </div>
      </div>
      )}
      <EndSheet
        open={endOpen}
        onOpenChange={setEndOpen}
        ending={ending}
        onEnd={() => void end()}
        hasParentTurns={session.turns.some((turn) => turn.speakerId !== "kinora")}
      />

      <LiveKitSheet
        open={livekitOpen}
        onOpenChange={setLivekitOpen}
        session={session}
        livekit={livekit}
      />

      <AboutSheet open={aboutOpen} onOpenChange={setAboutOpen} />

      <AppSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        title="Session safety & info"
        description="Session safety and information."
      >
        <div className="space-y-2">
          <div className="rounded-2xl border border-[#f0dfe3] bg-[#fff8f9] p-3">
            <p className="text-[15px] font-semibold text-[#b34c77]">
              If safety is in question
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-[#7d5a66]">
              Call 911 if you are in immediate danger. Crisis support: 988.
              Domestic violence support: 1-800-799-7233 or thehotline.org.
              Kinora will stop coaching if abuse or self-harm comes up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMoreOpen(false);
              setAboutOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-3 text-left"
          >
            <Sparkles className="h-4 w-4 text-kinora-700" />
            <span className="flex-1 text-[15px] font-medium">About Kinora</span>
            <MoreHorizontal className="h-4 w-4 text-[#c3bdcb]" />
          </button>
          <Link
            href="/app/sessions"
            className="flex w-full items-center gap-3 rounded-2xl border border-[#ece8f4] bg-white p-3 text-left"
          >
            <ShieldCheck className="h-4 w-4 text-kinora-700" />
            <span className="flex-1 text-[15px] font-medium">
              Leave without ending
            </span>
          </Link>
        </div>
      </AppSheet>
    </div>
  );
}

function EndSheet({
  open,
  onOpenChange,
  ending,
  onEnd,
  hasParentTurns,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ending: boolean;
  onEnd: () => void;
  hasParentTurns: boolean;
}) {
  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="End and reflect?"
      description="Kinora will write a neutral summary and the agreements you can save."
    >
      <div className="rounded-2xl border border-[#e9e1fb] bg-[#faf7ff] p-3 text-[13.5px] leading-relaxed text-ink-soft">
        {hasParentTurns
          ? "Both of you have added your side. The summary will reflect what each of you said — without deciding who is right."
          : "Kinora will still write a summary from the opening, but a sentence from each of you makes it much more useful."}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          disabled={ending}
          onClick={onEnd}
          className="focus-ring flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {ending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {ending ? "Writing the summary…" : "End and reflect"}
        </button>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="focus-ring h-10 rounded-full border border-[#e4def0] bg-white px-4 text-[15px] font-semibold text-ink-soft"
        >
          Keep talking
        </button>
      </div>
    </AppSheet>
  );
}
