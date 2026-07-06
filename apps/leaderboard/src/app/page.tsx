import { LeaderboardBoard } from "@/widgets/leaderboard-board";

export default async function LeaderboardHome({
  searchParams,
}: {
  searchParams: Promise<{ gameSlug?: string }>;
}) {
  const { gameSlug } = await searchParams;
  return <LeaderboardBoard gameSlug={gameSlug} />;
}
