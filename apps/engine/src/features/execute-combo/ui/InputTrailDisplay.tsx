import { DirectionGlyph, type InputToken } from "@/entities/combo-breaker";

export interface InputTrailDisplayProps {
  trail: InputToken[];
}

const TRAIL_ITEM_CLASS = "flex h-7 w-7 shrink-0 items-center justify-center";

export function InputTrailDisplay({ trail }: InputTrailDisplayProps) {
  return (
    <div className="flex h-64 flex-col gap-1 text-lg" aria-label="Recent inputs">
      {trail.map((token, index) =>
        token.kind === "direction" ? (
          <span key={index} className={TRAIL_ITEM_CLASS}>
            <DirectionGlyph direction={token.direction} />
          </span>
        ) : (
          <span key={index} className={`${TRAIL_ITEM_CLASS} text-arcade-amber`}>
            {token.button}
          </span>
        ),
      )}
    </div>
  );
}
