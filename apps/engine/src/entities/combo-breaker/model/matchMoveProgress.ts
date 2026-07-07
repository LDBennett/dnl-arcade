import { matchChargeProgress } from "./matchChargeMotion";
import { matchSequenceProgress, type SequenceProgress } from "./matchSequenceProgress";
import type { ComboBreakerState, MoveDef } from "./types";

export function matchMoveProgress(state: ComboBreakerState, move: MoveDef): SequenceProgress {
  return move.motion.kind === "sequence"
    ? matchSequenceProgress(state.buffer, move.motion.steps, state.moveShownAtMs)
    : matchChargeProgress(state.buffer, move.motion, state.moveShownAtMs);
}
