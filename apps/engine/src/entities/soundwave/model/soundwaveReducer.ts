import { GOOD_WINDOW_MS } from "./constants";
import { calculateJudgmentPoints } from "./calculateJudgmentPoints";
import { createSoundwaveState } from "./createSoundwaveState";
import { judgeHit } from "./judgeHit";
import type { SessionNote, SoundwaveAction, SoundwaveState } from "./types";

function advanceCursor(notes: SessionNote[], cursor: number): number {
  let next = cursor;
  while (next < notes.length && notes[next].status !== "upcoming") next += 1;
  return next;
}

export function soundwaveReducer(state: SoundwaveState, action: SoundwaveAction): SoundwaveState {
  switch (action.type) {
    case "START": {
      if (state.status !== "ready") return state;
      return { ...state, status: "playing" };
    }

    case "HIT": {
      if (state.status !== "playing") return state;

      // Earliest upcoming note in this lane within the hit window. Notes are
      // time-sorted, so the scan can stop past the window's far edge.
      let hitIndex = -1;
      for (let i = state.cursor; i < state.notes.length; i += 1) {
        const note = state.notes[i];
        if (note.timeMs > action.timeMs + GOOD_WINDOW_MS) break;
        if (note.status === "upcoming" && note.lane === action.lane) {
          hitIndex = i;
          break;
        }
      }
      if (hitIndex === -1) return state;

      const judgment = judgeHit(action.timeMs - state.notes[hitIndex].timeMs);
      if (judgment === null) return state;

      const notes = state.notes.map((note, i) =>
        i === hitIndex ? { ...note, status: judgment } : note,
      );
      const combo = state.combo + 1;
      return {
        ...state,
        notes,
        cursor: advanceCursor(notes, state.cursor),
        score: state.score + calculateJudgmentPoints(judgment, state.combo),
        combo,
        maxCombo: Math.max(state.maxCombo, combo),
        counts: { ...state.counts, [judgment]: state.counts[judgment] + 1 },
        lastJudgment: judgment,
        judgmentSeq: state.judgmentSeq + 1,
      };
    }

    case "ADVANCE": {
      if (state.status !== "playing") return state;

      const missDeadline = action.timeMs - GOOD_WINDOW_MS;
      let missCount = 0;
      for (let i = state.cursor; i < state.notes.length; i += 1) {
        const note = state.notes[i];
        if (note.timeMs >= missDeadline) break;
        if (note.status === "upcoming") missCount += 1;
      }
      // The sweep runs every animation frame; bail without allocating so
      // frames with nothing to miss don't re-render.
      if (missCount === 0) return state;

      const notes = state.notes.map((note) =>
        note.status === "upcoming" && note.timeMs < missDeadline
          ? { ...note, status: "miss" as const }
          : note,
      );
      return {
        ...state,
        notes,
        cursor: advanceCursor(notes, state.cursor),
        combo: 0,
        counts: { ...state.counts, miss: state.counts.miss + missCount },
        lastJudgment: "miss",
        judgmentSeq: state.judgmentSeq + missCount,
      };
    }

    case "FINISH": {
      if (state.status !== "playing") return state;
      return { ...state, status: "over" };
    }

    case "RESET":
      return createSoundwaveState(state.track);

    default:
      return state;
  }
}
