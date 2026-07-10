// Owns the run's entire Web Audio graph: context, decoded buffer, source and
// analyser. Everything is created per run and torn down hard on dispose —
// the brief's "strict AudioContext node teardown" is this file's one job.

// Small scheduling offset so source.start() lands on a clean context time
// instead of "as soon as possible" mid-block.
const START_DELAY_SEC = 0.08;

const ANALYSER_FFT_SIZE = 256;

export interface SoundwaveAudioEngine {
  /** Fetch + decode the track. Safe to call again after a stop (cached). */
  load(): Promise<void>;
  /** Schedule playback `delaySec` from now (default: minimal scheduling
   *  offset). getTimeMs() runs negative until the song actually starts,
   *  which is what drives the pre-song countdown. */
  start(onEnded: () => void, delaySec?: number): void;
  /** Stop playback without firing the onEnded callback. */
  stop(): void;
  /** Stop and close the AudioContext. The engine is unusable afterwards. */
  dispose(): void;
  /** Current song time in ms (negative during the scheduling lead-in). */
  getTimeMs(): number;
  /** Latest FFT magnitudes, or null before playback starts. */
  readFrequencyData(): Uint8Array | null;
}

// audioUrl is used verbatim — a full URL to wherever the track is hosted
// (CORS required: the response is decoded, not just played), or an
// app-relative path that must already include the engine's /play basePath,
// since raw fetch() URLs don't get basePath applied the way next/link does.
export function createAudioEngine(audioUrl: string): SoundwaveAudioEngine {
  let context: AudioContext | null = null;
  let buffer: AudioBuffer | null = null;
  let source: AudioBufferSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  // Explicit ArrayBuffer generic: getByteFrequencyData rejects the default
  // ArrayBufferLike-backed Uint8Array under TS 5.7's typed-array generics.
  let frequencyData: Uint8Array<ArrayBuffer> | null = null;
  let startedAtSec = 0;

  function stopSource() {
    if (!source) return;
    source.onended = null;
    source.stop();
    source.disconnect();
    source = null;
    if (analyser) {
      analyser.disconnect();
      analyser = null;
      frequencyData = null;
    }
  }

  return {
    async load() {
      // The context is only ever created here, inside the user-gesture call
      // chain, so it starts in the "running" state (autoplay policy).
      context = context ?? new AudioContext();
      if (buffer) return;
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error(`Audio fetch failed: ${response.status}`);
      buffer = await context.decodeAudioData(await response.arrayBuffer());
    },

    start(onEnded, delaySec = START_DELAY_SEC) {
      if (!context || !buffer) throw new Error("start() before load() resolved");
      stopSource();
      source = context.createBufferSource();
      source.buffer = buffer;
      analyser = context.createAnalyser();
      analyser.fftSize = ANALYSER_FFT_SIZE;
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      analyser.connect(context.destination);
      source.onended = onEnded;
      startedAtSec = context.currentTime + delaySec;
      source.start(startedAtSec);
    },

    stop: stopSource,

    dispose() {
      stopSource();
      buffer = null;
      void context?.close().catch(() => {});
      context = null;
    },

    getTimeMs() {
      if (!context || !source) return 0;
      return (context.currentTime - startedAtSec) * 1000;
    },

    readFrequencyData() {
      if (!analyser || !frequencyData) return null;
      analyser.getByteFrequencyData(frequencyData);
      return frequencyData;
    },
  };
}
