# MVP Scope: What to Build, What to Fake-Proof, What to Only Mention

> Based on the official FAQ ([10-official-faq-analysis.md](10-official-faq-analysis.md)):
> - **Q3:** only the key scenario must work, end-to-end and for real.
> - **Q85:** hide buttons that don't work.
> - **Q100:** at least one working return mechanic.
> - **Q126:** "fail → train → succeed" is strong evidence.
> - **Q52:** two-window partner testing with instructions.
> - **Q35:** labeled demo mode with time acceleration.
> - **Q95:** Stripe test checkout with the card shown.
> - **Q146:** depth of execution > originality.

## The one key scenario (what the jury will click through in ~5 minutes)
```
Landing ("For the jury" box: open Link A, then Link B)
  → Partner A: 2-min Family Quiz → personalized 28-day Team Plan (+ invite link)
  → Partner B (2nd window): joins the same team via the link → short quiz
  → Repair Room: both answer 3 private questions about one recent conflict
       → LIVE AI writes a neutral summary of both sides + proposes 1 small agreement
       → both click "We agree" → saved to the Team Plan, progress bar moves
  → Rehearsal (before → after): attempt 1 is scored → coaching → retry on a NEW scenario → higher score
  → Progress / license screen (return mechanic) → "Simulate a week" (demo, labeled)
  → Paywall: Annual Family License $149 (default) / 4-week plan → Stripe TEST checkout (card 4242… shown)
```

## Priority list (MoSCoW)

### 🟥 MUST: build it real; this *is* the 40% score
| # | Feature | Why it's a must | "Real" means |
|---|---|---|---|
| M1 | **Landing + "For the jury" box** (Link A / Link B, step order, "this is a demo" label) | Q52, Q35: the first thing the jury sees, 12:00–15:00 | Links create or join a real guest team session |
| M2 | **Family Quiz → personalized Team Plan** | Shows the user and personalization (Q32). Covers family types (only child, 3+ kids, adopted, blended, solo/co-parent) | Answers change the plan (rules pick modules); an LLM writes a short "Family Profile". Different inputs → different plans (Q134) |
| M3 | **Partner joins in a 2nd window** (team code / link, guest session) | Our core difference: the *team* is the user | Shared team state on the server (Supabase or a simple DB/KV). Partner B's answers appear for A |
| M4 | **Repair Room**: both answer privately → **live neutral AI summary + 1 agreement** → both accept | Signature feature, two-person input ChatGPT can't get (Q32). Replaces the live-mediator idea | Live LLM call on both partners' real text. Anti-sycophancy prompt: no verdicts, names each person's own part. Safety screen for abuse/crisis words → resources |
| M5 | **One return mechanic: Team Plan progress + license progress** | Q100 requires one working return mechanic. Renewal story (Q30) | Completing Repair/Rehearsal updates persisted progress (the 28-day plan checklist, a license-class bar) |
| M6 | **Paywall + Stripe test checkout** (annual default) | Q37/Q55/Q95: paywall = minimum; a completable test checkout = stronger | Real Stripe Checkout in test mode; the test card shown on screen; success page unlocks "premium" in the session |

### 🟧 SHOULD: build next; big score per hour
| # | Feature | Why | Effort |
|---|---|---|---|
| S1 | **Rehearsal before → after** (AI role-plays the partner; rule + LLM scoring; retry on a *new* scenario) | Q126: "strong evidence of value". Single-player, so easy to test | Medium (reuses the M4 LLM plumbing) |
| S2 | **"Simulate a week" demo button** (labeled) | Q35: the jury sees streak, weekly Huddle summary and renewal reminder in 3 minutes | Low |
| S3 | **Pause button + 20-minute timer** inside the Repair Room entry ("We're flooded, back at 8:40") | Makes Pause → Repair visible. No push notifications, just shared state | Low |
| S4 | Mobile-responsive layout | Q60/Q103: a plus | Low if planned from the start |

