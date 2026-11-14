# Research & Recommendations (Business Cup 2.0, Skills track)

> **What this folder is:** market research, competitor analysis, a 5-year financial model, a pitch-deck outline and a clickable UI draft, prepared for the team. **It is research input, not the final product spec.** The product name and scope (Kinora) are the team's call.
>
> The drafts use the working name **"Hearth"**. Where they recommend *against* a live AI counselor/mediator during fights, or *against* game-based assessment of children, the reasons and evidence are in [docs/05-idea-review.md](docs/05-idea-review.md) and [docs/research/evidence-ai-mediation-psychology.md](docs/research/evidence-ai-mediation-psychology.md).

> **Teammates, start here:** download the repo and open `ui/competitors.html`, `ui/economics.html` and `ui/prototype.html` in a browser (GitHub shows HTML as source code, so open them locally). Then read `docs/08-pitch-deck.md` and `docs/05-idea-review.md`.

**Track 03: Skills.** Working concept: **Hearth, the Family License for two.** A gamified, couple-synced parenting-skills web app for US couples aged 25–45 with a first child aged 0–5 (or expecting).

> **One user:** a couple aged 27–40 with a first kid aged 0–5. **One pain:** "Since the baby we argue more, parent differently, and we're scared our kid feels it." **Skill:** parenting as a team.

