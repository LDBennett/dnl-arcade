import type { GameId, ScoreEntry } from "../model/types";

export interface FetchTopScoresParams {
  gameSlug: GameId;
  limit?: number;
  baseUrl?: string;
}

export async function fetchTopScores({
  gameSlug,
  limit = 5,
  baseUrl = "",
}: FetchTopScoresParams): Promise<ScoreEntry[]> {
  const params = new URLSearchParams({ gameSlug, limit: String(limit) });
  const response = await fetch(`${baseUrl}/scores/api/scores?${params}`);
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as { entries: ScoreEntry[] };
  return data.entries;
}
