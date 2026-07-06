"use client";

import { usePlayerName } from "@/entities/player";
import { useRecentGamesForPlayer } from "@/entities/score";

export function useContinuePlaying() {
  const { playerName } = usePlayerName();
  const { entries, loading } = useRecentGamesForPlayer(playerName);
  return { entries, loading };
}
