import { fetchTopScores } from "@dnl-arcade/score-client";
import { ScoreTable } from "@/entities/score";
import { LEADERBOARD_ORIGIN, ZoneLink } from "@/shared";

// Hardcoded to matrix-breach for now — the only game with scoring wired up.
// Extend once more games get GameOverPanel/submit-run-score wiring.
const FEATURED_GAME_SLUG = "matrix-breach";

export async function LeaderboardPanel() {
  const entries = await fetchTopScores({
    gameSlug: FEATURED_GAME_SLUG,
    limit: 5,
    baseUrl: LEADERBOARD_ORIGIN,
  });

  return (
    <section className="p-8">
      <h2 className="text-sm text-arcade-cyan/60">High Scores</h2>
      <div className="mt-2">
        <ScoreTable entries={entries} />
      </div>
      <ZoneLink href="/scores" className="mt-2 inline-block text-sm text-arcade-cyan underline">
        View full leaderboard
      </ZoneLink>
    </section>
  );
}
