import {
  FAST_EXECUTION_BONUS_MS,
  MAX_STREAK_MULTIPLIER,
  OK_EXECUTION_BONUS_MS,
  STREAK_MULTIPLIER_STEP,
} from "./constants";

export interface CalculateComboScoreInput {
  basePoints: number;
  streak: number;
  executionMs: number;
}

export function calculateComboScore({ basePoints, streak, executionMs }: CalculateComboScoreInput): number {
  const speedBonus =
    executionMs <= FAST_EXECUTION_BONUS_MS ? 1.5 : executionMs <= OK_EXECUTION_BONUS_MS ? 1.2 : 1;
  const streakMultiplier = Math.min(MAX_STREAK_MULTIPLIER, 1 + streak * STREAK_MULTIPLIER_STEP);
  return Math.round(basePoints * speedBonus * streakMultiplier);
}
