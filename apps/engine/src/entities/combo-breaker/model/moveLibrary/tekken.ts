import { BASE_POINTS_BY_DIFFICULTY } from "../constants";
import type { MoveDef } from "../types";
import { dir, press, sequence } from "./helpers";

export const TEKKEN_MOVES: MoveDef[] = [
  {
    id: "electric-wind-god-fist",
    label: "Electric Wind God Fist",
    notation: "6,5,2,3,P",
    sourceGame: "tekken",
    character: "Kazuya",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([dir(6), dir(5), dir(2), dir(3), press("P")]),
  },
  {
    id: "rising-uppercut",
    label: "Rising Uppercut",
    notation: "3,P",
    sourceGame: "tekken",
    character: "Generic",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(3), press("P")]),
  },
  {
    id: "hellsweep",
    label: "Hellsweep (Spinning Demon Left Kick)",
    notation: "6,5,2,3,K",
    sourceGame: "tekken",
    character: "Kazuya",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([dir(6), dir(5), dir(2), dir(3), press("K")]),
  },
  {
    id: "manji-spin-kick",
    label: "Manji Spin Kick",
    notation: "4,4,K",
    sourceGame: "tekken",
    character: "Yoshimitsu",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(4), dir(4), press("K")]),
  },
];
