import type { NumpadDirection } from "./types";

// Numpad digits that share a cardinal's axis component, keyed by that
// cardinal (charge directions are always pure cardinals: 2, 4, 6, or 8).
// e.g. holding "back" (4) and briefly flickering to "up-back" (7) or
// "down-back" (1) should still count as holding back — only dropping the
// component entirely (moving to 5/6/8/2/9/3) should break a charge.
const AXIS_SIBLINGS: Partial<Record<NumpadDirection, readonly NumpadDirection[]>> = {
  4: [4, 1, 7],
  6: [6, 3, 9],
  2: [2, 1, 3],
  8: [8, 7, 9],
};

export function directionIncludesAxis(direction: NumpadDirection, axis: NumpadDirection): boolean {
  return AXIS_SIBLINGS[axis]?.includes(direction) ?? direction === axis;
}
