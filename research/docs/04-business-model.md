# Business Model, Unit Economics and 5-Year Plan

> All numbers come from [model/financial_model.py](../model/financial_model.py) (a monthly cohort simulation; full output in [model/output.md](../model/output.md)). Assumptions are anchored to **RevenueCat State of Subscription Apps 2026**, **Adapty Meta Ads benchmarks Q3 2026** and **FunnelFox State of Web2App 2026**. They are estimates for a pitch, not a forecast.

## 1. What we sell

| Plan | Price | Notes |
|---|---|---|
| **Free (no login)** | $0 | Onboarding quiz, "Family Profile", day-1 lesson, 1 AI rehearsal, partner invite. This is what the jury uses |
| **Household plan** (both partners, 2 seats) | **$9.99 first 4 weeks → $24.99 every 4 weeks** | The quiz-funnel norm (Zimran's Finelo: $19.99 → ~$30–40). **One price for two people** is a differentiator vs per-seat Lasting and Good Inside |
| Annual | $149/yr (≈ $12.40/mo) | Pushed after 2 renewals ("you've built a 45-day streak, lock in") |
| **Gift a License** | $59 for 3 months, one-time | Baby showers and registries. A brag-friendly, high-intent channel |
| Expecting Edition (one-time) | $49 | "Learner's Permit": 6-week couple prep for the baby. Upsells into the subscription after birth |

**Transparent billing as a feature:** the renewal price is shown on the paywall, the app reminds you 3 days before renewal, and cancellation is one click. Billing transparency is the biggest trust risk across quiz-funnel subscriptions, so this answers a real jury concern.

## 2. Funnel

```
Meta / TikTok / Pinterest / YouTube creative ("Since the baby we argue about everything...")
 → Landing + 25-screen quiz (kid age, conflict hotspots, who does night wakes, love language, "parent you want to be")
 → "Your Family Profile + 28-day Team Plan" (real personalization)
 → Partner invite link (viral loop: a 2nd seat at no extra cost)
 → Paywall ($9.99 first 4 weeks)  → web app (PWA) daily habit
```
Benchmarks: ~13% of sessions reach the paywall, ~3% purchase (FunnelFox). Paywall→purchase is 15–25%. US Meta CPM is $18–30, and the median cost per paying user is **$43–82** (Adapty).

## 3. Unit economics (per paying household, 24-month horizon)

| Scenario | Paid CAC | Organic share | Blended CAC | Renew after intro | Monthly churn | Avg paid months | Net rev 12m | **GM-LTV 24m** | **LTV/CAC** | **Payback** |
|---|---|---|---|---|---|---|---|---|---|---|
| Conservative (standalone) | $120 | 5% | $116 | 40% | 20% | 3.0 | $52 | $47 | **0.41** ❌ | > 24 mo |
| **Base (standalone)** | $60 | 15% | $52 | 50% | 14% | 4.5 | $77 | $82 | **1.58** | 7 mo |
| Optimistic (standalone) | $45 | 25% | $34 | 55% | 11% | 5.7 | $94 | $112 | **3.24** ✅ | 4 mo |
| **Inside Zimran** | $45 | 20% | $37 | 50% | 14% | 4.5 | $77 | $82 | **2.22** | 5 mo |

Other assumptions: payment fees 6%, refunds 3–6% on the first charge, **AI + hosting COGS $0.80–2.00 per active payer per month** (text coaching at ~$0.05–0.60; capped voice rehearsal at ~$0.30–0.60 per 10 minutes), support 2–5%. Gross margin on web is **~75–85%** (vs 60–70% if we billed through the App Store).

**How to read it:**
- The **conservative** case says that *if* parents behave like the average web-funnel buyer, **paid social doesn't pay back**. We would then grow only through organic, gifting and community channels and keep the team tiny. **Kill/pivot criterion:** if D7 ROAS stays below 25% after $50K of tests.
- The **base** case clears LTV > CAC but needs ~$9M of funding to scale. That's normal for venture-backed consumer subscriptions.
- **The levers that move us from base to optimistic are product levers, not ad tricks:**
  1. **Partner seat**: the second partner arrives free (organic), and couples churn less than solo users because there's mutual accountability.
  2. **Gift a License**: zero-CAC acquisition at baby showers.
  3. **Life-stage continuity**: expecting → newborn → toddler → preschool levels give a reason to stay after the first crisis passes.
  4. **Shareable license card**: free reach from the "I'm doing the work" signal.

## 4. Five-year plan

### Conservative (standalone)
| Year | Marketing | New payers | Active payers (end) | Revenue | ARR (end) | P&L | Cumulative |
|---|---|---|---|---|---|---|---|
| Y1 | $60K | 526 | 180 | $16K | $30K | −$127K | −$127K |
| Y3 | $300K | 2,632 | 925 | $113K | $156K | −$410K | −$795K |
| Y5 | $700K | 6,140 | 2,184 | $296K | $372K | −$761K | **−$2.1M** |
→ A lifestyle business at best. **Don't scale paid acquisition in this world.**

### Base (standalone)
| Year | Marketing | New payers | Active payers (end) | Revenue | ARR (end) | P&L | Cumulative |
|---|---|---|---|---|---|---|---|
| Y1 | $200K | 3,922 | 1,685 | $157K | $324K | −$262K | −$262K |
| Y2 | $1.2M | 23,529 | 10,347 | $1.1M | $2.0M | −$914K | −$1.2M |
| Y3 | $4.0M | 78,431 | 35,153 | $4.2M | $6.9M | −$2.1M | −$3.2M |
| Y4 | $9.0M | 176,471 | 80,769 | $10.7M | $16.1M | −$3.0M | −$6.2M |
| Y5 | $16.0M | 313,725 | 146,191 | $21.0M | **$29.4M** | −$3.3M | −$9.5M |
→ Peak funding need **~$9.5M**. Matches a "seed → Series A" path (seed $0.3–1M ARR, A at $2–5M ARR).

### Optimistic (standalone)
| Year | Marketing | New payers | Active payers (end) | Revenue | ARR (end) | P&L | Cumulative |
|---|---|---|---|---|---|---|---|
| Y1 | $400K | 11,852 | 5,739 | $542K | $1.2M | −$202K | −$202K |
| Y2 | $2.5M | 74,074 | 37,117 | $4.1M | $7.7M | +$96K | −$106K |
| Y3 | $8.0M | 237,037 | 122,880 | $15.5M | $25.9M | +$2.9M | +$2.8M |
| Y4 | $18.0M | 533,333 | 285,181 | $40.0M | $60.9M | +$12.2M | +$15.0M |
| Y5 | $30.0M | 888,889 | 493,148 | $76.9M | **$106.9M** | +$30.7M | +$45.7M |
→ **Crosses $100M ARR in Y5** with ~490K paying households, ≈ 1.4% of partnered US parents aged 25–44 (or ~5× Good Inside's subscriber count). Peak burn is only ~$0.5M, because payback is under 6 months and profits are reinvested. That is Zimran's own bootstrapped model.

### Inside Zimran (base retention + Zimran's media and funnel machine)
| Year | Marketing | New payers | Active payers (end) | Revenue | ARR (end) | P&L | Cumulative |
|---|---|---|---|---|---|---|---|
| Y1 | $600K | 16,667 | 7,163 | $669K | $1.4M | −$264K | −$264K |
| Y2 | $4.0M | 111,111 | 48,749 | $5.2M | $9.5M | −$320K | −$584K |
| Y3 | $10.0M | 277,778 | 126,189 | $16.2M | $25.0M | +$2.4M | +$1.8M |
| Y4 | $20.0M | 555,556 | 256,489 | $35.4M | $51.3M | +$8.0M | +$9.8M |
| Y5 | $32.0M | 888,889 | 418,145 | $62.3M | **$84.4M** | +$18.2M | +$28.0M |
→ The **same base-case product behaviour** grows ~3× faster and is profitable by Y3, because Zimran brings a ~25% CAC discount (creative studio, pixel data, a tested funnel stack, cross-promotion to its 100K+ paying users) and cheap capital.

### IRR (asked for, with a caveat)
5-year IRR on annual cash flows: **Optimistic ≈ 500%**, **Inside Zimran ≈ 340%**. Base is negative without an exit. With a 3× ARR terminal value it is ≈ 220%. The numbers are huge because the upfront capital is tiny, which is typical for bootstrapped funnel businesses. They are not meaningful for comparison. **Pitch LTV/CAC and payback days instead. That's what Zimran itself runs on.**

## 5. Integration with Zimran vs standalone

| Dimension | **Inside Zimran (new "Family Skills" niche)** | **Standalone startup** |
|---|---|---|
| CAC | **Lower** (−20–30%): their creative and media-buying machine, lookalike data, Coursiv/Finelo cross-sell | Higher. Must learn paid social from zero |
| Speed | Launch in ~4–6 weeks on their funnel/paywall stack | 3–6 months to a tuned funnel |
| Capital | Zimran-funded and bootstrapped. Peak burn ~$0.8M | Needs a ~$1–2M seed for the base case |
| Product fit | Same template: 28-day challenge, micro-lessons, streaks, AI | Free to go deeper (clinician board, research partnerships) |
| Brand / trust | ⚠️ A **trust-critical** audience (parents, couples) needs a separate, family-first brand and transparent billing | Can build a clean, "evidence-based" trust brand. Easier PR, pediatrician and therapist referrals |
| Channels unlocked | Global English markets fast (Zimran sells in 150+ countries) | Partnerships: hospitals and OB-GYNs (Expecting Edition), Gottman-style certified coaches, employer benefits later (B2B2C) |
| Equity / upside | Team gets a role or bonus, Zimran owns it | Team owns it; dilution from VC |
| Exit | Part of the Zimran portfolio | Acquirers: Talkspace, Maven, Good Inside, Peanut, Flo, Noom |
| **Verdict** | **Highest expected value in years 1–3** | **Higher ceiling and trust if the evidence and brand work** |

**Recommended pitch line:** *"Built as a standalone brand, designed to plug into Zimran's machine as its next niche. Same funnel, a new audience, and a longer LTV, because parenting lasts 18 years and Finelo doesn't."*

## 5b. Cost structure: AI, servers and ads, itemized
The model ([model/financial_model.py](../model/financial_model.py), full tables in [model/output.md](../model/output.md)) keeps every cost line separate.

### Variable cost per active paying household per month (base case ≈ $1.20)
| Item | What drives it | Base estimate | How we got it |
|---|---|---|---|
| **LLM: AI Rehearsal** | ~4 sessions/mo × ~10 turns × (~2K input + 200 output tokens) on a Sonnet-class model | ~$0.35–0.45 | Sonnet-class pricing ~$3/$15 per 1M tokens; prompt caching cuts the input cost |
| **LLM: Repair Room summaries** | ~2/mo × (3K in + 500 out) | ~$0.03 | Same |
| **LLM: skill scoring, plan personalization** | ~40 small calls on a Haiku-class model | ~$0.06 | Haiku-class ~$1/$5 per 1M tokens |
| **LLM: optional voice rehearsal** (later) | 10 min/mo, capped | $0.30–1.00 | Realtime voice ~$0.03–0.10/min. Not in the base case; cap minutes |
| **Infra** | Hosting (Vercel), database and realtime (Supabase/Postgres), email and push notifications, error monitoring, storage for license cards | ~$0.30–0.50 | Typical serverless SaaS cost at 10K–500K users |
| **Total AI + infra** | | **~$1.20** (conservative $2.00, optimistic $0.80) | ≈ **5–10% of revenue** at $24.99 per 4 weeks |

The **lessons themselves are pre-written content, not generated on the fly**. Only Rehearsal, Repair and personalization call an LLM. That's why AI cost stays small.

### Free users also cost money
Each paying household comes with ~25–30 quiz-takers who try the free AI rehearsal and don't buy. At ~$0.03–0.05 each, that's **~$1.00 per paying household** (conservative $1.50, optimistic $0.70). It's added to the blended CAC.

### Where the money goes (Base case, Y3 / Y5)
| Cost line | Y3 | Y5 | Share |
|---|---|---|---|
| **Ads (paid marketing)** | $4.0M | $16.0M | **~60% of all costs**, by far the biggest line |
| Team & fixed (salaries, content and expert review, tools, legal, base servers) | $1.8M | $6.0M | ~25% |
| Payment fees (Stripe ~6%) | $269K | $1.3M | ~6% of billings |
| **LLM / AI API** | $160K | $761K | **~3.4% of revenue** |
| **Infra (hosting, DB, email)** | $114K | $543K | **~2.4% of revenue** |
| **Free-user AI** | $78K | $314K | ~1.4% of revenue |
| Support | $126K | $629K | 3% of revenue |
| Refunds | $35K | $141K | <1% |

**Takeaway for the pitch:** *AI and servers cost about 8% of revenue. Ads are about 60% of costs.* The business is won or lost on **acquisition cost**, not AI cost. That's why word of mouth matters so much (next table).

### Word of mouth ("сарафанное радио") is the biggest lever
Base scenario. Only the share of customers who arrive free (partner invites, referrals, moms recommending it to other moms, gifts) changes, with the same ad budget:

| Free / organic share of new payers | Blended CAC | LTV/CAC | Payback | Y5 ARR |
|---|---|---|---|---|
| 15% (base assumption) | $52 | 1.58 | 7 mo | $29.4M |
| 30% | $43 | 1.91 | 6 mo | $35.7M |
| 45% | $34 | 2.42 | 4 mo | $45.4M |
| 60% | $25 | **3.29** | **3 mo** | **$62.4M** |

Why a high organic share is plausible here:
1. **Every purchase brings a second user** (the partner seat).
2. **Moms recommend to moms**: 42% of moms visit online parenting communities monthly, and 89% trust recommendations from people they know.
3. **Parents show off "doing the work"** with the shareable license card.
4. **Gifting at baby showers.**

But **we only assume 15–25%** in the plan until real data proves more. Investors and the jury discount a model that *assumes* virality.

## 6. International upside (bonus; US stays the primary market)
Based on [research/international-expansion.md](research/international-expansion.md) and [06-audience-culture-personas.md §6](06-audience-culture-personas.md):

| Expansion | Multiplier on US revenue (raw / risk-adjusted) | Timing |
|---|---|---|
| + Canada, UK, Australia, Ireland, NZ | **1.31× / 1.23×** | Y2–3 (same funnel, English) |
| + Germany, Netherlands, Nordics | **1.52× / 1.34×** | Y3–4 (localization, SEPA/iDEAL, GDPR, German cancel-button law) |
| + US Spanish-speaking segment | ~1.6–1.7× | Y3 test |

Applied to Y5 ARR (risk-adjusted, English wave only): **Optimistic $107M → ~$130M**, **Inside Zimran $84M → ~$105M**, Base $29M → ~$36M. Meta CPMs in UK/CA/AU/DE run ~50–73% of US levels, which offsets lower local ARPU. The main headwind is **free government parenting resources** (NHS, Raising Children Network, Plunket, German midwife system), so the international pitch leads with the **couple/team** angle, which those services don't cover.

## 7. Key risks and mitigations
| Risk | Mitigation |
|---|---|
| CAC in a narrow, sensitive audience | Partner seat, gifting, a dad-first creative angle (an underserved and cheaper audience), Pinterest/YouTube for expecting parents |
| "Gym membership" churn (aspirational buyers who don't use it) | First-14-days obsession: 5-minute reps, partner accountability, the kid mission is fun and real |
| AI legal exposure (IL/NV laws) | "Skills coach", never "therapy". Crisis/DV routing. AI disclosure. No verdicts |
| Data sensitivity (discoverable in divorce) | Private-by-default reflections, short retention, one-click delete, no raw transcript storage |
| Seasonal and crisis churn | Life-stage levels plus weekly Team Huddle rituals |
| Copycats / Good Inside adds couple features | Speed, couple-native architecture, gamified license as a brand asset |

## Sources
All benchmark numbers in this file, with URLs: [research/unit-economics-benchmarks.md](research/unit-economics-benchmarks.md) (RevenueCat 2026, Adapty Q3 2026, FunnelFox 2026, Admiral, Stripe, LLM pricing). Market and competitor figures: [03-us-market.md](03-us-market.md), [research/competitors.md](research/competitors.md). International: [research/international-expansion.md](research/international-expansion.md).
