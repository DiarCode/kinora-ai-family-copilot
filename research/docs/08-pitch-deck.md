# Pitch Deck: Slide-by-Slide Points + Speaker Notes

> **Updated after the official FAQ ([10-official-faq-analysis.md](10-official-faq-analysis.md)):** 10 slides *including the title and any appendix*; no video in the PDF, so show the product as **screenshots**; the jury tests the product via the link *before* the pitch; **renewal beats daily use**; show **CAC by channel**.
>
> Rules: **max 10 slides, PDF**, 5-minute pitch + 2-minute Q&A. Judging: Does it work 40% · Value & retention 20% · Problem & user 15% · Money 15% · Originality 10%.
> Every number below has its original source linked in `docs/research/*` or `docs/03`. Use the **exact wording** shown, since several stats are easy to over-claim (see "How to say the stress stat correctly" at the end).

---

## Slide 1: Hook
**Title:** *You need a license to drive. Not to raise a human.*
- **Hearth: the Family License, for two.** Parenting as a team, 5 minutes a day.
- Visual: the license card mock-up ("Jess & Mike · Licensed Team Parents · Class 2").

**Say (15s):** "In the US you need a license to drive, fish, even cut hair. But the hardest job most people ever do comes with no training. So we built the license nobody gave you."

---

## Slide 2: The pain (Problem & User, 15%)
- **Parenting is harder than expected for 62%** of US parents. **29%** find it stressful *all or most of the time* (mothers 33%, fathers 24%) [Pew 2023].
- **~2 in 3 couples** see relationship satisfaction drop in the first ~3 years after a first baby [Gottman].
- Couples wait **~6 years** before seeking help [Gottman]. **Women file ~2/3 of divorces** [Rosenfeld].
- Moms of kids under 6 do **7.5 h/day** of childcare vs dads **5.3 h** [Pew 2023]. **1 in 4 posts on r/Parenting (8M+ members) is about dividing childcare** [Pew 2025].
- Stress context: **48% of parents** say most days their stress is completely overwhelming, **vs 26% of other adults** [US Surgeon General 2024]. *(Say it as the gap. See the note at the end.)*

**Say:** "The baby arrives, the load doubles, and the couple starts fighting about who does more. Kids don't need parents who never fight. They need parents who **repair**, and who parent as one team."

---

## Slide 3: Our user
**Jess, 32, "the Team Captain"**: college-educated, partnered, household income $100K+, a 2-year-old, both parents working.
- She researches everything, follows parenting Instagram, feels like "the default parent".
- Mike wants to be a great dad: **63% of dads say they spend too little time with their kids**, and only **39% say they do a "very good job"** [Pew].
- They'd never pay $200 an hour for couples therapy ("we're not *that* bad"). They already pay ~$219/month for subscriptions.
- **Market:** 91.9M Americans aged 25–44 · 3.6M births/yr · **~9–11M partnered households with a kid under 12 and income ≥ $100K** (our core able-to-pay pool, estimated).

---

## Slide 4: The product (Does it work, 40%). **Screenshot flow, not a live demo**
The PDF can't play video (FAQ Q76), so show **5 screenshots left→right**: Quiz → Team Plan → Partner B joins (2nd window) → Repair Room neutral summary → Paywall (Stripe test). The jury will already have tried it via the link; the landing page has a **"For the jury: open link A, then link B"** box (Q52).

One core flow, all working end-to-end, no login:
1. **Family Quiz → personalized 28-day Team Plan** (team type, kid age, family type: only child, 3+ kids, adopted, blended…)
2. **Partner invite** → the second laptop joins the same team live
3. **Today:** 90-second lesson → scenario rep → a 10-minute real-life play mission with the kid
4. **AI Rehearsal:** practice a hard conversation; the AI plays your partner and scores your *skills*, not who's right
5. **Pause & Repair:** a pre-agreed pause button (no AI during a fight) → each partner answers privately → a **neutral** AI summary for both + one small agreement
6. **License card** + Stripe test checkout

**Say:** "You've already tried it: one window as Jess, one as Mike. Here's the flow." *(Live demo only if the stage allows; the slides must stand alone.)*

**Before → after proof (FAQ Q126, "strong evidence"):** in Rehearsal, the first attempt scores e.g. 35/100 → coaching → a retry on a *new* similar scenario scores 80/100. Put this pair of screenshots on the slide.

---

