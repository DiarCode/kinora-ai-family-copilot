# Decisions: Standalone vs Zimran, and How We Charge

> Made after reading the official FAQ ([10-official-faq-analysis.md](10-official-faq-analysis.md)). Numbers come from `model/financial_model.py`; the pricing comparison uses the same base assumptions (estimates, benchmark-anchored).

## Decision 1: **Standalone is the primary pitch.** Zimran fit is only the upside on the last slide.

| Why standalone leads | FAQ basis |
|---|---|
| The jury scores the **product and its business** (40/20/15/15/10). Nothing scores "fits Zimran" | Q17, Q106 |
| "A new acquisition channel by itself is **not** a new angle", so "same funnel as Coursiv" earns no originality | Q31 |
| "Don't copy Finelo/Coursiv, find your own angle" | Q12, Q57 |
| Trust: parents and couples need a separate, family-first brand with transparent billing | Q138, Q150 |

| What we still show (one line on the last slide) | Why |
|---|---|
| Inside Zimran: LTV/CAC 2.2, payback 5 mo, **$84M ARR in Y5** (~$105M with English-speaking markets), profitable from Y3 | The most credible path to "$100M ARR long-term" without optimistic assumptions |
| "Everything 20% worse at once inside Zimran → payback 10 months" | Robustness flex |
| "We understand your machine" | Q117: ownership and depth of thinking |

**Numbers to lead with:** Standalone **Base** (LTV/CAC 1.6, payback 7 mo, $29M ARR Y5), then the upside: **Optimistic** ($107M) and **Inside Zimran** ($84M).

**Slide-10 line:**
> "Hearth stands on its own: a family-first brand, a new user (the parent team), a new mechanic (Pause → Repair). It also plugs into Zimran's machine as the next niche: the same playbook, an audience you don't serve yet, and customers who stay for years because parenting lasts 18 years."

**If asked "inside Zimran or alone?":** inside Zimran for years 1–3. It's faster, has a lower CAC, and needs ~$0.8M of funding instead of ~$9.5M. It keeps its own brand to protect parents' trust.

## Decision 2: How we charge. **Hybrid membership, with annual as the anchor.**

FAQ Q51: *"Subscription isn't mandatory; any model where the user pays works."* Q148: annual or one-time is fine if it's clear why people come back. Q30: **renewals** are what Zimran values. We compared four models on the same base assumptions:

| Model | 24-mo gross-margin LTV | Blended CAC | LTV/CAC | Key assumptions [E] |
|---|---|---|---|---|
| A. 4-week subscription ($9.99 intro → $24.99) | $82 | $52 | 1.58 | 50% renew after intro, 14% monthly churn |
| **B. Annual membership, $149 upfront** | **$152** | $67 | **2.26** | CAC +30% (higher upfront price converts worse), 6% refunds, 30% renew at year 1 (RevenueCat: annual 27–36%) |
| C. One-time 28-day program, $79 | $71 | $62 | 1.13 | No renewal, 8% refunds, 15% buy the next class at $49 |
| **D. Hybrid: 4-week OR annual (40% choose annual)** | **$110** | $58 | **1.90** | A + B mix, plus one-time add-ons |

| | Pros | Cons |
|---|---|---|
| A. 4-week subscription | Low entry price ($9.99) → highest conversion; Zimran's own model | Monthly churn moments; subscription fatigue (73% are frustrated by price hikes) |
| B. Annual | Cash upfront (pays for ads immediately), fewer churn moments, fits "renew your license" | Higher price → lower conversion; refund risk in month 1 |
| C. One-time program | Simplest promise ("28-day result"); no subscription anxiety | No renewal → weakest on Value & retention (20%) and LTV |
| D. Hybrid | Captures both buyer types; annual raises LTV; the 4-week plan keeps entry easy | Slightly more complex paywall |

### ✅ Recommendation: D, the "Family License" membership
| Plan | Price | Role |
|---|---|---|
| **Annual license** *(default, highlighted on the paywall)* | **$149/yr** (≈ $12.40/mo) for **both partners** | The anchor. "Licenses get renewed": the metaphor makes the yearly renewal natural |
| 4-week plan | $9.99 first 4 weeks → $24.99 / 4 weeks | Low-commitment entry; the app offers to switch to annual after 2 renewals |
| Learner's Permit (expecting couples) | $49 one-time | Pre-birth program; converts to membership after the birth |
| Gift a License | $59 for 3 months (one-time) | Baby showers and registries (≈ $0 CAC) |

**Why this fits the jury best:**
1. **Renewal-based**, which is what Zimran says it values (Q30).
2. It sells **a clear result**: the 28-day Team Plan, then a yearly license (Q14).
3. **Higher LTV/CAC** (≈ 1.9 blended vs 1.6) with honest assumptions.
4. The one-time products cover expecting couples and gift-givers without forcing a subscription.

**Caveat:** the annual plan's CAC penalty (+30%) and the 30% year-1 renewal are estimates. Treat the 40% annual share as a hypothesis to A/B test on the paywall. **All 5-year projections still use the conservative 4-week base**, so the hybrid is extra upside, not something the plan relies on.
