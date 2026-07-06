"use client";

import { useEffect, useRef } from "react";
import { ScoreSubmitForm } from "@/features/submit-run-score";
import type { LossReason, TerminalStatus } from "@/entities/hack-terminal";
import { MiniLeaderboard } from "./MiniLeaderboard";

export function GameOverPanel({
  status,
  lossReason,
  score,
  gameSlug,
  onRetry,
}: {
  status: TerminalStatus;
  lossReason?: LossReason;
  score?: number;
  gameSlug: string;
  onRetry: () => void;
}) {
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  // The grid's buttons become disabled when the game ends, which drops
  // focus to <body>. Move it to Retry so keyboard/gamepad play can
  // continue without requiring Tab.
  useEffect(() => {
    retryButtonRef.current?.focus();
  }, []);

  return (
    <div className="mt-6">
      <p className="text-lg text-arcade-amber">
        {status === "won"
          ? "ACCESS GRANTED"
          : lossReason === "timeout"
            ? "LOCKOUT — connection timed out"
            : "LOCKOUT — attempts exhausted"}
      </p>
      <button
        ref={retryButtonRef}
        type="button"
        onClick={onRetry}
        className="mt-3 rounded border border-arcade-cyan px-4 py-2 text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
      >
        Retry
      </button>

      {status === "won" && score !== undefined && (
        <>
          <p className="mt-3 text-sm text-arcade-cyan">Score: {score}</p>
          <ScoreSubmitForm gameSlug={gameSlug} score={score} />
          <MiniLeaderboard gameSlug={gameSlug} />
        </>
      )}
    </div>
  );
}
