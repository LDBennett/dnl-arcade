// Generates SoundWave beatmap TS files from the three Pixabay tracks.
// Pipeline per track: decode -> mono -> 3 band-filtered onset envelopes
// (biquad low/mid/high) -> refine beat-grid phase against onsets -> sample
// onset strength at eighth-note subdivisions -> select notes per difficulty
// rules -> emit compact TS data file + stats to stdout.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import decode from "audio-decode";

const AUDIO_DIR = fileURLToPath(new URL("../../apps/engine/public/audio/", import.meta.url));
const OUT_DIR =
  process.argv[2] ??
  fileURLToPath(new URL("../../apps/engine/src/entities/soundwave/model/tracks/", import.meta.url));

const HOP_MS = 10;

// Per track: `file` is the local MP3 used as analysis input (must exist in
// apps/engine/public/audio). Optional `audioUrl` is what the game fetches at
// runtime — set it to a hosted URL (the host must allow CORS, since the
// response is decoded); when omitted it falls back to serving the local file
// at /play/audio/<file>.
const TRACKS = [
  {
    file: "alexzavesa-dance-playful-night-510786.mp3",
    slug: "dance-playful-night",
    exportName: "dancePlayfulNight",
    title: "Dance Playful Night",
    artist: "AleXZavesa",
    difficulty: "easy",
    bpm: 115,
    approxFirstBeat: 1.6,
    // easy: quarter notes only, generous gaps
    subdivisionsPerBeat: 1,
    thresholds: { low: 0.45, mid: 0.5, high: 0.6 },
    globalGapMs: 380,
    laneGapMs: 700,
    maxNps: 2.2,
    chords: false,
    // This track is mid-heavy: rotate mid notes across three lanes so no
    // lane starves at easy density.
    rotateMidLanes: [2, 0, 3],
  },
  {
    file: "alexguz-funk-amp-breakbeat-541097.mp3",
    slug: "funk-breakbeat",
    exportName: "funkBreakbeat",
    title: "Funk & Breakbeat",
    artist: "AlexGuz",
    difficulty: "medium",
    bpm: 125,
    approxFirstBeat: 0.52,
    subdivisionsPerBeat: 2,
    thresholds: { low: 0.4, mid: 0.45, high: 0.55 },
    globalGapMs: 230,
    laneGapMs: 450,
    maxNps: 3.0,
    chords: false,
  },
  {
    file: "sigmamusicart-no-copyright-music-537751.mp3",
    slug: "no-copyright-music",
    exportName: "noCopyrightMusic",
    title: "No Copyright Music",
    artist: "SigmaMusicArt",
    difficulty: "hard",
    bpm: 150,
    approxFirstBeat: 0.04,
    subdivisionsPerBeat: 2,
    thresholds: { low: 0.35, mid: 0.4, high: 0.5 },
    globalGapMs: 190,
    laneGapMs: 380,
    maxNps: 4.0,
    chords: true,
  },
];

// --- RBJ biquad filters (direct form I) ---
function biquadCoeffs(type, f0, fs, q = Math.SQRT1_2) {
  const w0 = (2 * Math.PI * f0) / fs;
  const cosW0 = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  let b0, b1, b2;
  if (type === "lowpass") {
    b0 = (1 - cosW0) / 2; b1 = 1 - cosW0; b2 = b0;
  } else {
    b0 = (1 + cosW0) / 2; b1 = -(1 + cosW0); b2 = b0;
  }
  const a0 = 1 + alpha;
  return {
    b0: b0 / a0, b1: b1 / a0, b2: b2 / a0,
    a1: (-2 * cosW0) / a0, a2: (1 - alpha) / a0,
  };
}

function applyBiquad(input, coeffs) {
  const { b0, b1, b2, a1, a2 } = coeffs;
  const out = new Float32Array(input.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const x0 = input[i];
    const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    out[i] = y0;
    x2 = x1; x1 = x0; y2 = y1; y1 = y0;
  }
  return out;
}

