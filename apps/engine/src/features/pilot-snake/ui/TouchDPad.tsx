"use client";

import type { Direction } from "@/entities/snake";

const BUTTON_CLASS =
  "flex items-center justify-center rounded border border-arcade-cyan text-2xl text-arcade-cyan shadow-neon active:bg-arcade-cyan active:text-arcade-bg";

export function TouchDPad({ onDirection }: { onDirection: (direction: Direction) => void }) {
  return (
    <div className="engine-touch-dpad mx-auto mt-4 grid-cols-3 grid-rows-3 gap-2 w-56">
      <div />
      <button type="button" className={BUTTON_CLASS} onPointerDown={() => onDirection("up")}>
        ↑
      </button>
      <div />
      <button type="button" className={BUTTON_CLASS} onPointerDown={() => onDirection("left")}>
        ←
      </button>
      <div />
      <button type="button" className={BUTTON_CLASS} onPointerDown={() => onDirection("right")}>
        →
      </button>
      <div />
      <button type="button" className={BUTTON_CLASS} onPointerDown={() => onDirection("down")}>
        ↓
      </button>
      <div />
    </div>
  );
}
