# Official Zimran FAQ (150 answers): What It Means for Our Idea

> Source: "Business Cup 2.0 | FAQ по кейсу", the official organizer answers (PDF in the project root, 29 pages, Q1–Q150). Questions closed at 14:00 on Nov 14.
> Legend: ✅ **confirms** our approach · 🔄 **changes** something · ⚠️ **risk / must do** · ➕ **new opportunity**.

## TL;DR: the 10 things that change our plan
1. 🔄 **Retention = subscription renewal, not daily use** (Q30, Q7). *"A product opened once a week but renewed for six months is rated higher than a daily habit that churns after a month."* → Our pitch must lead with **why they renew** (weekly Team Huddle, license classes that grow with the kid, the annual plan), not daily streaks.
2. 🔄 **CAC must be shown by channel** (Q58, Q143, Q144). *"We expect numbers in the deck: price, CAC assumptions by channel, retention, with sources."* → Added a channel CAC table below.
3. 🔄 **No live demo in the deck.** Show the product as screenshots of key screens and the flow (Q76, Q121, Q145). The jury tests the product via the link *before* the pitch. **10 slides max including the title and any appendix** (Q53, Q81). Extras go in the README.
4. ⚠️ **Two-partner products: officially OK.** Let the jury play both roles in separate windows via links, and **put clear instructions for the jury on the main page** (Q52). This is exactly our partner-invite demo.
5. ➕ **"User fails → trains → solves a new similar task" is *strong evidence of value*** (Q126). → Build the **AI Rehearsal as a before/after**: first attempt scored, coaching, then a retry on a new similar scenario with a higher score.
6. 🔄 **"People pay for a clear result, not for content"** (Q14). → Our promise must be a concrete result, not "a course". See the result statement below.
7. ⚠️ **Only the key scenario has to work, but fully** (Q3, Q85). *"Better one feature that really works than ten buttons that lead nowhere."* Hide non-working buttons. → Cut the MVP to one core flow (below).
8. ✅ **"New parents" is literally given as an example segment** for the Skills track (Q13). Our user choice is validated by the organizers.
9. ➕ **Guest mode with demo data and "time acceleration" is explicitly allowed** (Q35, Q66, Q69, Q84): the jury can live through "a week of use" in 3 minutes. Label it as demo.
10. ➕ **Real US user signals during the 24h earn points** (Q39, Q49, Q58, Q74, Q102, Q149). *"Even a few real interviews strengthen the pitch."* → Run a quick survey or interviews with US parents now.

---

## Full mapping: every relevant answer vs. our idea

