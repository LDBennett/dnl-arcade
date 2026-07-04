import type { Candidate } from "./types";

export function evaluateGuess(
  candidate: Candidate,
  password: Candidate,
): { likeness: number; correct: boolean } {
  const likeness = candidate.code.reduce(
    (count, glyph, index) => (glyph === password.code[index] ? count + 1 : count),
    0,
  );
  return { likeness, correct: candidate.id === password.id };
}
