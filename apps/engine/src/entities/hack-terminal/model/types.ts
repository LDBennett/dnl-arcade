export type Glyph = string;

export interface Candidate {
  id: string;
  code: Glyph[];
}

export interface Attempt {
  candidateId: string;
  likeness: number;
  correct: boolean;
}

export type TerminalStatus = "in-progress" | "won" | "lost";
export type LossReason = "attempts" | "timeout";

export interface HackTerminalState {
  status: TerminalStatus;
  lossReason?: LossReason;
  candidates: Candidate[];
  passwordId: string;
  attempts: Attempt[];
  attemptsRemaining: number;
  timeRemainingSec: number;
  score?: number;
}

export type HackTerminalAction =
  | { type: "SUBMIT_GUESS"; candidateId: string }
  | { type: "TICK" }
  | { type: "RESET" };
