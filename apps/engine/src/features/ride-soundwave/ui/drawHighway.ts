import { arcadeColors, arcadeFont } from "@dnl-arcade/ui";
import { LANE_COUNT, LANE_KEYS, type SessionNote } from "@/entities/soundwave";

export const HIGHWAY_WIDTH = 360;
export const HIGHWAY_HEIGHT = 480;

const HIT_LINE_Y = 408;
const NOTE_HEIGHT = 14;
const NOTE_INSET_X = 8;
/** Song-time window a note spends travelling from the top to the hit line. */
const LEAD_TIME_MS = 1800;
const LANE_FLASH_MS = 120;
const MISS_LINGER_MS = 350;
const SPECTRUM_BARS = 30;
const SPECTRUM_MAX_HEIGHT = 150;
const GO_FLASH_MS = 500;

const LANE_WIDTH = HIGHWAY_WIDTH / LANE_COUNT;
const LANE_COLORS = [
  arcadeColors.cyan,
  arcadeColors.magenta,
  arcadeColors.green,
  arcadeColors.amber,
] as const;

export interface HighwayFrame {
  notes: SessionNote[];
  /** Whether a run is in progress — gates the countdown/GO overlay. */
  playing: boolean;
  /** Current song time (audio clock). */
  nowMs: number;
  frequencyData: Uint8Array | null;
  /** performance.now() of the last press per lane. */
  laneFlashes: number[];
  /** performance.now() of this frame, for flash decay. */
  frameNowMs: number;
}

function noteY(noteTimeMs: number, nowMs: number): number {
  const progress = (noteTimeMs - nowMs) / LEAD_TIME_MS;
  return HIT_LINE_Y - progress * (HIT_LINE_Y + NOTE_HEIGHT);
}

function drawSpectrum(ctx: CanvasRenderingContext2D, frequencyData: Uint8Array) {
  const barWidth = HIGHWAY_WIDTH / SPECTRUM_BARS;
  const binsPerBar = Math.floor(frequencyData.length / SPECTRUM_BARS);
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = arcadeColors.purple;
  for (let bar = 0; bar < SPECTRUM_BARS; bar += 1) {
    const height = (frequencyData[bar * binsPerBar] / 255) * SPECTRUM_MAX_HEIGHT;
    ctx.fillRect(bar * barWidth + 1, HIGHWAY_HEIGHT - height, barWidth - 2, height);
  }
  ctx.globalAlpha = 1;
}

function drawLanes(ctx: CanvasRenderingContext2D, frame: HighwayFrame) {
  ctx.strokeStyle = arcadeColors.panel;
  for (let lane = 1; lane < LANE_COUNT; lane += 1) {
    ctx.beginPath();
    ctx.moveTo(lane * LANE_WIDTH, 0);
    ctx.lineTo(lane * LANE_WIDTH, HIT_LINE_Y);
    ctx.stroke();
  }

  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    if (frame.frameNowMs - frame.laneFlashes[lane] < LANE_FLASH_MS) {
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = LANE_COLORS[lane];
      ctx.fillRect(lane * LANE_WIDTH, 0, LANE_WIDTH, HIT_LINE_Y);
      ctx.globalAlpha = 1;
    }
  }
}

function drawHitLine(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = arcadeColors.cyan;
  ctx.lineWidth = 2;
  ctx.shadowColor = arcadeColors.cyan;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(0, HIT_LINE_Y);
  ctx.lineTo(HIGHWAY_WIDTH, HIT_LINE_Y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1;

  ctx.font = `12px ${arcadeFont}`;
  ctx.textAlign = "center";
  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    ctx.fillStyle = LANE_COLORS[lane];
    ctx.fillText(
      LANE_KEYS[lane].toUpperCase(),
      lane * LANE_WIDTH + LANE_WIDTH / 2,
      HIT_LINE_Y + 34,
    );
  }
}

function drawNotes(ctx: CanvasRenderingContext2D, frame: HighwayFrame) {
  for (const note of frame.notes) {
    const untilMs = note.timeMs - frame.nowMs;
    const x = note.lane * LANE_WIDTH + NOTE_INSET_X;
    const width = LANE_WIDTH - NOTE_INSET_X * 2;

    if (note.status === "upcoming" && untilMs <= LEAD_TIME_MS) {
      ctx.fillStyle = LANE_COLORS[note.lane];
      ctx.shadowColor = LANE_COLORS[note.lane];
      ctx.shadowBlur = 12;
      ctx.fillRect(x, noteY(note.timeMs, frame.nowMs) - NOTE_HEIGHT, width, NOTE_HEIGHT);
      ctx.shadowBlur = 0;
    } else if (note.status === "miss" && -untilMs <= MISS_LINGER_MS) {
      ctx.globalAlpha = 1 + untilMs / MISS_LINGER_MS;
      ctx.fillStyle = arcadeColors.red;
      ctx.fillRect(x, noteY(note.timeMs, frame.nowMs) - NOTE_HEIGHT, width, NOTE_HEIGHT);
      ctx.globalAlpha = 1;
    }
  }
}

// Pre-song get-ready: song time runs negative while playback is scheduled
// (see audioEngine start delay), so the countdown is driven by the same
// audio clock the notes are judged against.
function drawCountdown(ctx: CanvasRenderingContext2D, nowMs: number) {
  const isCountingDown = nowMs < 0;
  if (!isCountingDown && nowMs >= GO_FLASH_MS) return;

  ctx.textAlign = "center";
  ctx.shadowColor = arcadeColors.cyan;
  ctx.shadowBlur = 16;
  ctx.fillStyle = arcadeColors.cyan;
  if (isCountingDown) {
    ctx.font = `14px ${arcadeFont}`;
    ctx.fillText("GET READY", HIGHWAY_WIDTH / 2, HIGHWAY_HEIGHT / 2 - 56);
    ctx.font = `48px ${arcadeFont}`;
    ctx.fillText(String(Math.ceil(-nowMs / 1000)), HIGHWAY_WIDTH / 2, HIGHWAY_HEIGHT / 2);
  } else {
    ctx.globalAlpha = 1 - nowMs / GO_FLASH_MS;
    ctx.font = `40px ${arcadeFont}`;
    ctx.fillText("GO!", HIGHWAY_WIDTH / 2, HIGHWAY_HEIGHT / 2);
    ctx.globalAlpha = 1;
  }
  ctx.shadowBlur = 0;
}

export function drawHighway(ctx: CanvasRenderingContext2D, frame: HighwayFrame) {
  ctx.fillStyle = arcadeColors.bg;
  ctx.fillRect(0, 0, HIGHWAY_WIDTH, HIGHWAY_HEIGHT);
  if (frame.frequencyData) drawSpectrum(ctx, frame.frequencyData);
  drawLanes(ctx, frame);
  drawNotes(ctx, frame);
  drawHitLine(ctx);
  if (frame.playing) drawCountdown(ctx, frame.nowMs);
}
