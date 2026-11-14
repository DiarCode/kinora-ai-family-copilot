# Business Cup 2.0 — "From Zero to…" — Rules & Strategy Notes

> Source: the organizer's Canva video deck (5 slides, transcribed from screenshots). Event: **Nov 14–15, Nazarbayev University**. Organizer: Zimran.

## 1. The challenge (slide 01)

**Build a web product that closes a fundamental pain for adults in the US — one they will pay for.**

| Constraint | Value | What it means for us |
|---|---|---|
| Audience | **US, 25–45** | Working adults with jobs, families, bills and goals |
| Model | **B2C** | Sell to people, not companies. Employer/B2B channels can be a *future* growth idea, **never the core** |
| Platform | **Web only** | Runs in the browser. No mobile apps. (A PWA that installs from the browser is still web.) |
| Time | **24 hours** | From an idea to a working product |

## 2. Tracks (slide 02) — pick ONE

| # | Track | Prompt |
|---|---|---|
| 01 | Money | Earning, spending, saving, owing. Where does money hurt? |
| 02 | Entertainment | Play, stories, free time. What makes downtime feel wasted? |
| **03** | **Skills** ← *our pick* | **Learning and growing. What do people fail to master?** |

> "A track is a territory, not a product. Narrow it down to **one user and one pain**."

This line matters a lot for scoring. A product that covers parenting, couples, mediation, childbirth and kids' gamification all at once breaks it. See the idea review for how we narrow it.

## 3. Judging criteria (slide 03) — "The product comes first"

| Weight | Criterion | Jury question | What they look for |
|---|---|---|---|
| **40%** | **Does it work?** (Product & Engineering) | — | Works **end-to-end in production**: not a mockup, not a slide. Core value is **real, not faked or hardcoded**. **Quality of UX and code: "we read your repo."** |
| 20% | What do we sell? (Value & Retention) | Clear what the user pays for and **why they come back tomorrow** | |
| 15% | Who do we sell to? (Problem & User) | A clear choice of problem and a **deep understanding of the target user** | |
| 15% | Why does it make money? (Business potential) | Big or growing niche, **$100M ARR long-term, LTV > CAC** | |
| 10% | Is it new? (Originality) | Not a copy-paste of a business that already exists | |

**Pass / fail gates:** B2C only (no B2B) · Web only (no mobile apps) · All 3 submission items.

### Strategic reading of the criteria
- **40% goes to a working product.** A narrow product that works beats a broad one that's half-faked. Every feature in the demo must really work: real auth-less flow, real data saved, real AI calls, no hardcoded "AI results."
- **20% is retention.** We have to show **why the user comes back tomorrow**: daily lessons, streaks, a partner nudge, a kid-related ritual.
- **15% is the user.** Have one sharp persona (see the idea review) and quote real stats.
- **15% is money.** Show a credible path to **$100M ARR** and **LTV > CAC** using real benchmark numbers.
- **10% is originality.** "Duolingo for parenting" alone isn't new. Our angle is the **couple-as-a-team** framing plus the **"parent license" credential**.

## 4. Submission (slide 04) — three things, all required

Deadline: **12:00, Nov 15**. Resubmit as often as you like until then; the jury reviews your latest version. One submission per team, made by the captain.

| # | Item | Format | Requirement |
|---|---|---|---|
| 01 | Pitch deck | PDF | **Up to 10 slides total.** The story behind the product, covering the criteria |
| 02 | Production link | URL | A live web product the jury can open in a browser and use end-to-end. **No sign-up or login required** |
| 03 | GitHub repo | GitHub | Source code. **Public repo**: no access requests, no login |

Missing any of the three makes the submission **incomplete**.

**Key implication:** the jury must be able to use the product **without login**. Design the demo as a guest session (localStorage or an anonymous session ID), with an optional "save progress" step. A Stripe **test-mode** paywall is fine and shows the money flow. Make clear it's test mode.

## 5. Flow (slide 05) — "24 hours. One product."

1. **Get the case:** pick a track and a pain
2. **Build:** 24 hours to a working product
3. **Ship:** submit the deck, link and repo
4. **Pitch:** 5-minute pitch plus 2-minute Q&A
5. **Top 10:** finalists compete for **₸5,000,000**

Tagline on the slide: **"be extra."**

## 6. Checklist we derive from the rules
- [ ] Track 03 (Skills) chosen, narrowed to **one user and one pain**
- [ ] Deployed URL (Vercel/Netlify/Render) that works with **no login**
- [ ] Public GitHub repo with a clean README, clean structure, and no secrets committed (API keys in env vars)
- [ ] Real AI feature (not mocked) with a graceful fallback if the API fails
- [ ] Retention loop visible in the demo (streak, daily lesson, partner invite)
- [ ] Paywall / pricing page (Stripe test mode) that shows what we sell
- [ ] Deck ≤10 slides as PDF: problem → user → product → retention → market → unit economics → $100M path → originality → team
- [ ] 5-minute pitch rehearsed; Q&A answers ready for "why not ChatGPT?", "why would dads use it?", "CAC?", "AI safety?"

## Source
Transcribed from the organizer's Canva video deck "BUSINESS CUP </2.0> FROM ZERO TO…" (5 slides: challenge, tracks, criteria, submission, flow), shared with participants. Event page: https://businesscup.zimran.io
