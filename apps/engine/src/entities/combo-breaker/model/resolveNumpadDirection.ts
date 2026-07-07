import type { NumpadDirection } from "./types";

export type Cardinal = "up" | "down" | "left" | "right";

const NUMPAD_BY_AXES: Record<string, NumpadDirection> = {
  "up,left": 7,
  "up,": 8,
  "up,right": 9,
  ",left": 4,
  ",": 5,
  ",right": 6,
  "down,left": 1,
  "down,": 2,
  "down,right": 3,
};

// `heldInOrder` is recency-ordered (most recently pressed last). Opposing
// cardinals on the same axis (left/right, up/down) resolve independently per
// axis to whichever was pressed most recently — the standard SOCD
// "last input wins" convention used by fighting-game input emulators.
export function resolveNumpadDirection(heldInOrder: readonly Cardinal[]): NumpadDirection {
  let vertical: "up" | "down" | undefined;
  let horizontal: "left" | "right" | undefined;

  for (const cardinal of heldInOrder) {
    if (cardinal === "up" || cardinal === "down") vertical = cardinal;
    else horizontal = cardinal;
  }

  return NUMPAD_BY_AXES[`${vertical ?? ""},${horizontal ?? ""}`];
}
