# Stress Test: How Bad Can It Get, and What Must Hold?

> Reproduce: `python model/stress_test.py` → [model/stress_output.md](../model/stress_output.md). Every lever's pessimistic value is benchmark-anchored ([research/unit-economics-benchmarks.md](research/unit-economics-benchmarks.md)).

## Why we did this
The idea was to show the jury a "worst case that's still profitable". We tested it honestly, because this jury (Zimran) runs exactly these funnels and will check our assumptions in Q&A.

## The 7 levers
| Lever | Pessimistic | Base (≈ benchmark median) |
|---|---|---|
| Paid CAC (ad cost per paying household) | $120 (2× worse than median) | $60 (Adapty median $43–82) |
| Share of payers arriving free (invites, referrals, gifts) | 5% | 15% |
| Renew after the $9.99 intro month | 40% | 50% |
| Monthly churn after that | 20% | 14% |
| Refunds on first charge | 6% | 4.5% |
| AI + servers per active household / month | $2.00 | $1.20 |
| Price per 4 weeks after intro | $19.99 (forced discount) | $24.99 |

## Results (all 128 combinations)
| Test | Result |
|---|---|
| **All 7 pessimistic** | LTV $38 vs CAC $116 → **LTV/CAC 0.33. Every paid customer loses money.** |
| All pessimistic **except one** lever | **0 of 7 work** (best: CAC at base → 0.65) |
| All pessimistic **except two** | **0 of 21 work** |
| All pessimistic except **three** | **2 work, and both need CAC + churn at base** (LTV/CAC ~1.05, payback 17–18 mo) |
| Overall | 32 of 128 combinations have LTV/CAC > 1 |

**Which levers matter most** (average LTV/CAC gain from pessimistic → base):

| Lever | Gain |
|---|---|
| CAC | +0.51 |
| Churn | +0.22 |
| Price | +0.16 |
| Renewal after intro | +0.15 |
| Organic share | +0.08 |
| AI cost | +0.05 |
| Refunds | ~0 |

**Break-even with everything else pessimistic:** paid CAC must fall to **~$35**, or **~70%** of payers must arrive free. Retention alone can't fix it.

### So: the "all worst except one" pitch is not possible
Making "all worst" look profitable would require quietly keeping **3–4** levers at base. Presenting that as "the worst case" would be misleading. One question from the jury ("what churn did you assume?") would break it and cost us credibility on every other number. **Don't do it.**

## What we CAN honestly say (and it's still a strong flex)

### 1. "Only two things need to be *median*. Everything else can go wrong."
**Stress case A:**
- **Pessimistic:** organic share (5%), refunds (6%), AI and server cost (+67%).
- **Median:** CAC ($60) and retention (50% renewal, 14% churn).
- **Per customer: LTV $77 vs CAC $58 → LTV/CAC 1.31, payback 10 months.**
- Even with the price also forced down to $19.99 (stress case B), each customer still roughly pays back (1.05, 18 months).

*Precise wording:* each customer is profitable. The *company* still needs funding while it grows, because ads are paid before customers pay back. Stress A peaks at a ~$1.9M cumulative burn over 5 years while spending to grow. Don't say "the company is profitable in the worst case".

### 2. The two must-hold levers are exactly what the product is built to protect
| Must hold | How the design protects it |
|---|---|
| **Retention** at median | Two users hold each other accountable (shared streak, partner sees your progress). The weekly Team Huddle ritual. License classes that grow with the kid give a reason to stay after the first crisis |
| **CAC** at median | The free partner seat brings a second user at no ad cost. Gift a License at baby showers. Shareable license card. "Give a month, get a month" referrals. A cheaper, underserved dad audience |

### 3. The downside is capped by a stop rule
- **Stop rule:** if day-7 return on ad spend stays below 25% after a $50K test, pause paid ads and grow only through referrals, communities and partnerships.
- **Maximum loss before that decision:** about $50K of ads + ~3 months of a lean Almaty team (~$40K) ≈ **$90K**.
- **Upside if the two levers hold:** the Inside-Zimran case reaches $84M ARR in year 5.
- → **A small, capped downside with a large upside.**

### 4. Our base case uses medians, not top-quartile numbers
| Assumption | Ours (base) | Benchmark |
|---|---|---|
| Paid CAC | $60 | Adapty Q3 2026 median cost per paying user: $43–82 |
| 12-month net revenue per payer | $77 | FunnelFox web-funnel 12-month LTV: ~$67 blended, $80–90 Health & Fitness |
| Monthly plan retention at 12 months | ~11% | RevenueCat: 6–10% (monthly plans) |
| Organic share | 15% | No hard benchmark; our product has a built-in partner seat |

The optimistic case (LTV/CAC 3.2) needs top-quartile retention, and we label it that way.

