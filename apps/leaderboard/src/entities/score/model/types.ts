export interface ScoreRecord {
  id: string;
  gameSlug: string;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface CreateScoreInput {
  gameSlug: string;
  playerName: string;
  score: number;
}
