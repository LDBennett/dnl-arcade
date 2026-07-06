"use client";

import { useSubmitRunScore } from "../model/useSubmitRunScore";

export function ScoreSubmitForm({
  gameSlug,
  score,
}: {
  gameSlug: string;
  score: number;
}) {
  const { playerName, setPlayerName, status, result, error, submit } =
    useSubmitRunScore(gameSlug, score);

  if (status === "submitted" && result) {
    return (
      <p className="mt-3 text-sm text-arcade-cyan">
        Saved as {result.entry.playerName} — rank #{result.rank}
      </p>
    );
  }

  return (
    <form
      className="mt-3 flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <input
        id="player_name"
        type="text"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        maxLength={24}
        className="rounded border border-arcade-cyan bg-transparent px-2 py-1 text-sm text-arcade-cyan"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded border border-arcade-cyan px-2 py-1 text-sm text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg disabled:opacity-50 h-auto"
      >
        {status === "submitting" ? "Saving..." : "Save Score"}
      </button>
      {error && <span className="text-sm text-arcade-red">{error}</span>}
    </form>
  );
}
