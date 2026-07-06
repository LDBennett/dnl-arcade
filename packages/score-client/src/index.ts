export type { GameId, ScoreEntry, SubmitScoreInput, SubmitScoreResult } from "./model/types";
export {
  PLAYER_NAME_STORAGE_KEY,
  getStoredPlayerName,
  setStoredPlayerName,
  generateDefaultPlayerName,
} from "./model/playerIdentity";
export { fetchTopScores } from "./api/fetchTopScores";
export { submitScore } from "./api/submitScore";
export { fetchRecentGamesForPlayer } from "./api/fetchRecentGamesForPlayer";
