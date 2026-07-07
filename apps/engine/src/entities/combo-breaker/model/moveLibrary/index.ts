import { DEAD_OR_ALIVE_MOVES } from "./deadOrAlive";
import { GUILTY_GEAR_MOVES } from "./guiltyGear";
import { MORTAL_KOMBAT_MOVES } from "./mortalKombat";
import { SOUL_CALIBUR_MOVES } from "./soulCalibur";
import { STREET_FIGHTER_MOVES } from "./streetFighter";
import { TEKKEN_MOVES } from "./tekken";

export const MOVE_LIBRARY = [
  ...STREET_FIGHTER_MOVES,
  ...MORTAL_KOMBAT_MOVES,
  ...GUILTY_GEAR_MOVES,
  ...TEKKEN_MOVES,
  ...DEAD_OR_ALIVE_MOVES,
  ...SOUL_CALIBUR_MOVES,
];
