"use client";

import { fetchTopScores, type ScoreEntry } from "@dnl-arcade/score-client";
import { useEffect, useState } from "react";

export interface UseTopScoresResult {
  entries: ScoreEntry[];
  loading: boolean;
  error: string | null;
}

export function useTopScores(gameSlug: string, limit = 5): UseTopScoresResult {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTopScores({ gameSlug, limit })
      .then((result) => {
        if (!cancelled) {
          setEntries(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load scores");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [gameSlug, limit]);

  return { entries, loading, error };
}
