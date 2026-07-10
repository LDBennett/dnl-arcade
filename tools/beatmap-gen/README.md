# beatmap-gen

Offline tooling that turns the MP3s in `apps/engine/public/audio` into the
generated track files in `apps/engine/src/entities/soundwave/model/tracks`.
A workspace member with no build/lint scripts — the root `pnpm install`
covers its dependencies; run its scripts from this directory.

## Adding a new track

1. Drop the MP3 into `apps/engine/public/audio` and note it in `CREDITS.md`.
2. `pnpm analyze <path-to-mp3>` — reports BPM (trust it when the reported and
   median-interval BPM agree on a round number), first-beat offset, duration.
3. Add a config entry to `TRACKS` in `generate-beatmaps.mjs` (bpm from step 2,
   density/threshold knobs copied from the difficulty tier it should match).
   Set `audioUrl` to the hosted URL the game should stream the song from
   (host must send CORS headers — the audio is fetched and decoded, not
   `<audio>`-tag played); omit it to serve the local file at `/play/audio/`.
4. `pnpm generate` — regenerates all track files in place and prints density
   stats (aim: easy ≈1.8 notes/sec, medium ≈2.9, hard ≈3.6; lanes balanced).
5. Register the new track in `entities/soundwave/model/tracks/index.ts`.

## How it works

Decode → mono → three biquad-filtered onset envelopes (kick <150Hz,
mid 250–4000Hz, hats >6kHz) → refine the beat-grid phase against onset
energy → sample onset strength at eighth-note subdivisions → select notes
under per-difficulty thresholds, lane-gap / global-gap / density caps →
emit `[beat, lane]` tuples relative to `firstBeatSec`.
