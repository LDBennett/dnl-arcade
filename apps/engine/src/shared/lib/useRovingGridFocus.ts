"use client";

import { useRef, useState, type KeyboardEvent } from "react";

export interface UseRovingGridFocusOptions {
  itemCount: number;
  columns: number;
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
}: UseRovingGridFocusOptions): UseRovingGridFocusResult<T> {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(T | null)[]>([]);

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
