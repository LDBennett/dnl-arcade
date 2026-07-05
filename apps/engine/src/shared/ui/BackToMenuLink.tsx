import Link from "next/link";
import { forwardRef } from "react";

export const BackToMenuLink = forwardRef<HTMLAnchorElement>(function BackToMenuLink(_, ref) {
  return (
    <Link
      ref={ref}
      href="/"
      className="inline-block text-sm text-arcade-cyan hover:text-arcade-amber"
    >
      &larr; Back to games
    </Link>
  );
});
