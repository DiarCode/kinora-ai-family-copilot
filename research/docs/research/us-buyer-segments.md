# US Buyer Segments for a Couple-Synced "Family License" Parenting App

Research date: 2026-11-14. Tags: **[S]** primary source, **[SEC]** secondary source, **[E]** estimate/derivation (verify before external use).
Research limits: Census/ACS API endpoints returned 403 to this tool, so household-income shares for families with kids are partly **[E]**. Items I could not verify are flagged "UNVERIFIED" rather than filled with guesses.

---

## 0. Executive summary

- **Primary buyer:** college-educated mother, 28-40, in a partnered household earning $100K+, with a child under 12. She is the default researcher/decider and the person most likely to initiate. The evidence for "women first, partner recruited" is decent on *who researches and who feels the load*, but is thin on *who pays*. Treat it as a hypothesis to A/B test.
- **Able-to-pay pool [E]:** roughly 33M US families have own children under 18 (39% of ~84M family households per Census). Married-couple families with kids (~median $143K) are the core. Roughly 15-20M partnered households with a child under 18 and income >= $100K is a defensible planning range; single-parent households >= $75K are a small (~1-2M) but loyal niche.
- **Price point check:** $24.99/4 wks = ~$325/yr (monthly-equivalent ~$27) vs $149/yr annual. Against a measured average itemized subscription spend of $219/mo (C+R, 2022) it is ~12% of the average sub wallet; the real barrier is churn/fatigue (Deloitte: 41% of streaming users say content isn't worth the price), not income, for $100K+ households.
- **Financial precarity is real even at the top:** ~37-49% of $100K+ earners report living paycheck to paycheck in LendingClub/PYMNTS releases. Lead with an annual plan discount and a "cancel in one tap" promise.
- **Big risk:** a mom-first product can entrench the mental load. Mitigate by giving dad his own onboarding, equal-credit mechanics, and "who owns this" visible task splits.

---

## A. Purchasing power and buyer

### A1. Income of US families with children

| Metric | Value | Tag | Source |
|---|---|---|---|
| Share of US family households that include own children <18 (2024) | ~39% | [S] | https://content.govdelivery.com/accounts/USCENSUS/bulletins/3c16e18 |
| Median income, all married-couple families (2024) | $128,700 | [SEC] | https://wiareport.com/2025/09/the-persistent-gender-gap-in-median-income-in-the-united-states |
| Median income, families with a single female householder (2024) | ~47% of married-couple median = ~$60K (all single-mother-headed families, with or without kids) | [E] | same WIA link |
| Median income, married couples **with children at home** (2024) | $143,400 (post does not name table; verify vs CPS FINC-03 / ACS B19126) | [SEC] | https://economistwritingeveryday.com/2026/09/02/median-family-income-for-married-couples-with-children-is-probably-higher-than-you-think/ |
| Single-mother family with kids median | Likely ~$45-55K. Not verified from a table. | [E] | table locations: https://censusreporter.org/tables/B19126/ ; https://www.census.gov/data/tables/2025/demo/cps/finc-03.html |
| Families with income >$150K (2023 dollars), all families | "well over 30%" | [SEC] | https://economistwritingeveryday.com/tag/family-income/ |
| Share of families-with-kids >= $100K / >= $150K | UNVERIFIED. Planning guess: married w/ kids ~65-70% >= $100K, ~40-45% >= $150K; single-mother ~15-20% >= $100K | [E] | pull exact from CPS FINC-03 |

**Middle/upper-middle definitions (Pew):** middle income = 2/3x to 2x median household income, size-adjusted. 2023: 51% of Americans middle, 30% lower, 19% upper. 2022 dollar range ~$56.6K-$169.8K; ~$61K-$183K for a 3-person household. [S] https://www.pewresearch.org/social-trends/2024/05/31/the-state-of-the-american-middle-class/
Implication: a $75K+ household is solidly "middle" for a family of 3-4; $100K+ is mid-to-upper-middle.

### A2. Financial precarity

| Metric | Value | Tag | Source |
|---|---|---|---|
| Could cover $400 emergency with cash/equivalent (all adults, Oct 2025 survey) | 63%, unchanged from 2024 | [S] | https://www.federalreserve.gov/newsevents/pressreleases/other20260513a.htm ; https://www.federalreserve.gov/publications/2026-economic-well-being-of-us-households-in-2025-executive-summary.htm |
| Same, parents of children <18 | 55% (vs 66% other adults) - not verified against the Fed table | [SEC] | https://financer.com/personal-finance/emergency-fund-statistics/ |
| Parents of kids <13 using paid childcare | ~1 in 4 | [S] | Fed SHED 2025 link above |
| Living paycheck to paycheck, all | ~60%+ consistently in LendingClub research | [SEC] | https://www.cbsnews.com/news/paycheck-to-paycheck-6-in-10-americans-lendingclub |
| $100K+ earners paycheck-to-paycheck | 49% (Apr 2023, up from 42% Apr 2022); PYMNTS split: 37% manage bills, 12% struggle. No 2025 LendingClub breakout found. | [SEC] | https://pymnts.com/?p=1258964 ; https://www.pymnts.com/?p=1254682 |
| $100-150K bracket paycheck-to-paycheck, 2025 compilations | 36-45% (definitions vary) | [SEC] | https://joingerald.com/learn/financial-wellness/how-many-people-live-paycheck-to-paycheck |

Takeaway: "able to pay" is not "will pay." Self-reported tightness exists up the income ladder, so value must be proven in weeks 1-2 and the plan must be easy to pause/cancel.

### A3. Subscription economy

| Metric | Value | Tag | Source |
|---|---|---|---|
| Itemized avg monthly subscription spend | $219 (vs. $86 guessed), C+R Research 2022, n=1,000 | [SEC] | https://resubs.app/resources/subscription-spending-statistics |
| West Monroe estimate | $273/mo (up from $237 in 2018) | [SEC] | same |
| Self-reported (CNET/YouGov 2025) | ~$90/mo | [SEC] | same |
| Avg paid subscriptions/household | 5.8 (Parks Associates) | [SEC] | https://thedesk.net/2026/02/parks-associates-cost-is-biggest-driver-of-streaming-churn-in-2025/ |
| Streaming-specific | 4.1 services (Deloitte) | [SEC] | https://www.tvtechnology.com/platform/streaming/deloitte-streaming-churn-rises-73-percent-of-subs-are-frustrated-with-svod-price-hikes |
| Fatigue / churn | 73% frustrated by price hikes; 41% say streaming not worth the price (+5 pts); 41% churned in/out in 6 months. Parks: 30% cite cutting household expenses as top churn reason, 20% cite a price increase. | [SEC] | Deloitte link above; Parks link above |
| Flexibility effect | Consumers stay longer when subscriptions are easy to leave ("flexibility, not fatigue") | [SEC] | https://www.subscriptioninsider.com/article-type/news/flexibility-not-fatigue-consumers-stay-longer-when-subscriptions-are-easier-to-leave |

Not found in this pass: per-child extracurricular/education spend, online-course spend, and wellness-app payer gender/income (research gap; see Section D).

### A4. Who buys parenting / self-improvement content

- **"Women control 70-85% of purchases":** a weak claim. The common 83%/85% figure traces to a 2003 management book (Tom Peters, *Re-Imagine!*), not a measurement; a Futures Co. survey found only 37% of women say they hold *primary* shopping responsibility; BCG 2008 had women self-identifying as making 73% of consumer decisions; NIQ says 89% of women claim daily household shopping responsibility (self-report). [SEC] https://joshlevs.com/ufaqs/myth-women-control-about-85-of-household-spending ; https://www.mediapost.com/publications/article/257808/women-rule-well-85-anyway.html ; https://www.foodnavigator-usa.com/Article/2026/06/08/soup-to-nuts-podcast-how-are-womens-shopping-habits-shaping-the-future-of-cpg/
  **Use instead:** "mothers report doing more of the child-care management" (Pew below). Do not cite 85% in a pitch.
- **Division of labor (Pew):** Mothers in opposite-sex couples report more child-care responsibility; fathers more often say it is split equally [S] https://www.sheknows.com/parenting/articles/2707676/pew-research-parenting-study-2023/ (summarizing Pew Jan 2023). Pew June 2026 (full-time working parents, different-sex couples): 43% say mom does more chores, 17% dad, 40% equal; one commentary reports 55% of dual-income dads vs 36% of moms very/extremely satisfied with the split (not verified on Pew's page). [S/SEC] https://www.pewresearch.org/social-trends/2026/06/16/how-working-parents-divide-family-responsibilities/
- **Fathers:** Pew 2015: 39% of fathers say they do a "very good job" raising kids vs 51% of mothers; 63% of dads (2017) say they spend too little time with kids vs 35% of moms. [S] https://www.pewresearch.org/social-trends/2019/06/12/fathers-day-facts/ (older data - refresh if possible).
- **Parenting-app gender split / Good Inside audience composition:** NOT FOUND. No public data; Rephonic lists a gender-skew metric behind a paywall. Anecdotal: coverage describes mothers reciting her mantras and "fathers becoming her followers." [SEC] https://www.scarymommy.com/parenting/dr-becky-good-inside-advice-she-gives-but-doesnt-follow ; https://rephonic.com/podcasts/good-inside-with-dr-becky. Recommended: assume 80%+ female [E] and validate in your own funnel.
- **Couples therapy initiation:** no reliable study found. "Women initiate ~70%" is an unsourced aggregator claim (Gitnux) - UNVERIFIED. Related, better-documented: women initiate ~69% of divorces (Rosenfeld). [SEC] https://gitnux.org/couples-therapy-statistics/ ; https://www.psychologytoday.com/us/blog/the-new-resilience/201508/women-initiate-divorce-much-more-men-heres-why
- **Marketing to dads is underserved** [E, inference from above gaps]: dads feel less successful and wish for more time; few brands speak to them.

### A5. Stay-at-home parents

- 18% of US parents did not work for pay in 2021 (unchanged vs 2016). Fathers = 18% of stay-at-home parents (up from 11% in 1989). 26% of mothers vs 7% of fathers are not employed. [S] https://www.pewresearch.org/short-reads/2023/08/03/almost-1-in-5-stay-at-home-parents-in-the-us-are-dads/
- Headcount is definition-dependent (Census narrow "stay-at-home dad" ~231K in 2023 vs ~2.1M broader) [SEC] https://fathercraft.com/how-many-stay-at-home-dads/
- Income profile: bimodal (high-earner spouse vs. lower-income families who can't afford childcare) [E; Pew shows share of stay-at-home parents by income quintile - not pulled]. SAHM in high-earner households is a high-engagement, low-price-sensitivity sub-segment, ideal for the "lead parent" role.

---

## B. Family-type segments

### B1. Size table

| Segment | Size | Tag | Source |
|---|---|---|---|
| Children living with two parents | ~70% (2020); mother-only ~21% (15.3M) | [S] | https://census.gov/newsroom/press-releases/2023/children-families-living-arrangements.html (via search summary) |
| Children in mother-only households (2024) | 14.4M children; father-only 3.5M | [SEC] | https://www.aecf.org/blog/child-well-being-in-single-parent-families |
| Of single-parent children, share with single mother | 86% vs 14% father | [SEC] | https://www.bgsu.edu/content/bgsu/en/ncfmr/resources/data/family-profiles/childrens-family-structure-2025-fp-26-06.html |
| Blended-family children (stepparent, step- or half-siblings) | 17% in 2023 (23% in 2013); 33% live with mother+stepparent, 13% father+stepparent | [S] | https://www.pewresearch.org/short-reads/2026/04/21/5-facts-about-u-s-children-living-in-blended-families |
| Mothers 40-44 with 3+ children | 38% (2016); 62% have 1-2 | [S] | https://www.pewresearch.org/short-reads/2018/08/09/middle-children-have-become-rarer-but-a-growing-share-of-americans-now-say-three-or-more-kids-are-ideal/ |
| Only-child mothers | ~11% (1976) to 18-22% (2014; sources conflict) | [S] | https://www.pewresearch.org/social-trends/2015/05/07/family-size-among-mothers/ |
| Adopted per year | ~120.9K in 2019 (annual range 118-127K since 1987); no authoritative stock count found (the "1.5M" figure is UNVERIFIED) | [S] | https://www.childwelfare.gov/pubs/adopted2010-19/ |
| Foster care on a given day | 368K (FY2022 AFCARS); 53,665 adopted from foster care in 2022 | [SEC] | https://www.ccainstitute.org/resources/fact-sheets |
| Grandparents responsible for grandchildren | 2.4M (Generations United); Census older count 2.7M (2014) | [SEC] | https://gu.org/app/uploads/2024/08/Network-General-Grandfamilies-Fact-Sheet-2022-FINAL-UPDATE.pdf ; https://hechingerreport.org/parent-substance-abuse-incarceration-drives-increase-in-grandparents-raising-grandchildren/ |
| LGBTQ parents | 2.57M LGBTQ adults parenting <18 (18% of LGBTQ adults); ~5M children have an LGBTQ parent; 20% became parents via stepparenthood | [S] | https://williamsinstitute.law.ucla.edu/press/lgbtq-parenting-2024-press-release |
| IVF births | 2.6% of US births (95,860 babies, 2023 SART); 100,158 IVF births reported in a later ASRM release (Mar 2026) | [S] | https://www.asrm.org/news-and-events/asrm-news/press-releasesbulletins/us-ivf-usage-increases-in-2023-leads-to-over-95000-babies-born |
| Autism | 1 in 31 8-year-olds (CDC ADDM 2022 data) | [SEC] | https://www.disabilityscoop.com/2025/04/16/cdc-raises-autism-prevalence-estimate/31413/ |
| ADHD | ~11.4% ever diagnosed ages 3-17 (~7M); ~10.5% current (secondary citing CDC) | [SEC] | https://www.monstermath.app/blog/how-many-children-are-neurodivergent-2025 |
| Military families | ~2.4M total DoD-force family members, 62.5% children (~1.5M, my arithmetic); active-duty ~869-889K children | [S/E] | https://download.militaryonesource.mil/12038/MOS/Infographic/2023-demographics-total-dod-military-community.pdf |
| Twins/multiples, chronic illness, immigrant/bilingual, dual-career w/ nanny | NOT researched in this pass | - | - |

### B2. Segment-by-segment (needs, ability to pay, personalization)

| Segment | Income / ability to pay | Top pain points | Personalization in app |
|---|---|---|---|
| **Single mothers** (~14.4M kids) | Lower median (~$45-60K [E]); blended-family net worth is a fraction of non-blended ($86K vs $194K) so price-sensitive. Financially stable sub-segment (>$75K) is small [E ~1-2M]. | Doing it alone; no partner to sync with; time poverty; guilt | "Solo" mode: replace partner sync with a trusted-adult (grandparent, co-parent, friend) "village" invite; lower price/annual-only; micro-lessons <5 min |
| **Single fathers** (3.5M kids) | Higher than single moms on average [E] | Underserved content; stigma | Dad-voiced content; same solo mode |
| **Blended / stepfamilies** (17% of kids) | Lower education/wealth; 34% of couples unmarried; child-support tension (median $400/mo cash) | Step-parent authority, discipline alignment, co-parenting with ex | Stepparent role pathways; "two-household" consistency routines; shared language scripts |
| **3+ children** (~38% of mothers 40-44 ever) | Costly households; mixed | Sibling rivalry, divided attention, logistics | Multi-child profiles; 1:1 time prompts per child; sibling conflict modules; family-plan value story |
| **Only child** (~18-22% of mothers [SEC]) | Often older, higher-education parents [E] | Fear of "only child syndrome," social opportunities | Myth-busting. Falbo & Polit meta-analysis (80 years of research): only children match or exceed on adjustment, character, sociability; no reliable selfishness difference (a 2019 *J. Research in Personality* study agrees; a values-priority study found slight self-centeredness - measures differ). https://www.apa.org/monitor/2024/09/only-children.html |
| **Adoptive / foster** (~120K adoptions/yr, 368K in care) | Often higher income (private adoption cost) [E] | Attachment, trauma-informed parenting, transracial identity, grief | Trauma-informed track; connection-before-correction; avoid shame-based or "just be consistent" defaults; ability to disable "bio-family" assumptions |
| **Grandfamilies** (2.4-2.7M) | Often low income, older | Legal/benefit stress, age gap, trauma history | Grandparent-friendly UI/large type; "caregiver + kid" not couple-sync; likely a low-ARPU partnership channel (not a primary buyer) |
| **LGBTQ parents** (2.57M adults) | Mixed | Inclusion in content; two moms/dads, not "mom/dad" | Gender-neutral roles, "Parent A/B"; no default mom lead |
| **IVF / older first-time** (2.6% of births) | Typically high-income, high-willingness-to-pay [E] | Anxiety, perfectionism, preparing for baby | Expecting-couple onboarding path; high-intensity-prep content |
| **Parents of neurodivergent kids** (autism 1/31, ADHD ~11%) | Mixed; cost stress from therapies | Meltdowns, school IEPs, partner disagreement | Neuro-affirming scripts; not a clinical replacement; disclaimers; partner alignment on strategy |
| **Military** (~1.5M kids) | Moderate, stable pay | Deployments, relocation; one parent solo for months | "Deployment mode" async sync; MilSpouse partnerships |

---

## C. Synthesis

### C1. Able-to-pay sizing (planning estimates [E])

Base: ~39% of ~84M family households have own children <18, so ~33M families [E from S bulletin].

| Cohort | Est. households | Note |
|---|---|---|
| Families with kids <18, any income | ~33M | [E] |
| Married/partnered with kids <18 | ~22-24M | [E] (~70% of children in 2-parent homes) |
| Partnered, kids <18, income >= $100K | ~15-17M | [E] (~65-70% of married-with-kids; median $143K) |
| Partnered, kids <12, income >= $100K | ~9-11M | [E] |
| Partnered, kids <12, income >= $75K | ~12-13M | [E] |
| Single-parent, kids <18, income >= $75K | ~1.0-1.5M | [E] |
| Realistic SAM (digitally engaged, college-educated, mom 28-40) | ~5-7M | [E] |

All [E] numbers should be replaced with CPS ASEC FINC-03 / ACS PUMS cross-tabs (kids <12 x income x marital) before investor/judge-facing use.

### C2. Recommended personas

1. **Primary - "Lead Parent Maya":** college-educated mom 28-40, partnered, $100K+ household, kid 2-10. Wants fewer meltdowns, a calmer household, and for her partner to "get it." She does the research and the invite. Size: ~5-7M [E].
2. **Involved Millennial Dad "Dan":** wants to be better than his dad; 39% say they do a "very good job" (Pew 2015) so confidence is the gap; sells on skills and competence, not guilt. Comes in via partner invite.
3. **Financially stable single mom:** solo mode; ~1-1.5M [E]; sells on "a coach in your pocket."
4. **Expecting couple / IVF / older first-time:** high willingness to prep; ~3.6M births/yr [E from CDC trends, not pulled]; IVF ~2.6% of births.
5. **Adoptive/foster:** ~120K adoptions/yr; high intent, niche specific content; a content credibility test.
6. **Parents of 3+:** pitch the household license (one plan, many kids).
7. **Parents of an only child:** myth-busting and "intentional" framing.

### C3. Messaging per persona

| Persona | Hook |
|---|---|
| Maya | "Stop being the only one who knows the plan. Invite your partner; we'll keep you both on the same page in 5 minutes a day." |
| Dan | "Level up as a dad. Play-by-play skills, quests, and a real score." |
| Single mom | "Backup, not judgment. Your plan, your pace, one trusted adult in your corner." |
| Expecting | "Prepare together before the baby arrives." |
| Adoptive | "Trauma-informed, shame-free tools built with attachment in mind." |
| 3+ kids | "One license, every child; sibling-fight scripts that work." |
| Only child | "Raising an only child? The research says they're fine. Here's how to make them thrive." |

### C4. Is "women first, she recruits the partner" supported?

Supported: mothers report more child-care responsibility (Pew 2023/2026), women dominate parenting-content consumption (anecdotal, no hard split found), women initiate most divorces (Rosenfeld 69%). Not supported / uncertain: that mothers *pay* more than dads (the "women control 85% of spending" figure is unreliable), and no data found on partner-conversion rates. Test via funnel: A/B a mom-first vs. neutral "parent" CTA, and measure invite acceptance.

**Risks and mitigations:**
- Reinforces "mom as project manager" -> frame onboarding as a *joint* decision; give dad equal onboarding; show a visible split of "who owns what."
- Dads feel judged (39% "very good job") -> use competence/mastery framing, not deficit.
- Partner never joins -> make the household license value work solo; nudge but don't nag.
- Non-traditional families alienated by "mom/dad" language -> use "Parent A/B" with customization.
- Single-parent exclusion -> solo mode; village invites.

---

## D. Research gaps to close before pitch
1. Exact CPS ASEC / ACS cross-tabs: kids <12 x income bands x marital status (Census tables blocked in this session).
2. Parenting-app payer gender; Good Inside audience split (request from Good Inside / Apptopia / Sensor Tower).
3. Per-child extracurricular/education spend; online-course spend; wellness-app payer demographics.
4. Twins/multiples, chronic illness, immigrant/bilingual, dual-career nanny families sizing.
5. Verify Fed SHED parent-specific $400 figure (55%) against the Fed table.

---

## Sources
- Census family bulletin: https://content.govdelivery.com/accounts/USCENSUS/bulletins/3c16e18
- WIA report on 2024 incomes: https://wiareport.com/2025/09/the-persistent-gender-gap-in-median-income-in-the-united-states
- Economist Writing Every Day: https://economistwritingeveryday.com/2026/09/02/median-family-income-for-married-couples-with-children-is-probably-higher-than-you-think/ ; https://economistwritingeveryday.com/tag/family-income/
- Census tables: https://censusreporter.org/tables/B19126/ ; https://www.census.gov/data/tables/2025/demo/cps/finc-03.html ; https://census.gov/newsroom/press-releases/2023/children-families-living-arrangements.html
- Pew middle class: https://www.pewresearch.org/social-trends/2024/05/31/the-state-of-the-american-middle-class/
- Fed SHED: https://www.federalreserve.gov/newsevents/pressreleases/other20260513a.htm ; https://www.federalreserve.gov/publications/2026-economic-well-being-of-us-households-in-2025-executive-summary.htm ; https://financer.com/personal-finance/emergency-fund-statistics/
- LendingClub/PYMNTS: https://www.cbsnews.com/news/paycheck-to-paycheck-6-in-10-americans-lendingclub ; https://pymnts.com/?p=1258964 ; https://www.pymnts.com/?p=1254682 ; https://joingerald.com/learn/financial-wellness/how-many-people-live-paycheck-to-paycheck
- Subscriptions: https://resubs.app/resources/subscription-spending-statistics ; https://thedesk.net/2026/02/parks-associates-cost-is-biggest-driver-of-streaming-churn-in-2025/ ; https://www.tvtechnology.com/platform/streaming/deloitte-streaming-churn-rises-73-percent-of-subs-are-frustrated-with-svod-price-hikes ; https://www.subscriptioninsider.com/article-type/news/flexibility-not-fatigue-consumers-stay-longer-when-subscriptions-are-easier-to-leave
- Women purchasing claim: https://joshlevs.com/ufaqs/myth-women-control-about-85-of-household-spending ; https://www.mediapost.com/publications/article/257808/women-rule-well-85-anyway.html ; https://www.foodnavigator-usa.com/Article/2026/06/08/soup-to-nuts-podcast-how-are-womens-shopping-habits-shaping-the-future-of-cpg/
- Pew parenting/fathers: https://www.pewresearch.org/social-trends/2019/06/12/fathers-day-facts/ ; https://www.sheknows.com/parenting/articles/2707676/pew-research-parenting-study-2023/ ; https://www.pewresearch.org/social-trends/2026/06/16/how-working-parents-divide-family-responsibilities/
- Stay-at-home: https://www.pewresearch.org/short-reads/2023/08/03/almost-1-in-5-stay-at-home-parents-in-the-us-are-dads/ ; https://fathercraft.com/how-many-stay-at-home-dads/
- Good Inside: https://www.scarymommy.com/parenting/dr-becky-good-inside-advice-she-gives-but-doesnt-follow ; https://rephonic.com/podcasts/good-inside-with-dr-becky
- Couples therapy / divorce: https://gitnux.org/couples-therapy-statistics/ ; https://www.psychologytoday.com/us/blog/the-new-resilience/201508/women-initiate-divorce-much-more-men-heres-why
- Family structure: https://www.aecf.org/blog/child-well-being-in-single-parent-families ; https://www.bgsu.edu/content/bgsu/en/ncfmr/resources/data/family-profiles/childrens-family-structure-2025-fp-26-06.html ; https://www.pewresearch.org/short-reads/2026/04/21/5-facts-about-u-s-children-living-in-blended-families
- Family size: https://www.pewresearch.org/short-reads/2018/08/09/middle-children-have-become-rarer-but-a-growing-share-of-americans-now-say-three-or-more-kids-are-ideal/ ; https://www.pewresearch.org/social-trends/2015/05/07/family-size-among-mothers/ ; https://www.apa.org/monitor/2024/09/only-children.html
- Adoption/foster/grandfamilies: https://www.childwelfare.gov/pubs/adopted2010-19/ ; https://www.ccainstitute.org/resources/fact-sheets ; https://gu.org/app/uploads/2024/08/Network-General-Grandfamilies-Fact-Sheet-2022-FINAL-UPDATE.pdf ; https://hechingerreport.org/parent-substance-abuse-incarceration-drives-increase-in-grandparents-raising-grandchildren/
- LGBTQ: https://williamsinstitute.law.ucla.edu/press/lgbtq-parenting-2024-press-release
- IVF: https://www.asrm.org/news-and-events/asrm-news/press-releasesbulletins/us-ivf-usage-increases-in-2023-leads-to-over-95000-babies-born
- Neurodivergence: https://www.disabilityscoop.com/2025/04/16/cdc-raises-autism-prevalence-estimate/31413/ ; https://www.monstermath.app/blog/how-many-children-are-neurodivergent-2025
- Military: https://download.militaryonesource.mil/12038/MOS/Infographic/2023-demographics-total-dod-military-community.pdf
