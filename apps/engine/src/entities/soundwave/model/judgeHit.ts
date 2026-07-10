import { GOOD_WINDOW_MS, PERFECT_WINDOW_MS } from "./constants";
import type { Judgment } from "./types";

/** Judge a hit by its signed offset from the note's moment (hit − note, ms).
 *  Returns null when the press is outside every window (a stray press —
 *  ignored rather than penalized, so mashing can't miss notes early). */
export function judgeHit(offsetMs: number): Exclude<Judgment, "miss"> | null {
  const distance = Math.abs(offsetMs);
  if (distance <= PERFECT_WINDOW_MS) return "perfect";
  if (distance <= GOOD_WINDOW_MS) return "good";
  return null;
}
