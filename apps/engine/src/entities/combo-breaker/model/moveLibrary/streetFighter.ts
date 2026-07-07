import { BASE_POINTS_BY_DIFFICULTY } from "../constants";
import type { MoveDef } from "../types";
import { dir, press, sequence } from "./helpers";

export const STREET_FIGHTER_MOVES: MoveDef[] = [
  {
    id: "hadouken",
    label: "Hadouken",
    notation: "236P",
    sourceGame: "street-fighter",
    character: "Ryu / Ken",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(2), dir(3, { optional: true }), dir(6), press("P")]),
  },
  {
    id: "shoryuken",
    label: "Shoryuken",
    notation: "623P",
    sourceGame: "street-fighter",
    character: "Ryu / Ken",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([dir(6), dir(2), dir(3, { optional: true }), press("P")]),
  },
  {
    id: "tatsumaki-senpukyaku",
    label: "Tatsumaki Senpukyaku",
    notation: "214K",
    sourceGame: "street-fighter",
    character: "Ryu / Ken",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([dir(2), dir(1, { optional: true }), dir(4), press("K")]),
  },
  {
    id: "shinku-hadouken",
    label: "Shinku Hadouken",
    notation: "236236P",
    sourceGame: "street-fighter",
    character: "Ryu",
    difficulty: "precise",
    basePoints: BASE_POINTS_BY_DIFFICULTY.precise,
    motion: sequence([
      dir(2),
      dir(3, { optional: true }),
      dir(6),
      dir(2),
      dir(3, { optional: true }),
      dir(6),
      press("P"),
    ]),
  },
  {
    id: "spiral-arrow",
    label: "Spiral Arrow",
    notation: "236K",
    sourceGame: "street-fighter",
    character: "Cammy",
    difficulty: "simple",
    basePoints: BASE_POINTS_BY_DIFFICULTY.simple,
    motion: sequence([
      dir(2),
      dir(3, { optional: true }),
      dir(6),
      press("K"),
    ]),
  },
];