## Read in this order
| # | Doc | What's inside |
|---|---|---|
| ★ | [docs/05-idea-review.md](docs/05-idea-review.md) | **Master review:** verdicts on each idea component (AI mediator, kids' gamification, childbirth, brag driver), decision matrix, differentiation, 24h MVP scope, deck outline, jury Q&A |
| 1 | [docs/01-hackathon-rules.md](docs/01-hackathon-rules.md) | Rules, judging weights (40/20/15/15/10), submission checklist |
| 2 | [docs/02-zimran-company-research.md](docs/02-zimran-company-research.md) | Zimran: products (Coursiv, Finelo), funnel model, ~$20M/yr revenue (self-reported), culture, Business Cup 1 winner |
| 3 | [docs/03-us-market.md](docs/03-us-market.md) | US demographics, stress and conflict stats, willingness to pay, TAM/SAM/SOM, persona |
| 4 | [docs/04-business-model.md](docs/04-business-model.md) | Pricing, funnel, CAC/LTV/payback, 5-year plan in 4 scenarios, Zimran-integration vs standalone |
| 6 | [docs/06-audience-culture-personas.md](docs/06-audience-culture-personas.md) | **What unites US parents**, the life-stage map → license classes, dating/marriage/divorce facts, able-to-pay sizing, **personas** (single mom, 3+ kids, only child, adoptive, blended, ND, LGBTQ+), "women first?" analysis, international upside |
| 7 | [docs/07-gtm-networks-dads-books.md](docs/07-gtm-networks-dads-books.md) | **US equivalent of the parent committee** and word-of-mouth playbook · **do dads take the initiative?** · parenting-books market, the "100 books" legal check, and the **Expert Consensus Engine** framing |
| R7 | [docs/research/us-parent-networks-word-of-mouth.md](docs/research/us-parent-networks-word-of-mouth.md) | PTA/PTO, room parents, ClassDojo, Reddit/FB/Peanut, MomCo, Babylist, referral channels |
| R8 | [docs/research/fathers-initiative-gender-dynamics.md](docs/research/fathers-initiative-gender-dynamics.md) | Gender gaps in parenting-help seeking, maternal gatekeeping, dad motivation, male word of mouth |
| R9 | [docs/research/parenting-books-market-knowledge-base.md](docs/research/parenting-books-market-knowledge-base.md) | Self-help/parenting book market, summary apps (Blinkist, Headway), completion evidence, copyright/AI case law |
| R3 | [docs/research/us-parenting-culture-and-stages.md](docs/research/us-parenting-culture-and-stages.md) | US parenting values, diversity, stage-by-stage map (costs, health, school), rituals and marketing calendar |
| R4 | [docs/research/us-dating-marriage-divorce.md](docs/research/us-dating-marriage-divorce.md) | Dating, cohabitation, marriage, housework split, divorce rates and reasons, the baby's effect on couples |
| R5 | [docs/research/us-buyer-segments.md](docs/research/us-buyer-segments.md) | Income, ability to pay, subscription habits, who buys, family-type segments |
| R6 | [docs/research/international-expansion.md](docs/research/international-expansion.md) | UK, CA, AU, IE, NZ, DE, NL, Nordics: sizing, ARPU/CAC, free alternatives, localization |
| R10 | [docs/research/unit-economics-benchmarks.md](docs/research/unit-economics-benchmarks.md) | Subscription and web-funnel benchmarks (RevenueCat, Adapty, FunnelFox), CAC, pricing, AI costs, fees: the sources behind the model |
| R1 | [docs/research/competitors.md](docs/research/competitors.md) | Competitive landscape (~30 products), failures, gaps |
| R2 | [docs/research/evidence-ai-mediation-psychology.md](docs/research/evidence-ai-mediation-psychology.md) | Evidence on AI mediation risks, parenting/couple programs, gamification, signaling psychology, privacy |
| 🆚 | [ui/competitors.html](ui/competitors.html) | **Open first:** visual competitor map (Good Inside, Paired, Joon, Kinedu + 15 more), filterable table, the gaps we close |
| 📊 | [ui/economics.html](ui/economics.html) | **Key metrics dashboard:** 4 scenarios, ARR chart, cost breakdown (AI/servers vs ads), word-of-mouth lever, market funnel |
| 🧪 | [docs/09-stress-test.md](docs/09-stress-test.md) | **Stress test:** 7 levers × 128 combinations. What breaks us, the 2 levers that must hold (CAC, retention), the stop rule capping the downside at ~$90K, and how to pitch it honestly |
| 🎤 | [docs/08-pitch-deck.md](docs/08-pitch-deck.md) | **10-slide pitch deck points + speaker notes + Q&A**, the "proud parent" social-signaling driver, and how to cite the 48% stress stat correctly |
| UI | [ui/prototype.html](ui/prototype.html) | Clickable UI draft of the MVP screens with build notes (open in a browser) |
| $ | [model/financial_model.py](model/financial_model.py) → [model/output.md](model/output.md) | Reproducible cohort model (`python model/financial_model.py`) |

## Key numbers (for the deck)
- 91.9M Americans aged 25–44 · 62.7M parents with kids under 18 · 3.63M births/yr
- Parents are ~2× as likely as other adults to say stress is overwhelming most days (48% vs 26%, Surgeon General 2024; general stress, not parenting-only). 29% find parenting itself stressful all or most of the time (Pew 2023) · 62% say parenting is harder than expected (Pew)
- ~2/3 of couples see satisfaction drop after the first baby (Gottman)
- Good Inside: ~$34M revenue in 2025, 100K+ subscribers → people pay for parenting education
- Couples wait ~6 years before seeking help (Gottman) · women initiate ~2/3 of divorces (Rosenfeld) · moms 7.5 vs dads 5.3 h/day of childcare for kids under 6 (Pew)
- Able-to-pay core: ~9–11M partnered households with a kid under 12 and $100K+ income (est.) · International: US + Anglosphere ≈ 1.3× the US alone
- Base case: CAC ~$52 blended, 24-month GM-LTV ~$82, LTV/CAC 1.6, 7-month payback. Optimistic: LTV/CAC 3.2 → **$107M ARR in Y5**. Inside Zimran: $84M ARR Y5, profitable from Y3

> **Sourcing:** every number traces to an original URL in `docs/research/*` (or `docs/02`, `docs/03`). The synthesis docs (04–07) link back to those files. Tags: [S] primary, [SEC] secondary, [E] estimate.
