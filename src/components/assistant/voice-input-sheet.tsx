"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { AppSheet } from "@/components/app/app-sheet";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { useSpeechRecognition } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";

export function VoiceInputSheet({
  open,
  onOpenChange,
  onSubmit,
  onTypeInstead,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (text: string) => void;
  onTypeInstead: () => void;
}) {
  const [transcript, setTranscript] = useState("");
  const {
    supported,
    listening,
    interim,
    error,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
    onFinal: (text) => setTranscript(text),
  });

  useEffect(() => {
    if (!open) {
      stop();
      // Reset the local transcript when the sheet closes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranscript("");
      reset();
    }
  }, [open, reset, stop]);

  const text = `${transcript} ${interim}`.trim();

  const finish = () => {
    if (!text) return;
    stop();
    onSubmit(text);
    onOpenChange(false);
    setTranscript("");
  };

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Talk to Kinora"
      description="Speak naturally. You can edit before sending."
    >
      <div className="flex flex-col items-center pt-2 pb-4">
        <div className="relative grid place-items-center">
          {listening ? (
            <>
              <span className="absolute h-[132px] w-[132px] animate-[ring-pulse_2.2s_ease-out_infinite] rounded-full border border-kinora-500/40" />
              <span className="absolute h-[132px] w-[132px] animate-[ring-pulse_2.2s_ease-out_0.7s_infinite] rounded-full border border-kinora-500/25" />
            </>
          ) : null}
          <KinoraOrb size={116} animated label="Kinora is listening" />
        </div>

        <p className="mt-4 text-[16px] font-medium text-ink">
          {listening ? "Listening…" : supported ? "Ready when you are." : "Voice input is unavailable"}
        </p>
        {error || !supported ? (
          <p className="mt-1 max-w-[300px] text-center text-[14px] leading-relaxed text-muted">
            {error ??
              "This browser does not support speech recognition. Type instead."}
          </p>
        ) : null}

        {text ? (
          <div className="mt-5 w-full rounded-2xl border border-[#ebe6f4] bg-white p-4">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              {transcript}
              {interim ? (
                <span className="text-muted"> {interim}</span>
              ) : null}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex w-full items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (listening) stop();
              else start();
            }}
            disabled={!supported}
            className={cn(
              "focus-ring flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition active:scale-[0.99]",
              listening
                ? "bg-[#3a2e56]"
                : "bg-ink",
              !supported && "cursor-not-allowed bg-[#d9d4e2] text-[#7f7a88]",
            )}
          >
            {listening ? (
              <>
                <MicOff className="h-4 w-4" />
                Stop listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                {text ? "Keep talking" : "Start speaking"}
              </>
            )}
          </button>
          {text ? (
            <button
              type="button"
              onClick={finish}
              className="focus-ring grid h-12 w-12 place-items-center rounded-full bg-ink text-white"
              aria-label="Use this message"
            >
              <span className="text-[16px] leading-none">↑</span>
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-3">
          {text ? (
            <button
              type="button"
              onClick={() => {
                reset();
                setTranscript("");
                stop();
              }}
              className="inline-flex items-center gap-1.5 text-[14px] text-muted"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onTypeInstead();
            }}
            className="text-[14px] font-medium text-kinora-800"
          >
            Type instead
          </button>
        </div>
      </div>
    </AppSheet>
  );
}
