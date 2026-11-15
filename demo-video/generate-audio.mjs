#!/usr/bin/env node
/**
 * Generates one MP3 per script line with ElevenLabs Turbo v2.5.
 *
 * Requires ELEVENLABS_API_KEY in the environment or .env.local.
 * Requires voices.json mapping:
 *   { "kinora": { "id": "...", "name": "..." },
 *     "michael": { "id": "...", "name": "..." },
 *     "lucy": { "id": "...", "name": "..." } }
 *
 * Usage:
 *   node generate-audio.mjs                # all lines
 *   node generate-audio.mjs --line 4       # one line (audition / retry)
 *   node generate-audio.mjs --voices       # list account voices and exit
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MODEL_ID = process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5";
const API = "https://api.elevenlabs.io/v1";

function loadKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const envPath = path.join(ROOT, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.+)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "").trim();
    }
  }
  return null;
}

const KEY = loadKey();
if (!KEY) {
  console.error("ELEVENLABS_API_KEY not found in environment or .env.local");
  process.exit(1);
}

const headers = { "xi-api-key": KEY, "Content-Type": "application/json" };

async function api(pathname, init) {
  const res = await fetch(`${API}${pathname}`, { headers, ...init });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init?.method || "GET"} ${pathname} → ${res.status}\n${body}`);
  }
  return res;
}

if (process.argv.includes("--voices")) {
  const res = await api("/voices");
  const data = await res.json();
  for (const voice of data.voices || []) {
    const labels = voice.labels ? Object.entries(voice.labels).map(([k, v]) => `${k}=${v}`).join(", ") : "";
    console.log(`${voice.voice_id}  ${voice.name.padEnd(18)} ${voice.category || ""}  ${labels}`);
  }
  process.exit(0);
}

const script = JSON.parse(fs.readFileSync(path.join(ROOT, "script.json"), "utf8"));
const voicesPath = path.join(ROOT, "voices.json");
if (!fs.existsSync(voicesPath)) {
  console.error("voices.json is missing. Add voice IDs for kinora/michael/lucy first.");
  process.exit(1);
}
const voices = JSON.parse(fs.readFileSync(voicesPath, "utf8"));

function voiceSettings(line) {
  const delivery = (line.delivery || "").toLowerCase();
  const angry = /angry|frustrated|sharp|hurt|defensive/.test(delivery);
  const soft = /vulnerable|apologetic|soften|quiet|tears|sincere/.test(delivery);
  if (line.speaker === "kinora") {
    return { stability: 0.68, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true };
  }
  if (angry) {
    return { stability: 0.3, similarity_boost: 0.86, style: 0.45, use_speaker_boost: true };
  }
  if (soft) {
    return { stability: 0.44, similarity_boost: 0.86, style: 0.22, use_speaker_boost: true };
  }
  return { stability: 0.5, similarity_boost: 0.86, style: 0.2, use_speaker_boost: true };
}

const pad = (n) => String(n).padStart(2, "0");
const onlyLine = (() => {
  const i = process.argv.indexOf("--line");
  return i >= 0 ? Number(process.argv[i + 1]) : null;
})();

const lines = script.lines.map((line, i) => ({ ...line, n: i + 1 }));

for (const line of lines) {
  if (onlyLine && line.n !== onlyLine) continue;
  const voice = voices[line.speaker];
  if (!voice?.id) {
    console.error(`No voice id for speaker "${line.speaker}"`);
    process.exit(1);
  }
  const prev = script.lines[line.n - 2]?.text;
  const next = script.lines[line.n]?.text;
  const base = {
    text: line.text,
    model_id: MODEL_ID,
    voice_settings: voiceSettings(line),
    previous_text: prev,
    next_text: next,
  };

  const target = path.join(ROOT, "audio", `line-${pad(line.n)}.mp3`);
  let res;
  try {
    res = await api(`/text-to-speech/${voice.id}?output_format=mp3_44100_128`, {
      method: "POST",
      body: JSON.stringify(base),
    });
  } catch (err) {
    // Retry once without continuity hints / style (some models reject them).
    const fallback = {
      text: line.text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: base.voice_settings.stability,
        similarity_boost: base.voice_settings.similarity_boost,
      },
    };
    console.warn(`  line ${pad(line.n)} retry without optional params…`);
    res = await api(`/text-to-speech/${voice.id}?output_format=mp3_44100_128`, {
      method: "POST",
      body: JSON.stringify(fallback),
    });
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
  console.log(`  line ${pad(line.n)} ${line.speaker.padEnd(7)} ${voice.name} → ${path.relative(ROOT, target)} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

console.log(`Done — model ${MODEL_ID}`);
