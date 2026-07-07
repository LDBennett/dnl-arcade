"use client";

import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import {
  comboBreakerReducer,
  createEmptyComboBreakerState,
  resolveNumpadDirection,
  type ButtonToken,
  type Cardinal,
  type ComboBreakerState,
  type NumpadDirection,
} from "@/entities/combo-breaker";

export interface UseComboBreakerSessionResult {
  state: ComboBreakerState;
  start: () => void;
  reset: () => void;
}

const KEY_TO_CARDINAL: Record<string, Cardinal> = {
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

const KEY_TO_BUTTON: Record<string, ButtonToken> = {
  j: "P",
  J: "P",
  k: "K",
  K: "K",
  l: "H",
  L: "H",
};

const GAMEPAD_DEADZONE = 0.5;
const GAMEPAD_TICK_THROTTLE_MS = 100;

function gamepadCardinals(gamepad: Gamepad): Cardinal[] {
  const dpad: Cardinal[] = [];
  if (gamepad.buttons[12]?.pressed) dpad.push("up");
  if (gamepad.buttons[13]?.pressed) dpad.push("down");
  if (gamepad.buttons[14]?.pressed) dpad.push("left");
  if (gamepad.buttons[15]?.pressed) dpad.push("right");
  if (dpad.length > 0) return dpad;

  const [x = 0, y = 0] = gamepad.axes;
  const stick: Cardinal[] = [];
  if (y <= -GAMEPAD_DEADZONE) stick.push("up");
  if (y >= GAMEPAD_DEADZONE) stick.push("down");
  if (x <= -GAMEPAD_DEADZONE) stick.push("left");
  if (x >= GAMEPAD_DEADZONE) stick.push("right");
  return stick;
}

export function useComboBreakerSession(): UseComboBreakerSessionResult {
  const [state, dispatch] = useReducer(comboBreakerReducer, undefined, createEmptyComboBreakerState);

  // Read inside the rAF loop without re-subscribing the effect on every tick.
  const stateRef = useRef(state);
  stateRef.current = state;

  // Single merge point for keyboard + gamepad direction input: both sources
  // compare against this ref (not React state, which updates asynchronously)
  // before dispatching, so a direction change is only ever dispatched once
  // regardless of which input source produced it.
  const lastResolvedDirectionRef = useRef<NumpadDirection>(5);

  // The real move pick is random, so it can only be generated client-side —
  // doing it in the reducer's lazy initializer would run once during SSR and
  // again during client hydration, producing two different picks and a
  // hydration mismatch. useLayoutEffect fires before paint, so the empty
  // placeholder above is never shown.
  useLayoutEffect(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Keyboard capture: tracks a recency-ordered list of held cardinal keys so
  // opposing directions resolve via "last input wins" (see
  // resolveNumpadDirection), and fires on both keydown and keyup so
  // releasing a hold back toward neutral is itself a legitimate motion event
  // (needed for charge-move releases).
  useEffect(() => {
    const heldOrder: Cardinal[] = [];

    function resolveAndDispatch() {
      const direction = resolveNumpadDirection(heldOrder);
      if (direction === lastResolvedDirectionRef.current) return;
      lastResolvedDirectionRef.current = direction;
      dispatch({ type: "SET_DIRECTION", direction, atMs: performance.now() });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      const cardinal = KEY_TO_CARDINAL[event.key];
      if (cardinal) {
        if (!heldOrder.includes(cardinal)) heldOrder.push(cardinal);
        resolveAndDispatch();
        return;
      }

      const button = KEY_TO_BUTTON[event.key];
      if (button) dispatch({ type: "PRESS_BUTTON", button, atMs: performance.now() });
    }

    function handleKeyUp(event: KeyboardEvent) {
      const cardinal = KEY_TO_CARDINAL[event.key];
      if (!cardinal) return;
      const index = heldOrder.indexOf(cardinal);
      if (index !== -1) heldOrder.splice(index, 1);
      resolveAndDispatch();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Gamepad polling: the Gamepad API has no change events, so state must be
  // sampled every frame and diffed against the previous frame to emit
  // edge-triggered input events instead of spamming one per held frame. Runs
  // for the component's whole lifetime (not gated on session status) so a
  // controller can also start a "ready" round, same as keyboard input. Also
  // drives the round-timer TICK, throttled since the countdown doesn't need
  // per-frame resolution.
  useEffect(() => {
    let rafId: number;
    let lastTickDispatchMs = 0;
    const buttonsHeld = { punch: false, kick: false, hold: false };

    function loop(timestamp: number) {
      const gamepad = navigator.getGamepads ? navigator.getGamepads()[0] : null;
      if (gamepad) {
        const direction = resolveNumpadDirection(gamepadCardinals(gamepad));
        if (direction !== lastResolvedDirectionRef.current) {
          lastResolvedDirectionRef.current = direction;
          dispatch({ type: "SET_DIRECTION", direction, atMs: timestamp });
        }

        // Standard Gamepad layout: buttons[2] = X, buttons[3] = Y (Xbox controller).
        const punchPressed = gamepad.buttons[2]?.pressed ?? false;
        if (punchPressed && !buttonsHeld.punch) {
          dispatch({ type: "PRESS_BUTTON", button: "P", atMs: timestamp });
        }
        buttonsHeld.punch = punchPressed;

        const kickPressed = gamepad.buttons[3]?.pressed ?? false;
        if (kickPressed && !buttonsHeld.kick) {
          dispatch({ type: "PRESS_BUTTON", button: "K", atMs: timestamp });
        }
        buttonsHeld.kick = kickPressed;

        // A button on controller (buttons[0]) -> H.
        const holdPressed = gamepad.buttons[0]?.pressed ?? false;
        if (holdPressed && !buttonsHeld.hold) {
          dispatch({ type: "PRESS_BUTTON", button: "H", atMs: timestamp });
        }
        buttonsHeld.hold = holdPressed;
      }

      if (
        stateRef.current.status === "in-progress" &&
        timestamp - lastTickDispatchMs >= GAMEPAD_TICK_THROTTLE_MS
      ) {
        dispatch({ type: "TICK", atMs: timestamp });
        lastTickDispatchMs = timestamp;
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return {
    state,
    start: () => dispatch({ type: "START", atMs: performance.now() }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
