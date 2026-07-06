"use client";

import { useRouter } from "next/navigation";
import {
  AttemptLog,
  TerminalGrid,
  useHackTerminalSession,
} from "@/features/crack-terminal";
import { GAME_SLUG, MAX_ATTEMPTS } from "@/entities/hack-terminal";
import { BackToMenuLink, GameOverPanel, KeyboardHint, useEscapeKey } from "@/shared";

export function MatrixBreachTerminal() {
  const { state, submitGuess, reset } = useHackTerminalSession();
  const router = useRouter();

  useEscapeKey(() => router.push("/"));

  const gameOverMessage =
    state.status === "won"
      ? `ACCESS GRANTED — score: ${state.score}`
      : state.lossReason === "timeout"
        ? "LOCKOUT — connection timed out"
        : "LOCKOUT — attempts exhausted";

  return (
    <main className="p-8">
      <BackToMenuLink />
      <h1 className="mt-2 text-arcade-green">Matrix Breach</h1>
      <div className="mt-2 flex gap-6 text-sm text-arcade-cyan">
        <span>Time remaining: {state.timeRemainingSec}s</span>
        <span>
          Attempts: {state.attemptsRemaining} / {MAX_ATTEMPTS}
        </span>
      </div>
      <KeyboardHint />

      <div className="relative mt-4">
        <TerminalGrid
          candidates={state.candidates}
          attempts={state.attempts}
          status={state.status}
          onSubmitGuess={submitGuess}
        />

        {state.status !== "in-progress" && (
          <div className="absolute inset-0 overflow-y-auto bg-arcade-bg/70 p-3 flex justify-center align-center">
            <GameOverPanel
              message={gameOverMessage}
              score={state.status === "won" ? state.score : undefined}
              gameSlug={GAME_SLUG}
              onRetry={reset}
            />
          </div>
        )}
      </div>

      <AttemptLog
        attempts={state.attempts}
        candidates={state.candidates}
        attemptsRemaining={state.attemptsRemaining}
        maxAttempts={MAX_ATTEMPTS}
      />
    </main>
  );
}
