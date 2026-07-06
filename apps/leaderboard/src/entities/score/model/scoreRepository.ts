import { prisma } from "@/shared/lib/prisma";
import type { CreateScoreInput, ScoreRecord } from "./types";

function toScoreRecord(row: {
  id: string;
  gameSlug: string;
  playerName: string;
  score: number;
  createdAt: Date;
}): ScoreRecord {
  return {
    id: row.id,
    gameSlug: row.gameSlug,
    playerName: row.playerName,
    score: row.score,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listTopScores(gameSlug: string, limit: number): Promise<ScoreRecord[]> {
  const rows = await prisma.score.findMany({
    where: { gameSlug },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: limit,
  });
  return rows.map(toScoreRecord);
}

export async function listRecentGamesForPlayer(
  playerName: string,
  limit: number,
): Promise<ScoreRecord[]> {
  const rows = await prisma.score.findMany({
    where: { playerName },
    orderBy: { createdAt: "desc" },
    distinct: ["gameSlug"],
    take: limit,
  });
  return rows.map(toScoreRecord);
}

export async function createScore(input: CreateScoreInput): Promise<ScoreRecord> {
  const row = await prisma.score.create({ data: input });
  return toScoreRecord(row);
}

export async function countScoresAbove(gameSlug: string, score: number): Promise<number> {
  return prisma.score.count({ where: { gameSlug, score: { gt: score } } });
}
