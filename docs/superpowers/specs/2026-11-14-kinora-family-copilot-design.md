# Kinora — AI Family Copilot: Product & Technical Design

**Date:** 2026-11-14
**Status:** Approved for implementation by the user's explicit "implement fully end-to-end" instruction.
**Research inputs:** `research/README.md`, `docs/03-us-market.md`, `docs/05-idea-review.md`, `docs/08-pitch-deck.md`, `docs/12-mvp-scope.md`, `docs/13-child-age-scope.md`, `docs/research/evidence-ai-mediation-psychology.md`, `docs/research/child-development-parental-influence-by-age.md`, `docs/research/us-family-structure-official-stats.md`, `docs/research/unit-economics-benchmarks.md`.
**Visual source of truth:** `reference_design.webp` (two mobile screens, 955×2070 each, lavender canvas `#B3ADBF`, soft `#F3F3F3` surfaces, purple orb, white cards, iOS-like pill controls).

## 1. Product summary

Kinora is a family copilot for the parent team. It combines:

1. **Landing page** — evidence-led marketing with statistics, use cases, examples and a working "Get Started".
2. **Family Home** — Michael & Lucy (seeded), individual daily moods (Sunny / Cloudy / Rainy), mood timeline, and next-best actions that deep-link to the right module.
3. **Individual Assistant** — a warm, personal chat that uses family memory: moods, prior sessions, children profiles, plans and courses.
4. **Psychologist Sessions** — a structured, evidence-informed coaching session with Kinora (voice or text) for one or both parents. Sessions can start immediately or be scheduled with a described problem. Kinora leads the conversation, tracks speakers, validates both sides, never declares a winner, and produces agreements + a recommended course.
5. **Children** — add children, run age-banded discovery assessments (3–5, 6–9, 10–13), get strengths, growth edges, interests, career seeds and practical parenting suggestions. Profiles are explicitly non-diagnostic and expire for retake.
6. **Courses** — short, static, research-grounded courses with a quiz at the end and completion tracking.

**Positioning guardrail (from research):** Kinora is coaching and skills education, **not therapy, counseling, diagnosis or mediation**. All sessions and chat surfaces disclose this. Crisis/abuse language routes to resources (988; 1-800-799-7233) and stops coaching. Kinora never takes one partner's side (anti-sycophancy), which is why the session is two-sided and neutral.

## 2. Visual design system

Extracted from `reference_design.webp`:

| Token | Value | Use |
|---|---|---|
| Canvas | `#B3ADBF` | Desktop surround |
| App surface | `#F3F3F3` | Phone/app background |
| Elevated | `#FFFFFF` | Cards, bubbles, controls |
| Ink | `#1E1E20` | Primary text |
| Muted | `#858585` | Secondary text |
| Border | `#E4E2E8` | Hairlines on assistant cards |
| Purple 200 | `#D6C7FE` | Ambient glow |
| Purple 300 | `#CFBBFB` | Orb highlight |
| Purple 400 | `#BD9FF7` | Orb mid |
| Purple 500 | `#B089FD` | Primary action / voice button |
| Purple 600 | `#8B5CF6` | Icon accents |
| Rain | `#7C9CF5` | Mood |
| Sun | `#F5B942` | Mood |
| Cloud | `#A8A3B5` | Mood |

- **Type:** Inter (`next/font/google`), display tracking `-0.035em`, headline weight 600, body 400/500.
- **Shape:** 44px app shell radius (desktop), 22–28px cards, 20px composer, 999px pills.
- **Elevation:** diffuse purple-tinted shadows, never harsh black.
- **Signature element:** animated WebGL "Kinora orb" (swirling lavender ribbons inside a glass sphere, soft glow). Static CSS fallback for reduced motion / no WebGL.
- **App shell:** mobile full-bleed; desktop ≥768px shows a centered 430–460px device-like shell on the lavender canvas, matching the reference. No generic dashboard chrome.
- **Backgrounds:** base `#F3F3F3` plus layered radial gradients (`#E6DCFF`, `#D6C7FE`) behind the orb and under the top bar.

## 3. Architecture

```
Next.js 16 App Router (TypeScript, React 19, Tailwind 4)
  ├─ /                     landing (server component, static content)
  ├─ /app                  home (client state + server actions via API)
  ├─ /app/assistant        chat (streaming response)
  ├─ /app/sessions         list, schedule sheet
  ├─ /app/sessions/[id]    voice/text session room + summary
  ├─ /app/children         children list + add
  ├─ /app/children/[id]    profile | unknown state
  ├─ /app/children/[id]/discover  assessment flow
  ├─ /app/courses          catalog
  └─ /app/courses/[slug]   slides + quiz
API route handlers (node runtime)
  ├─ /api/state            family snapshot, moods, actions
  ├─ /api/mood             set mood
  ├─ /api/assistant        streaming assistant
  ├─ /api/sessions         create/list/schedule
  ├─ /api/sessions/[id]    get/update/end/summarize
  ├─ /api/sessions/[id]/turn  append parent turn + AI turn
  ├─ /api/children         add child
  ├─ /api/children/[id]/assessment  submit + score
  ├─ /api/courses/[slug]   quiz completion
  ├─ /api/livekit/token    LiveKit access token
  └─ /api/health
```

