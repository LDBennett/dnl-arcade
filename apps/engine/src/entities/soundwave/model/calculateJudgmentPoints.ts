import {
  COMBO_BONUS_POINTS,
  COMBO_BONUS_STEP,
  MAX_COMBO_BONUS,
  POINTS_GOOD,
  POINTS_PERFECT,
} from "./constants";
import type { Judgment } from "./types";

/** Points awarded for one judged hit, given the streak *before* this hit.
 *  Perfects earn the full streak bonus, goods half of it. */
export function calculateJudgmentPoints(
  judgment: Exclude<Judgment, "miss">,
  comboBefore: number,
): number {
  const bonus = Math.min(
    Math.floor(comboBefore / COMBO_BONUS_STEP) * COMBO_BONUS_POINTS,
    MAX_COMBO_BONUS,
  );
  return judgment === "perfect" ? POINTS_PERFECT + bonus : POINTS_GOOD + bonus / 2;
}
