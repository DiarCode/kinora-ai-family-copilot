"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import { apiFetch } from "@/lib/client-api";

/** Apply the room mute state to every attached remote-audio element. */
function applyMute(elements: HTMLMediaElement[], muted: boolean) {
  for (const element of elements) element.muted = muted;
}

export type LiveKitParticipant = {
  identity: string;
  name: string;
  isLocal: boolean;
  isAgent: boolean;
};

export type LiveTranscription = {
  id: string;
  text: string;
  final: boolean;
  participantIdentity: string;
  participantName: string;
  isAgent: boolean;
};

export type DetectedSpeaker = {
  speakerId: string;
  identity: string;
  name: string;
};

export type LiveKitRoomOptions = {
  onSpeakerDetected?: (speaker: DetectedSpeaker) => void;
};

type LiveKitRoomLike = {
  connect: (url: string, token: string) => Promise<void>;
  disconnect: () => void;
  startAudio: () => Promise<unknown>;
  canPlaybackAudio: boolean;
  localParticipant: {
    identity: string;
    name?: string;
    setMicrophoneEnabled: (enabled: boolean) => Promise<unknown>;
    publishData: (
      data: Uint8Array,
      options?: { reliable?: boolean; topic?: string },
    ) => Promise<unknown>;
  };
  remoteParticipants: Map<
    string,
    { identity: string; name?: string; kind?: number }
  >;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler: (...args: unknown[]) => void) => void;
};

type TrackLike = {
  kind?: string;
  attach?: () => HTMLMediaElement;
  detach?: () => HTMLMediaElement[];
};

type SegmentLike = {
  id: string;
  text: string;
  final: boolean;
};

type ParticipantLike = {
  identity?: string;
  name?: string;
  kind?: number;
};

const isAgentParticipant = (participant: {
  identity: string;
  kind?: number;
}) => participant.identity.startsWith("agent-") || participant.kind === 4;

