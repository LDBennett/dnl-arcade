import type { ScoreEntry } from "../model/types";

export interface FetchRecentGamesForPlayerParams {
  playerName: string;
  limit?: number;
  baseUrl?: string;
}

export async function fetchRecentGamesForPlayer({
  playerName,
  limit = 4,
  baseUrl = "",
}: FetchRecentGamesForPlayerParams): Promise<ScoreEntry[]> {
  const params = new URLSearchParams({ playerName, limit: String(limit) });
  const response = await fetch(`${baseUrl}/scores/api/scores/recent?${params}`);
  if (!response.ok) {
    // throw new Error(`fetchRecentGamesForPlayer failed: ${response.status}`);
    return [];
  }
  const data = (await response.json()) as { entries: ScoreEntry[] };
  return data.entries;
}
