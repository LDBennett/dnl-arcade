export const GAME_SLUG = "neon-snake";

export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;
export const CELL_SIZE_PX = 20;

export const INITIAL_TICK_MS = 150;
export const MIN_TICK_MS = 60;
export const TICK_MS_STEP = 4;

/** Classic snake input buffer: two queued turns lets a fast zigzag land
 *  inside one slow early-game tick without dropping the second press. */
export const DIRECTION_QUEUE_SIZE = 2;

export const POINTS_PER_FOOD = 10;
