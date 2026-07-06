import type { NextConfig } from "next";

// Multi-Zone gateway: proxies isolated engine/leaderboard routes through the
// lobby's origin so the browser only ever talks to port 5000. See CLAUDE.md
// section 2.
const ENGINE_ORIGIN = process.env.ENGINE_ORIGIN ?? "http://localhost:5001";
const LEADERBOARD_ORIGIN = process.env.LEADERBOARD_ORIGIN ?? "http://localhost:5002";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/play", destination: `${ENGINE_ORIGIN}/play` },
      { source: "/play/:path*", destination: `${ENGINE_ORIGIN}/play/:path*` },
      { source: "/scores", destination: `${LEADERBOARD_ORIGIN}/scores` },
      { source: "/scores/:path*", destination: `${LEADERBOARD_ORIGIN}/scores/:path*` },
    ];
  },
};

export default nextConfig;
