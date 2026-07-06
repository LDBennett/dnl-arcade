"use client";

import { GameCard, gamesRoster } from "@/entities/game";
import { KeyboardHint, useEscapeKey, useRovingGridFocus } from "@/shared";

const COLUMNS = 2;

export function EngineDashboard() {
  const { focusedIndex, setFocusedIndex, registerItemRef, handleKeyDown } = useRovingGridFocus<
    HTMLAnchorElement
  >({ itemCount: gamesRoster.length, columns: COLUMNS });

  // The dashboard is the engine app's root, so Escape here has nowhere left
  // to go but out to the lobby. That's a different Multi-Zone app, so it
  // needs a hard navigation rather than next/link's client-side routing.
  useEscapeKey(() => {
    window.location.href = "/";
  });

  return (
    <div className="p-8">
      {/* Plain <a>, not next/link: the lobby is a different Multi-Zone app. */}
      <a href="/" className="inline-block text-sm text-arcade-cyan hover:text-arcade-amber">
        &larr; Back to Lobby
      </a>

      <KeyboardHint />
      <div className="mt-2 grid gap-4 sm:grid-cols-2" role="grid">
        {gamesRoster.map((game, index) => (
          <GameCard
            key={game.slug}
            {...game}
            ref={registerItemRef(index)}
            tabIndex={index === focusedIndex ? 0 : -1}
            onFocus={() => setFocusedIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>
    </div>
  );
}
