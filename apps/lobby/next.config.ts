import type { NextConfig } from "next";

// Multi-Zone gateway: proxies isolated engine routes through the lobby's origin
// so the browser only ever talks to port 3000. See CLAUDE.md section 2.
const ENGINE_ORIGIN = process.env.ENGINE_ORIGIN ?? "http://localhost:5001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/play", destination: `${ENGINE_ORIGIN}/play` },
      { source: "/play/:path*", destination: `${ENGINE_ORIGIN}/play/:path*` },
      { source: "/ladders", destination: `${ENGINE_ORIGIN}/ladders` },
      { source: "/ladders/:path*", destination: `${ENGINE_ORIGIN}/ladders/:path*` },
    ];
  },
};

export default nextConfig;
