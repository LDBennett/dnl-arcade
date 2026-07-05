"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export interface UseRovingGridFocusOptions {
  itemCount: number;
  columns: number;
  // Whether items can currently receive focus. Defaults to itemCount > 0.
  // Pass this explicitly for grids that go interactive -> non-interactive ->
  // interactive again (e.g. disabled while a round resolves, then a "Retry"
  // resets it) so focus is restored each time play resumes.
  isActive?: boolean;
}

export interface UseRovingGridFocusResult<T extends HTMLElement> {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerItemRef: (index: number) => (element: T | null) => void;
  handleKeyDown: (event: KeyboardEvent<T>, index: number) => void;
}

// Arrow keys and WASD both move focus one cell in the given direction.
const MOVE_BY_KEY: Record<string, { dCol: number; dRow: number }> = {
  arrowright: { dCol: 1, dRow: 0 },
  d: { dCol: 1, dRow: 0 },
  arrowleft: { dCol: -1, dRow: 0 },
  a: { dCol: -1, dRow: 0 },
  arrowdown: { dCol: 0, dRow: 1 },
  s: { dCol: 0, dRow: 1 },
  arrowup: { dCol: 0, dRow: -1 },
  w: { dCol: 0, dRow: -1 },
};

export function useRovingGridFocus<T extends HTMLElement>({
  itemCount,
  columns,
  isActive,
}: UseRovingGridFocusOptions): UseRovingGridFocusResult<T> {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(T | null)[]>([]);
  const wasFocusable = useRef(false);
  const canFocus = (isActive ?? true) && itemCount > 0;

  // Roving tabindex only lets the browser focus an item once the user tabs in.
  // Focus the initial item as soon as the grid becomes focusable so arrow/WASD
  // keys work immediately, without requiring Tab first. This fires on every
  // false -> true transition, not just on mount: some grids start with
  // itemCount 0 and populate later (client-only data), and some go
  // interactive -> disabled -> interactive again within the same mount.
  useEffect(() => {
    if (canFocus && !wasFocusable.current) {
      itemRefs.current[0]?.focus();
    }
    wasFocusable.current = canFocus;
  }, [canFocus]);

  function moveFocus(nextIndex: number) {
    const clamped = Math.max(0, Math.min(itemCount - 1, nextIndex));
    setFocusedIndex(clamped);
    itemRefs.current[clamped]?.focus();
  }

  function registerItemRef(index: number) {
    return (element: T | null) => {
      itemRefs.current[index] = element;
    };
  }

  function handleKeyDown(event: KeyboardEvent<T>, index: number) {
    const move = MOVE_BY_KEY[event.key.toLowerCase()];
    if (!move) return;
    event.preventDefault();
    moveFocus(index + move.dRow * columns + move.dCol);
  }

  return { focusedIndex, setFocusedIndex, registerItemRef, handleKeyDown };
}
