"use client";

import { useContinuePlaying } from "@/features/continue-playing";
import { ZoneLink } from "@/shared";

export function ContinuePlayingRail() {
  const { entries, loading } = useContinuePlaying();

  if (loading) return null;

  if (entries.length === 0) {
    return (
      <section className="p-8">
        <p className="text-sm text-arcade-cyan/60">
          No games played yet —{" "}
          <ZoneLink href="/play" className="text-arcade-cyan underline">
            jump in!
          </ZoneLink>
        </p>
      </section>
    );
  }

  return (
    <section className="p-8">
      <h2 className="text-sm text-arcade-cyan/60">Continue Playing</h2>
      <div className="mt-2 flex gap-3">
        {entries.map((entry) => (
          <ZoneLink
            key={entry.gameSlug}
            href={`/play/${entry.gameSlug}`}
            className="rounded border border-arcade-cyan px-4 py-2 text-sm text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
          >
            Continue: {entry.gameSlug}
          </ZoneLink>
        ))}
      </div>
    </section>
  );
}