### 🟨 COULD: only if the musts and shoulds are solid
| Feature | Note |
|---|---|
| "Today" daily lesson + scenario rep (3–5 days of real content) | Nice, but **renewal > daily use** (Q30). Not needed for the score |
| Weekly **Team Huddle** screen (stats, appreciations, one goal) | Could be shown via "Simulate a week" output instead |
| Shareable **license card** (PNG) | Brag/word-of-mouth story; a deck screenshot may be enough |
| "Experts agree / differ" badges on plan items | Cheap static labels; supports originality |

### ⬜ WON'T (this time): mention in the deck or README only
| Feature | Where to mention |
|---|---|
| Real accounts, email reminders, push notifications | README "next steps" (guest mode + localStorage is OK, Q135) |
| Voice rehearsal | Roadmap |
| Full curriculum (28 days × all license classes), content packs for ND / adoptive / blended families | Deck slide 6 (license classes) + roadmap; the quiz flags already change the plan |
| Gift a License flow, Learner's Permit purchase, referral program, Class Pack codes | Deck slides 7 and 10 (pricing + go-to-market) |
| Dad funnel, separate onboarding | Deck slide 10 |
| Expert Consensus Engine knowledge base (100+ books) | Deck slide 5 (one line) |
| Co-parent mode for separated parents, Village seat | Roadmap; the quiz option exists |
| International, Spanish | Business slide one-liner |
| Analytics, A/B tests, CI/CD, tests | Not required (Q23) |

**Rule:** anything not built is **hidden in the UI** (Q85). No "coming soon" buttons in the main flow; mention it in the deck instead.

## Suggested build plan (3 people)
| Person | Owns | Order |
|---|---|---|
| **Full-stack A** | Team/session backend (guest IDs, team code, shared state), M1, M3, M5 | 1) data model + guest session → 2) partner join → 3) progress persistence |
| **Full-stack B** | LLM features: M2 profile text, **M4 Repair summary**, S1 Rehearsal scoring; safety screen; prompt tests on 10 messy inputs | 1) M4 first (signature) → 2) M2 → 3) S1 |
| **Front-end / product** | UI for the whole flow, mobile layout, M6 Stripe test checkout, S2/S3, deck screenshots | 1) quiz + plan UI → 2) paywall + Stripe → 3) demo polish + screenshots |

**Stack (simple, readable, Q22/Q28):** Next.js (App Router) on Vercel · Supabase (Postgres + anonymous sessions) or Vercel KV · an LLM API on the server only (a fast, cheap model for scoring; a stronger model for the Repair summary) · Stripe Checkout (test mode) · keys in env vars, never in the repo (Q26, Q48).

**Hour budget (example):** 0–2h data model and guest teams · 2–8h M2/M3/M4 · 8–12h M5/M6 · 12–16h S1/S2/S3 · 16–20h polish, mobile, README, safety copy · 20–24h full jury walkthrough on the deployed link from two browsers, screenshots, deck.

## Definition of done (the "jury test")
- [ ] Open the production link in a **fresh incognito window**: no login needed anywhere in the flow
- [ ] Link A + Link B in two windows: Partner B's answers reach Partner A's Repair Room
- [ ] Type **your own messy text** into the Repair Room: the summary is different, neutral, names both sides' parts, and never says who's right
- [ ] Type abuse/crisis words: resources appear instead of coaching
- [ ] Rehearsal: a bad first answer scores low, the retry scores higher, on a different scenario
- [ ] Progress persists after a page reload
- [ ] Stripe test checkout completes with 4242 4242 4242 4242; the premium state shows
- [ ] No dead buttons; everything not built is hidden
- [ ] Works on a phone-width screen
- [ ] README: what it is, the jury path, how to run, dependencies (LLM, DB, Stripe), "demo data is labeled", no secrets
- [ ] The repo is public and contains exactly the deployed code; commits are from the hackathon

## How the scope maps to the score
| Criterion | Covered by |
|---|---|
| Does it work (40%) | M1–M6 fully live; judges' own inputs work |
| Value & retention (20%) | M5 progress + license classes + S2 week simulation; renewal logic in the deck |
| Problem & user (15%) | M2 personalization for family types; deck stats + any US interviews |
| Money (15%) | M6 paywall + checkout; the deck has CAC by channel, LTV, payback, stress test |
| Originality (10%) | M3 + M4: the parent *team* as the user, Pause → Repair, two-person input |