### A. Product and what "works" means (40%)
| Q | Official answer (short) | Relation to us | Verdict |
|---|---|---|---|
| Q1, Q47, Q73 | Deployed public link; the jury goes end-to-end **without registration**. Figma or video don't count. Link live until the end of the final on Nov 15 | Our guest flow (localStorage / anonymous session) fits | ✅ |
| Q3, Q85, Q114 | Only the **key scenario** must work, truly, with no stubs or hardcoded answers. Hide dead buttons. One page is fine | Our MVP list (8 features) is too wide | 🔄 Cut to the core flow |
| Q35, Q54, Q65, Q68, Q92, Q99, Q119, Q139 | Real accounts are OK if there is a **one-click guest or demo mode**. Demo data + **time acceleration** OK if labeled | Add a **"Simulate a week"** button so the jury sees the streak, Team Huddle and renewal screen | ➕ |
| Q52 | Two-partner product: the jury can go through **both roles in separate windows via links**. **Give instructions on the main page** | Our core differentiator is officially supported | ✅⚠️ Add a "For the jury: open link A, then link B" box |
| Q66, Q69, Q84, Q94, Q127, Q134 | Sample data is OK if it **flows through the real logic**. "Hardcoded" = the result is pre-written and doesn't depend on input. Judges will **also try their own inputs** | Repair summaries and rehearsal scores must be live LLM output on whatever the jury types | ⚠️ |
| Q96 | "Your code does the calculations and an LLM explains the result" counts as real | Our skill scoring can be rule-based (code) + LLM feedback | ✅ |
| Q32, Q36, Q56, Q136 | **Not a ChatGPT wrapper.** What's "your own": a structured path to a result, accumulated data and progress, personalization over time, behavioral or game mechanics | License path + couple data + Pause → Repair flow. **Our moat: the repair summary uses *two* people's private inputs, which ChatGPT never gets** | ✅ Sharpen the "why not ChatGPT" answer |
| Q2, Q25 | AI is **not required**. Use it only if it actually solves the user's problem. "We assess value, not trendy tech" | Our "no live AI mediator" decision fits this philosophy perfectly | ✅ |
| Q125, Q126 | Diagnosing a gap and closing it = value in Skills. **"Fail → train → solve a new similar task" is strong evidence** | Turn Rehearsal into a before/after + a scenario retry in "Today" | ➕ |
| Q22, Q28, Q23 | Any stack. **"We read the code, keep it clean."** Simple architecture > complex unfinished. A README with setup is a plus | Next.js + Supabase + an LLM API is fine. Keep it small | ✅ |
| Q26 | No special security requirements. **Don't commit keys; don't collect extra personal data** | Minimal child data (first name, age), no raw transcripts stored long-term | ✅ |
| Q138, Q150, Q78 | Sensitive topics are **a plus for depth of pain** if careful: no medical advice, no treatment promises, no extra sensitive data | Postpartum check-in = referral only. Domestic-violence note. "Coaching, not therapy" | ✅⚠️ |
| Q5, Q113 | No 18+ content, nothing illegal | Couple content: keep intimacy topics PG | ⚠️ |
| Q40, Q60, Q87, Q103 | PWA counts; mobile-adaptive is a plus; native apps = fail | Build responsive; optional PWA | ✅ |
| Q46, Q64, Q93, Q98 | Public repo with the **full source of what's deployed**. The product must be built during the hackathon; **they may check commit history** | The product code goes in the captain's repo with commits during the event. Our `research/` folder is fine alongside | ⚠️ |
| Q48 | List key dependencies in the README; keep secret keys server-side; make sure APIs work during review | README "How it works" section + server-side LLM calls + spending limits | ⚠️ |
| Q131 | LLM costs are paid by the team | Use a cheap model for scoring, cache, rate-limit the demo | ⚠️ |

### B. Value and retention (20%)
| Q | Official answer | Relation to us | Verdict |
|---|---|---|---|
| **Q30** | **Renewal > DAU.** Weekly use renewed for 6 months beats daily use that churns | Our deck over-sells "daily 5 minutes". Renewal is what Zimran values, and it's lever #2 in our stress test | 🔄 **Reframe** |
| Q7, Q14 | Show what the user pays for, how much, and **why they come back**. People **"pay for a clear result, not for content"** | Need a concrete result promise | 🔄 |
| Q72, Q100 | **At least one return mechanic must be built and working** (progress, reminders, a personal plan, accumulated data). Retention logic and numbers go in the deck | Our working mechanics: the personal 28-day Team Plan, the shared progress and streak, the weekly Huddle | ✅ |
| Q108 | A plain online school risks being a copy. **A service people return to monthly scores well on Value & retention** | Supports "practice service" over "course" | ✅ |
| Q148 | Seasonal products: explain why they return next season | Our "license classes by child age" is the renewal logic over years | ✅ |

**Our renewal story (replaces "why they come back tomorrow"):**

| Horizon | Why they renew |
|---|---|
| Week | The **Team Huddle** (10 min, Sunday): shared stats, the "noticed/did" load view, one agreement. *This is the ritual, and it can be weekly.* |
| Month | Visible progress to the next **license class**. A monthly "Team Report" that both partners see. A new month = new age-specific missions. |
| Year | **The child keeps growing.** Each stage (Night Shift → Calm Driver → School Zone → Open Road) brings new problems, and the annual plan is pushed after 2 renewals. |
| Lock-in | Two people's shared history (agreements, repairs, milestones) is accumulated data a couple won't want to lose. |

**The concrete result (Q14):** *"In 28 days: a written Team Plan you both agreed to, a fair split of nights and chores you can both see, and a repair ritual you've used at least once. Measured by a 1-minute team check-in on day 0 and day 28."*

