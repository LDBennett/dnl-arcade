import { NextRequest, NextResponse } from "next/server";
import { countScoresAbove, createScore, listTopScores, validateScoreSubmission } from "@/entities/score";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function clampLimit(raw: string | null): number {
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_LIMIT;
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameSlug = searchParams.get("gameSlug");
  if (!gameSlug) {
    return NextResponse.json({ error: "gameSlug is required" }, { status: 400 });
  }

  const limit = clampLimit(searchParams.get("limit"));
  const entries = await listTopScores(gameSlug, limit);
  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateScoreSubmission(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { gameSlug, playerName, score } = validation.value;
  const [entry, aboveCount] = await Promise.all([
    createScore({ gameSlug, playerName, score }),
    countScoresAbove(gameSlug, score),
  ]);

  return NextResponse.json({ entry, rank: aboveCount + 1 }, { status: 201 });
}
