import { ROUND_DURATION_MS } from "./constants";
import { MOVE_LIBRARY } from "./moveLibrary";
import { pickNextMove } from "./pickNextMove";
import type { ComboBreakerProgress, ComboBreakerState, MoveDef } from "./types";

export function emptyProgressFor(move: MoveDef): ComboBreakerProgress {
  const totalSteps = move.motion.kind === "sequence" ? move.motion.steps.length : move.motion.releaseSteps.length;
  return { matchedStepIndices: [], totalSteps };
}

// Deterministic placeholder with no randomness — safe to render identically on
// server and client. The real move pick is generated client-only (see
// useComboBreakerSession) since generating it during SSR would produce a
// different random move than the client's hydration pass and mismatch.
export function createEmptyComboBreakerState(): ComboBreakerState {
  const currentMove = MOVE_LIBRARY[0];
  return {
    status: "ready",
    currentMove,
    moveShownAtMs: 0,
    roundStartedAtMs: 0,
    buffer: [],
    heldDirections: {},
    lastDirection: 5,
    recentInputTrail: [],
    score: 0,
    streak: 0,
    timeRemainingMs: ROUND_DURATION_MS,
    progress: emptyProgressFor(currentMove),
    lastAttemptFeedback: null,
  };
}

export function createInitialComboBreakerState(random: () => number = Math.random): ComboBreakerState {
  const currentMove = pickNextMove(MOVE_LIBRARY, undefined, random);
  return {
    status: "ready",
    currentMove,
    moveShownAtMs: 0,
    roundStartedAtMs: 0,
    buffer: [],
    heldDirections: {},
    lastDirection: 5,
    recentInputTrail: [],
    score: 0,
    streak: 0,
    timeRemainingMs: ROUND_DURATION_MS,
    progress: emptyProgressFor(currentMove),
    lastAttemptFeedback: null,
  };
}
