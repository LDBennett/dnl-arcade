import Link from "next/link";
import { listTopScores } from "@/entities/score";
import { ZoneLink } from "@/shared";

// Local copy of scored games — extend this list as more games get
// GameOverPanel/submit-run-score wiring.
const SCORED_GAMES = [
  { slug: "matrix-breach", title: "Matrix Breach" },
  { slug: "neon-snake", title: "Neon Snake" },
  { slug: "combo-breaker", title: "ComboBreaker" },
];

export async function LeaderboardBoard({ gameSlug }: { gameSlug?: string }) {
  const selectedSlug = gameSlug ?? SCORED_GAMES[0].slug;
  const entries = await listTopScores(selectedSlug, 10);

  return (
    <main className="p-8">
      <ZoneLink
        href="/"
        className="inline-block text-sm text-arcade-cyan hover:text-arcade-amber"
      >
        &larr; Back to Arcade
      </ZoneLink>

      <h1 className="mt-2 text-2xl text-arcade-green">High Scores</h1>

      <nav className="mt-4 flex flex-wrap gap-8">
        {SCORED_GAMES.map((game) => (
          <div key={game.slug} className="flex flex-col items-center gap-2">
            <Link
              href={`/?gameSlug=${game.slug}`}
              className={
                game.slug === selectedSlug
                  ? "rounded border border-arcade-cyan px-3 py-1 text-arcade-cyan shadow-neon"
                  : "rounded border border-transparent px-3 py-1 text-arcade-cyan/60 hover:text-arcade-cyan"
              }
            >
              {game.title}
            </Link>
            <ZoneLink
              href={`/play/${game.slug}`}
              className="text-sm text-arcade-cyan/60 underline hover:text-arcade-cyan"
            >
              Play
            </ZoneLink>
          </div>
        ))}
      </nav>

      <table className="mt-6 w-full max-w-md text-left text-sm">
        <thead>
          <tr className="text-arcade-cyan/60">
            <th className="pb-2 pr-4">Rank</th>
            <th className="pb-2 pr-4">Player</th>
            <th className="pb-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-arcade-cyan/60">
                No scores yet — be the first to play.
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => (
              <tr key={entry.id} className="text-arcade-cyan">
                <td className="py-1 pr-4">{index + 1}</td>
                <td className="py-1 pr-4">{entry.playerName}</td>
                <td className="py-1">{entry.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
