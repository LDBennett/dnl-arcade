"use client";

import { useRouter } from "next/navigation";
import {
  SnakeCanvas,
  TouchDPad,
  useSnakeSession,
} from "@/features/pilot-snake";
import { GAME_SLUG } from "@/entities/snake";
import {
  BackToMenuLink,
  GameOverPanel,
  KeyboardHint,
  useEscapeKey,
} from "@/shared";

export function NeonSnakeArena() {
  const { state, setDirection, start, reset } = useSnakeSession();
  const router = useRouter();

  useEscapeKey(() => router.push("/"));

  return (
    <main className="p-4 sm:p-8">
      <BackToMenuLink />
      <h1 className="mt-2 text-arcade-green">Neon Snake</h1>
      <p className="mt-2 text-sm text-arcade-cyan">Score: {state.score}</p>
      <KeyboardHint />

      <div className="relative mt-4 w-full max-w-[350px]">
        <SnakeCanvas state={state} />

        {state.status === "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-arcade-bg/70 flex-col gap-3">
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

      <TouchDPad onDirection={setDirection} />
    </main>
  );
}
