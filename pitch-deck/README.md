# Kinora — Seed Deck 2026

A focused **10-slide** investor deck for Kinora, the AI family copilot for the parent team. The editable file is `kinora-seed-2026.pptx`; the PDF is the same 10 slides. The 18-slide HTML in this folder is the long-form design source and diligence appendix, not the pitch.

## Open it

```bash
open pitch-deck/kinora-seed-2026.pptx   # editable in PowerPoint, Keynote, Google Slides
open pitch-deck/kinora-seed-2026.pdf    # 10-page export
```

The PPTX uses **Georgia** for headlines and **Arial** for body text so it stays editable on any machine. The HTML long-form version uses the original Instrument Serif + Inter Tight pairing.

## The 10 slides

1. **Cover** — Parenting is a team sport.
2. **Problem** — Parents run a two-person job with no shared operating system.
3. **Solution** — One calm place for the parent team; three real screens: check in, talk, agree.
4. **Why Kinora wins** — The market sells content; Kinora runs the relationship. A job-by-job comparison table against the market.
5. **Market** — A $1.2B entry market; 17M → 8.2M → 18K–45K, bottom-up.
6. **Business model** — $149/year household license; $67 CAC, $155 LTV, 2.3×, 7-month payback.
7. **Path** — $29.4M base case; $106.9M optimistic case; 5.6% of SAM for $100M.
8. **Go-to-market** — Every customer brings a second seat and a third family; $52 blended CAC.
9. **Proof & pilot** — The product is real; a 1,000-family pilot proves the loop.
10. **Team & ask** — Diar Begisbayev, Danila Lissovoy, Daniyar Sagandykov; $2.5M seed, 24 months.

## What is in the folder

```
pitch-deck/
  kinora-seed-2026.pptx      editable 10-slide deck (primary)
  kinora-seed-2026.pdf       10-page PDF exported from the PPTX
  kinora-seed-2026-long.pdf  18-page long-form export (archive)
  SPEAKER-NOTES.md           5-minute script + VC Q&A
  index.html                 18-slide long-form design source (not the pitch)
  assets/screens/            real screenshots from the working app
  review/                    slide images + the long-form and compact VC verdicts
  README.md                  this file
```

## Design system

- **Canvas:** white `#FFFFFF`; ink `#0A0A0B`; muted `#6D6D76`.
- **Accent:** lavender `#C9B8FF` for the highlighter and `#8B5CF6` for data; pale lavender `#F2EDFF`.
- **Signature:** one lavender highlighter on the sentence that matters; one idea per slide; large type over dense text.
- **Screenshots:** 430×932 mobile viewport at 3× DPR, framed in a clean device shell.
- **PPTX type:** Georgia 40–58 pt headlines, Arial 10–17 pt body, 30–50 pt metrics.

## Rebuild

The PPTX is generated from the same content as the deck:

```bash
node scripts/build-deck-pptx.mjs
soffice --headless --convert-to pdf --outdir pitch-deck pitch-deck/kinora-seed-2026.pptx
```

The screenshots were captured from the working Next.js app with a production build on port 3200 and an isolated data store:

```bash
npm run build
KINORA_TEST_MODE=1 KINORA_DATA_DIR=.data-deck KINORA_AI_MODE=engine npx next start --port 3200

# in another shell
node scripts/capture-deck.mjs        # all flows
node scripts/capture-deck.mjs home   # one flow
```

The capture script resets the demo between flows and uses the seeded family (Michael & Lucy Bennett, Sophie, 6). No real family data is shown.

## Sources and limits

- The deck uses the research in `research/` and the citations in the 18-slide long-form HTML. Where a study is small or a number is an estimate, the deck says so.
- Kinora is **coaching and skills education, not therapy**. The deck does not claim clinical outcomes, diagnosis, treatment, HIPAA compliance, or "AI therapist."
- The company is pre-revenue. The deck labels the product proof as product proof; the 1,000-family pilot and the 24-month milestones are a plan, not results.
- The ~$2.5B TAM is 17M partnered U.S. households with kids under 12 × $149/yr. The ~$1.2B SAM applies a 48% "overwhelmed most days" filter (8.2M households). The 17M count is our estimate from Census/Pew; the filter is sourced.
- Unit economics use the $149 annual anchor at an 80% gross margin: $67 CAC, $155 24-month LTV, 2.3× LTV/CAC, 7-month payback. The monthly plan is the floor ($52/$72/1.4×).
- The $100M path uses 460K paying households at ~$219 net revenue/year — 5.6% of the overwhelmed SAM. The base case is $29.4M ARR in Year 5; the optimistic case is $106.9M.
- The biggest risk is both-partner activation. Slide 9 makes the 1,000-family pilot the next milestone and states the contingency: below 40% activation, launch solo-parent mode at $79/yr and keep team mode as the upsell.

## Before sending

- Add the founder contact line (email / LinkedIn / domain) to the cover or final slide. The current deck carries the names but not contact details.
- Confirm the $2.5M ask, use of funds, and milestones with all three founders.
- If any pilot, LOI, waitlist, or design-partner conversations exist, add them to slide 9. The deck currently claims only a working product and a planned pilot; do not imply conversations that do not exist.
- Have counsel review the regulatory language in the long-form `index.html` (A3) before sharing broadly.
