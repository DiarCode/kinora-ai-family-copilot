#!/usr/bin/env node
/**
 * Deterministic frame renderer for the Kinora demo stage.
 *
 *   node render.mjs --test          # render a handful of key frames to out/test-*.jpg
 *   node render.mjs                 # render every frame + encode the MP4
 *   FPS=30 node render.mjs          # override frame rate (default 24)
 *
 * Serves demo-video/ over local HTTP (so the stage can fetch cues.json),
 * drives window.renderAt(ms) at fixed timesteps, screenshots each frame,
 * then encodes frames + out/session.wav with ffmpeg.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const TEST_MODE = args.includes("--test");
const NO_ENCODE = args.includes("--no-encode");
const FPS = Number(process.env.FPS || 24);
const QUALITY = Number(process.env.JPEG_QUALITY || 94);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".srt": "text/plain; charset=utf-8",
};

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ""));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch({
    headless: true,
    args: ["--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none"],
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("stage console:", msg.text());
  });
  page.on("pageerror", (err) => console.error("stage pageerror:", err.message));

  await page.goto(`http://127.0.0.1:${port}/stage/index.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__ready === true || !!window.__bootError, null, { timeout: 30000 });
  const bootError = await page.evaluate(() => window.__bootError || null);
  if (bootError) throw new Error(`Stage failed to boot:\n${bootError}`);

  const totalMs = await page.evaluate(() => window.__totalMs);
  console.log(`Stage ready — ${(totalMs / 1000).toFixed(2)}s timeline`);

  if (TEST_MODE) {
    fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
    const fractions = [
      0, 0.006, 0.014, 0.03, 0.05, 0.08, 0.12, 0.17, 0.22, 0.27,
      0.32, 0.37, 0.42, 0.47, 0.52, 0.57, 0.62, 0.67, 0.72, 0.78,
      0.84, 0.90, 0.95, 0.985,
    ];
    const moments = fractions.map((f) => Math.round(totalMs * f));
    for (const ms of moments) {
      await page.evaluate((t) => window.renderAt(t), ms);
      const file = path.join(ROOT, "out", `test-${String(ms).padStart(6, "0")}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: QUALITY });
      console.log(`  test frame @ ${(ms / 1000).toFixed(2)}s → ${path.relative(ROOT, file)}`);
    }
  } else {
    const framesDir = path.join(ROOT, "frames");
    fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir, { recursive: true });

    const totalFrames = Math.ceil((totalMs / 1000) * FPS);
    console.log(`Rendering ${totalFrames} frames @ ${FPS}fps…`);
    const started = Date.now();
    for (let f = 0; f < totalFrames; f++) {
      const ms = (f / FPS) * 1000;
      await page.evaluate((t) => window.renderAt(t), ms);
      const file = path.join(framesDir, `f-${String(f + 1).padStart(5, "0")}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: QUALITY });
      if ((f + 1) % 120 === 0 || f === totalFrames - 1) {
        const elapsed = (Date.now() - started) / 1000;
        const rate = (f + 1) / elapsed;
        const remaining = (totalFrames - f - 1) / rate;
        console.log(
          `  ${String(f + 1).padStart(5)}/${totalFrames} frames — ${elapsed.toFixed(0)}s elapsed, ~${remaining.toFixed(0)}s left`,
        );
      }
    }

    if (!NO_ENCODE) {
      const wav = path.join(ROOT, "out", "session.wav");
      if (!fs.existsSync(wav)) throw new Error("out/session.wav missing — run assemble-audio.mjs first");
      const mp4 = path.join(ROOT, "out", "kinora-demo-session.mp4");
      console.log("Encoding MP4…");
      execFileSync(
        "ffmpeg",
        [
          "-y", "-hide_banner", "-loglevel", "error",
          "-framerate", String(FPS),
          "-i", path.join(framesDir, "f-%05d.jpg"),
          "-i", wav,
          "-c:v", "libx264", "-preset", "slow", "-crf", "17",
          "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.2",
          "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
          "-shortest", "-movflags", "+faststart",
          mp4,
        ],
        { stdio: "inherit" },
      );
      const info = execFileSync(
        "ffprobe",
        ["-v", "error", "-show_entries", "format=duration,size,bit_rate", "-of", "default=noprint_wrappers=1", mp4],
        { encoding: "utf8" },
      );
      console.log(info.trim());
      console.log(`Video → ${path.relative(ROOT, mp4)}`);
    }
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
