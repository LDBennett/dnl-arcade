export type GameId = string;

export interface ScoreEntry {
  id: string;
  gameSlug: GameId;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface SubmitScoreInput {
  gameSlug: GameId;
  playerName: string;
  score: number;
}

export interface SubmitScoreResult {
  entry: ScoreEntry;
  rank: number;
}