## Slide 5: Why this works (evidence + the AI decision)
- **Practice beats reading:** online parenting programs measurably reduce kids' behavior problems (effect size g≈0.32), with no therapist needed. Couple programs around the birth showed child benefits years later (Family Foundations RCT).
- **Why we did NOT build a live AI mediator:**
  - People mid-fight are "flooded" (heart rate above ~100 bpm) and can't take in a third voice.
  - Science (2026, N=2,405): one chat with a flattering AI made people **less willing to repair** a conflict.
  - Illinois and Nevada now ban AI therapy.
- **So we built Pause → Repair.** AI is a **practice partner and a neutral summarizer**, never a judge, never one partner's confidant.
- **Expert Consensus Engine:** "where experts agree, where they differ, and one 5-minute thing to try tonight". Principles drawn from 100+ books and 300+ studies, in our own words.

---

## Slide 6: Why they RENEW (Value & Retention, 20%)
> FAQ Q30: *"Paying users matter, not DAU/MAU. Weekly use renewed for six months beats a daily habit that churns in a month."* Lead with renewal; daily reps are a bonus.

- **The result they pay for (Q14: "a clear result, not content"):** *in 28 days, a written Team Plan you both agreed to, a fair split of nights and chores you can both see, and a repair ritual you've used at least once.* Measured by a 1-minute team check-in on day 0 and day 28.
- **Renewal drivers:** the weekly Team Huddle ritual · a monthly Team Report · the next license class as the child grows · two people's shared history (agreements, repairs, milestones) they won't want to lose · the annual plan after 2 renewals.
- **Numbers:** base renewal after month 1 = 50%, then 14% monthly churn (≈ RevenueCat/FunnelFox medians); a stress test shows renewal can drop 41% before each customer stops paying back.

*(Older version below, keep only as supporting detail.)*
- **Daily:** a 5-minute rep + a kid mission. **Shared team streak**: your partner sees it.
- **Weekly:** a 10-minute **Team Huddle** (stats, appreciations, one goal), which makes the invisible load visible ("noticed" earns credit, not only "did").
- **Monthly → yearly:** **license classes grow with the child**: Learner's Permit (expecting) → Night Shift (0–1) → Calm Driver (1–3) → School Zone (3–6) → Open Road (6–12).
- **Why couples churn less:** two users hold each other accountable, and the next class gives a reason to stay after the first crisis passes.

---

## Slide 7: What we sell + why people buy (Money, part 1)
**The Family License membership (decision: hybrid, annual as the anchor; see [11-decisions-standalone-pricing.md](11-decisions-standalone-pricing.md)):**

| Plan | Price |
|---|---|
| **Annual license** (default, both partners) | **$149/yr** (≈ $12.40/mo). "Licenses get renewed" |
| 4-week plan (low-commitment entry) | $9.99 first 4 weeks → $24.99 / 4 weeks |
| Learner's Permit (expecting couples) | $49 one-time |
| Gift a License | $59 for 3 months (baby showers) |

Why hybrid: renewal-based (FAQ Q30), sells a clear result (Q14), subscription not mandatory (Q51). Hybrid LTV/CAC ≈ 1.9 vs 1.6 for 4-week only. Projections still use the conservative 4-week base.

- **Anchor:** less than **one couples-therapy session** ($100–300). About **half of Good Inside** ($279/yr per person). Proof people pay: **Good Inside ~$34M revenue, 100K+ members.**
- **Transparent billing:** renewal price on the paywall, a reminder 3 days before, one-click cancel.

### Why people buy: the "proud parent" driver (social signaling)
- **People pay for who it makes them, not just for results.** Gym members overpay ~$600 a year for a membership they under-use, because the *identity* ("I'm someone who works out") is part of what they buy [DellaVigna & Malmendier 2006].
- **The same identity exists for parents, and it's even stronger:** *"I'm the kind of parent who does the work."* Parents already invest heavily in kids (youth sports **$1,016/child/yr**; raising a child ≈ $310K).
- **We give that identity a shareable form:** the **license card** ("Licensed Team Parents · Class 2 · 60-day streak") for Instagram Stories, mom groups and the family chat. Each share is a free ad seen by exactly our audience.
- **Moms talk to moms:** 42% of moms are in online parenting communities monthly, and 89% of people trust recommendations from people they know. *One proud mom shows the card → her friends ask "what is that?" → word of mouth.*
- **Gifting is signaling too:** "I gifted my sister a Family License for her baby shower" signals care.
- ⚠️ **Our guardrail (say this, the jury will respect it):** we celebrate **effort and teamwork, never superiority**. No leaderboards ranking parents, no "parenting scores". Research shows parent comparison feeds mom-guilt and burnout, which would hurt retention and the brand.