### C. Problem and user (15%)
| Q | Official answer | Relation to us | Verdict |
|---|---|---|---|
| **Q13** | Choosing the exact segment is part of the task. Examples: **"nurses, truck drivers, new parents"** | Our primary user (couples with a first kid aged 0–6 / expecting) is one of their own examples | ✅ |
| Q11 | Skills = what adults **try to master and keep failing at**, including **habits** | Parenting as a team is a skill people keep failing at | ✅ |
| Q10, Q62, Q80, Q101, Q9 | One main track, **one user, one main pain**. "A product about everything usually loses on Problem & user" | ⚠️ The captain's repo description (AI counselor **+** child assessments) is two pains. Pick one | ⚠️ |
| Q43 | A product for teens paid by a 25–45 US parent is OK: **the client is the parent** | Confirms the parent as buyer even for kid-facing content | ✅ |
| Q39, Q49, Q74, Q102, Q149 | Interviews and surveys are **a plus**, not required. Even a few real interviews strengthen the pitch. Be clear what's real vs test | **Do 5–10 quick interviews or a survey with US parents** (friends or relatives in the US, r/Parenting with mod rules, Facebook groups). Put the quotes and numbers on slide 2 or 3 | ➕ |
| Q29, Q6, Q75 | US audience, US prices, **English UI** from the pitch on | ✅ | ✅ |

### D. Business potential (15%)
| Q | Official answer | Relation to us | Verdict |
|---|---|---|---|
| **Q58, Q81, Q142** | Numbers in the deck: **price, CAC assumptions by channel, retention, LTV**, with sources or clear logic. **Full TAM/SAM/SOM is not required.** A detailed financial model isn't needed, key numbers are | We had blended CAC only | 🔄 Add CAC by channel; shrink TAM/SAM/SOM to one line |
| Q143, Q144 | Marketing strategy is a plus. No specific budget: **the logic matters (channel, cost of acquiring a paying user, payback)** | Our GTM channel list + payback months | ✅🔄 |
| **Q33** | Internal data isn't disclosed. **Use public benchmarks (RevenueCat, Adapty), cite sources.** The jury checks realism | Exactly what we did. Our stress test shows we know the levers | ✅ |
| Q34 | Niches already tested by Zimran aren't disclosed. "Choose by strength of pain and willingness to pay" | ✅ | ✅ |
| Q20, Q37, Q51, Q55, Q67, Q91, Q95, Q115, Q116, Q130, Q137 | Real payments not required. **Minimum = a working paywall with a clear price.** A Stripe test checkout the jury can complete is **stronger**; show the test card on screen. A pricing page without a paywall isn't enough. Subscription isn't mandatory. Real payments are a strong signal (your responsibility) | Build the paywall + Stripe test checkout with "4242…" shown | ✅⚠️ |
| Q83 | Partner revenue (e.g. a bank commission) is OK as **additional** revenue | Affiliate "buy the book" links, Babylist listing = extra revenue | ✅➕ |
| Q129 | The roadmap may mention **B2B later** if the product and model are B2C | Employer family benefits (Maven-style) as a later channel | ✅ |
| Q38, Q42, Q15 | B2C = the person pays. If an employer or company pays, it's a fail | Daycare codes and Class Pack stay B2C (each family buys) | ✅ |
| Q124 | **One segment, one pain, a deep solution + a reasoned expansion path** is a good strategy | License classes 0 → 12 + international expansion | ✅ |

### E. Originality (10%)
| Q | Official answer | Relation to us | Verdict |
|---|---|---|---|
| Q31, Q57, Q12 | Zimran's products: **Finelo, Coursiv, Subpilot, a trading simulator**. Their niche isn't a minus; **copying the product is**. A new angle = new audience, new mechanic or new value. **A new acquisition channel alone is NOT a new angle** | We don't overlap with their products. Our "Zimran-native funnel" is a fit argument, *not* originality. Originality = couple-as-unit + Pause → Repair + "experts agree/differ" team decisions | ✅🔄 |
| Q24, Q41, Q71, Q79, Q97, Q123 | Not a ban on categories. Copy = same audience + same mechanic + same value. A new mechanic or segment in an existing category is fine | Parenting apps exist, but no one targets the **parent team** with **repair mechanics** | ✅ |
| **Q146** | **Depth of execution > originality** (40% vs 10%). A strong product in an existing niche with a new angle beats an original idea that doesn't work | Don't over-build. Polish the core flow | ✅ |
| Q147 | **A B2C version of a product currently sold only to companies is a new angle** (e.g. Nayya, ALEX) | ➕ Gottman's *Bringing Baby Home* is sold mostly via facilitators; Maven-style family coaching is employer-paid. **"We bring employer-grade family coaching to any couple, at $12/month"** is an originality line | ➕ |

