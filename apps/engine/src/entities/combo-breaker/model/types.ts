export type NumpadDirection = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ButtonToken = "P" | "K" | "H";

export type InputToken =
  | { kind: "direction"; direction: NumpadDirection; optional?: boolean }
  | { kind: "button"; button: ButtonToken };

export type MotionStep = InputToken | { kind: "simultaneous"; tokens: InputToken[] };

export interface SequenceMotion {
  kind: "sequence";
  steps: MotionStep[];
}

export interface ChargeMotion {
  kind: "charge";
  chargeDirection: NumpadDirection;
  minHoldMs: number;
  releaseSteps: MotionStep[];
}

export type MoveMotion = SequenceMotion | ChargeMotion;

export type SourceGame =
  | "street-fighter"
  | "mortal-kombat"
  | "guilty-gear"
  | "tekken"
  | "dead-or-alive"
  | "soul-calibur";

export type Difficulty = "simple" | "charge" | "precise";

export interface MoveDef {
  id: string;
  label: string;
  notation: string;
  sourceGame: SourceGame;
  character: string;
  difficulty: Difficulty;
  basePoints: number;
  motion: MoveMotion;
}

export type BufferedEvent =
  | { kind: "direction"; direction: NumpadDirection; atMs: number }
  | { kind: "button"; button: ButtonToken; atMs: number }
  | { kind: "charge-release"; direction: NumpadDirection; heldMs: number; atMs: number };

export type ComboBreakerStatus = "ready" | "in-progress" | "over";

export interface ComboBreakerProgress {
  matchedStepIndices: number[];
  totalSteps: number;
}

export interface ComboBreakerState {
  status: ComboBreakerStatus;
  currentMove: MoveDef;
  moveShownAtMs: number;
  roundStartedAtMs: number;
  buffer: BufferedEvent[];
  heldDirections: Partial<Record<NumpadDirection, number>>;
  lastDirection: NumpadDirection;
  recentInputTrail: InputToken[];
  score: number;
  streak: number;
  timeRemainingMs: number;
  progress: ComboBreakerProgress;
  lastAttemptFeedback: string | null;
}

export type ComboBreakerAction =
  | { type: "SET_DIRECTION"; direction: NumpadDirection; atMs: number }
  | { type: "PRESS_BUTTON"; button: ButtonToken; atMs: number }
  | { type: "TICK"; atMs: number }
  | { type: "START"; atMs: number }
  | { type: "RESET" };