**Say:** "People pay for the gym because of who it makes them. We sell the identity of a parent who's doing the work, give it a card worth sharing, and make the work small enough to actually happen."

---

## Slide 8: Unit economics and the $100M path (Money, part 2)
| | Base | **Inside Zimran** | Optimistic |
|---|---|---|---|
| Blended CAC | $52 | $37 | $34 |
| 24-month gross-margin LTV | $82 | $82 | $112 |
| **LTV/CAC** | 1.6 | **2.2** | **3.2** |
| Payback | 7 mo | 5 mo | 4 mo |
| **Y5 ARR** | $29M | **$84M** | **$107M** |

- **CAC by channel (FAQ Q58):** Meta ~$65 (50% of payers) · TikTok ~$75 (10%) · Pinterest/YouTube ~$55 (10%) · referrals ~$25 (10%) · parent communities ~$20 (8%) · daycare/Class Pack ~$15 (7%) · gifts ~$0 (5%) → **blended ≈ $52**. Benchmark: Adapty Q3 2026 median cost per paying user $43–82.
- **Costs, itemized:** AI + servers ≈ **8% of revenue**; ads ≈ **60% of costs**. We win on acquisition, not AI cost.
- **Word of mouth is the lever:** if 45% of customers arrive free (partner invites, referrals, gifts), base LTV/CAC rises from 1.6 to 2.4 and Y5 ARR from $29M to $45M with the same ad budget.
- **$100M ARR ≈ 460K paying households ≈ 4–5% of the able-to-pay pool.** Expansion to UK/CA/AU adds ~1.3×.
- **Robustness line (true, from model/sensitivity.py):** *"Any one assumption can be a third worse than the market median, and AI can cost 4× more, and every customer still pays back. Inside Zimran's machine, everything can be 20% worse at once: payback is still 10 months."*
- **Stress test (say this, it's honest and strong):** we tested 7 levers in all 128 combinations. We only need **CAC and retention at *median* benchmark level**. Even with referrals at 5%, refunds at 6% and AI costing 67% more, each household pays back in ~10 months (LTV/CAC 1.31). If even those two fail, a stop rule caps the loss at ~$90K. Details: [09-stress-test.md](09-stress-test.md). *Don't* claim "profitable in the worst case": with all 7 levers pessimistic, it isn't.

**Optional robustness box for slide 8 (all true, from the model):**

| If… | Each customer still pays back? |
|---|---|
| AI and servers cost **4×** our estimate | ✅ LTV/CAC 1.20 |
| **Any one** assumption is **⅓ worse** than the market median | ✅ ≥ 1.08 |
| Ad cost per customer is **60% higher** (~$96) | ✅ break-even |
| **Everything 20% worse at once**, inside Zimran's ad machine | ✅ 1.23, payback 10 months |
| Everything goes wrong at once | ❌, and our stop rule caps the loss at ~$90K |

---

## Slide 9: Competition and originality (10%)
| | Good Inside | Paired | Joon | Kinedu | **Hearth** |
|---|---|---|---|---|---|
| For | Mom | Couple | Kid | Baby | **The parent team** |
| Format | Videos & scripts | Daily questions | Chore game | Activities | **Daily practice + repair** |
| Couple-synced | ✗ | ✓ | ✗ | ✗ | ✓ |
| About the kids | ✓ | ✗ | ✓ | ✓ | ✓ |
| Conflict repair | ✗ | light | ✗ | ✗ | ✓ |
| Grows to age 12 | partly | ✗ | partly | ✗ (0–3) | ✓ |

**Originality line (FAQ Q147: a B2C version of a B2B-only product is a new angle):** *"Evidence-based family coaching today is sold to employers (Maven-style benefits) or through certified facilitators (Gottman's Bringing Baby Home). We bring it straight to any couple for ~$12 a month."* Note: Zimran said a new acquisition channel alone is not a new angle (Q31), so don't pitch "same funnel" as originality.

**Say:** "Good Inside is content for mom. Paired is a couple without kids. Joon is a game for the kid. Kinedu is activities for the baby. **We're the first product where the user is the parent team.**"

---

## Slide 10: Go-to-market, Zimran fit, team
- **Go-to-market:**
  - Every purchase brings a teammate (free partner seat) + "give a month, get a month" referrals.
  - Mom communities (Reddit, Facebook, Peanut).
  - Daycare codes and a **"Class Pack"** via room parents. The US has no parent committee, so we built one into the app.
  - Registry gifting + OB-GYN and doula referrals.
  - A separate **"Dad License"** funnel.
- **Standalone first (decision):** *"Hearth stands on its own: a family-first brand, a new user (the parent team), a new mechanic (Pause → Repair)."*
- **Upside, one line:** *"It also plugs into Zimran's machine as the next niche: the same playbook, an audience you don't serve yet, and customers who stay for years. Inside Zimran: $84M ARR in Y5, profitable from Y3."* (Don't present the funnel fit as originality: FAQ Q31.)
- Team: names and roles, and what we shipped in 24 hours.
- **Ask:** "We'd love to build this, standalone or as Zimran's family-skills niche."

---

## Q&A prep (2 minutes)
| Likely question | Answer |
|---|---|
| Why not just ChatGPT? | *(FAQ Q32: "structured path, accumulated data, personalization over time, mechanics")* Our Repair summary is built from **two people's private answers**, which ChatGPT never sees. Plus a structured license path, a shared history, a weekly ritual. And ChatGPT works for one person and **takes your side** (AI affirms users ~49% more than humans do, Science 2026). It has no curriculum, no partner sync, no habit loop. We're a structured two-person skill gym |
| Will dads use it? | Dads want in: 63% want more time with their kids. We give them their own track and "license/training" framing, never "therapy". Couple programs keep dads better than dad-only ones |
| Isn't this therapy? Legal? | No. It's skills education and coaching, with AI disclosure, crisis and DV routing, no diagnoses. Built with the IL/NV laws in mind |
| Isn't 48% stress about work, not family? | Partly, and we say so. It's general stress. But parents report it at **almost twice the rate of other adults** (48% vs 26%), and **29% say parenting itself** is stressful all or most of the time |
| CAC assumption? | $43–82 per paying user is the 2026 benchmark for subscription apps on Meta. We model $45–60 paid, with partner invites and gifts bringing the blended cost down |
| What if word of mouth doesn't happen? | Base case assumes only 15% organic. We have a stop rule: if day-7 return on ad spend stays below 25% after $50K, pause paid ads |
| Privacy? | Private reflections stay private, data is deleted after 30 days, there are no child accounts (COPPA) |

---

## How to say the stress stat correctly
**What the 48% actually is:** The US Surgeon General's advisory *Parents Under Pressure* (Aug 2024) cites APA's 2023 *Stress in America* survey:
- **48% of parents** say most days their stress is **completely overwhelming**, vs **26% of other adults**.
- 33% of parents report high stress in the past month, vs 20% of other adults.
- **41%** of parents say most days they're so stressed they **struggle to function**.

**Is it about family, or work and life in general?** **General.** The survey asks about overall stress, not "stress from parenting". The Surgeon General lists the drivers of parents' stress as a **mix**:
- **financial strain** and economic insecurity (the biggest)
- **time demands** (juggling work and caregiving)
- **children's health and safety** (including online)
- **parental isolation and loneliness**
- **cultural pressures** (e.g. the "perfect parent" standard)

**Is it still a useful metric for us? Yes, if framed correctly:**
1. **The gap is the point.** The same adults, with or without kids: parents are **almost 2× as likely** to be overwhelmed (48% vs 26%). Being a parent is associated with much higher stress (it's a correlation; parents also differ in age and income).
2. **Several drivers are ones we address:**
   - **Time demands** and the unequal **load between partners** (the shared plan, the "noticed/did" log, handoffs).
   - **Isolation** (a teammate in the app, the weekly Huddle).
   - **Cultural pressure** (no-guilt design, "experts differ" honesty).
3. **Drivers we don't solve:** money, housing, work hours. Don't claim we fix those.
4. **Pair it with a parenting-specific stat** so nobody can say "that's just work stress": **Pew 2023: 29% of parents find parenting stressful all or most of the time and 41% find it tiring**. Among parents of kids under 5, 57% find it tiring and 35% stressful.

**Safe wording on the slide:** *"Parents are almost twice as likely as other adults to say stress is overwhelming most days (48% vs 26%, US Surgeon General 2024), and 29% say parenting itself is stressful all or most of the time (Pew 2023)."*

Sources:
- https://www.hhs.gov/surgeongeneral/priorities/parents/
- https://mother.ly/news/surgeon-general-advisory-parenting-teens/
- https://www.beckershospitalreview.com/public-health/surgeon-general-parental-stress-is-a-public-health-crisis.html
- https://www.pewresearch.org/social-trends/2023/01/24/parenting-in-america-today/
- https://www.pewresearch.org/social-trends/2023/01/24/gender-and-parenting/
- https://wtop.com/parenting/2023/01/stressful-tiring-judged-and-harder-than-expect-but-study-finds-parents-also-find-parenting-rewarding
