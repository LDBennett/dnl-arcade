"use client";

import { useEffect, useRef } from "react";

// Focuses the returned ref's element on mount, so pages with a single
// (or primary) interactive element don't require a Tab press before
// keyboard input does anything.
export function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}
