#!/usr/bin/env node
/**
 * Builds the session timeline from script.json + generated audio files.
 * When an audio file is missing, falls back to a duration estimate so the
 * stage can be visually tested before TTS is generated.
 *
 * Outputs:
 *   stage/cues.json   (consumed by the stage)
 *   out/cues.json     (consumed by assemble-audio/render)
 *   out/kinora-demo.srt
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const script = JSON.parse(fs.readFileSync(path.join(ROOT, "script.json"), "utf8"));

const pad = (n) => String(n).padStart(2, "0");

function probeDuration(file) {
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", file],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    const value = Number(out);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

const lines = script.lines.map((line, i) => {
  const n = i + 1;
  const file = path.join(ROOT, "audio", `line-${pad(n)}.mp3`);
  let durationS = probeDuration(file);
  const hasAudio = durationS !== null;
  if (!hasAudio) {
    durationS = Math.max(1.4, line.text.length / 14.0 + 0.25);
  }
  return {
    index: n,
    speaker: line.speaker,
    phaseIndex: line.phase,
    isQuestion: line.isQuestion,
    text: line.text,
    gapAfterMs: line.gapAfterMs ?? 350,
    delivery: line.delivery,
    audioFile: hasAudio ? `audio/line-${pad(n)}.mp3` : null,
    durationMs: Math.round(durationS * 1000),
  };
});

let cursor = script.introMs;
for (const line of lines) {
  line.startMs = cursor;
  line.endMs = line.startMs + line.durationMs;
  cursor = line.endMs + line.gapAfterMs;
}
const lastEnd = lines.length ? lines[lines.length - 1].endMs : script.introMs;
const totalMs = lastEnd + script.tailMs + script.endCardMs;

const cues = {
  title: script.title,
  subtitle: script.subtitle,
  problem: script.problem,
  introMs: script.introMs,
  tailMs: script.tailMs,
  endCardMs: script.endCardMs,
  totalMs,
  sharedNeed: script.sharedNeed,
  agreement: script.agreement,
  journey: script.journey,
  lines: lines.map(({ delivery, gapAfterMs, ...rest }) => rest),
};

fs.writeFileSync(path.join(ROOT, "stage", "cues.json"), JSON.stringify(cues, null, 2));
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "out", "cues.json"), JSON.stringify(cues, null, 2));

// SRT subtitles
function srtTime(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const t = String(ms % 1000).padStart(3, "0");
  return `${h}:${m}:${s},${t}`;
}
const srt = lines
  .map((line, i) => {
    const end = line.endMs + Math.min(line.gapAfterMs, 300);
    return `${i + 1}\n${srtTime(line.startMs)} --> ${srtTime(end)}\n${line.speaker === "kinora" ? "Kinora" : line.speaker === "michael" ? "Michael" : "Lucy"}: ${line.text}\n`;
  })
  .join("\n");
fs.writeFileSync(path.join(ROOT, "out", "kinora-demo.srt"), srt);

const estimate = lines.some((l) => l.audioFile === null);
console.log(`Timeline ${estimate ? "(ESTIMATED durations)" : "(real audio durations)"}`);
console.log(`  lines: ${lines.length}`);
console.log(`  speech: ${(lines.reduce((t, l) => t + l.durationMs, 0) / 1000).toFixed(1)}s`);
console.log(`  total: ${(totalMs / 1000).toFixed(1)}s  (${Math.floor(totalMs / 60000)}:${String(Math.round((totalMs % 60000) / 1000)).padStart(2, "0")})`);
lines.forEach((l) => {
  console.log(
    `  ${pad(l.index)} ${l.speaker.padEnd(7)} ${String(l.startMs).padStart(6)}–${String(l.endMs).padStart(6)}ms  ${l.audioFile ? "audio" : "est  "}  ${l.text.slice(0, 58)}…`,
  );
});