### F. Pitch logistics
| Q | Official answer | Action |
|---|---|---|
| Q53, Q81 | **10 slides total, including the title and appendices.** Extras go in the README | Our outline is 10 slides with slide 1 as hook + title: OK. No appendix |
| Q76, Q121, Q145 | PDF can't play video. **Show the demo as screenshots** of key screens and the flow. The jury reviews the product via link beforehand | Slide 4 = a screenshot flow (quiz → plan → invite → Repair → paywall) |
| Q8, Q75, Q109, Q140 | Deck in English. Speak Kazakh, Russian or English | — |
| Q45, Q70, Q77 | Review 12:00–15:00 Nov 15, in the browser (mobile-adaptive is a plus). Finalists announced at **15:00** in Telegram **@business_cup_2026**. Pitches **16:30, Green Hall**, 5 min + 2 min Q&A | The **landing page + jury instructions** are the first impression |
| Q82, Q104 | The captain submits via the emailed link: deck PDF + product link + public GitHub. **No pull request needed** for submission | Q104 is about submitting. Our `research/` branch still needs merging into `main` (or just linking) for teammates |
| Q117 | Ideal winner: max **effort, attitude, ownership**, depth of thinking | Our research depth + stress test show this. Mention it briefly |

---

## Updated assumptions
| Assumption | Before | After FAQ |
|---|---|---|
| Retention metric to pitch | Daily streak / "why come back tomorrow" | **Renewal rate** (renewal after the intro month, monthly churn, annual plan share). Weekly Team Huddle is the core ritual. Daily reps are optional |
| Unit-economics presentation | Blended CAC + TAM/SAM/SOM | **CAC by channel** + price + retention + LTV + payback. TAM/SAM/SOM shrunk to one line |
| Demo | Live two-laptop demo | **Screenshots in the deck.** The jury plays both roles beforehand via **two links + instructions on the landing page** |
| MVP scope | 8 features | **One core scenario, fully real:** quiz → plan → partner joins (2nd window) → Repair Room (both answer → live AI neutral summary + agreement) → Rehearsal before/after → paywall + Stripe test. Everything else hidden |
| Originality pitch | Couple-native + Zimran fit | Couple-native + Pause → Repair + **B2C version of employer/facilitator-only family coaching** (Q147). The Zimran funnel fit is *not* an originality argument (Q31) |
| Evidence | Desk research | + **5–10 US parent interviews/survey** (a plus under Q39) |

## CAC by channel (estimate for the deck; consistent with base blended CAC ≈ $52)
| Channel | Share of new payers | CAC per payer | Logic / source |
|---|---|---|---|
| Meta (FB/IG) quiz funnel | 50% | ~$65 | Adapty Q3 2026 median cost per paying user $43–82; US CPM premium [E within benchmark] |
| TikTok | 10% | ~$75 | Younger parents; lower intent than Meta [E] |
| Pinterest / YouTube (expecting parents) | 10% | ~$55 | High-intent pregnancy and nursery searches [E] |
| Referral "give a month, get a month" | 10% | ~$25 | Cost = one free month for the referrer [E] |
| Parent communities (Reddit, FB groups, Peanut ambassadors) | 8% | ~$20 | Content + ambassador perks [E] |
| Daycare codes / "Class Pack" discount | 7% | ~$15 | Discount cost, no ad spend [E] |
| Gift a License (baby showers, registries) | 5% | ~$0 | The gift buyer pays [E] |
| **Blended** | 100% | **≈ $51** (+$1 free-user AI ≈ **$52**) | Matches the base model |
| *(Partner seat)* | — | $0 | The 2nd user is free; drives retention, not new payers |

Payback at base: ~7 months (Inside Zimran ~5). Stress tests in [09-stress-test.md](09-stress-test.md).

