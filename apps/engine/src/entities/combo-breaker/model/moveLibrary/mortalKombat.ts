import { BASE_POINTS_BY_DIFFICULTY } from "../constants";
import type { MoveDef } from "../types";
import { dir, press, sequence } from "./helpers";

export const MORTAL_KOMBAT_MOVES: MoveDef[] = [
  {
    id: "spear",
    label: 'Spear ("Get Over Here")',
    notation: "4,6,P",
    sourceGame: "mortal-kombat",
    character: "Scorpion",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(4), dir(6), press("P")]),
  },
  {
    id: "ice-ball",
    label: "Ice Ball",
    notation: "2,6,P",
    sourceGame: "mortal-kombat",
    character: "Sub-Zero",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(2), dir(6), press("P")]),
  },
  {
    id: "torpedo",
    label: "Torpedo",
    notation: "4,4,6,K",
    sourceGame: "mortal-kombat",
    character: "Raiden",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(4), dir(4), dir(6), press("K")]),
  },
  {
    id: "flying-kick",
    label: "Flying Kick",
    notation: "6,6,K",
    sourceGame: "mortal-kombat",
    character: "Liu Kang",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(6), dir(6), press("K")]),
  },
];
