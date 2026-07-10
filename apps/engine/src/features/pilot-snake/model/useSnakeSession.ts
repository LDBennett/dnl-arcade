"use client";

import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import {
  createEmptySnakeState,
  snakeReducer,
  type Direction,
  type SnakeState,
} from "@/entities/snake";

export interface UseSnakeSessionResult {
  state: SnakeState;
  setDirection: (direction: Direction) => void;
  start: () => void;
  reset: () => void;
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

export function useSnakeSession(): UseSnakeSessionResult {
  const [state, dispatch] = useReducer(snakeReducer, undefined, createEmptySnakeState);

  // Read inside the rAF loop without re-subscribing the effect on every tick.
  const stateRef = useRef(state);
  stateRef.current = state;

  // The real food placement is random, so it can only be generated client-side:
  // doing it in the reducer's lazy initializer would run once during SSR and
  // again during client hydration, producing two different placements and a
  // hydration mismatch. useLayoutEffect fires before paint, so the empty
  // placeholder above is never shown.
  useLayoutEffect(() => {
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) dispatch({ type: "SET_DIRECTION", direction });
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Drives the game loop via requestAnimationFrame with a delta-time
  // accumulator, rather than setInterval, so the tick rate can change
  // (speed ramp) without re-creating a timer. Re-runs only when `status`
  // transitions, so nothing is scheduled while "ready" (waiting for the
  // player to press Start) or once a run ends ("over"), and a fresh loop
  // starts once `start()` flips status to "in-progress".
  useEffect(() => {
    if (state.status !== "in-progress") return;

    let rafId: number;
    let lastTimestamp: number | null = null;
    let accumulatedMs = 0;

    function loop(timestamp: number) {
      if (lastTimestamp !== null) {
        accumulatedMs += timestamp - lastTimestamp;
        const tickMs = stateRef.current.tickMs;
        if (accumulatedMs >= tickMs) {
          dispatch({ type: "TICK" });
          // Carry the remainder so ticks don't quantize up to the next
          // animation frame, but cap it at one tick's worth — a long frame
          // (hidden tab, GC pause) shouldn't burst-fire catch-up ticks.
          accumulatedMs = Math.min(accumulatedMs - tickMs, tickMs);
        }
      }
      lastTimestamp = timestamp;
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [state.status]);

  return {
    state,
    setDirection: (direction: Direction) => dispatch({ type: "SET_DIRECTION", direction }),
    start: () => dispatch({ type: "START" }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
