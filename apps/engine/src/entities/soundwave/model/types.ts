export type Lane = 0 | 1 | 2 | 3;

export type Judgment = "perfect" | "good" | "miss";

export type NoteStatus = "upcoming" | Judgment;

export type TrackDifficulty = "easy" | "medium" | "hard";

/** A charted note: beat offset (may be fractional) from the track's beat 0. */
export interface TrackNote {
  beat: number;
  lane: Lane;
}

export interface TrackDefinition {
  slug: string;
  title: string;
  artist: string;
  difficulty: TrackDifficulty;
  bpm: number;
  /** Audio time (seconds) of beat 0 — anchors the beat grid to the file. */
  firstBeatSec: number;
  durationSec: number;
  /** Where the runtime fetches the song from: any absolute URL (host must
   *  allow CORS — the audio is decoded, not just played), or an app-relative
   *  path including the engine's /play basePath. */
  audioUrl: string;
  notes: TrackNote[];
}

/** A charted note resolved to absolute song time, tracked through a run. */
export interface SessionNote {
  id: number;
  lane: Lane;
  timeMs: number;
  status: NoteStatus;
}

export type SoundwaveStatus = "ready" | "playing" | "over";

export interface JudgmentCounts {
  perfect: number;
  good: number;
  miss: number;
}

export interface SoundwaveState {
  status: SoundwaveStatus;
  track: TrackDefinition;
  /** Sorted by timeMs; judged in place as the run progresses. */
  notes: SessionNote[];
  /** Index of the earliest note still awaiting judgment — bounds all scans. */
  cursor: number;
  score: number;
  combo: number;
  maxCombo: number;
  counts: JudgmentCounts;
  lastJudgment: Judgment | null;
  /** Increments on every judgment so the UI can re-trigger equal-value flashes. */
  judgmentSeq: number;
}

export type SoundwaveAction =
  | { type: "START" }
  | { type: "HIT"; lane: Lane; timeMs: number }
  | { type: "ADVANCE"; timeMs: number }
  | { type: "FINISH" }
  | { type: "RESET" };
