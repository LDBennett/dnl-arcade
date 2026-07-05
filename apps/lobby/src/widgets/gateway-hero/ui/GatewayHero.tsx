"use client";

import { useEffect, useRef } from "react";

export function GatewayHero() {
  const enterLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    enterLinkRef.current?.focus();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="animate-flicker text-2xl text-arcade-magenta drop-shadow-neon">
        RetroArcade
      </h1>
      {/* Plain <a>, not next/link: /play is a different Multi-Zone app.
          A soft client-side nav would run engine content under the lobby's
          JS runtime, which has no basePath, breaking every link inside it. */}
      <a
        ref={enterLinkRef}
        href="/play"
        className="rounded border border-arcade-cyan px-6 py-3 text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
      >
        Enter Arcade
      </a>
    </main>
  );
}
