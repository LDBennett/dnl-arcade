"use client";

import { fetchRecentGamesForPlayer, type ScoreEntry } from "@dnl-arcade/score-client";
import { useEffect, useState } from "react";

export interface UseRecentGamesForPlayerResult {
  entries: ScoreEntry[];
  loading: boolean;
}

export function useRecentGamesForPlayer(
  playerName: string,
  limit = 4,
): UseRecentGamesForPlayerResult {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRecentGamesForPlayer({ playerName, limit })
      .then((result) => {
        if (!cancelled) {
          setEntries(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntries([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [playerName, limit]);

  return { entries, loading };
}
