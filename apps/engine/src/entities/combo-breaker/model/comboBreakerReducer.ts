import { calculateComboScore } from "./calculateComboScore";
import { BUFFER_MAX_AGE_MS, INPUT_TRAIL_LENGTH, MOVE_TIME_LIMIT_MS, ROUND_DURATION_MS } from "./constants";
import { createInitialComboBreakerState, emptyProgressFor } from "./createComboBreakerState";
import { matchMove } from "./matchMove";
import { matchMoveProgress } from "./matchMoveProgress";
import { describeStep, type SequenceProgress } from "./matchSequenceProgress";
import { MOVE_LIBRARY } from "./moveLibrary";
import { directionIncludesAxis } from "./numpadAxis";
import { pickNextMove } from "./pickNextMove";
import type {
  BufferedEvent,
  ButtonToken,
  ComboBreakerAction,
  ComboBreakerState,
  InputToken,
  NumpadDirection,
} from "./types";

function describeDropFeedback(progress: SequenceProgress): string {
  const { matchedStepIndices, totalSteps, nextStep } = progress;
  if (matchedStepIndices.length === 0) {
    return nextStep ? `Too slow — start with ${describeStep(nextStep)}` : "Too slow — charge wasn't held long enough";
  }
  return nextStep
    ? `Dropped — ${matchedStepIndices.length}/${totalSteps} inputs landed, needed ${describeStep(nextStep)} next`
    : `Dropped — ${matchedStepIndices.length}/${totalSteps} inputs landed`;
}

function pruneBuffer(buffer: BufferedEvent[], nowMs: number): BufferedEvent[] {
  return buffer.filter((event) => nowMs - event.atMs <= BUFFER_MAX_AGE_MS);
}

function pushTrail(trail: InputToken[], token: InputToken): InputToken[] {
  return [...trail, token].slice(-INPUT_TRAIL_LENGTH);
}

function beginRoundIfReady(state: ComboBreakerState, atMs: number): ComboBreakerState {
  if (state.status !== "ready") return state;
  return {
    ...state,
    status: "in-progress",
    moveShownAtMs: atMs,
    roundStartedAtMs: atMs,
    buffer: [],
    heldDirections: {},
    streak: 0,
    score: 0,
    timeRemainingMs: ROUND_DURATION_MS,
    progress: emptyProgressFor(state.currentMove),
    lastAttemptFeedback: null,
  };
}

function awardMoveIfMatched(state: ComboBreakerState, atMs: number): ComboBreakerState {
  const result = matchMove(state, state.currentMove);
  if (!result.matched || result.completedAtMs === undefined) {
    return { ...state, progress: matchMoveProgress(state, state.currentMove) };
  }

  const executionMs = result.completedAtMs - state.moveShownAtMs;
  const gained = calculateComboScore({
    basePoints: state.currentMove.basePoints,
    streak: state.streak,
    executionMs,
  });

  const nextMove = pickNextMove(MOVE_LIBRARY, state.currentMove.id);
  return {
    ...state,
    score: state.score + gained,
    streak: state.streak + 1,
    currentMove: nextMove,
    moveShownAtMs: atMs,
    buffer: [],
    heldDirections: {},
    progress: emptyProgressFor(nextMove),
    lastAttemptFeedback: null,
  };
}

const AXIS_CARDINALS: readonly NumpadDirection[] = [2, 4, 6, 8];

// Charge holds are tracked per axis cardinal (back/forward/down/up) rather
// than by the exact resolved digit, so a brief flicker onto a diagonal that
// still contains the charging axis (e.g. 4 -> 1 while charging back) doesn't
// reset the held-since timestamp. A charge only actually breaks once the
// axis component is fully absent from the resolved direction.
function applyDirection(state: ComboBreakerState, direction: NumpadDirection, atMs: number): ComboBreakerState {
  let buffer = state.buffer;
  const heldDirections = { ...state.heldDirections };

  for (const axis of AXIS_CARDINALS) {
    const isHeld = directionIncludesAxis(direction, axis);
    const heldSinceMs = heldDirections[axis];

    if (isHeld && heldSinceMs === undefined) {
      heldDirections[axis] = atMs;
    } else if (!isHeld && heldSinceMs !== undefined) {
      buffer = [...buffer, { kind: "charge-release", direction: axis, heldMs: atMs - heldSinceMs, atMs }];
      delete heldDirections[axis];
    }
  }

  buffer = pruneBuffer([...buffer, { kind: "direction", direction, atMs }], atMs);

  const next: ComboBreakerState = {
    ...state,
    buffer,
    heldDirections,
    lastDirection: direction,
    recentInputTrail: pushTrail(state.recentInputTrail, { kind: "direction", direction }),
  };

  return awardMoveIfMatched(next, atMs);
}

function applyButton(state: ComboBreakerState, button: ButtonToken, atMs: number): ComboBreakerState {
  const buffer = pruneBuffer([...state.buffer, { kind: "button", button, atMs }], atMs);
  const next: ComboBreakerState = {
    ...state,
    buffer,
    recentInputTrail: pushTrail(state.recentInputTrail, { kind: "button", button }),
  };

  return awardMoveIfMatched(next, atMs);
}

export function comboBreakerReducer(state: ComboBreakerState, action: ComboBreakerAction): ComboBreakerState {
  switch (action.type) {
    case "SET_DIRECTION": {
      if (state.status === "over") return state;
      return applyDirection(beginRoundIfReady(state, action.atMs), action.direction, action.atMs);
    }

    case "PRESS_BUTTON": {
      if (state.status === "over") return state;
      return applyButton(beginRoundIfReady(state, action.atMs), action.button, action.atMs);
    }

    case "TICK": {
      if (state.status !== "in-progress") return state;

      const timeRemainingMs = Math.max(0, ROUND_DURATION_MS - (action.atMs - state.roundStartedAtMs));
      if (timeRemainingMs <= 0) {
        return { ...state, status: "over", timeRemainingMs: 0 };
      }

      if (action.atMs - state.moveShownAtMs > MOVE_TIME_LIMIT_MS) {
        const feedback = describeDropFeedback(matchMoveProgress(state, state.currentMove));
        const nextMove = pickNextMove(MOVE_LIBRARY, state.currentMove.id);
        return {
          ...state,
          timeRemainingMs,
          streak: 0,
          currentMove: nextMove,
          moveShownAtMs: action.atMs,
          buffer: [],
          heldDirections: {},
          progress: emptyProgressFor(nextMove),
          lastAttemptFeedback: feedback,
        };
      }

      return { ...state, timeRemainingMs };
    }

    case "START":
      return beginRoundIfReady(state, action.atMs);

    case "RESET":
      return createInitialComboBreakerState();

    default:
      return state;
  }
}
