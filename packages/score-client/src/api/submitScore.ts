import type { SubmitScoreInput, SubmitScoreResult } from "../model/types";

export async function submitScore(
  input: SubmitScoreInput,
  baseUrl = "",
): Promise<SubmitScoreResult> {
  const response = await fetch(`${baseUrl}/scores/api/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `submitScore failed: ${response.status}`);
  }
  return (await response.json()) as SubmitScoreResult;
}
