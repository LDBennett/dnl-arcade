import { forwardRef, type AnchorHTMLAttributes } from "react";

/**
 * Plain `<a>` for navigating to a different Multi-Zone app (e.g. the lobby
 * at "/" or the engine at "/play/..."). `next/link` would prepend this
 * app's basePath and rewrite the link back into its own zone, so a raw
 * anchor is required here — this wrapper documents that intentionally.
 */
export const ZoneLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  function ZoneLink(props, ref) {
    return <a ref={ref} {...props} />;
  },
);
