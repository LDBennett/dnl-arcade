import { BASE_POINTS_BY_DIFFICULTY } from "../constants";
import type { MoveDef } from "../types";
import { dir, press, sequence, simultaneous } from "./helpers";

export const DEAD_OR_ALIVE_MOVES: MoveDef[] = [
  {
    id: "counter-hold",
    label: "Counter Hold",
    notation: "4H",
    sourceGame: "dead-or-alive",
    character: "System mechanic",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([
      simultaneous(
        { kind: "direction", direction: 4 },
        { kind: "button", button: "H" },
      ),
    ]),
  },
  {
    id: "izuna-drop",
    label: "Izuna Drop",
    notation: "41236H",
    sourceGame: "dead-or-alive",
    character: "Ryu Hayabusa",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([
      dir(4),
      dir(1, { optional: true }),
      dir(2),
      dir(3, { optional: true }),
      dir(6),
      press("H"),
    ]),
  },
  {
    id: "wind-roll",
    label: "Wind Roll",
    notation: "236P",
    sourceGame: "dead-or-alive",
    character: "Kasumi",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([
      dir(2),
      dir(3, { optional: true }),
      dir(6),
      press("P"),
    ]),
  },
];
