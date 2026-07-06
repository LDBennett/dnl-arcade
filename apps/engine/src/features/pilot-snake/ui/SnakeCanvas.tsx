"use client";

import { arcadeColors } from "@dnl-arcade/ui";
import { useEffect, useRef } from "react";
import { CELL_SIZE_PX, GRID_HEIGHT, GRID_WIDTH, type SnakeState } from "@/entities/snake";

export function SnakeCanvas({ state }: { state: SnakeState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = arcadeColors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = arcadeColors.panel;
    for (let x = 0; x < GRID_WIDTH; x += 1) {
      for (let y = 0; y < GRID_HEIGHT; y += 1) {
        if ((x + y) % 2 === 0) {
          ctx.fillRect(x * CELL_SIZE_PX, y * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
        }
      }
    }

    ctx.fillStyle = arcadeColors.magenta;
    ctx.fillRect(
      state.food.x * CELL_SIZE_PX,
      state.food.y * CELL_SIZE_PX,
      CELL_SIZE_PX,
      CELL_SIZE_PX,
    );

    state.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? arcadeColors.cyan : arcadeColors.green;
      ctx.fillRect(segment.x * CELL_SIZE_PX, segment.y * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
    });
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_WIDTH * CELL_SIZE_PX}
      height={GRID_HEIGHT * CELL_SIZE_PX}
      className="h-auto w-full border border-arcade-cyan"
    />
  );
}
