"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { LANE_COUNT, type Lane, type SessionNote } from "@/entities/soundwave";
import { drawHighway, HIGHWAY_HEIGHT, HIGHWAY_WIDTH } from "./drawHighway";

export interface HighwayCanvasProps {
  notes: SessionNote[];
  playing: boolean;
  onLaneHit: (lane: Lane) => void;
  getTimeMs: () => number;
  readFrequencyData: () => Uint8Array | null;
  laneFlashesRef: React.RefObject<number[]>;
}

export function HighwayCanvas({
  notes,
  playing,
  onLaneHit,
  getTimeMs,
  readFrequencyData,
  laneFlashesRef,
}: HighwayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The draw loop reads notes through refs so judgment re-renders don't
  // tear down and restart the rAF loop.
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    function loop() {
      drawHighway(ctx as CanvasRenderingContext2D, {
        notes: notesRef.current,
        playing: playingRef.current,
        nowMs: getTimeMs(),
        frequencyData: readFrequencyData(),
        laneFlashes: laneFlashesRef.current ?? [0, 0, 0, 0],
        frameNowMs: performance.now(),
      });
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [getTimeMs, readFrequencyData, laneFlashesRef]);

  // Touch/click support: each lane column is a tap target. pointerdown fires
  // per finger, so two-finger chords register as two hits.
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const lane = Math.floor(((event.clientX - rect.left) / rect.width) * LANE_COUNT);
    if (lane >= 0 && lane < LANE_COUNT) onLaneHit(lane as Lane);
  }

  return (
    <canvas
      ref={canvasRef}
      width={HIGHWAY_WIDTH}
      height={HIGHWAY_HEIGHT}
      onPointerDown={handlePointerDown}
      className="h-auto w-full touch-none select-none border border-arcade-cyan"
    />
  );
}
