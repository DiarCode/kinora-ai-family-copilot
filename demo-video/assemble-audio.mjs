#!/usr/bin/env node
/**
 * Assembles audio/line-XX.mp3 into out/session.wav using the timeline gaps.
 * Per-line loudness normalization keeps the angry couple and calm Kinora
 * balanced; final pass targets -14 LUFS for web playback.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const cues = JSON.parse(fs.readFileSync(path.join(ROOT, "out", "cues.json"), "utf8"));
const lines = cues.lines;

const missing = lines.filter((l) => !l.audioFile || !fs.existsSync(path.join(ROOT, l.audioFile)));
if (missing.length) {
  console.error(`Missing audio for ${missing.length} line(s): ${missing.map((l) => l.index).join(", ")}`);
  process.exit(1);
}

const inputs = [];
const filters = [];
let concatInputs = "";
let inputIndex = 0;

const silence = (durationS, tag) => {
  filters.push(`anullsrc=r=48000:cl=stereo:d=${durationS.toFixed(3)}[${tag}]`);
  concatInputs += `[${tag}]`;
};

// intro silence
silence(lines[0].startMs / 1000, "s0");

lines.forEach((line, i) => {
  const file = path.join(ROOT, line.audioFile);
  inputs.push("-i", file);
  filters.push(
    `[${inputIndex}:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,aformat=sample_fmts=s16:channel_layouts=stereo[a${i}]`,
  );
  concatInputs += `[a${i}]`;
  inputIndex += 1;

  const next = lines[i + 1];
  const gapMs = next ? next.startMs - line.endMs : cues.totalMs - line.endMs;
  silence(Math.max(0, gapMs) / 1000, `s${i + 1}`);
});

filters.push(`${concatInputs}concat=n=${lines.length * 2 + 1}:v=0:a=1[joined]`);
filters.push(`[joined]loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[out]`);

const args = [
  "-y",
  "-hide_banner",
  "-loglevel", "error",
  ...inputs,
  "-filter_complex", filters.join(";"),
  "-map", "[out]",
  "-c:a", "pcm_s16le",
  "-ar", "48000",
  "-ac", "2",
  path.join(ROOT, "out", "session.wav"),
];

console.log(`Assembling ${lines.length} lines → out/session.wav`);
execFileSync("ffmpeg", args, { stdio: "inherit" });
const stats = execFileSync(
  "ffprobe",
  ["-v", "error", "-show_entries", "format=duration,size", "-of", "default=noprint_wrappers=1", path.join(ROOT, "out", "session.wav")],
  { encoding: "utf8" },
);
console.log(stats.trim());
