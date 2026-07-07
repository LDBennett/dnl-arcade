import { STEP_LENIENCY_MS } from "./constants";
import { walkSteps } from "./matchSequenceMotion";
import type { BufferedEvent, MotionStep } from "./types";

export interface SequenceProgress {
  matchedStepIndices: number[];
  totalSteps: number;
  nextStep: MotionStep | null;
}

// Non-failing counterpart to matchSequenceMotion: reports how far into
// `steps` the buffer currently satisfies, for live "you're this far into the
// motion" feedback, rather than a strict all-or-nothing match.
export function matchSequenceProgress(
  buffer: readonly BufferedEvent[],
  steps: readonly MotionStep[],
  afterMs: number,
  leniencyMs: number = STEP_LENIENCY_MS,
): SequenceProgress {
  const result = walkSteps(buffer, steps, afterMs, leniencyMs);
  return {
    matchedStepIndices: result.matchedIndices,
    totalSteps: steps.length,
    nextStep: result.nextRequiredIndex !== null ? steps[result.nextRequiredIndex] : null,
  };
}

const DIRECTION_WORD: Record<number, string> = {
  1: "↙ down-back",
  2: "↓ down",
  3: "↘ down-forward",
  4: "← back",
  5: "neutral",
  6: "→ forward",
  7: "↖ up-back",
  8: "↑ up",
  9: "↗ up-forward",
};

const BUTTON_WORD: Record<string, string> = {
  P: "P (punch)",
  K: "K (kick)",
  H: "H (hold)",
};

// Renders a MotionStep as short human text for the "what you missed" message.
export function describeStep(step: MotionStep): string {
  if (step.kind === "direction") return DIRECTION_WORD[step.direction];
  if (step.kind === "button") return BUTTON_WORD[step.button];
  return step.tokens
    .map((token) => (token.kind === "direction" ? DIRECTION_WORD[token.direction] : BUTTON_WORD[token.button]))
    .join(" + ");
}