## How to say it in the pitch (slide 8 + Q&A)
> "We stress-tested 7 levers in all 128 combinations. If *everything* goes wrong, we lose money on every customer, and we'd see that within about $50K of ads and stop. Our stop rule caps the downside at roughly $90K. But we only need **two** things to be *median*, not great: CAC around $60 and median retention. With those two, even if referrals don't happen, refunds run high and AI costs 67% more, each household pays back within 10 months. And those two levers are exactly what our couple design protects: a partner who keeps you accountable, and a free second seat that lowers acquisition cost."

**Why this beats the "pessimistic yet profitable" trick:**
1. It survives any Q&A follow-up.
2. It shows Zimran we think like operators (stop rules, payback, lever ranking).
3. It turns the risk into a product argument.

---

## Haircut test: base assumptions made 15% → 75% worse
Reproduce: `python model/sensitivity.py` → [model/sensitivity_output.md](../model/sensitivity_output.md).

"X% worse" means:
- ad cost per customer **+X%**
- free arrivals **−X%**
- renewal after the intro month **−X%**
- monthly churn **+X%**
- refunds **+X%**
- AI and server costs **+X%**

The baseline is the **base case = market median benchmarks**.

### A. One assumption worse, the rest at median (Base case)
| Lever | 15% | 25% | 33% | 40% | 50% | 75% | Breaks even at |
|---|---|---|---|---|---|---|---|
| AI + server costs | 1.56 | 1.55 | 1.54 | 1.53 | 1.51 | 1.48 | **never**: even at **4× (+300%) LTV/CAC is 1.20** |
| Refunds | 1.58 | 1.58 | 1.58 | 1.58 | 1.58 | 1.57 | never |
| Free arrivals | 1.54 | 1.52 | 1.50 | 1.48 | 1.45 | 1.40 | never (even at 0%) |
| Monthly churn | 1.41 | 1.32 | 1.25 | 1.20 | 1.13 | 0.99 | **73% worse** |
| Ad cost per customer | 1.38 | 1.27 | 1.19 | 1.14 | 1.06 | 0.91 | **60% worse** (~$96) |
| Renewal after intro | 1.37 | 1.22 | 1.11 | 1.01 | 0.86 | 0.50 | **41% worse** |
| Price per 4 weeks | 1.35 | 1.20 | 1.08 | 0.97 | 0.82 | 0.44 | **39% worse** |

### B. All six assumptions worse *at the same time*
| X% worse | **Base case** (standalone) | **Inside Zimran** |
|---|---|---|
| 0% | 1.58 · payback 7 mo | 2.22 · 5 mo |
| 15% | 1.02 · 19 mo (barely) | **1.42 · 8 mo** |
| 20% | ❌ 0.89 | **1.23 · 10 mo** |
| 25% | ❌ 0.77 | **1.06 · 15 mo** |
| 33% | ❌ 0.61 | ❌ 0.84 |
| Break-even | **≈ 16% worse** | **≈ 28% worse** |

### C. Company-level warning
LTV/CAC is about **each customer**. If we kept the same aggressive ad plan while everything is 15–20% worse, the company would burn much more ($20M+ standalone). That's why the **stop and scale rule** matters: ads only scale while payback stays within ~12 months. **Always say "each customer pays back", never "the company is profitable".**

## ✅ Claims that are impressive AND true (pick 1–2 for slide 8)
| # | Claim | Backed by | Strength |
|---|---|---|---|
| 1 | **"AI is not our risk. Even if AI and servers cost 4× our estimate, every customer still pays back (LTV/CAC 1.2)."** | Lever A: AI +300% → 1.20 | ⭐⭐⭐ Pre-empts the "AI is expensive" question |
| 2 | **"Any single assumption can be a third worse than the market median, and every customer still pays back."** | At 33% worse, every lever ≥ 1.08 (price 1.08, renewal 1.11, CAC 1.19, churn 1.25) | ⭐⭐⭐ Clean and memorable. Holds up to ~39% |
| 3 | **"Our ad cost per customer can be 60% above the market median, and we still break even."** | CAC breaks at +60% (~$96) | ⭐⭐ Speaks to Zimran's core skill (media buying) |
| 4 | **"With Zimran's acquisition machine, *everything* can go 20% worse at once (CAC, retention, churn, referrals, refunds, AI), and each customer still pays back in 10 months."** | Inside Zimran, all six at 20% → 1.23, 10 mo (25% → 1.06, 15 mo) | ⭐⭐⭐ Best "flex" and the Zimran-fit argument in one line |
| 5 | "Standalone, everything 15% worse at once still breaks even." | Base, all at 15% → 1.02, 19 mo | ⭐ Too thin to headline. Q&A only |

**Don't claim:**
- "Everything 50% worse and still profitable". False: 0.37.
- "Company profitable in the worst case". False.
- Anything with price cut as well beyond ~12% (base) or ~21% (Zimran) together.

### Suggested slide-8 line
> **"Stress-tested: any one assumption can be a third worse than the market median, and AI can cost 4× more, and every customer still pays back. Inside Zimran's acquisition machine, *everything* can be 20% worse at once: payback is still 10 months."**
