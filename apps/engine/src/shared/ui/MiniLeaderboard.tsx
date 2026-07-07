"use client";

import { fetchTopScores, type ScoreEntry } from "@dnl-arcade/score-client";
import { ZoneLink } from "@dnl-arcade/zone-link";
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

  return (
    <>
      {entries && entries.length > 0 && (
        <ul className="mt-3 text-sm text-arcade-cyan/80">
          {entries.map((entry, index) => (
            <li key={entry.id}>
              #{index + 1} {entry.playerName} — {entry.score}
            </li>
          ))}
        </ul>
      )}
      <ZoneLink
        href={`/scores?gameSlug=${gameSlug}`}
        className="mt-2 inline-block text-sm text-arcade-cyan underline"
      >
        View full leaderboard
      </ZoneLink>
    </>
  );
}
