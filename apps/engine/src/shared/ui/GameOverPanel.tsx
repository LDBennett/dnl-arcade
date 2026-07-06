"use client";

import { useEffect, useRef } from "react";
import { ScoreSubmitForm } from "@/features/submit-run-score";
import { MiniLeaderboard } from "./MiniLeaderboard";

export function GameOverPanel({
  message,
  score,
  gameSlug,
  onRetry,
}: {
  message: string;
  score?: number;
  gameSlug: string;
  onRetry: () => void;
}) {
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    retryButtonRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <p className="text-lg text-arcade-amber">{message}</p>

      {score !== undefined && (
        <>
          <ScoreSubmitForm gameSlug={gameSlug} score={score} />
          <MiniLeaderboard gameSlug={gameSlug} />
        </>
      )}

      <button
        ref={retryButtonRef}
        type="button"
        onClick={onRetry}
        className="mt-3 rounded border border-arcade-cyan px-4 py-2 text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
      >
        Retry
      </button>
    </div>
  );
}
