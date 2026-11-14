# Unit-Economics Benchmarks: Web-to-App Subscription Funnels (US B2C)

> Research date: 2026-11-14. This is the source file behind [../04-business-model.md](../04-business-model.md) and [model/financial_model.py](../../model/financial_model.py).
> **[S]** = number seen in a fetched or searched source · **[V]** = vendor-reported (likely flattering) · **[E]** = our estimate or derivation · **[M]** = from memory, not re-verified.
> **Gaps not found:** Meta CPM for US women 25–45 specifically (Adapty's PDF is gated), absolute web-funnel refund rates, stage-by-stage quiz conversion, company-confirmed Headway/BetterMe/Zimran financials, official Lasting pricing, gifting/registry channel benchmarks.

## 1. Subscription app benchmarks: RevenueCat State of Subscription Apps 2026 (2025 data; 115K apps, $16B revenue) [S]
Sources: https://www.revenuecat.com/state-of-subscription-apps · https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026

| Metric | Value |
|---|---|
| Download → trial (D30), Health & Fitness / Education | 6.9% / 6.5% |
| Download → trial, North America | 7.1% |
| Trial → paid, H&F median / North America | 37.7% / 34.2% |
| Trial → paid by trial length (≤4d / 5–9d / 17–32d) | 25.5% / 37.4% / 42.5% |
| Download → paid (D35), overall / H&F / top quartile | 2.0% / 2.9% / >6.2% |
| Download → paid, hard paywall vs freemium | 10.7% vs 2.1% |
| Revenue per install D14 / D60, overall | $0.23 / $0.34 |
| RPI D14 / D60, H&F | $0.48 / $0.66 |
| RPI D14 / D60, hard paywall | $2.32 / $3.09 |
| Year-1 revenue per payer, H&F / Education | $35.64 / $22.82 |
| Median price weekly / monthly / yearly | $5.99 / $10 / $34.80 |
| Annual-plan year-1 retention | 27–28% (up to 36% for low-priced annual, 2025 report; see also https://paddle.com/news/industry/subscription-apps-revenue-struggle) |
| Monthly-plan 12-month retention | 6–10% (AI apps 6.1%, non-AI 9.5%) |
| AI vs non-AI apps | +41% year-1 revenue per payer ($30.16 vs $21.37), worse retention |
| Median YoY MRR growth | 5.3% (top 10% grew 306%) |

**Refunds** (Adapty) [S]: https://adapty.io/blog/refund-rate-metrics-and-benchmarking/
- 2–5% of payers: Education 4.9–5.1%, H&F 4.7%, Lifestyle 3–4%.
- By plan: weekly 2.6%, monthly 3–3.5%, annual 4.2%.
- Hard paywall 5.8% vs freemium 3.4%.

## 2. Web-to-app funnels: FunnelFox State of Web2App 2026 [V] (directional; has internal contradictions)
Source: https://funnelfox.com/state-of-web2app-2026

| Metric | Value |
|---|---|
| Sessions reaching paywall / purchasing | 13% / 3% (≈23% paywall→purchase) |
| Final conversion, web vs app | 3.0% vs 1.5% |
| H&F 12-month LTV, web vs app | ~$80–90 vs ~$40–45 |
| Blended web LTV at month 12 | ~$67 |
| ARPPU (global) | $27–31 |
| Revenue by plan | 1-month 48.8%, 1-week 30.5%, 1-year 12.2%, 3-month 8.4% |
| Payment failure on initiated web payments | 30–50% (retries recover up to 17.5%) |
| Weekly-plan 12-month retention | ~3% |

**Funnel design snapshot (Admiral, Oct 2026, 23 quizzes):** https://admiral.media/web-to-app-funnels-2026/
- Median of **35 screens** to the price page.
- Email is asked about 90% of the way through.
- First-period discount of 50–80%, followed by a ~2.5× renewal jump.
- A countdown timer on 8 of 11 pages; a free trial on only 1 of 11 (Kinedu).

Other references:
- Noom funnel of up to 113 screens: https://www.revenuecat.com/blog/growth/web-to-app-funnels.md
- Quiz start→finish 65% and start→lead 40%: https://tryinteract.com/blog/quiz-conversion-rate-report/

## 3. CAC benchmarks
| Metric | Value | Source |
|---|---|---|
| Median Meta CPM, subscription apps, Q3 2026 | $8.87 (global mix) | https://adapty.io/meta-ads-benchmarks/ [S] |
| CPC by age band | $0.44–0.67 | Adapty |
| Cost per trial | $20.28 | Adapty |
| **Cost per paying user** (median) | **$64.93**; Subscribe-optimized $42.77, Start-Trial $57.32, Purchase $82.23 | Adapty |
| US D7 ROAS | 33% (median app 39%) | Adapty |
| All-industry Meta CPM / CPC, H1 2026 | Median $13.51 / $0.71 | https://syntermedia.ai/benchmarks/2026-h1/meta-ads/cpm · https://syntermedia.ai/benchmarks/2026-h1/meta-ads/cpc |
| US CPM premium | ~$22 average in 2025 | https://www.stackmatix.com/blog/average-cost-of-facebook-ads |

**Derived US quiz-funnel CAC [E]:** cost per click $1.00–2.50 (US CPM $18–30, CTR 0.8–1.5%) ÷ click→purchase 2–4% = **$35–125 per first purchase**. That is consistent with Adapty's $43–82.

## 4. Pricing benchmarks
| Product | Price | Source |
|---|---|---|
| BetterMe | $15.19 / 4 wks → $38.95 | Admiral (above) |
| Liven | $19.99 / 4 wks → $39.99 | Admiral |
| Headway | $19.98 / 3 mo → $49.98 | Admiral |
| Kinedu | 7 days free → $79.99/yr | Admiral |
| Good Inside | $28/mo billed quarterly, or $279/yr | https://support.goodinside.com/hc/en-us/articles/4416301207060-How-much-does-Good-Inside-cost |
| Paired | $79.99/yr per couple | https://www.paired.com/frequently-asked-questions |

## 5. Comparable company trajectories
| Company | Data | Source |
|---|---|---|
| Flo | $35M (2022) → $112M (2023); ~5M paid subscribers; $200M+ round | https://sifted.eu/articles/flo-health-unicorn-raise-news · https://tech.eu/2024/07/30/flo-health-raises-over-200m-becomes-first-femtech-unicorn/ |
| Noom | ~$237M (2019) → ~$400M (2020, aggregator); layoffs in 2022 | https://www.mobihealthnews.com/news/noom-confirms-layoffs-amid-need-build-more-efficient-business |
| Headway | Expected >$100M revenue in 2023 (secondhand) | https://forbes.ua/innovations/desyatki-milyoniv-na-mikronavchanni-chomu-nayskladnishiy-rik-v-istorii-kraini-stav-nayuspishnishim-dlya-ukrainskogo-startapu-headway-06022023-11728 |
| BetterMe | ~$70M (low confidence) | https://bitscale.ai/directory/betterme |
| Maven Clinic (B2B2C reference) | ~$268M revenue in 2024 (Sacra estimate) | https://sacra.com/c/maven-clinic |

## 6. AI cost of goods per active user
| Item | Price | Source |
|---|---|---|
| OpenAI gpt-4o-mini / gpt-5-mini (per 1M tokens, in/out) | $0.15/$0.60 · $0.25/$2.00 | https://developers.openai.com/api/docs/pricing |
| Claude Haiku 4.5 | $1 / $5 (cache reads $0.10) | https://www.anthropic.com/claude/haiku |
| Realtime voice | ~$0.10/min full, ~$0.03/min mini [E] | https://www.forasoft.com/blog/article/openai-realtime-api-pricing |

**[E] COGS per active user per month:**
- Text coaching: $0.03–0.60.
- 10 minutes of voice per month: $0.30–3.00.

At $10–30 ARPU this leaves a healthy margin. Cap voice minutes.

## 7. Fees, chargebacks, margin
- **Stripe:** 2.9% + $0.30, plus Billing 0.7% (confirm at https://stripe.com/billing/pricing). Blended web cost is ~5–7%.
- **App-store commission:** 15–30%.
- **Apple US link-out:** the case is still unresolved, with no final fee set. https://appleinsider.com/articles/26/03/30/the-epic-vs-apple-case-wont-get-a-rehearing-for-app-store-fees
- **Chargebacks:** 0.34–0.54% in digital goods, 0.8–1.5% in SaaS. Stay under 0.75%. https://www.chargeflow.io/blog/chargeback-statistics-trends-costs-solutions · https://chargebackcost.pages.dev/saas-chargeback-rate
- **Gross margin [E]:** ~75–85% on web, vs ~60–70% through app stores.

## 8. Recommended model assumptions (used in the model; all [E])
| | Conservative | Base | Optimistic |
|---|---|---|---|
| Paid CAC | $120 | $60 | $45 |
| Organic share | 5% | 15% | 25% |
| Renew after intro | 40% | 50% | 55% |
| Monthly churn after first renewal | 20% | 14% | 11% |
| Refunds | 6% | 4.5% | 3% |
| AI + content COGS / active payer / month | $2.00 | $1.20 | $0.80 |

Rule of thumb: LTV/CAC of 3:1 is only reachable with D7 ROAS above ~60% and annual-plan retention above 30%. The main lever is the **paid-to-organic mix** (partner invite, referral, gifting).
