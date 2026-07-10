export const GAME_SLUG = "soundwave";

export const LANE_COUNT = 4;

/** Lane hit keys, left to right — index is the Lane value. */
export const LANE_KEYS = ["d", "f", "j", "k"] as const;

/** Absolute hit-timing windows, in ms either side of a note's moment. */
export const PERFECT_WINDOW_MS = 60;
export const GOOD_WINDOW_MS = 130;

export const POINTS_PERFECT = 100;
export const POINTS_GOOD = 50;

/** Every full COMBO_BONUS_STEP of streak adds COMBO_BONUS_POINTS, capped. */
export const COMBO_BONUS_STEP = 10;
export const COMBO_BONUS_POINTS = 10;
export const MAX_COMBO_BONUS = 50;
