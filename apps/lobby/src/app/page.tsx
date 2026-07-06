import { ContinuePlayingRail } from "@/widgets/continue-playing-rail";
import { GatewayHero } from "@/widgets/gateway-hero";
import { LeaderboardPanel } from "@/widgets/leaderboard-panel";
import { ProfileMenu } from "@/widgets/profile-menu";

// LeaderboardPanel fetches live scores server-side on every request — this
// page can't be statically prerendered.
export const dynamic = "force-dynamic";

export default function LobbyHome() {
  return (
    <main className="min-h-screen">
      <ProfileMenu />
      <GatewayHero />
      <ContinuePlayingRail />
      <LeaderboardPanel />
    </main>
  );
}
