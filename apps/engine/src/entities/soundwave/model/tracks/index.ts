import type { TrackDefinition } from "../types";
import { dancePlayfulNight } from "./dancePlayfulNight";
import { funkBreakbeat } from "./funkBreakbeat";
import { noCopyrightMusic } from "./noCopyrightMusic";

/** Playable roster, ordered easiest to hardest. */
export const soundwaveTracks: TrackDefinition[] = [
  dancePlayfulNight,
  funkBreakbeat,
  noCopyrightMusic,
];