**Persistence:** a repository interface with a default server-side JSON store (`.data/kinora.json`, atomic writes, process lock) so the app works with zero setup and across tabs/reloads. A Supabase adapter + `supabase/migrations/0001_init.sql` (full schema + RLS) is included for production, activated by `DATA_BACKEND=supabase` + a service-role key. The provided publishable key cannot create tables, so local mode is the tested default.

**AI:** provider abstraction over AI SDK 7.
- `KINORA_AI_MODE=llm` + `OLLAMA_BASE_URL` (default `http://localhost:11434/v1`, model `gemma4:e2b-it-qat`) or `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` → real LLM.
- Otherwise (and on any LLM error/timeout) → `Kinora Engine`, a deterministic, context-aware NLG engine with the same interface. The app and all tests are fully functional in both modes; no API key is required.
- Prompts enforce: warmth, brevity, both-sides neutrality, no diagnosis, no verdicts, safety routing, memory citation.

**Voice:** LiveKit room for the two parents + client-side speech.
- `/api/livekit/token` issues scoped tokens from `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- Each parent's device captures speech (Web Speech API) and tags the transcript with its participant identity — this is speaker identification by device, no fragile diarization.
- Kinora's turn is generated server-side and spoken on every client with a soft female TTS voice (preferred system voice), with live captions. Text mode uses the same orchestrator.
- If LiveKit/browser speech is unavailable, the session stays fully usable in text mode; no dead ends.

## 4. Domain model

```ts
Family { id, name, members: Parent[2], plan, createdAt }
Parent { id, name, role, avatarColor }
Mood { id, memberId, date: YYYY-MM-DD, value: 'sunny'|'cloudy'|'rainy', note?, createdAt }
Child { id, name, birthDate, avatarColor, profile?: ChildProfile, assessments: Assessment[] }
ChildProfile { archetype, traits: Record<Trait, number>, strengths[], growth[], interests[], careerSeeds[],
               parentingTips[], activities[], completedAt, retakeAfter }
Session { id, status: 'scheduled'|'active'|'completed', mode:'voice'|'text', problem, scheduledFor?,
          startedAt?, completedAt?, participants, turns: Turn[], summary?, agreements[], recommendedCourse? }
Turn { id, speakerId: 'kinora'|parentId, text, at, kind: 'question'|'reflection'|'agreement'|'safety' }
Course { slug, title, category, minutes, slides[], quiz[], suggestedFor[] }
CourseProgress { slug, slideIndex, completedAt?, score?, answers? }
MemoryItem { id, kind, text, sourceId?, createdAt }
```

**Assessment traits:** creativity, analytical, social, emotional, physical, focus, leadership. Scores are normalized 0–100 from age-banded item weights. Archetypes are descriptive, never labels of ability. Recommendations are generated from trait combinations. Clear disclaimer: "A conversation starter, not a diagnosis."

## 5. Next-best-action rules (home)

Priority order, with deep links:
1. A parent marked **Rainy** today → "A 10-minute reset for {name}" → session/course, plus a repair script.
2. Both parents **Cloudy/Rainy** → "Book a team check-in" → `/app/sessions`.
3. Child has **no profile** or a profile older than 90 days → "Discover {child}'s strengths" → assessment.
4. Course **in progress** → "Continue {course}".
5. No session in 7 days → "A 15-minute check-in with Kinora".
6. Both **Sunny** → "Bank the good day: plan a family ritual".
7. Upcoming scheduled session → "Prepare for your session".
Every action exposes a one-line reason built from real state (never decorative).

## 6. Course catalog

1. **Repair After the Storm** — visible repair, emotional security, the 20-minute pause.
2. **Emotion Coaching in 90 Seconds** — name, validate, limit, coach.
3. **The Fair-Load Reset** — invisible load, night shifts, "noticed vs did".
4. **Connection Missions by Age** — 10-minute rituals for 0–12.
5. **The Weekly Team Huddle** — 10-minute check-in, appreciations, one goal.
6. **Screens, Boundaries & Big Feelings** — 6–12 digital contract, calm limits.

Each: 4 slides, 3-question quiz, 2/3 pass threshold, persisted progress.

## 7. Testing strategy

- **Unit (Vitest):** mood rules, child scoring/archetypes/age bands, psychologist state machine + safety, session summary, course quiz, memory retrieval, store persistence/concurrency, assistant context, LiveKit token claims.
- **E2E (Playwright):** landing → Get Started; mood set + reload persistence + action update; assistant conversation; child assessment → profile; course → quiz → completion; session start → turns → summary → saved; navigation; mobile viewport; API health.
- **Static:** `tsc --noEmit`, ESLint, production build.
- **Visual:** Playwright screenshots at 430×932 and desktop; manual review against `reference_design.webp`.
- **Container:** multi-stage `Dockerfile` + `docker-compose.yml` for parity.

## 8. Out of scope / honest constraints

- No real authentication, multi-family tenancy, invitations, payments, push notifications (research MVP says guest/demo is fine; user asked for seeded family).
- Child data is minimal (name, birth date, avatar); no child accounts (COPPA-minded).
- LiveKit voice depends on browser speech APIs and a running agent/TTS; text mode is the guaranteed path. The LiveKit token + room integration is real and tested at the token level.
- No clinical claims or diagnoses anywhere in copy.
