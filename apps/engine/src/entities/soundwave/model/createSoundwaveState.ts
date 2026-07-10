import type { SessionNote, SoundwaveState, TrackDefinition } from "./types";

/** Resolve a track's beat-relative chart into absolute song-time session
 *  notes. Pure and deterministic, so it is safe as a reducer initializer. */
export function createSoundwaveState(track: TrackDefinition): SoundwaveState {
  const beatMs = 60000 / track.bpm;
  const notes: SessionNote[] = track.notes.map((note, id) => ({
    id,
    lane: note.lane,
    timeMs: track.firstBeatSec * 1000 + note.beat * beatMs,
    status: "upcoming",
  }));

  return {
    status: "ready",
    track,
    notes,
    cursor: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    counts: { perfect: 0, good: 0, miss: 0 },
    lastJudgment: null,
    judgmentSeq: 0,
  };
}
