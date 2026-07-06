const GAME_SLUG_MAX_LENGTH = 64;
const PLAYER_NAME_MAX_LENGTH = 24;
const PLAYER_NAME_PATTERN = /^[A-Za-z0-9 _-]+$/;
const SCORE_MIN = 0;
const SCORE_MAX = 100_000;

export interface ScoreSubmissionInput {
  gameSlug: unknown;
  playerName: unknown;
  score: unknown;
}

export type ScoreSubmissionValidation =
  | { valid: true; value: { gameSlug: string; playerName: string; score: number } }
  | { valid: false; error: string };

export function validateScoreSubmission(
  input: ScoreSubmissionInput,
): ScoreSubmissionValidation {
  const gameSlug = typeof input.gameSlug === "string" ? input.gameSlug.trim() : "";
  if (gameSlug.length === 0 || gameSlug.length > GAME_SLUG_MAX_LENGTH) {
    return { valid: false, error: "gameSlug must be 1-64 characters" };
  }

  const playerName = typeof input.playerName === "string" ? input.playerName.trim() : "";
  if (
    playerName.length === 0 ||
    playerName.length > PLAYER_NAME_MAX_LENGTH ||
    !PLAYER_NAME_PATTERN.test(playerName)
  ) {
    return {
      valid: false,
      error: "playerName must be 1-24 characters (letters, digits, space, - or _)",
    };
  }

  const score = input.score;
  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < SCORE_MIN ||
    score > SCORE_MAX
  ) {
    return { valid: false, error: `score must be an integer between ${SCORE_MIN} and ${SCORE_MAX}` };
  }

  return { valid: true, value: { gameSlug, playerName, score } };
}
