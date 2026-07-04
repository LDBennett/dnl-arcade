import { TokenGlyph, type Attempt, type Candidate } from "@/entities/hack-terminal";

export interface AttemptLogProps {
  attempts: Attempt[];
  candidates: Candidate[];
  attemptsRemaining: number;
  maxAttempts: number;
}

export function AttemptLog({ attempts, candidates, attemptsRemaining, maxAttempts }: AttemptLogProps) {
  return (
    <div className="mt-4">
      <p className="text-sm text-arcade-cyan">
        Attempts remaining: {attemptsRemaining} / {maxAttempts}
      </p>
      <ol className="mt-2 space-y-1">
        {attempts.map((attempt, index) => {
          const candidate = candidates.find((c) => c.id === attempt.candidateId);
          if (!candidate) return null;
          return (
            <li key={`${attempt.candidateId}-${index}`} className="text-sm">
              {candidate.code.map((char, charIndex) => (
                <TokenGlyph key={charIndex} char={char} />
              ))}
              <span className="ml-3 text-arcade-amber">
                likeness {attempt.likeness}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