// Positive-difference RMS envelope: one onset-strength value per 10ms hop.
function onsetEnvelope(samples, sampleRate) {
  const hop = Math.round((sampleRate * HOP_MS) / 1000);
  const frameCount = Math.floor(samples.length / hop);
  const rms = new Float32Array(frameCount);
  for (let f = 0; f < frameCount; f++) {
    let sum = 0;
    const start = f * hop;
    for (let i = start; i < start + hop; i++) sum += samples[i] * samples[i];
    rms[f] = Math.sqrt(sum / hop);
  }
  const flux = new Float32Array(frameCount);
  for (let f = 1; f < frameCount; f++) flux[f] = Math.max(0, rms[f] - rms[f - 1]);
  // Normalize by 97th percentile so thresholds are comparable across tracks.
  const sorted = Array.from(flux).sort((a, b) => a - b);
  const p97 = sorted[Math.floor(sorted.length * 0.97)] || 1;
  for (let f = 0; f < frameCount; f++) flux[f] = Math.min(flux[f] / p97, 1.5);
  return flux;
}

function fluxAt(flux, timeSec) {
  const idx = (timeSec * 1000) / HOP_MS;
  const lo = Math.floor(idx);
  if (lo < 0 || lo + 1 >= flux.length) return 0;
  return flux[lo] + (flux[lo + 1] - flux[lo]) * (idx - lo);
}

// Strongest onset within +/-30ms of the grid time.
function peakNear(flux, timeSec) {
  let peak = 0;
  for (let dt = -30; dt <= 30; dt += HOP_MS) {
    peak = Math.max(peak, fluxAt(flux, timeSec + dt / 1000));
  }
  return peak;
}

// Refine grid phase: known BPM is trusted, but the first-beat anchor from
// music-tempo is coarse. Slide phase +/-120ms around it and keep the phase
// where summed onset energy at beat times is maximal.
function refinePhase(bands, bpm, approxFirstBeat, durationSec) {
  const period = 60 / bpm;
  let bestPhase = approxFirstBeat;
  let bestSum = -1;
  for (let offset = -120; offset <= 120; offset += 2) {
    const phase = approxFirstBeat + offset / 1000;
    if (phase < 0) continue;
    let sum = 0;
    for (let t = phase; t < durationSec; t += period) {
      sum += fluxAt(bands.low, t) + fluxAt(bands.mid, t) + fluxAt(bands.high, t);
    }
    if (sum > bestSum) { bestSum = sum; bestPhase = phase; }
  }
  return bestPhase;
}

const BAND_LANE = { low: 1, mid: 2, high: 3 };
const BAND_ALT_LANE = { low: 0, mid: 0, high: 2 };

function generateNotes(config, bands, firstBeat, durationSec) {
  const beatSec = 60 / config.bpm;
  const stepSec = beatSec / config.subdivisionsPerBeat;
  const stepBeats = 1 / config.subdivisionsPerBeat;
  const notes = []; // { beat, lane, timeSec, band, strength }
  const lastLaneTime = [-Infinity, -Infinity, -Infinity, -Infinity];
  let lastNoteTime = -Infinity;
  let lastChordTime = -Infinity;
  let midRotation = 0;

  const stepCount = Math.floor((durationSec - firstBeat - 1) / stepSec);
  for (let k = 0; k < stepCount; k++) {
    const t = firstBeat + k * stepSec;
    const beat = k * stepBeats;

    const strengths = Object.entries(config.thresholds)
      .map(([band, threshold]) => ({ band, threshold, strength: peakNear(bands[band], t) }))
      .filter((s) => s.strength >= s.threshold)
      .sort((a, b) => b.strength - a.strength);
    if (strengths.length === 0) continue;

    // Global rhythm gap (chord partners exempt below).
    if ((t - lastNoteTime) * 1000 < config.globalGapMs) continue;

    // Sliding 4s density cap.
    const windowStart = t - 4;
    const inWindow = notes.filter((n) => n.timeSec >= windowStart).length;
    if (inWindow >= config.maxNps * 4) continue;

    const pick = strengths[0];
    let lane;
    if (config.rotateMidLanes && pick.band === "mid") {
      const rotation = config.rotateMidLanes;
      lane = rotation[midRotation % rotation.length];
      midRotation++;
      if ((t - lastLaneTime[lane]) * 1000 < config.laneGapMs) {
        lane = rotation[midRotation % rotation.length];
        midRotation++;
      }
      if ((t - lastLaneTime[lane]) * 1000 < config.laneGapMs) continue;
    } else {
      lane = BAND_LANE[pick.band];
      if ((t - lastLaneTime[lane]) * 1000 < config.laneGapMs) {
        lane = BAND_ALT_LANE[pick.band];
        if ((t - lastLaneTime[lane]) * 1000 < config.laneGapMs) continue;
      }
    }

    notes.push({ beat, lane, timeSec: t, band: pick.band, strength: pick.strength });
    lastLaneTime[lane] = t;
    lastNoteTime = t;

    // Hard only: very strong second band on a bar downbeat becomes a chord.
    if (
      config.chords &&
      k % (4 * config.subdivisionsPerBeat) === 0 &&
      strengths.length > 1 &&
      strengths[1].strength >= 0.85 &&
      (t - lastChordTime) >= 2
    ) {
      let chordLane = BAND_LANE[strengths[1].band];
      if (chordLane === lane) chordLane = BAND_ALT_LANE[strengths[1].band];
      if (chordLane !== lane && (t - lastLaneTime[chordLane]) * 1000 >= config.laneGapMs) {
        notes.push({ beat, lane: chordLane, timeSec: t, band: strengths[1].band, strength: strengths[1].strength });
        lastLaneTime[chordLane] = t;
        lastChordTime = t;
      }
    }
  }
  return notes;
}

