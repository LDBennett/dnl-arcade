import { calculateScore } from "./calculateScore";
import { MAX_ATTEMPTS, SESSION_TIME_LIMIT_SEC } from "./constants";
import { evaluateGuess } from "./evaluateGuess";
import { generatePuzzle, type GeneratePuzzleOptions } from "./generatePuzzle";
import type { HackTerminalAction, HackTerminalState } from "./types";

export function createInitialHackTerminalState(
  options?: GeneratePuzzleOptions,
): HackTerminalState {
  const puzzle = generatePuzzle(options);
  return {
    status: "in-progress",
    candidates: puzzle.candidates,
    passwordId: puzzle.passwordId,
    attempts: [],
    attemptsRemaining: puzzle.maxAttempts,
    timeRemainingSec: puzzle.timeLimitSec,
  };
}

// Deterministic placeholder with no randomness — safe to render identically on
// server and client. The real puzzle is generated client-only (see
// useHackTerminalSession) since generating it during SSR would produce a
// different random puzzle than the client's hydration pass and mismatch.
export function createEmptyHackTerminalState(): HackTerminalState {
  return {
    status: "in-progress",
    candidates: [],
    passwordId: "",
    attempts: [],
    attemptsRemaining: MAX_ATTEMPTS,
    timeRemainingSec: SESSION_TIME_LIMIT_SEC,
  };
}

export function hackTerminalReducer(
  state: HackTerminalState,
  action: HackTerminalAction,
): HackTerminalState {
  switch (action.type) {
    case "SUBMIT_GUESS": {
      if (state.status !== "in-progress") return state;

      const candidate = state.candidates.find((c) => c.id === action.candidateId);
      if (!candidate) return state;

      const password = state.candidates.find((c) => c.id === state.passwordId)!;
      const { likeness, correct } = evaluateGuess(candidate, password);
      const attempts = [...state.attempts, { candidateId: candidate.id, likeness, correct }];

      if (correct) {
        const score = calculateScore({
          timeRemainingSec: state.timeRemainingSec,
          attemptsRemaining: state.attemptsRemaining,
        });
        return { ...state, attempts, status: "won", score };
      }

      const attemptsRemaining = state.attemptsRemaining - 1;
      return {
        ...state,
        attempts,
        attemptsRemaining,
        status: attemptsRemaining <= 0 ? "lost" : state.status,
        lossReason: attemptsRemaining <= 0 ? "attempts" : state.lossReason,
      };
    }

    case "TICK": {
      if (state.status !== "in-progress") return state;

      const timeRemainingSec = state.timeRemainingSec - 1;
      return {
        ...state,
        timeRemainingSec,
        status: timeRemainingSec <= 0 ? "lost" : state.status,
        lossReason: timeRemainingSec <= 0 ? "timeout" : state.lossReason,
      };
    }

    case "RESET":
      return createInitialHackTerminalState();

    default:
      return state;
  }
}
