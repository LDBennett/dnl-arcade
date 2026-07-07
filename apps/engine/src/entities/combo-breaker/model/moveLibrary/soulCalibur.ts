import { BASE_POINTS_BY_DIFFICULTY } from "../constants";
import type { MoveDef } from "../types";
import { dir, press, sequence, simultaneous } from "./helpers";

export const SOUL_CALIBUR_MOVES: MoveDef[] = [
  {
    id: "heaven-cannon",
    label: "Heaven Cannon",
    notation: "236K",
    sourceGame: "soul-calibur",
    character: "Mitsurugi",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([
      dir(2),
      dir(3, { optional: true }),
      dir(6),
      press("K"),
    ]),
  },
  {
    id: "overlord-buster",
    label: "Overlord Buster",
    notation: "3K",
    sourceGame: "soul-calibur",
    character: "Siegfried",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([
      dir(3),
      press("K"),
    ]),
  },
  {
    id: "guard-impact",
    label: "Guard Impact",
    notation: "6H",
    sourceGame: "soul-calibur",
    character: "System mechanic",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([
      simultaneous(
        { kind: "direction", direction: 6 },
        { kind: "button", button: "H" },
      ),
    ]),
  },
  {
    id: "wind-divide",
    label: "Wind Divide",
    notation: "3, H+K",
    sourceGame: "soul-calibur",
    character: "Mitsurugi",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([
      dir(3),
      simultaneous(
        { kind: "button", button: "H" },
        { kind: "button", button: "K" },
      ),
    ]),
  },
];
