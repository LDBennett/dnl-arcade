import type { NextConfig } from "next";

// Isolated leaderboard zone: basePath keeps this app's assets/routes namespaced
// under /scores so the lobby's rewrite (apps/lobby/next.config.ts) can proxy
// cleanly without path collisions. See CLAUDE.md section 2.
const nextConfig: NextConfig = {
  basePath: "/scores",
};

export default nextConfig;
