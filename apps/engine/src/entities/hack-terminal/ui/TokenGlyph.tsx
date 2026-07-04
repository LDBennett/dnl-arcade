import type { Glyph } from "../model/types";

export interface TokenGlyphProps {
  char: Glyph;
  state?: "matched" | "idle";
}

export function TokenGlyph({ char, state = "idle" }: TokenGlyphProps) {
  return (
    <span
      className={
        state === "matched"
          ? "text-arcade-green"
          : "text-arcade-cyan"
      }
    >
      {char}
    </span>
  );
}
