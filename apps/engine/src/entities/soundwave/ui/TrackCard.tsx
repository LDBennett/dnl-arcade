import { forwardRef, type KeyboardEvent } from "react";
import type { TrackDefinition, TrackDifficulty } from "../model/types";

export interface TrackCardProps {
  track: TrackDefinition;
  onSelect: (track: TrackDefinition) => void;
  tabIndex?: number;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

const DIFFICULTY_CLASS: Record<TrackDifficulty, string> = {
  easy: "border-arcade-green/50 text-arcade-green",
  medium: "border-arcade-amber/50 text-arcade-amber",
  hard: "border-arcade-red/50 text-arcade-red",
};

function formatDuration(durationSec: number): string {
  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.round(durationSec % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export const TrackCard = forwardRef<HTMLButtonElement, TrackCardProps>(function TrackCard(
  { track, onSelect, tabIndex, onFocus, onKeyDown },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={() => onSelect(track)}
      className="block w-full rounded border border-arcade-purple p-4 text-left shadow-neon hover:bg-arcade-panel focus:outline-none focus:ring-2 focus:ring-arcade-amber"
    >
      <h2 className="text-arcade-amber">
        {track.title}
        <span
          className={`ml-2 rounded border px-1.5 py-0.5 text-[0.6rem] uppercase ${DIFFICULTY_CLASS[track.difficulty]}`}
        >
          {track.difficulty}
        </span>
      </h2>
      <p className="mt-2 text-sm text-arcade-cyan">
        {track.artist} · {track.bpm} BPM · {formatDuration(track.durationSec)} ·{" "}
        {track.notes.length} notes
      </p>
    </button>
  );
});
