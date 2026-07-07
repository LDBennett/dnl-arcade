import type { NumpadDirection } from "../model/types";

export interface DirectionGlyphProps {
  direction: NumpadDirection;
  state?: "matched" | "idle";
}

const GLYPH_BY_DIRECTION: Record<NumpadDirection, string> = {
  7: "↖",
  8: "↑",
  9: "↗",
  4: "←",
  5: "•",
  6: "→",
  1: "↙",
  2: "↓",
  3: "↘",
};

export function DirectionGlyph({ direction, state = "idle" }: DirectionGlyphProps) {
  return (
    <span className={state === "matched" ? "text-arcade-green" : "text-arcade-cyan"}>
      {GLYPH_BY_DIRECTION[direction]}
    </span>
  );
}
