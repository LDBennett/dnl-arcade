export const GAME_SLUG = "combo-breaker";

export const ROUND_DURATION_MS = 60_000;
export const MOVE_TIME_LIMIT_MS = 4_000;
export const STEP_LENIENCY_MS = 450;
export const SKIP_STEP_LENIENCY_MS = 500;
export const FINAL_PAIR_WINDOW_MS = 250;
export const CHARGE_MIN_HOLD_MS = 800;
export const CHARGE_RELEASE_WINDOW_MS = 400;
export const BUFFER_MAX_AGE_MS = 1_500;
export const INPUT_TRAIL_LENGTH = 8;

export const BASE_POINTS_BY_DIFFICULTY = { simple: 100, charge: 150, precise: 250 } as const;
export const STREAK_MULTIPLIER_STEP = 0.1;
export const MAX_STREAK_MULTIPLIER = 2.0;
export const FAST_EXECUTION_BONUS_MS = 500;
export const OK_EXECUTION_BONUS_MS = 1_000;
