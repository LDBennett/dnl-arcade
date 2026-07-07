import Link from "next/link";
import { forwardRef, type KeyboardEvent } from "react";
import type { GameEntry } from "../model/types";

export interface GameCardProps extends GameEntry {
  tabIndex?: number;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void;
}

export const GameCard = forwardRef<HTMLAnchorElement, GameCardProps>(function GameCard(
  { slug, title, mechanic, built = true, tabIndex, onFocus, onKeyDown },
  ref,
) {
  return (
    <Link
      ref={ref}
      href={`/${slug}`}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      aria-disabled={!built}
      onClick={(event) => {
        if (!built) event.preventDefault();
      }}
      className={
        built
          ? "block rounded border border-arcade-purple p-4 shadow-neon hover:bg-arcade-panel focus:outline-none focus:ring-2 focus:ring-arcade-amber"
          : "block rounded border border-arcade-purple/30 p-4 grayscale opacity-60 focus:outline-none focus:ring-2 focus:ring-arcade-amber"
      }
    >
      <h2 className={built ? "text-arcade-amber" : "text-arcade-amber/60"}>
        {title}
        {!built && (
          <span className="ml-2 rounded border border-arcade-purple/50 px-1.5 py-0.5 text-[0.6rem] text-arcade-purple">
            COMING SOON
          </span>
        )}
      </h2>
      <p className={built ? "mt-2 text-sm text-arcade-cyan" : "mt-2 text-sm text-arcade-cyan/60"}>
        {mechanic}
      </p>
    </Link>
  );
});
