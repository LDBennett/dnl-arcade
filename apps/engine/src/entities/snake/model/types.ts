export interface Point {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";
export type SnakeStatus = "ready" | "in-progress" | "over";

export interface SnakeState {
  status: SnakeStatus;
  snake: Point[];
  direction: Direction;
  nextDirection: Direction;
  food: Point;
  score: number;
  tickMs: number;
}

export type SnakeAction =
  | { type: "SET_DIRECTION"; direction: Direction }
  | { type: "START" }
  | { type: "TICK" }
  | { type: "RESET" };
