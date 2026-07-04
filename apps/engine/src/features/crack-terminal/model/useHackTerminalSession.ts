"use client";

import { useEffect, useLayoutEffect, useReducer } from "react";
import {
  createEmptyHackTerminalState,
  hackTerminalReducer,
  type HackTerminalState,
} from "@/entities/hack-terminal";

export interface UseHackTerminalSessionResult {
  state: HackTerminalState;
  submitGuess: (candidateId: string) => void;
  reset: () => void;
}

export function useHackTerminalSession(): UseHackTerminalSessionResult {
  const [state, dispatch] = useReducer(hackTerminalReducer, undefined, createEmptyHackTerminalState);

  // The real puzzle is random, so it can only be generated client-side: doing it
  // in the reducer's lazy initializer would run once during SSR and again during
  // client hydration, producing two different puzzles and a hydration mismatch.
  // useLayoutEffect fires before paint, so the empty placeholder above is never shown.
  useLayoutEffect(() => {
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    if (state.status !== "in-progress") return;

    const intervalId = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(intervalId);
  }, [state.status]);

  return {
    state,
    submitGuess: (candidateId: string) => dispatch({ type: "SUBMIT_GUESS", candidateId }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
