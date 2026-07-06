import { NextRequest, NextResponse } from "next/server";
import { listRecentGamesForPlayer } from "@/entities/score";

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 20;

function clampLimit(raw: string | null): number {
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_LIMIT;
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerName = searchParams.get("playerName");
  if (!playerName) {
    return NextResponse.json({ error: "playerName is required" }, { status: 400 });
  }

  const limit = clampLimit(searchParams.get("limit"));
  const entries = await listRecentGamesForPlayer(playerName, limit);
  return NextResponse.json({ entries });
}
