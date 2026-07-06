"use client";

import { useRouter } from "next/navigation";
import { AttemptLog, TerminalGrid, useHackTerminalSession } from "@/features/crack-terminal";
import { GAME_SLUG, MAX_ATTEMPTS } from "@/entities/hack-terminal";
import { BackToMenuLink, KeyboardHint, useEscapeKey } from "@/shared";
import { GameOverPanel } from "./GameOverPanel";

export function MatrixBreachTerminal() {
  const { state, submitGuess, reset } = useHackTerminalSession();
  const router = useRouter();

  useEscapeKey(() => router.push("/"));

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

      <div className="mt-4">
        <TerminalGrid
          candidates={state.candidates}
          attempts={state.attempts}
          status={state.status}
          onSubmitGuess={submitGuess}
        />
      </div>

      <AttemptLog
        attempts={state.attempts}
        candidates={state.candidates}
        attemptsRemaining={state.attemptsRemaining}
        maxAttempts={MAX_ATTEMPTS}
      />

      {state.status !== "in-progress" && (
        <GameOverPanel
          status={state.status}
          lossReason={state.lossReason}
          score={state.score}
          gameSlug={GAME_SLUG}
          onRetry={reset}
        />
      )}
    </main>
  );
}
