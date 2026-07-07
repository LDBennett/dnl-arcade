"use client";

import { useRouter } from "next/navigation";
import { GAME_SLUG, MoveNotation } from "@/entities/combo-breaker";
import { InputTrailDisplay, useComboBreakerSession } from "@/features/execute-combo";
import { BackToMenuLink, GameOverPanel, KeyboardHint, useEscapeKey } from "@/shared";

export function ComboBreakerArena() {
  const { state, start, reset } = useComboBreakerSession();
  const router = useRouter();

  useEscapeKey(() => router.push("/"));

  return (
    <main className="p-4 sm:p-8">
      <BackToMenuLink />
      <h1 className="mt-2 text-arcade-green">ComboBreaker</h1>
      <p className="mt-2 text-sm text-arcade-cyan">
        Score: {state.score} &middot; Streak: {state.streak} &middot; Time:{" "}
        {Math.ceil(state.timeRemainingMs / 1000)}s
      </p>
      <KeyboardHint />
      <p className="engine-keyboard-hint text-xs text-arcade-purple">
        J = Punch &middot; K = Kick &middot; L = Hold &middot; Gamepad: X = Punch, Y = Kick, A = Hold
      </p>

      <div className="relative mt-4 flex w-full max-w-[500px] gap-4 rounded border border-arcade-cyan p-4">
        <div className="border-r border-arcade-cyan/30 pr-3">
          <InputTrailDisplay trail={state.recentInputTrail} />
        </div>

        <div className="flex-1">
          <MoveNotation move={state.currentMove} matchedStepIndices={state.progress.matchedStepIndices} />
          {state.lastAttemptFeedback && (
            <p className="mt-2 text-xs text-arcade-amber">{state.lastAttemptFeedback}</p>
          )}
        </div>

        {state.status === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-arcade-bg/70">
            <button
              type="button"
              onClick={start}
              className="animate-flicker rounded border border-arcade-cyan px-6 py-3 text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
            >
              PRESS START
            </button>
            <span className="text-sm">Or press any direction key to start</span>
          </div>
        )}

        {state.status === "over" && (
          <div className="absolute inset-0 overflow-y-auto bg-arcade-bg/70 p-3">
            <GameOverPanel
              message={`GAME OVER — final score: ${state.score}`}
              score={state.score}
              gameSlug={GAME_SLUG}
              onRetry={reset}
            />
          </div>
        )}
      </div>
    </main>
  );
}
