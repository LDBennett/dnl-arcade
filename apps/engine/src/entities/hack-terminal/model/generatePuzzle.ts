import {
  ALPHABET,
  CANDIDATE_COUNT,
  CODE_LENGTH,
  MAX_ATTEMPTS,
  SESSION_TIME_LIMIT_SEC,
} from "./constants";
import type { Candidate, Glyph } from "./types";

export interface GeneratePuzzleOptions {
  candidateCount?: number;
  codeLength?: number;
  alphabet?: readonly Glyph[];
  maxAttempts?: number;
  timeLimitSec?: number;
  random?: () => number;
}

export interface GeneratedPuzzle {
  candidates: Candidate[];
  passwordId: string;
  maxAttempts: number;
  timeLimitSec: number;
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function randomCode(codeLength: number, alphabet: readonly Glyph[], random: () => number): Glyph[] {
  return Array.from({ length: codeLength }, () => pick(alphabet, random));
}

function mutateCode(
  base: readonly Glyph[],
  alphabet: readonly Glyph[],
  random: () => number,
): Glyph[] {
  const mutationCount = 1 + Math.floor(random() * 3); // 1..3 positions
  const code = [...base];
  const positions = new Set<number>();
  while (positions.size < Math.min(mutationCount, code.length)) {
    positions.add(Math.floor(random() * code.length));
  }
  for (const position of positions) {
    const otherGlyphs = alphabet.filter((glyph) => glyph !== code[position]);
    code[position] = pick(otherGlyphs, random);
  }
  return code;
}

function codeKey(code: readonly Glyph[]): string {
  return code.join("");
}

export function generatePuzzle(options: GeneratePuzzleOptions = {}): GeneratedPuzzle {
  const codeLength = options.codeLength ?? CODE_LENGTH;
  const candidateCount = options.candidateCount ?? CANDIDATE_COUNT;
  const alphabet = options.alphabet ?? ALPHABET;
  const maxAttempts = options.maxAttempts ?? MAX_ATTEMPTS;
  const timeLimitSec = options.timeLimitSec ?? SESSION_TIME_LIMIT_SEC;
  const random = options.random ?? Math.random;

  const passwordCode = randomCode(codeLength, alphabet, random);
  const usedKeys = new Set([codeKey(passwordCode)]);

  const candidates: Candidate[] = [
    { id: "c0", code: passwordCode },
  ];

  for (let i = 1; i < candidateCount; i += 1) {
    let decoyCode = mutateCode(passwordCode, alphabet, random);
    while (usedKeys.has(codeKey(decoyCode))) {
      decoyCode = mutateCode(passwordCode, alphabet, random);
    }
    usedKeys.add(codeKey(decoyCode));
    candidates.push({ id: `c${i}`, code: decoyCode });
  }

  // Shuffle so the password isn't always c0.
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const passwordId = candidates.find((candidate) => codeKey(candidate.code) === codeKey(passwordCode))!.id;

  return { candidates, passwordId, maxAttempts, timeLimitSec };
}
