import Link from "next/link";
import { forwardRef, type KeyboardEvent } from "react";
import type { GameEntry } from "../model/types";

export interface GameCardProps extends GameEntry {
  tabIndex?: number;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void;
}

export const GameCard = forwardRef<HTMLAnchorElement, GameCardProps>(function GameCard(
  { slug, title, mechanic, tabIndex, onFocus, onKeyDown },
  ref,
) {
  return (
    <Link
      ref={ref}
      href={`/${slug}`}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      className="block rounded border border-arcade-purple p-4 shadow-neon hover:bg-arcade-panel focus:outline-none focus:ring-2 focus:ring-arcade-amber"
    >
      <h2 className="text-arcade-amber">{title}</h2>
      <p className="mt-2 text-sm text-arcade-cyan">{mechanic}</p>
    </Link>
  );
});
