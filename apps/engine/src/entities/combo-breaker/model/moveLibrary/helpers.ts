import { CHARGE_MIN_HOLD_MS } from "../constants";
import type {
  ButtonToken,
  ChargeMotion,
  InputToken,
  MotionStep,
  NumpadDirection,
  SequenceMotion,
} from "../types";

export function dir(direction: NumpadDirection, opts?: { optional?: boolean }): InputToken {
  return { kind: "direction", direction, optional: opts?.optional };
}

export function press(button: ButtonToken): InputToken {
  return { kind: "button", button };
}

export function simultaneous(...tokens: InputToken[]): MotionStep {
  return { kind: "simultaneous", tokens };
}

export function sequence(steps: MotionStep[]): SequenceMotion {
  return { kind: "sequence", steps };
}

export function charge(
  chargeDirection: NumpadDirection,
  releaseSteps: MotionStep[],
  minHoldMs: number = CHARGE_MIN_HOLD_MS,
): ChargeMotion {
  return { kind: "charge", chargeDirection, minHoldMs, releaseSteps };
}
