import { forwardRef, type AnchorHTMLAttributes } from "react";

/**
 * Plain `<a>` for navigating to a different Multi-Zone app (e.g. the lobby
 * at "/", the engine at "/play/...", or the leaderboard at "/scores/...").
 * `next/link` would prepend the current app's basePath and rewrite the link
 * back into its own zone, so a raw anchor is required here — this wrapper
 * documents that intentionally and gives every app the same primitive.
 */
export const ZoneLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  function ZoneLink(props, ref) {
    return <a ref={ref} {...props} />;
  },
);
