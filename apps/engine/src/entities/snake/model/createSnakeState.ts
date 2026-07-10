import { GRID_HEIGHT, GRID_WIDTH, INITIAL_TICK_MS } from "./constants";
import { placeFood } from "./placeFood";
import type { Point, SnakeState } from "./types";

function initialSnake(): Point[] {
  const y = Math.floor(GRID_HEIGHT / 2);
  const headX = Math.floor(GRID_WIDTH / 2);
  return [
    { x: headX, y },
    { x: headX - 1, y },
    { x: headX - 2, y },
  ];
}

// Deterministic placeholder with no randomness — safe to render identically on
// server and client. The real food placement is generated client-only (see
// useSnakeSession) since generating it during SSR would produce a different
// random cell than the client's hydration pass and mismatch.
export function createEmptySnakeState(): SnakeState {
  const snake = initialSnake();
  return {
    status: "ready",
    snake,
    direction: "right",
    directionQueue: [],
    food: { x: GRID_WIDTH - 1, y: 0 },
    score: 0,
    tickMs: INITIAL_TICK_MS,
  };
}

export function createInitialSnakeState(random: () => number = Math.random): SnakeState {
  const snake = initialSnake();
  return {
    status: "ready",
    snake,
    direction: "right",
    directionQueue: [],
    food: placeFood(snake, random),
    score: 0,
    tickMs: INITIAL_TICK_MS,
  };
}
