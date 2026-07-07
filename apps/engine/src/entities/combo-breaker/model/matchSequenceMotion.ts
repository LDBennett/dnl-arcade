import { FINAL_PAIR_WINDOW_MS, SKIP_STEP_LENIENCY_MS, STEP_LENIENCY_MS } from "./constants";
import type { BufferedEvent, InputToken, MotionStep } from "./types";

const SIMULTANEOUS_WINDOW_MS = 100;

function eventSatisfiesToken(event: BufferedEvent, token: InputToken): boolean {
  if (token.kind === "direction") return event.kind === "direction" && event.direction === token.direction;
  return event.kind === "button" && event.button === token.button;
}

function findStepMatch(buffer: readonly BufferedEvent[], step: MotionStep, afterMs: number): number | null {
  if (step.kind !== "simultaneous") {
    const match = buffer.find((event) => event.atMs > afterMs && eventSatisfiesToken(event, step));
    return match ? match.atMs : null;
  }

  const candidateTimes = step.tokens.map(
    (token) => buffer.find((event) => event.atMs > afterMs && eventSatisfiesToken(event, token))?.atMs,
  );
  if (candidateTimes.some((atMs) => atMs === undefined)) return null;

  const times = candidateTimes as number[];
  const spread = Math.max(...times) - Math.min(...times);
  return spread <= SIMULTANEOUS_WINDOW_MS ? Math.max(...times) : null;
}

function isOptionalStep(step: MotionStep): boolean {
  return step.kind === "direction" && step.optional === true;
}

// The true final step of every move in the library is a button immediately
// preceded by a direction (the "motion + button" ending). Real players often
// land the button slightly before or after that last direction, so this pair
// is matched order-independently rather than strictly direction-then-button.
function isFinalDirectionButtonPair(steps: readonly MotionStep[], index: number): boolean {
  if (index !== steps.length - 1) return false;
  const step = steps[index];
  const previous = steps[index - 1];
  return step.kind === "button" && previous !== undefined && previous.kind === "direction";
}

export interface StepWalkResult {
  matchedIndices: number[];
  completedAtMs: number | null;
  failed: boolean;
  // Index of the step that blocked further progress (missing or out of the
  // leniency window), or null once every step has been satisfied.
  nextRequiredIndex: number | null;
}

// Shared walker behind both matchSequenceMotion (pass/fail) and
// matchSequenceProgress (partial credit for live feedback) so both agree on
// leniency, optional-skip, and final-pair-order rules.
export function walkSteps(
  buffer: readonly BufferedEvent[],
  steps: readonly MotionStep[],
  afterMs: number,
  leniencyMs: number = STEP_LENIENCY_MS,
): StepWalkResult {
  let cursor = afterMs;
  let previousMatchMs: number | null = null;
  let skippedSincePreviousMatch = false;
  const matchedIndices: number[] = [];

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    const isFinalPair = isFinalDirectionButtonPair(steps, index);
    const searchFrom = isFinalPair ? cursor - FINAL_PAIR_WINDOW_MS : cursor;
    const matchedAt = findStepMatch(buffer, step, searchFrom);

    if (matchedAt === null) {
      if (isOptionalStep(step)) {
        skippedSincePreviousMatch = true;
        continue;
      }
      return { matchedIndices, completedAtMs: null, failed: true, nextRequiredIndex: index };
    }

    if (previousMatchMs !== null) {
      const gap = isFinalPair ? Math.abs(matchedAt - previousMatchMs) : matchedAt - previousMatchMs;
      const allowedGapMs = isFinalPair
        ? FINAL_PAIR_WINDOW_MS
        : skippedSincePreviousMatch
          ? SKIP_STEP_LENIENCY_MS
          : leniencyMs;
      if (gap > allowedGapMs) return { matchedIndices, completedAtMs: null, failed: true, nextRequiredIndex: index };
    }

    matchedIndices.push(index);
    previousMatchMs = matchedAt;
    cursor = matchedAt;
    skippedSincePreviousMatch = false;
  }

  return { matchedIndices, completedAtMs: previousMatchMs, failed: false, nextRequiredIndex: null };
}

// Walks the buffer for an in-order match of `steps` and returns the
// timestamp the final step completed at, or null if the motion wasn't
// completed within the leniency/skip/final-pair rules (see `walkSteps`).
export function matchSequenceMotion(
  buffer: readonly BufferedEvent[],
  steps: MotionStep[],
  afterMs: number,
  leniencyMs: number = STEP_LENIENCY_MS,
): number | null {
  const result = walkSteps(buffer, steps, afterMs, leniencyMs);
  return result.failed ? null : result.completedAtMs;
}
