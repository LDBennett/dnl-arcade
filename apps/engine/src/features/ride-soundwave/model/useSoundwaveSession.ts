"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  createSoundwaveState,
  LANE_KEYS,
  soundwaveReducer,
  type Lane,
  type SoundwaveState,
  type TrackDefinition,
} from "@/entities/soundwave";
import { createAudioEngine, type SoundwaveAudioEngine } from "./audioEngine";

export type TrackLoadStatus = "idle" | "loading" | "error";

/** Get-ready window between pressing start and the first audio sample.
 *  Scheduled on the audio clock, so song time runs negative until zero. */
export const COUNTDOWN_SEC = 3;

export interface UseSoundwaveSessionResult {
  state: SoundwaveState;
  loadStatus: TrackLoadStatus;
  start: () => void;
  reset: () => void;
  /** Register a lane hit at the current song time — keyboard and touch both land here. */
  hitLane: (lane: Lane) => void;
  getTimeMs: () => number;
  readFrequencyData: () => Uint8Array | null;
  /** performance.now() of the last press per lane, for the canvas key glow. */
  laneFlashesRef: React.RefObject<number[]>;
}

export function useSoundwaveSession(track: TrackDefinition): UseSoundwaveSessionResult {
  const [state, dispatch] = useReducer(soundwaveReducer, track, createSoundwaveState);
  const [loadStatus, setLoadStatus] = useState<TrackLoadStatus>("idle");

  // Read inside event handlers and the rAF loop without re-subscribing.
  const stateRef = useRef(state);
  stateRef.current = state;

  const engineRef = useRef<SoundwaveAudioEngine | null>(null);
  const laneFlashesRef = useRef<number[]>([0, 0, 0, 0]);

  const getTimeMs = useCallback(() => engineRef.current?.getTimeMs() ?? 0, []);
  const readFrequencyData = useCallback(
    () => engineRef.current?.readFrequencyData() ?? null,
    [],
  );

  const start = useCallback(async () => {
    if (stateRef.current.status !== "ready") return;
    setLoadStatus("loading");
    try {
      const engine = engineRef.current ?? createAudioEngine(track.audioUrl);
      engineRef.current = engine;
      await engine.load();
      engine.start(() => dispatch({ type: "FINISH" }), COUNTDOWN_SEC);
      setLoadStatus("idle");
      dispatch({ type: "START" });
    } catch {
      setLoadStatus("error");
    }
  }, [track.audioUrl]);

  const reset = useCallback(() => {
    engineRef.current?.stop();
    dispatch({ type: "RESET" });
  }, []);

  // Hits are judged against the audio clock, not the input event timestamp —
  // judgment and playback must share one clock or windows drift.
  const hitLane = useCallback(
    (lane: Lane) => {
      if (stateRef.current.status !== "playing") return;
      laneFlashesRef.current[lane] = performance.now();
      dispatch({ type: "HIT", lane, timeMs: getTimeMs() });
    },
    [getTimeMs],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      const lane = (LANE_KEYS as readonly string[]).indexOf(event.key.toLowerCase());
      if (lane !== -1) hitLane(lane as Lane);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hitLane]);

  // Miss sweep: notes whose window has fully passed are judged every frame.
  // The reducer returns the same reference when nothing lapsed, so idle
  // frames cost no re-render.
  useEffect(() => {
    if (state.status !== "playing") return;
    let rafId: number;
    function loop() {
      dispatch({ type: "ADVANCE", timeMs: getTimeMs() });
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [state.status, getTimeMs]);

  // Strict teardown: leaving the arena (Escape, back link, route change)
  // silences playback and closes the AudioContext immediately.
  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  return { state, loadStatus, start, reset, hitLane, getTimeMs, readFrequencyData, laneFlashesRef };
}
