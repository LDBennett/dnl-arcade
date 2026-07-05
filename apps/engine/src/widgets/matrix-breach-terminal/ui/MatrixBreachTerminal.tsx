"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AttemptLog, TerminalGrid, useHackTerminalSession } from "@/features/crack-terminal";
import { MAX_ATTEMPTS } from "@/entities/hack-terminal";
import { BackToMenuLink, KeyboardHint, useEscapeKey } from "@/shared";

export function MatrixBreachTerminal() {
  const { state, submitGuess, reset } = useHackTerminalSession();
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEscapeKey(() => router.push("/"));

  // The grid's buttons become disabled when the game ends, which drops
  // focus to <body>. Move it to Retry so keyboard/gamepad play can
  // continue without requiring Tab.
  useEffect(() => {
    if (state.status !== "in-progress") {
      retryButtonRef.current?.focus();
    }
  }, [state.status]);

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
        <div className="mt-6">
          <p className="text-lg text-arcade-amber">
            {state.status === "won"
              ? "ACCESS GRANTED"
              : state.lossReason === "timeout"
                ? "LOCKOUT — connection timed out"
                : "LOCKOUT — attempts exhausted"}
          </p>
          <button
            ref={retryButtonRef}
            type="button"
            onClick={reset}
            className="mt-3 rounded border border-arcade-cyan px-4 py-2 text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
          >
            Retry
          </button>
        </div>
      )}
    </main>
  );
}
