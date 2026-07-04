"use client";

import { GameCard, gamesRoster } from "@/entities/game";
import { KeyboardHint, useRovingGridFocus } from "@/shared";

const COLUMNS = 2;

export function EngineDashboard() {
  const { focusedIndex, setFocusedIndex, registerItemRef, handleKeyDown } = useRovingGridFocus<
    HTMLAnchorElement
  >({ itemCount: gamesRoster.length, columns: COLUMNS });

  return (
    <div className="p-8">
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