## Zimran company facts learned (update to research)
- Products named by the organizers: **Finelo, Coursiv, Subpilot, and a trading simulator** (Q12, Q31, Q57). Subpilot wasn't in our earlier research; it isn't described in the FAQ.
- They build mainly for **US and European** users, not Kazakhstan (Q14).
- Philosophy: **"People pay for a clear result, not content"** (Q14). **"Paying users matter, not DAU/MAU"** (Q30, also quoted from Arman). **"We assess user value, not trendy tech"** (Q25).

## Action checklist (from the FAQ)
- [ ] Landing page: a **"For the jury"** box with Partner A and Partner B links and the order to open them (Q52)
- [ ] One-click guest mode + labeled **demo data + "simulate a week"** (Q35)
- [ ] Core flow fully live on any input. Judges will type their own (Q134); no canned outputs
- [ ] Rehearsal **before → coaching → retry** with visible score improvement (Q126)
- [ ] Paywall with a clear price + **Stripe test checkout, test card shown on screen** (Q95)
- [ ] Hide every non-working button (Q85). English UI. Mobile-responsive
- [ ] README: what it is, how to run it, key dependencies (LLM, Supabase, Stripe), the demo path. No secrets (Q23, Q48)
- [ ] Repo public, containing the full deployed source; commits made during the hackathon (Q46, Q64)
- [ ] Deck: **10 slides incl. title**, screenshots instead of a live demo, **renewal logic**, **CAC by channel**, sources (Q53, Q58, Q76)
- [ ] 5–10 US parent interviews or a quick survey: put the quotes and numbers in the deck (Q39)
- [ ] Link stays live until the end of the final, Nov 15 (Q73)


---

## Assumption register: each assumption checked against the FAQ
Format: **according to Qx → assumption is ✅ fine / 🔄 needs changing / ➕ new**, and what we did.

