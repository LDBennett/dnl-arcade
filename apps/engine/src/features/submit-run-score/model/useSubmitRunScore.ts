"use client";

import {
  generateDefaultPlayerName,
  getStoredPlayerName,
  setStoredPlayerName,
  submitScore,
  type SubmitScoreResult,
} from "@dnl-arcade/score-client";
import { useLayoutEffect, useState } from "react";

export type SubmitRunScoreStatus = "idle" | "submitting" | "submitted" | "error";

export interface UseSubmitRunScoreResult {
  playerName: string;
  setPlayerName: (name: string) => void;
  status: SubmitRunScoreStatus;
  result: SubmitScoreResult | null;
  error: string | null;
  submit: () => Promise<void>;
}

export function useSubmitRunScore(gameSlug: string, score: number): UseSubmitRunScoreResult {
  // Starts empty so server and initial client render match — the real name
  // (from storage, or a random default) can only be resolved client-side. See
  // apps/lobby's usePlayerName for the full explanation of this pattern.
  const [playerName, setPlayerName] = useState("");
  const [status, setStatus] = useState<SubmitRunScoreStatus>("idle");
  const [result, setResult] = useState<SubmitScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    setPlayerName(getStoredPlayerName() ?? generateDefaultPlayerName());
  }, []);

  const submit = async () => {
    setStatus("submitting");
    setError(null);
    try {
      const submitted = await submitScore({ gameSlug, playerName, score });
      setStoredPlayerName(playerName);
      setResult(submitted);
      setStatus("submitted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit score");
      setStatus("error");
    }
  };

  return { playerName, setPlayerName, status, result, error, submit };
}
