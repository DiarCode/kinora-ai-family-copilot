# Kinora — session demo video

A 2-panel-plus-app demo of Kinora's couples session: Michael (left), the live
Kinora app (center), Lucy (right). Three performed voices, a live transcript,
phase progression, a shared-need reveal, and one small agreement.

**Output:** `out/kinora-demo-session.mp4` — 1920×1080, 24 fps, H.264 + AAC,
~2:48, −14 LUFS.

## Cast

| Role | Voice | Voice ID |
| --- | --- | --- |
| Kinora | Alice — clear, engaging educator (British) | `Xb7hH8MSUJpSbSDYk0k2` |
| Michael | Chris — charming, down-to-earth (American) | `iP95p4xoKVk53GoZ742B` |
| Lucy | Jessica — playful, bright, warm (American) | `cgSgspJ2msm6clMCkdW9` |

Model: `eleven_turbo_v2_5`. Michael and Lucy start frustrated/defensive
(low stability, higher style); Kinora stays calm and professional
(high stability, neutral style). Settings live in `generate-audio.mjs`.

## Session arc

The script mirrors the app's real coaching engine
(`src/lib/engine/psychologist.ts`):

1. **Story** — one question per parent, no verdict
2. **Emotion** — what each was protecting under the anger
3. **Needs** — the need under the anger
4. **Common ground** — the shared need, named out loud
5. **Agreement** — pause + return time; device-free first ten minutes
6. **Close** — summary, one next step, "a conversation, not a verdict"

`script.json` holds all dialogue, delivery notes, gaps, and UI content.

## Pipeline

```bash
# 1. Voices (requires ELEVENLABS_API_KEY in ../.env.local)
node generate-audio.mjs --voices     # list account voices
node generate-audio.mjs              # → audio/line-XX.mp3 (20 calls)
node generate-audio.mjs --line 4     # regenerate a single line

# 2. Timeline: real durations → stage/cues.json, out/cues.json, out/kinora-demo.srt
node build-timeline.mjs

# 3. Loudness-balanced master (per-line −16 LUFS, final −14 LUFS)
node assemble-audio.mjs              # → out/session.wav

# 4. Frames + encode (deterministic screenshots driven by cues.json)
node render.mjs --test               # quick key-frame check → out/test-*.jpg
node render.mjs                      # → frames/ + out/kinora-demo-session.mp4
```

`render.mjs` serves this folder over local HTTP, drives
`window.renderAt(ms)` at fixed timesteps, screenshots each frame, then
encodes with ffmpeg. No wall-clock animation is used, so re-renders are
frame-accurate.

## Stage

`stage/index.html` is a self-contained 1920×1080 scene:

- Real WebGL Kinora orb (same shader as `src/components/brand/kinora-orb.tsx`)
- Phase rail: Story → Emotion → Needs → Common ground → Agreement → Close
- Question counter (8 Kinora questions), session timer, live pill
- Session-focus card that gives way to the shared-need/agreement reveal
- Portraits cropped from `Kinora_ A Warm Kitchen Conversation.png`
- Live captions, active-speaker rings, animated voice bars, emotion arcs
  (Frustrated → Guarded → Honest → Seen → Sorry → Heard)
- Branded end card with the coaching disclosure

Fonts are vendored from `pitch-deck/assets/fonts`.

## Notes

- The session is simulated for demonstration; Kinora is coaching and skills
  practice, not therapy or crisis care. This disclosure appears on the end card.
- Generated frames and the intermediate WAV are gitignored; the final MP4, the
  per-line MP3s, the SRT, and the cue sheets are kept.