export function useLiveKitRoom(options: LiveKitRoomOptions = {}) {
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const [participants, setParticipants] = useState<LiveKitParticipant[]>([]);
  const [transcriptions, setTranscriptions] = useState<LiveTranscription[]>([]);
  const [agentPresent, setAgentPresent] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<
    "idle" | "requested" | "failed" | "timeout"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [detectedSpeaker, setDetectedSpeaker] =
    useState<DetectedSpeaker | null>(null);
  const onSpeakerDetectedRef = useRef(options.onSpeakerDetected);
  const roomRef = useRef<LiveKitRoomLike | null>(null);
  const roomNameRef = useRef<string | null>(null);
  const audioElements = useRef<HTMLMediaElement[]>([]);
  const mutedRef = useRef(false);
  const [localIdentity, setLocalIdentity] = useState<string | null>(null);

  useEffect(() => {
    onSpeakerDetectedRef.current = options.onSpeakerDetected;
  }, [options.onSpeakerDetected]);

  const syncParticipants = useCallback((room: LiveKitRoomLike) => {
    const remote = Array.from(room.remoteParticipants.values()).map((item) => ({
      identity: item.identity,
      name: item.name || item.identity,
      isLocal: false,
      isAgent: isAgentParticipant(item),
    }));
    setParticipants([
      {
        identity: room.localParticipant.identity,
        name: room.localParticipant.name || room.localParticipant.identity,
        isLocal: true,
        isAgent: false,
      },
      ...remote,
    ]);
    setAgentPresent(remote.some((item) => item.isAgent));
  }, []);

  const removeAudioElements = useCallback(() => {
    for (const element of audioElements.current) {
      element.remove();
    }
    audioElements.current = [];
  }, []);

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    roomNameRef.current = null;
    removeAudioElements();
    setStatus("idle");
    setParticipants([]);
    setTranscriptions([]);
    setAgentPresent(false);
    setDispatchStatus("idle");
    setLocalIdentity(null);
    setMuted(false);
    setAudioBlocked(false);
    setDetectedSpeaker(null);
    mutedRef.current = false;
  }, [removeAudioElements]);

  useEffect(() => () => disconnect(), [disconnect]);

  useEffect(() => {
    if (
      status !== "connected" ||
      agentPresent ||
      dispatchStatus !== "requested"
    ) {
      return;
    }
    // Agent cold starts can take several seconds on LiveKit Cloud. Give the
    // worker room to spin up before the UI offers a retry.
    const timer = window.setTimeout(() => {
      setDispatchStatus((current) =>
        current === "requested" ? "timeout" : current,
      );
    }, 20_000);
    return () => window.clearTimeout(timer);
  }, [agentPresent, dispatchStatus, status]);

  const requestDispatch = useCallback(async (roomName: string) => {
    setDispatchStatus("requested");
    try {
      await apiFetch("/api/livekit/dispatch", {
        method: "POST",
        body: JSON.stringify({ roomName }),
      });
    } catch {
      setDispatchStatus("failed");
    }
  }, []);

  const retryDispatch = useCallback(async () => {
    const roomName = roomNameRef.current;
    if (!roomName) return;
    await requestDispatch(roomName);
  }, [requestDispatch]);

  const connect = useCallback(
    async ({
      roomName,
      identity,
      name,
    }: {
      roomName: string;
      identity: string;
      name: string;
    }) => {
      setStatus("connecting");
      setError(null);
      setDispatchStatus("idle");
      setAudioBlocked(false);
      setTranscriptions([]);
      try {
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        }) as unknown as LiveKitRoomLike;
        roomRef.current = room;
        roomNameRef.current = roomName;

        // Unlock WebAudio from the join tap. iOS Safari requires this before
        // a remote audio element is allowed to play.
        try {
          await room.startAudio();
        } catch {
          // The Voice room sheet exposes an explicit "enable sound" retry.
        }
        setAudioBlocked(!room.canPlaybackAudio);

        const credentials = await apiFetch<{
          token: string;
          url: string;
          roomName: string;
        }>("/api/livekit/token", {
          method: "POST",
          body: JSON.stringify({ roomName, identity, name }),
        });

        const onParticipants = () => syncParticipants(room);

        const onAudioPlaybackChanged = () => {
          setAudioBlocked(!room.canPlaybackAudio);
        };

        const onTrackSubscribed = (...args: unknown[]) => {
          const track = args[0] as TrackLike | undefined;
          if (!track || track.kind !== "audio" || !track.attach) return;
          const element = track.attach();
          element.autoplay = true;
          element.setAttribute("data-kinora-audio", "true");
          element.setAttribute("playsinline", "");
          element.setAttribute("webkit-playsinline", "");
          element.style.display = "none";
          element.muted = mutedRef.current;
          document.body.appendChild(element);
          audioElements.current.push(element);
          void element
            .play?.()
            .then(() => setAudioBlocked(false))
            .catch(() => setAudioBlocked(true));
        };

        const onTrackUnsubscribed = (...args: unknown[]) => {
          const track = args[0] as TrackLike | undefined;
          if (!track?.detach) return;
          const detached = track.detach();
          for (const element of detached) element.remove();
          audioElements.current = audioElements.current.filter(
            (element) => !detached.includes(element),
          );
        };

        const onDisconnected = () => {
          removeAudioElements();
          roomRef.current = null;
          roomNameRef.current = null;
          setStatus("idle");
          setParticipants([]);
          setAgentPresent(false);
          setLocalIdentity(null);
          setAudioBlocked(false);
          setDetectedSpeaker(null);
        };

        const onTranscription = (...args: unknown[]) => {
          const segments = (args[0] ?? []) as SegmentLike[];
          const participant = (args[1] ?? {}) as ParticipantLike;
          if (!Array.isArray(segments) || !segments.length) return;
          const identityValue = participant.identity ?? "";
          const displayName = participant.name || identityValue;
          const agent = isAgentParticipant({
            identity: identityValue,
            kind: participant.kind,
          });

          setTranscriptions((current) => {
            const map = new Map(current.map((item) => [item.id, item]));
            for (const segment of segments) {
              if (!segment?.id || !segment.text) continue;
              map.set(segment.id, {
                id: segment.id,
                text: segment.text,
                final: Boolean(segment.final),
                participantIdentity: identityValue,
                participantName: displayName,
                isAgent: agent,
              });
            }
            return Array.from(map.values()).slice(-40);
          });
        };

        const onDataReceived = (...args: unknown[]) => {
          const payload = args[0];
          let bytes: Uint8Array | undefined;
          if (payload instanceof Uint8Array) {
            bytes = payload;
          } else if (payload && typeof payload === "object" && "data" in payload) {
            const data = (payload as { data?: unknown }).data;
            if (data instanceof Uint8Array) bytes = data;
          }
          if (!bytes) return;
          try {
            const message = JSON.parse(new TextDecoder().decode(bytes)) as {
              type?: string;
              speakerId?: string;
              identity?: string;
              name?: string;
            };
            if (
              message.type === "kinora.speaker_detected" &&
              message.identity &&
              message.name
            ) {
              const speaker = {
                speakerId: message.speakerId ?? "",
                identity: message.identity,
                name: message.name,
              };
              setDetectedSpeaker(speaker);
              onSpeakerDetectedRef.current?.(speaker);
            }
          } catch {
            // Ignore non-Kinora data packets.
          }
        };

        room.on("participantConnected", onParticipants);
        room.on("participantDisconnected", onParticipants);
        room.on("activeSpeakersChanged", onParticipants);
        room.on("trackSubscribed", onTrackSubscribed);
        room.on("trackUnsubscribed", onTrackUnsubscribed);
        room.on("dataReceived", onDataReceived);
        room.on("transcriptionReceived", onTranscription);
        room.on("audioPlaybackChanged", onAudioPlaybackChanged);
        room.on("disconnected", onDisconnected);

        await room.connect(credentials.url, credentials.token);
        roomRef.current = room;
        setLocalIdentity(identity);
        setStatus("connected");
        syncParticipants(room);

        try {
          await room.startAudio();
          setAudioBlocked(!room.canPlaybackAudio);
        } catch {
          setAudioBlocked(true);
        }

        try {
          await room.localParticipant.setMicrophoneEnabled(true);
        } catch {
          setError(
            "Connected to the room, but the microphone was blocked. You can still type or use the device voice mode.",
          );
        }

        await requestDispatch(roomName);
      } catch (cause) {
        roomRef.current?.disconnect();
        roomRef.current = null;
        roomNameRef.current = null;
        removeAudioElements();
        setAudioBlocked(false);
        setDetectedSpeaker(null);
        setStatus("error");
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not join the voice room.",
        );
      }
    },
    [removeAudioElements, requestDispatch, syncParticipants],
  );

  const setRoomMuted = useCallback((next: boolean) => {
    mutedRef.current = next;
    setMuted(next);
    applyMute(audioElements.current, next);
  }, []);

  const toggleMuted = useCallback(() => {
    setRoomMuted(!mutedRef.current);
  }, [setRoomMuted]);

  const selectSpeaker = useCallback(async (identity: string) => {
    const room = roomRef.current;
    if (!room || !identity) return;
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "kinora.speaker", identity }),
      );
      await room.localParticipant.publishData(payload, {
        reliable: true,
        topic: "kinora.speaker",
      });
    } catch {
      // A speaker packet is best-effort; the room still works.
    }
  }, []);

  const endRoom = useCallback(() => {
    const room = roomRef.current;
    if (room) {
      try {
        const payload = new TextEncoder().encode(
          JSON.stringify({ type: "kinora.end" }),
        );
        void room.localParticipant
          .publishData(payload, { reliable: true, topic: "kinora.end" })
          .catch(() => {
            // The agent also has an empty-room timeout.
          });
      } catch {
        // The agent also has an empty-room timeout.
      }
    }
    disconnect();
  }, [disconnect]);

  const startAudio = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      await room.startAudio();
      setAudioBlocked(!room.canPlaybackAudio);
    } catch {
      setAudioBlocked(true);
    }
  }, []);

  return {
    status,
    participants,
    transcriptions,
    agentPresent,
    dispatchStatus,
    localIdentity,
    error,
    muted,
    audioBlocked,
    detectedSpeaker,
    setRoomMuted,
    toggleMuted,
    startAudio,
    retryDispatch,
    connect,
    disconnect,
    endRoom,
    selectSpeaker,
  };
}