| # | Our assumption (before the FAQ) | According to… | Verdict | What we changed |
|---|---|---|---|---|
| 1 | Track = **Skills**, parenting as a team | **Q11** (Skills = what adults keep failing to master, incl. habits), **Q13** ("new parents" is an example segment) | ✅ Fine | — |
| 2 | One user (couple with a first kid aged 0–6) and one pain | **Q10, Q62, Q80, Q101** ("one user, one main pain; a product about everything loses") | ✅ Fine for our narrowed concept · ⚠️ the Kinora repo description (AI counselor + child assessments) is two pains | Flagged to the captain |
| 3 | The buyer is the parent; B2C only | **Q38, Q42, Q43** (whoever pays decides B2C; a parent paying for a kid's product = B2C) | ✅ Fine | — |
| 4 | Employer benefits as a channel | **Q38** (employer pays = fail) · **Q129** (B2B only on the roadmap) | 🔄 Moved to "later roadmap" only | Deck: employer channel only on the roadmap line |
| 5 | Daycare codes / "Class Pack" | **Q38, Q42** (each family pays itself) | ✅ Fine if each family buys its own plan | — |
| 6 | Pitch retention as "why come back tomorrow" (daily streak) | **Q30** (renewal > DAU; weekly use renewed for 6 months beats a daily habit) | 🔄 **Changed** | Slide 6 → "Why they RENEW"; weekly Team Huddle is the core ritual |
| 7 | The product = "a course" | **Q14** ("people pay for a clear result, not content") · **Q108** (an online school risks being a copy; a service people return to monthly scores well) | 🔄 **Changed** | Concrete 28-day result promise; "practice service", not "course" |
| 8 | A subscription is required | **Q51** ("subscription isn't mandatory, any user-paid model") · **Q148** (annual or one-time fine if the return logic is clear) | 🔄 Re-evaluated | Compared 4 models → **hybrid, annual as anchor** ([11-decisions-standalone-pricing.md](11-decisions-standalone-pricing.md)) |
| 9 | Blended CAC is enough | **Q58, Q81, Q142, Q143** (CAC **by channel**, price, retention, LTV) | 🔄 **Changed** | Added a CAC-by-channel table (blended ≈ $52) |
| 10 | A full TAM/SAM/SOM slide | **Q81** ("full TAM/SAM/SOM not required") | 🔄 Shrunk | One line in the deck; details stay in docs |
| 11 | Benchmarks from RevenueCat/Adapty/FunnelFox | **Q33** ("use public benchmarks, cite sources; the jury checks realism") | ✅ Fine | — |
| 12 | Live two-laptop demo during the pitch | **Q76, Q121, Q145** (PDF can't play video → screenshots; the jury tests via link beforehand) | 🔄 **Changed** | Slide 4 = screenshot flow; live demo optional |
| 13 | 10-slide deck with a separate title slide | **Q53, Q81** (10 slides **including** the title and appendix) | 🔄 Adjusted | Slide 1 = title + hook; no appendix; extras in the README |
| 14 | The jury tests the partner flow in two browsers | **Q52** (two windows via links OK; instructions on the main page) | ✅ Fine + ⚠️ must add instructions | "For the jury: open link A, then link B" box |
| 15 | Guest mode, localStorage / anonymous sessions | **Q35, Q54, Q65, Q92, Q135** | ✅ Fine | — |
| 16 | Demo data for a quick walkthrough | **Q35, Q66, Q69, Q84, Q127** (OK if labeled and run through real logic; judges also type their own inputs, Q134) | ✅ Fine + ➕ "simulate a week" button | Added to the MVP scope |
| 17 | 8 MVP features | **Q3, Q85, Q114** (only the key scenario, fully real; hide dead buttons) | 🔄 **Changed** | One core flow (quiz → plan → partner → Repair → Rehearsal → paywall) |
| 18 | AI Rehearsal shows feedback | **Q125, Q126** ("fail → train → solve a new similar task" is strong evidence) | ➕ Upgraded | Before/after scores on a new scenario |
| 19 | AI is the core, but no live mediator | **Q2, Q25** (AI only if it solves the problem) · **Q32, Q36, Q56, Q136** (must be more than a wrapper) | ✅ Fine | "Why not ChatGPT": the Repair summary uses **two people's** private inputs |
| 20 | Code computes, LLM explains | **Q96** (counts as real) | ✅ Fine | Rule-based scoring + LLM feedback |
| 21 | Sensitive topics (conflict, postpartum depression, DV) | **Q138, Q150, Q78** (depth of pain is a plus; no medical advice; minimal sensitive data) · **Q26** | ✅ Fine with care | Referral-only for postpartum depression, minimal child data, "coaching, not therapy" |
| 22 | Intimacy topics in couple content | **Q5, Q113** (no 18+) | ⚠️ Keep PG | — |
| 23 | Stripe test checkout | **Q20, Q37, Q55, Q67, Q95, Q137** (paywall = minimum; a test checkout the jury completes = stronger; show the test card) | ✅ Fine | Show "4242 4242 4242 4242" on screen |
| 24 | Affiliate book links, registry listing | **Q83** (partner revenue OK as *additional*) | ✅ Fine | — |
| 25 | Originality = couple-native + Pause → Repair + Zimran-funnel fit | **Q31** (a new acquisition channel alone is **not** a new angle) · **Q57** · **Q147** (a B2C version of a B2B-only product is a new angle) | 🔄 **Changed** | Funnel fit removed from originality; added "employer/facilitator-grade family coaching, now direct to couples" |
| 26 | Pitch as "Zimran's next niche" | **Q31, Q57, Q12** (own angle; the product must stand alone) · criteria judge the product, not the fit | 🔄 **Changed** | **Standalone is primary**; Zimran fit only as upside on the last slide |
| 27 | Research desk-only | **Q39, Q49, Q74, Q102, Q149** (interviews/surveys are a plus) | ➕ New | Do 5–10 US parent interviews or a survey |
| 28 | English UI, US prices | **Q6, Q29, Q75** | ✅ Fine | — |
| 29 | Responsive web / PWA | **Q40, Q60, Q87, Q103** | ✅ Fine | — |
| 30 | The repo holds the full deployed code; built during the event | **Q46, Q64, Q93, Q98** (public repo with full source; commit history may be checked) | ⚠️ Must do | Product code goes in the captain's repo with commits during the event |
| 31 | LLM API costs | **Q131** (the team pays) | ⚠️ Plan for it | Cheap model for scoring, rate limits on the demo |
| 32 | Zimran's products = Coursiv, Finelo | **Q12, Q31** (also **Subpilot** and a trading simulator) · **Q14** (US and Europe users) | 🔄 Updated | Zimran research updated |
