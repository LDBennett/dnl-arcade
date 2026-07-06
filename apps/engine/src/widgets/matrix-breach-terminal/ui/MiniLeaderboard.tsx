"use client";

import { fetchTopScores, type ScoreEntry } from "@dnl-arcade/score-client";
import { useEffect, useState } from "react";

export function MiniLeaderboard({ gameSlug }: { gameSlug: string }) {
  const [entries, setEntries] = useState<ScoreEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTopScores({ gameSlug, limit: 5 })
      .then((result) => {
        if (!cancelled) setEntries(result);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, [gameSlug]);

  if (!entries || entries.length === 0) return null;

  return (
    <ul className="mt-3 text-sm text-arcade-cyan/80">
      {entries.map((entry, index) => (
        <li key={entry.id}>
          #{index + 1} {entry.playerName} — {entry.score}
        </li>
      ))}
    </ul>
  );
}
