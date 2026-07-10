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
  /** Pending turns, applied one per tick. Depth-limited (see
   *  DIRECTION_QUEUE_SIZE) so quick two-key maneuvers survive a slow tick
   *  instead of overwriting each other. */
  directionQueue: Direction[];
  food: Point;
  score: number;
  tickMs: number;
}

export type SnakeAction =
  | { type: "SET_DIRECTION"; direction: Direction }
  | { type: "START" }
  | { type: "TICK" }
  | { type: "RESET" };
