import { CHARGE_RELEASE_WINDOW_MS } from "./constants";
import { matchSequenceMotion } from "./matchSequenceMotion";
import { matchSequenceProgress, type SequenceProgress } from "./matchSequenceProgress";
import type { BufferedEvent, ChargeMotion } from "./types";

// Finds a charge-release event that satisfies the required direction/hold
// duration, then matches the release steps immediately after it. This is
// what structurally distinguishes charge moves from plain sequences: they
// require a duration precondition before the motion can even begin.
export function matchChargeMotion(
  buffer: readonly BufferedEvent[],
  motion: ChargeMotion,
  afterMs: number,
): number | null {
  const release = buffer.find(
    (event) =>
      event.kind === "charge-release" &&
      event.atMs > afterMs &&
      event.direction === motion.chargeDirection &&
      event.heldMs >= motion.minHoldMs,
  );
  if (!release) return null;

  // The release's first step (e.g. pressing forward) is dispatched in the
  // same reducer call as the charge-release event itself, so they share a
  // timestamp. matchSequenceMotion's `> afterMs` is exclusive, so anchor
  // fractionally before the release to let that same-instant event count.
  return matchSequenceMotion(buffer, motion.releaseSteps, release.atMs - 1, CHARGE_RELEASE_WINDOW_MS);
}

// Live-feedback counterpart to matchChargeMotion: no progress to report while
// still charging (there's nothing in `releaseSteps` to highlight yet), and
// once a qualifying charge-release event exists, progress on the release
// steps themselves.
export function matchChargeProgress(
  buffer: readonly BufferedEvent[],
  motion: ChargeMotion,
  afterMs: number,
): SequenceProgress {
  const release = buffer.find(
    (event) =>
      event.kind === "charge-release" &&
      event.atMs > afterMs &&
      event.direction === motion.chargeDirection &&
      event.heldMs >= motion.minHoldMs,
  );
  if (!release) {
    return { matchedStepIndices: [], totalSteps: motion.releaseSteps.length, nextStep: null };
  }

  return matchSequenceProgress(buffer, motion.releaseSteps, release.atMs - 1, CHARGE_RELEASE_WINDOW_MS);
}
