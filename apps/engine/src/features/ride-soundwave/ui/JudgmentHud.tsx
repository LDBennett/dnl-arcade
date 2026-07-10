import type { Judgment, SoundwaveState } from "@/entities/soundwave";

const JUDGMENT_CLASS: Record<Judgment, string> = {
  perfect: "text-arcade-cyan",
  good: "text-arcade-amber",
  miss: "text-arcade-red",
};

const JUDGMENT_LABEL: Record<Judgment, string> = {
  perfect: "PERFECT",
  good: "GOOD",
  miss: "MISS",
};

export function JudgmentHud({ state }: { state: SoundwaveState }) {
  return (
    <div className="flex items-end justify-between text-sm">
      <p>
        Score: <span className="text-arcade-green">{state.score}</span>
      </p>
      {state.lastJudgment ? (
        // Keyed by judgmentSeq so back-to-back equal judgments re-flash.
        <p
          key={state.judgmentSeq}
          className={`animate-flicker ${JUDGMENT_CLASS[state.lastJudgment]}`}
        >
          {JUDGMENT_LABEL[state.lastJudgment]}
        </p>
      ) : (
        <p className="opacity-0">READY</p>
      )}
      <p>
        Combo:{" "}
        <span className={state.combo >= 10 ? "text-arcade-magenta" : "text-arcade-cyan"}>
          {state.combo}×
        </span>
      </p>
    </div>
  );
}
