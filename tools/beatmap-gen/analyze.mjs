// Reports BPM, first-beat offset and duration for MP3s passed as arguments.
// Usage: node analyze.mjs <file.mp3> [...more]
import { readFile } from "node:fs/promises";
import decode from "audio-decode";
import MusicTempo from "music-tempo";

const files = process.argv.slice(2);

for (const file of files) {
  const buf = await readFile(file);
  const audio = await decode(buf);
  const { sampleRate, channelData } = audio;
  const numberOfChannels = channelData.length;
  const length = channelData[0].length;

  // Downmix to mono
  const mono = new Float32Array(length);
  for (let ch = 0; ch < numberOfChannels; ch++) {
    const data = channelData[ch];
    for (let i = 0; i < length; i++) mono[i] += data[i] / numberOfChannels;
  }

  // music-tempo assumes 44.1kHz with default hopSize 441 (10ms frames);
  // scale hopSize so frames stay 10ms at the file's actual sample rate.
  const mt = new MusicTempo(mono, { hopSize: Math.round(sampleRate / 100) });

  const duration = length / sampleRate;
  const beats = mt.beats; // seconds
  const firstBeat = beats.length ? beats[0] : null;

  // Median inter-beat interval as a sanity check on the reported tempo
  const intervals = [];
  for (let i = 1; i < beats.length; i++) intervals.push(beats[i] - beats[i - 1]);
  intervals.sort((a, b) => a - b);
  const medianInterval = intervals.length ? intervals[Math.floor(intervals.length / 2)] : null;

  console.log(JSON.stringify({
    file: file.split(/[\\/]/).pop(),
    sampleRate,
    duration: +duration.toFixed(2),
    reportedBpm: +(+mt.tempo).toFixed(2),
    medianIntervalBpm: medianInterval ? +(60 / medianInterval).toFixed(2) : null,
    firstBeatSec: firstBeat === null ? null : +firstBeat.toFixed(3),
    beatCount: beats.length,
  }));
}