function stats(notes, durationSec) {
  const lanes = [0, 0, 0, 0];
  for (const n of notes) lanes[n.lane]++;
  let maxWindow = 0;
  for (const n of notes) {
    const count = notes.filter((m) => m.timeSec >= n.timeSec && m.timeSec < n.timeSec + 4).length;
    maxWindow = Math.max(maxWindow, count);
  }
  return {
    count: notes.length,
    avgNps: +(notes.length / durationSec).toFixed(2),
    peakNps: +(maxWindow / 4).toFixed(2),
    lanes,
  };
}

function emitTs(config, notes, firstBeat, durationSec) {
  const tuples = notes.map((n) => `[${+n.beat.toFixed(2)}, ${n.lane}]`);
  const lines = [];
  for (let i = 0; i < tuples.length; i += 8) lines.push("  " + tuples.slice(i, i + 8).join(", ") + ",");
  return `import type { TrackDefinition } from "../types";

// Generated offline from onset analysis of the source MP3 (band-filtered
// spectral flux snapped to the ${config.bpm} BPM grid). [beat, lane] tuples
// are relative to firstBeatSec. Regenerate rather than hand-editing.
const NOTES: Array<[number, number]> = [
${lines.join("\n")}
];

export const ${config.exportName}: TrackDefinition = {
  slug: "${config.slug}",
  title: "${config.title}",
  artist: "${config.artist}",
  difficulty: "${config.difficulty}",
  bpm: ${config.bpm},
  firstBeatSec: ${+firstBeat.toFixed(3)},
  durationSec: ${+durationSec.toFixed(2)},
  audioUrl: "${config.audioUrl ?? `/play/audio/${config.file}`}",
  notes: NOTES.map(([beat, lane]) => ({ beat, lane: lane as 0 | 1 | 2 | 3 })),
};
`;
}

for (const config of TRACKS) {
  const buf = await readFile(AUDIO_DIR + config.file);
  const { channelData, sampleRate } = await decode(buf);
  const length = channelData[0].length;
  const durationSec = length / sampleRate;
  const mono = new Float32Array(length);
  for (const ch of channelData) {
    for (let i = 0; i < length; i++) mono[i] += ch[i] / channelData.length;
  }

  const low = applyBiquad(mono, biquadCoeffs("lowpass", 150, sampleRate));
  const midHp = applyBiquad(mono, biquadCoeffs("highpass", 250, sampleRate));
  const mid = applyBiquad(midHp, biquadCoeffs("lowpass", 4000, sampleRate));
  const high = applyBiquad(mono, biquadCoeffs("highpass", 6000, sampleRate));

  const bands = {
    low: onsetEnvelope(low, sampleRate),
    mid: onsetEnvelope(mid, sampleRate),
    high: onsetEnvelope(high, sampleRate),
  };

  const firstBeat = refinePhase(bands, config.bpm, config.approxFirstBeat, durationSec);
  const notes = generateNotes(config, bands, firstBeat, durationSec);

  console.log(JSON.stringify({ track: config.slug, firstBeat: +firstBeat.toFixed(3), ...stats(notes, durationSec) }));
  await writeFile(OUT_DIR + config.exportName + ".ts", emitTs(config, notes, firstBeat, durationSec));
}
