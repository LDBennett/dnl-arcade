export type { ScoreRecord, CreateScoreInput } from "./model/types";
export { validateScoreSubmission } from "./model/validateScoreSubmission";
export {
  listTopScores,
  listRecentGamesForPlayer,
  createScore,
  countScoresAbove,
} from "./model/scoreRepository";
