import type { ButtonToken, MotionStep, MoveDef, SourceGame } from "../model/types";
import { DirectionGlyph } from "./DirectionGlyph";

export interface MoveNotationProps {
  move: MoveDef;
  matchedStepIndices?: number[];
}

const SOURCE_GAME_LABEL: Record<SourceGame, string> = {
  "street-fighter": "Street Fighter",
  "mortal-kombat": "Mortal Kombat",
  "guilty-gear": "Guilty Gear",
  tekken: "Tekken",
  "dead-or-alive": "Dead or Alive",
  "soul-calibur": "SoulCalibur",
};

function ButtonGlyph({ button, state = "idle" }: { button: ButtonToken; state?: "matched" | "idle" }) {
  return <span className={state === "matched" ? "text-arcade-green" : "text-arcade-amber"}>{button}</span>;
}

function MotionStepGlyph({ step, state = "idle" }: { step: MotionStep; state?: "matched" | "idle" }) {
  if (step.kind === "direction") return <DirectionGlyph direction={step.direction} state={state} />;
  if (step.kind === "button") return <ButtonGlyph button={step.button} state={state} />;
  return (
    <span className="inline-flex gap-0.5">
      {step.tokens.map((token, index) =>
        token.kind === "direction" ? (
          <DirectionGlyph key={index} direction={token.direction} state={state} />
        ) : (
          <ButtonGlyph key={index} button={token.button} state={state} />
        ),
      )}
    </span>
  );
}

export function MoveNotation({ move, matchedStepIndices = [] }: MoveNotationProps) {
  const steps = move.motion.kind === "sequence" ? move.motion.steps : move.motion.releaseSteps;

  return (
    <div>
      <div className="flex items-center gap-2 text-2xl">
        {move.motion.kind === "charge" && (
          <span className="flex items-center gap-1 text-sm text-arcade-purple">
            [hold <DirectionGlyph direction={move.motion.chargeDirection} />]
          </span>
        )}
        {steps.map((step, index) => (
          <MotionStepGlyph key={index} step={step} state={matchedStepIndices.includes(index) ? "matched" : "idle"} />
        ))}
      </div>
      <p className="mt-1 text-sm text-arcade-cyan">{move.notation}</p>
      <p className="text-xs text-arcade-purple">
        {move.label} — {move.character} ({SOURCE_GAME_LABEL[move.sourceGame]})
      </p>
    </div>
  );
}
