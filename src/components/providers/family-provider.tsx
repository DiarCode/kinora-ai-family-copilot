"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type {
  FamilyState,
  MoodValue,
  NextAction,
  Session,
  StateResponse,
} from "@/lib/types";
import { apiFetch } from "@/lib/client-api";

type AiStatus = { mode: "engine" | "llm"; model: string };

type AddChildInput = {
  name: string;
  birthDate: string;
  avatarColor?: string;
};

type FamilyContextValue = {
  state: FamilyState | null;
  actions: NextAction[];
  today: string;
  ai: AiStatus;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setMood: (memberId: string, value: MoodValue, note?: string) => Promise<void>;
  addChild: (input: AddChildInput) => Promise<FamilyState["children"][number]>;
  createSession: (input: {
    problem: string;
    mode: "voice" | "text";
    scheduledFor?: string;
  }) => Promise<Session>;
  updateSession: (
    id: string,
    action: "start" | "complete" | "accept",
    agreements?: string[],
  ) => Promise<Session>;
  sendTurn: (
    sessionId: string,
    speakerId: string,
    text: string,
  ) => Promise<Session>;
  submitAssessment: (
    childId: string,
    answers: { questionId: string; optionIndex: number }[],
  ) => Promise<{ profile: NonNullable<FamilyState["children"][number]["profile"]> }>;
  saveCourseSlide: (slug: string, slideIndex: number) => Promise<void>;
  submitCourseQuiz: (
    slug: string,
    answers: number[],
  ) => Promise<{ passed: boolean; score: number; total: number }>;
  updateSettings: (settings: {
    assistantName?: string;
    plan?: "family" | "plus";
  }) => Promise<void>;
  applyPayload: (payload: StateResponse) => void;
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: StateResponse;
}) {
  const [data, setData] = useState<StateResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // A stable marker for end-to-end tests: the buttons are only interactive
    // once this provider has hydrated.
    document.documentElement.dataset.kinoraReady = "true";
    return () => {
      mounted.current = false;
      delete document.documentElement.dataset.kinoraReady;
    };
  }, []);

  const applyPayload = useCallback((payload: StateResponse) => {
    if (!mounted.current) return;
    setData(payload);
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const payload = await apiFetch<StateResponse>("/api/state");
      applyPayload(payload);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not refresh the family.";
      setError(message);
    }
  }, [applyPayload]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [refresh]);

  const run = useCallback(
    async <T,>(
      path: string,
      init: RequestInit,
      onPayload?: (payload: StateResponse & T) => void,
    ): Promise<T> => {
      setLoading(true);
      try {
        const payload = await apiFetch<StateResponse & T>(path, init);
        applyPayload(payload);
        onPayload?.(payload);
        return payload;
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Something went wrong.";
        setError(message);
        toast.error(message);
        throw cause;
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [applyPayload],
  );

  const setMood = useCallback(
    async (memberId: string, value: MoodValue, note?: string) => {
      await run("/api/mood", {
        method: "POST",
        body: JSON.stringify({ memberId, value, note }),
      });
    },
    [run],
  );

  const addChild = useCallback(
    async (input: AddChildInput) => {
      const result = await run<{ child: FamilyState["children"][number] }>(
        "/api/children",
        { method: "POST", body: JSON.stringify(input) },
      );
      return result.child;
    },
    [run],
  );

  const createSession = useCallback(
    async (input: {
      problem: string;
      mode: "voice" | "text";
      scheduledFor?: string;
    }) => {
      const result = await run<{ session: Session }>("/api/sessions", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return result.session;
    },
    [run],
  );

  const updateSession = useCallback(
    async (
      id: string,
      action: "start" | "complete" | "accept",
      agreements?: string[],
    ) => {
      const result = await run<{ session: Session }>(`/api/sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action, agreements }),
      });
      return result.session;
    },
    [run],
  );

  const sendTurn = useCallback(
    async (sessionId: string, speakerId: string, text: string) => {
      const result = await run<{ session: Session }>(
        `/api/sessions/${sessionId}/turn`,
        {
          method: "POST",
          body: JSON.stringify({ speakerId, text }),
        },
      );
      return result.session;
    },
    [run],
  );

  const submitAssessment = useCallback(
    async (
      childId: string,
      answers: { questionId: string; optionIndex: number }[],
    ) => {
      const result = await run<{
        profile: NonNullable<FamilyState["children"][number]["profile"]>;
      }>(`/api/children/${childId}/assessment`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      return { profile: result.profile };
    },
    [run],
  );

  const saveCourseSlide = useCallback(
    async (slug: string, slideIndex: number) => {
      await run(`/api/courses/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({ slideIndex }),
      });
    },
    [run],
  );

  const submitCourseQuiz = useCallback(
    async (slug: string, answers: number[]) => {
      const result = await run<{
        passed: boolean;
        score: number;
        total: number;
      }>(`/api/courses/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({ answers }),
      });
      return {
        passed: result.passed,
        score: result.score,
        total: result.total,
      };
    },
    [run],
  );

  const updateSettings = useCallback(
    async (settings: {
      assistantName?: string;
      plan?: "family" | "plus";
    }) => {
      await run("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
    },
    [run],
  );

  const value = useMemo<FamilyContextValue>(
    () => ({
      state: data.state,
      actions: data.actions,
      today: data.today,
      ai: data.ai ?? { mode: "engine", model: "Kinora Engine" },
      loading,
      error,
      refresh,
      setMood,
      addChild,
      createSession,
      updateSession,
      sendTurn,
      submitAssessment,
      saveCourseSlide,
      submitCourseQuiz,
      updateSettings,
      applyPayload,
    }),
    [
      data,
      loading,
      error,
      refresh,
      setMood,
      addChild,
      createSession,
      updateSession,
      sendTurn,
      submitAssessment,
      saveCourseSlide,
      submitCourseQuiz,
      updateSettings,
      applyPayload,
    ],
  );

  return (
    <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
  );
}

export function useFamily(): FamilyContextValue {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error("useFamily must be used inside FamilyProvider.");
  }
  return context;
}
