"use client";

import {
  generateDefaultPlayerName,
  getStoredPlayerName,
  setStoredPlayerName,
} from "@dnl-arcade/score-client";
import { useLayoutEffect, useState } from "react";

export interface UsePlayerNameResult {
  playerName: string;
  setPlayerName: (name: string) => void;
}

export function usePlayerName(): UsePlayerNameResult {
  // Start empty so server and initial client render match. The real name
  // (from storage, or a random default) can only be resolved client-side, so
  // resolving it in the lazy initializer would run once during SSR and again
  // during client hydration, producing two different values and a hydration
  // mismatch. useLayoutEffect fires before paint, so the empty placeholder is
  // never shown.
  const [playerName, setPlayerNameState] = useState("");

  useLayoutEffect(() => {
    setPlayerNameState(getStoredPlayerName() ?? generateDefaultPlayerName());
  }, []);

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
    setStoredPlayerName(name);
  };

  return { playerName, setPlayerName };
}
