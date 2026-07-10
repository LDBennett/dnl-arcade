"use client";

import {
  HighwayCanvas,
  JudgmentHud,
  useSoundwaveSession,
} from "@/features/ride-soundwave";
import { GAME_SLUG, type TrackDefinition } from "@/entities/soundwave";
import { GameOverPanel } from "@/shared";

export function SoundwaveArena({
  track,
  onExit,
}: {
  track: TrackDefinition;
  onExit: () => void;
}) {
  const {
    state,
    loadStatus,
    start,
    reset,
    hitLane,
    getTimeMs,
    readFrequencyData,
    laneFlashesRef,
  } = useSoundwaveSession(track);

  const { perfect, good, miss } = state.counts;

  return (
    <div className="mt-4 w-full max-w-[360px]">
      <p className="text-sm text-arcade-cyan">
        {track.title} — {track.artist}
      </p>
      <div className="mt-2">
        <JudgmentHud state={state} />
      </div>

      <div className="relative mt-2">
        <HighwayCanvas
          notes={state.notes}
          playing={state.status === "playing"}
          onLaneHit={hitLane}
          getTimeMs={getTimeMs}
          readFrequencyData={readFrequencyData}
          laneFlashesRef={laneFlashesRef}
        />

        {state.status === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-arcade-bg/70">
            <button
              type="button"
              onClick={start}
              disabled={loadStatus === "loading"}
              className="animate-flicker rounded border border-arcade-cyan px-6 py-3 text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg disabled:opacity-50"
            >
              {loadStatus === "loading" ? "LOADING…" : "PRESS START"}
            </button>
            {loadStatus === "error" && (
              <p className="text-sm text-arcade-red">Audio failed to load — try again.</p>
            )}
            <p className="px-4 text-center text-sm">
              Hit D F J K — or tap the lanes — as notes reach the line
            </p>
          </div>
        )}

        {state.status === "over" && (
          <div className="absolute inset-0 overflow-y-auto bg-arcade-bg/70 p-3">
            <GameOverPanel
              message={`TRACK CLEAR — ${perfect}× perfect, ${good}× good, ${miss}× miss, best combo ${state.maxCombo}`}
              score={state.score}
              gameSlug={GAME_SLUG}
              onRetry={reset}
            />
            <button
              type="button"
              onClick={onExit}
              className="mt-3 rounded border border-arcade-purple px-4 py-2 text-arcade-purple shadow-neon hover:bg-arcade-purple hover:text-arcade-bg"
            >
              Track select
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
