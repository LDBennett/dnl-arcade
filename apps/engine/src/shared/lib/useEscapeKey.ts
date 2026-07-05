"use client";

import { useEffect } from "react";

// Runs onEscape whenever the user presses Escape, regardless of what's
// currently focused. Used to give every game a keyboard "back out" path
// that mirrors its BackToMenuLink/menu navigation.
export function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscape();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
}
