import type { GameEntry } from "./types";

// Mirrors CLAUDE.md section 3. Single source of truth for dashboard links
// and each game route's stub metadata.
export const gamesRoster: GameEntry[] = [
  {
    slug: "matrix-breach",
    title: "Matrix Breach",
    mechanic: "Alphanumeric pattern-matching cyberpunk hacking terminal.",
    technicalFocus:
      "Deep component state, CSS Grid rendering performance, keyboard focus states.",
  },
  {
    slug: "neon-snake",
    title: "Neon Snake",
    mechanic: "Smooth, vector-style grid navigation on a continuous loop.",
    technicalFocus:
      "requestAnimationFrame loop management, thread boundary isolation, memory flushing on unmount.",
  },
  {
    slug: "soundwave",
    title: "SoundWave",
    mechanic: "Synthwave rhythm simulator parsing live frequency inputs.",
    technicalFocus:
      "Real-time Web Audio scheduling, strict AudioContext node teardown.",
  },
  {
    slug: "combo-breaker",
    title: "ComboBreaker",
    mechanic: "Frame-accurate fighting game move input matching trainer.",
    technicalFocus:
      "Raw keyboard intercepts plus Gamepad API polling without blocking the shell.",
  },
];
