import { ATTEMPT_BONUS, BASE_SCORE, TIME_BONUS_PER_SEC } from "./constants";

export function calculateScore(input: {
  timeRemainingSec: number;
  attemptsRemaining: number;
}): number {
  return (
    BASE_SCORE +
    input.timeRemainingSec * TIME_BONUS_PER_SEC +
    input.attemptsRemaining * ATTEMPT_BONUS
  );
}
