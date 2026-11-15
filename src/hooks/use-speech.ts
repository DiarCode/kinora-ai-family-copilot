"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
};

type RecognitionConstructor = new () => SpeechRecognitionLike;

export function useSpeechRecognition({
  onFinal,
}: {
  onFinal?: (text: string) => void;
} = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    const globalWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const Recognition = (globalWindow.SpeechRecognition ??
      globalWindow.webkitSpeechRecognition) as
      | RecognitionConstructor
      | undefined;
    // Feature detection is browser-only; read it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(Boolean(Recognition));
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const globalWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const Recognition = (globalWindow.SpeechRecognition ??
      globalWindow.webkitSpeechRecognition) as
      | RecognitionConstructor
      | undefined;
    if (!Recognition) {
      setError("Speech recognition is not available in this browser.");
      return;
    }
    recognitionRef.current?.abort();
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    finalRef.current = "";
    setInterim("");
    setError(null);

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }
      if (finalText) {
        finalRef.current = `${finalRef.current} ${finalText}`.trim();
        onFinalRef.current?.(finalRef.current);
      }
      setInterim(interimText);
    };
    recognition.onerror = (event) => {
      if (event.error === "no-speech") return;
      setError(
        event.error === "not-allowed"
          ? "Microphone permission was blocked. You can type instead."
          : "Voice input stopped. You can type instead.",
      );
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("Voice input could not start. You can type instead.");
      setListening(false);
    }
  }, []);

  const reset = useCallback(() => {
    finalRef.current = "";
    setInterim("");
  }, []);

  return {
    supported,
    listening,
    interim,
    error,
    start,
    stop,
    reset,
  };
}
