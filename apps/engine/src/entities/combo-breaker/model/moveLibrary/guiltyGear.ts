import { BASE_POINTS_BY_DIFFICULTY } from "../constants";
import type { MoveDef } from "../types";
import { dir, press, sequence } from "./helpers";

export const GUILTY_GEAR_MOVES: MoveDef[] = [
  {
    id: "gun-flame",
    label: "Gun Flame",
    notation: "236P",
    sourceGame: "guilty-gear",
    character: "Sol Badguy",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(2), dir(3, { optional: true }), dir(6), press("P")]),
  },
  {
    id: "volcanic-viper",
    label: "Volcanic Viper",
    notation: "623K",
    sourceGame: "guilty-gear",
    character: "Sol Badguy",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([dir(6), dir(2), dir(3, { optional: true }), press("K")]),
  },
  {
    id: "stun-edge",
    label: "Stun Edge",
    notation: "236P",
    sourceGame: "guilty-gear",
    character: "Ky Kiske",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(2), dir(3, { optional: true }), dir(6), press("P")]),
  },
];
