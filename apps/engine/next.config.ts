import type { NextConfig } from "next";

// Isolated sandbox zone: basePath keeps this app's assets/routes namespaced
// under /play so the lobby's rewrite (apps/lobby/next.config.ts) can proxy
// cleanly without path collisions. See CLAUDE.md section 2.
const nextConfig: NextConfig = {
  basePath: "/play",
};

export default nextConfig;
