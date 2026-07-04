/** Raw token values for contexts that can't use Tailwind classes
 *  (Canvas 2D draw calls, Web Audio visualizers, etc). Keep in sync
 *  with the color scale in `tailwind-preset.js`. */
export const arcadeColors = {
  bg: "#0b0b12",
  panel: "#14141f",
  cyan: "#39ffe4",
  magenta: "#ff2bd6",
  purple: "#8b2bff",
  amber: "#ffb000",
  green: "#39ff6a",
  red: "#ff3860",
} as const;

export type ArcadeColor = keyof typeof arcadeColors;

export const arcadeFont = "'Press Start 2P', monospace";
