import { GRID_HEIGHT, GRID_WIDTH } from "./constants";
import type { Point } from "./types";

export function placeFood(snake: readonly Point[], random: () => number = Math.random): Point {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const emptyCells: Point[] = [];

  for (let x = 0; x < GRID_WIDTH; x += 1) {
    for (let y = 0; y < GRID_HEIGHT; y += 1) {
      if (!occupied.has(`${x},${y}`)) emptyCells.push({ x, y });
    }
  }

  return emptyCells[Math.floor(random() * emptyCells.length)];
}
