import { matchChargeMotion } from "./matchChargeMotion";
import { matchSequenceMotion } from "./matchSequenceMotion";
import type { ComboBreakerState, MoveDef } from "./types";

export interface MoveMatchResult {
  matched: boolean;
  completedAtMs?: number;
}

export function matchMove(state: ComboBreakerState, move: MoveDef): MoveMatchResult {
  const completedAtMs =
    move.motion.kind === "sequence"
      ? matchSequenceMotion(state.buffer, move.motion.steps, state.moveShownAtMs)
      : matchChargeMotion(state.buffer, move.motion, state.moveShownAtMs);

  return completedAtMs === null ? { matched: false } : { matched: true, completedAtMs };
}
