"use client";

import { useMemo } from "react";
import type { Attempt, Candidate, TerminalStatus } from "@/entities/hack-terminal";
import { useRovingGridFocus } from "@/shared";

const COLUMNS = 4;

export interface TerminalGridProps {
  candidates: Candidate[];
  attempts: Attempt[];
  status: TerminalStatus;
  onSubmitGuess: (candidateId: string) => void;
}

export function TerminalGrid({ candidates, attempts, status, onSubmitGuess }: TerminalGridProps) {
  const isInteractive = status === "in-progress";
  const { focusedIndex, setFocusedIndex, registerItemRef, handleKeyDown } = useRovingGridFocus<
    HTMLButtonElement
  >({ itemCount: candidates.length, columns: COLUMNS, isActive: isInteractive });

  const latestAttemptByCandidate = useMemo(() => {
    const map = new Map<string, Attempt>();
    for (const attempt of attempts) {
      map.set(attempt.candidateId, attempt);
    }
    return map;
  }, [attempts]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="grid">
      {candidates.map((candidate, index) => {
        const attempt = latestAttemptByCandidate.get(candidate.id);
        return (
          <button
            key={candidate.id}
            ref={registerItemRef(index)}
            type="button"
            role="gridcell"
            tabIndex={index === focusedIndex ? 0 : -1}
            disabled={!isInteractive}
            onFocus={() => setFocusedIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => onSubmitGuess(candidate.id)}
            className="rounded border border-arcade-purple p-3 font-arcade text-arcade-cyan shadow-neon hover:bg-arcade-panel focus:outline-none focus:ring-2 focus:ring-arcade-amber disabled:opacity-50"
          >
            <div>{candidate.code.join(" ")}</div>
            {attempt && (
              <div className="mt-1 text-xs text-arcade-amber">
                likeness {attempt.likeness}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
