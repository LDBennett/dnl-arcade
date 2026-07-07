import type { MoveDef } from "./types";

export function pickNextMove(
  library: readonly MoveDef[],
  excludeId?: string,
  random: () => number = Math.random,
): MoveDef {
  const candidates = excludeId ? library.filter((move) => move.id !== excludeId) : library;
  const pool = candidates.length > 0 ? candidates : library;
  return pool[Math.floor(random() * pool.length)];
}
