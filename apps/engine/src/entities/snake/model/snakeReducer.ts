import { GRID_HEIGHT, GRID_WIDTH, MIN_TICK_MS, POINTS_PER_FOOD, TICK_MS_STEP } from "./constants";
import { createInitialSnakeState } from "./createSnakeState";
import { placeFood } from "./placeFood";
import type { Direction, Point, SnakeAction, SnakeState } from "./types";

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function movePoint(point: Point, direction: Direction): Point {
  switch (direction) {
    case "up":
      return { x: point.x, y: point.y - 1 };
    case "down":
      return { x: point.x, y: point.y + 1 };
    case "left":
      return { x: point.x - 1, y: point.y };
    case "right":
      return { x: point.x + 1, y: point.y };
  }
}

export function snakeReducer(state: SnakeState, action: SnakeAction): SnakeState {
  switch (action.type) {
    case "SET_DIRECTION": {
      if (state.status === "over") return state;
      if (OPPOSITE[action.direction] === state.direction) return state;
      if (state.status === "ready") {
        return { ...state, status: "in-progress", nextDirection: action.direction };
      }
      return { ...state, nextDirection: action.direction };
    }

    case "START": {
      if (state.status !== "ready") return state;
      return { ...state, status: "in-progress" };
    }

    case "TICK": {
      if (state.status !== "in-progress") return state;

      const direction = state.nextDirection;
      const newHead = movePoint(state.snake[0], direction);

      const hitWall =
        newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT;
      if (hitWall) {
        return { ...state, status: "over" };
      }

      const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
      const bodyToCheck = ateFood ? state.snake : state.snake.slice(0, -1);
      const hitSelf = bodyToCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y);
      if (hitSelf) {
        return { ...state, status: "over" };
      }

      const newSnake = ateFood
        ? [newHead, ...state.snake]
        : [newHead, ...state.snake.slice(0, -1)];

      if (!ateFood) {
        return { ...state, snake: newSnake, direction };
      }

      return {
        ...state,
        snake: newSnake,
        direction,
        food: placeFood(newSnake),
        score: state.score + POINTS_PER_FOOD,
        tickMs: Math.max(MIN_TICK_MS, state.tickMs - TICK_MS_STEP),
      };
    }

    case "RESET":
      return createInitialSnakeState();

    default:
      return state;
  }
}
