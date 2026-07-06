-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Score_gameSlug_score_idx" ON "Score"("gameSlug", "score");

-- CreateIndex
CREATE INDEX "Score_playerName_createdAt_idx" ON "Score"("playerName", "createdAt");
