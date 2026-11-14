# US teen independence and the teen-parenting market: age scope for a B2C parenting-skills product

Date: 2026-11-14. Tags: [S] primary source, [SEC] secondary (reporting a primary), [E] estimate / my own calculation. Where a primary page could not be fetched (census.gov and pewresearch.org returned HTTP 403 to the fetch tool), numbers come from search-result summaries and are tagged [SEC]. Verify [SEC] items before putting them on a slide.

## 0. Bottom line

- Recommendation: ship core 0-12 now. Add 13-15 as a clearly separate, optional module ("Class 5 Road Test" style) later. Do not extend to 16-18 in the first version.
- Why, in three lines: (1) by arithmetic, parents of 0-12 are ~85-90% inside the 25-45 buyer band, parents of 13-15 ~60-70%, parents of 16-17 only ~40-55% [E]; (2) willingness to pay for teen-parenting tools is real (monitoring, coaching, therapy) but concentrated in safety/surveillance and clinical care, not skills training; (3) US teens are NOT leaving early, so "teen independence" is a longer, more parent-involved runway than the folk belief implies, which supports a later teen module rather than a reason to cover it now.

## 1. Leaving home: US vs Europe / Russia / Kazakhstan

| Metric | Value | Tag | URL |
|---|---|---|---|
| US adults 18-24 living in parental home, 2024 (CPS ASEC) | 57% | [SEC] (Census release, via Florida Realtors) | https://floridarealtors.org/news-media/news-articles/2024/11/census-family-households-drop-64-2024 ; primary: https://census.gov/newsroom/press-releases/2024/families-and-living-arrangements.html |
| US adults 25-34 living in parental home, 2024 | 16% | [SEC] same | same |
| US 18-34 living in parent's home, ACS 2024 | 32.5% (31.8% in 2023) | [SEC] (Mappr citing ACS) | https://www.mappr.co/?p=52189 |
| US 25-34 living with parents in 2000 | ~12% | [SEC] | https://www.census.gov/library/stories/2024/05/living-arrangements.html |
| EU average age leaving parental home, 2024 | 26.2 (26.3 in 2023) | [S] Eurostat | https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250923-1 |
| Croatia / Slovakia / Greece / Italy / Spain | 31.3 / 30.9 / 30.7 / 30.1 / 30.0 | [S] Eurostat (as reported) | same |
| Finland / Denmark / Sweden | 21.4 / 21.7 / 21.9 | [S] Eurostat (as reported) | same |
| Pew: 18-34 who got financial help from parents in past 12 months | 44% (68% of those under 25; 30% of ages 30-34) | [S] Pew Jan 2024 (via summaries) | https://www.pewresearch.org/social-trends/2024/01/25/financial-help-and-independence-in-young-adulthood/ |
| Pew: completely financially independent | 45% overall; 16% of 18-24; 67% of 30s | [SEC] | same |
| Pew: 18-24 receiving rent/mortgage help | 31% | [SEC] | same |
| Pew: young adults living with parent who say it helped finances | 64% | [SEC] | same |
| Russia: 18-35 living with partner and children outside parental home (2019 RANEPA) | ~34%; ~14% alone | [SEC] Statista | https://statista.com/statistics/1123994/demographic-situation-of-youth-in-russia |
| Russia: 18-35 living with parents | "about every fourth" (~9.5M people), year unclear | [SEC, weak] | https://realty.rbc.ru/news/6566f3109a79477e78c9a189 (unverified; treat as rough) |
| Russia (HSE, 2011 survey): ever lived apart from parents / back with them | 97% / 12% | [SEC] | https://iq.hse.ru/en/news/177665223.html |
| Kazakhstan: share of young adults living with parents / average leaving age | NOT FOUND in this search | - | Check stat.gov.kz household tables, e.g. https://stat.gov.kz/api/iblock/element/279532/file/en/ |

Reading: is "US kids move out early" still true? Only in a narrow sense. The US (about 16% of 25-34 at home on CPS; EU leaving age 26) is still earlier than southern/eastern Europe (30-31) but later than the Nordics (21-22), and the US share is rising from ~12% in 2000. Most 18-24s (57%, CPS definition counts college dorms as the parental home for students) are still counted at home. Parental money continues well past 18 (68% of under-25s get help). For a product: parenting does not end at 18, and "launching" is a multi-year process. Russia and Kazakhstan: data is thin (see gaps); do not make cross-country claims beyond Eurostat vs US.

Not found: share of 18-year-olds who go to college away from home. Related: ~62% of 2022 high-school completers enrolled in college that October, 45% at 4-year institutions [S] https://nces.ed.gov/fastfacts/display.asp?id=51 . The on-campus share needs a separate NCES query.

## 2. Teen autonomy milestones (US)

| Milestone | Number | Tag | URL |
|---|---|---|---|
| 16-year-olds with a driver's license | ~46% in 1983 -> ~25% in 2022 (sources vary 24-25.6%) | [SEC] (FHWA Highway Statistics DL-20 via press) | https://www.consumeraffairs.com/insurance/teen-driving-statistics.html ; FHWA: https://www.fhwa.dot.gov/policyinformation/pubs/our_nations_highways_2026/drivers.cfm (aggregate 16-19 only) |
| First smartphone | ~half of kids have own phone by age 11 (2019: 53% at 11, 69% at 12); 2026 census: crosses 50% at 11, near-universal by 17 | [S] Common Sense | https://www.commonsensemedia.org/research/the-2026-common-sense-media-census-tech-and-media-use-by-tweens-and-teens ; https://www.commonsensemedia.org/articles/tweens-teens-and-phones-what-our-2019-research-reveals |
| Social media use, ages 13-17 | ~95%; >1/3 "almost constantly" | [S] Surgeon General advisory 2023 | https://surgeongeneral.gov/ymh-social-media |
| Runaways | 1.6-1.7M "runaway/thrownaway" episodes per year (NISMART-2, 1999 data, dated); NRS cites 1.6-2.8M | [S] OJJDP | https://www.ojp.gov/sites/ojp/files/archives/html/ojjdp/nismart/04/ns4.html |
| Estrangement, any close relative | 27% of US adults | [S] Pillemer / Cornell (book Fault Lines, 2020) | https://kiowacountypress.net/content/family-rifts-affect-millions-americans-%E2%80%93-research-shows-possible-paths-estrangement-toward |
| Estrangement where the relative is a parent or child | 17% (conflicting reports; check book) | [SEC] | same |
| Young adults rating relationship with parent highly | majority, higher for mothers | [S] Pew 2024 | https://www.pewresearch.org/social-trends/2024/01/25/young-adults-relationship-with-their-parents/ |

Not found with a citable number: first job rate, dating age, emancipation counts (legally rare; age of majority is 18 in most states), and Pillemer's parent-child-only estrangement rate beyond the 17% bucket. I did not locate a Pew teen survey figure for "get along with parents".

Takeaways: teen autonomy is arriving later (license, jobs), while phone/social-media autonomy arrives earlier (age ~11). That mismatch is the core parenting tension and sits at ages 10-15, i.e. partly inside a "0-12" product's upper edge.

## 3. Teens and parents today

| Item | Number | Tag | URL |
|---|---|---|---|
| Persistent sadness/hopelessness, HS students, 2023 | 39.7% (52.6% of girls); 2021: 42% | [S] CDC YRBS | https://www.cdc.gov/yrbs/results/2023-yrbs-results.html |
| Same measure, 2025 YRBS | 33.3% | [S] CDC MMWR | https://www.cdc.gov/mmwr/volumes/75/su/su7501a4.htm |
| Parents worried about teen mental wellbeing | 89% (parents) vs 77% (teens) somewhat/extremely worried | [S] Pew Apr 2025 | https://alpha.pewresearch.org/pewresearch-org/wp-content/uploads/sites/20/2025/04/PI_2025.04.22_teens-social-media-mental-health_REPORT.pdf |
| Parents naming social media as top negative influence | 44% vs 22% of teens | [S] same | same |
| Teens saying they spend too much time on phone | 38% (27% social media) | [SEC] Pew Mar 2024 | https://www.deseret.com/family/2024/03/12/pew-research-center-teens-parents-screen-time-smartphones |
| Parents who have looked through teen's phone | ~half | [SEC] same | same |
| Surgeon General: >3 h/day social media ~ double risk of depression/anxiety symptoms (association, 12-15 sample); teens avg 3.5 h/day | | [S] | https://surgeongeneral.gov/ymh-social-media |

Reading: parent anxiety about teens is high and specific (mental health, phones). That is a demand signal, but it is a clinical/safety-flavoured demand, which a skills product must handle carefully (disclaimers, referral paths).

## 4. Teen-parenting market and willingness to pay

| Segment | Evidence | Tag | URL |
|---|---|---|---|
| Family location/safety (Life360) | FY2024 revenue ~$371.5M (+22%); 79.6M MAU (US 43.7M); 2.3M paying circles; ARPPC $131.76/yr; US 1.6M paying circles | [S] company release | https://www.life360.com/press/life360-reports-record-q4-and-fy-2024-results |
| Monitoring (Bark) | Premium $14/mo or $99/yr, unlimited kids | [SEC] (Bark's own blog) | https://www.bark.us/blog/bark-vs-qustodio/ |
| Monitoring (Qustodio) | ~$55-$110/yr depending on tier/page | [SEC] | https://www.qustodio.com/plans |
| Parental-control software market, 2024 | ~$1.4B (Fortune BI) to $2.2B (TBRC); ~$3.4B by 2032 forecasts; low reliability | [SEC] | https://fortunebusinessinsights.com/parental-control-software-market-104282 ; https://marketresearch.com/Business-Research-Company-v4006/Parental-Control-Software-Global-39098912 |
| Parenting-advice subscription (Good Inside) | >$34M revenue last year (+50%); >100k subscribers at ~$25/mo; core product is for kids 2-10 | [SEC] Fortune | https://fortune.com/2026/03/02/inside-dr-becky-kennedys-34-million-parenting-empire/ ; https://www.goodinside.com/lp/core/ |
| Books | The Anxious Generation (Haidt, Mar 2024): "over two million copies" | [SEC] publisher copy, unaudited | https://www.tatteredcover.com/products/9780593655030 |
| Teen mental health (Charlie Health) | Revenue estimates conflict ($220M-$516M, aggregators); expanded to ages 8-64; insurance-paid | [E] low reliability | https://hitconsultant.net/2025/08/22/charlie-health-expands-virtual-behavioral-healthcare-to-ages-8-64/ |
| College counseling | $100-300/h; packages from ~$6.5k (one report) to $25-40k (boutique); self-reported by sellers | [SEC] | https://sayhellocollege.com/blog/are-college-counselors-worth-it/ |

Not found: Brightline and Little Otter financials, Lisa Damour sales, spending-per-teen surveys, driving-coach app revenues. I did not verify these.

Reading:
- Parents of teens demonstrably pay, but mostly for (a) surveillance/safety (cheap, $50-130/yr), (b) clinical care (insurance-paid), (c) admissions (high-ticket, 16-17+, parents aged 45+ mostly).
- A skills/coaching subscription at ~$25/mo is proven (Good Inside) but its anchor audience is 2-10, which is consistent with a 0-12 core.
- Teen-skills pricing evidence is thin; a teen module would be a bet, not a proven category.

## 5. Age arithmetic for the 25-45 buyer rule

Inputs:
- Mean age of mother at first birth: 27.6 in 2024 (27.5 in 2023, 26.6 in 2016) [S] NCHS via BGSU https://www.bgsu.edu/ncfmr/resources/data/family-profiles/mean-age-mother-first-birth-fp-26-12.html ; https://cdc.gov/nchs/blog/posts/2025/06/the-rising-age-of-motherhood-in-the-united-states.html
- Mean maternal age at ALL births: I could not confirm ~30.0 from NCHS. I use ~29.5 (SD ~5.5) as the assumption [E]. For parents of today's teens, births occurred ~2009-2013 when the mean was about 1 year lower, so I run 28.5-29.5.
- Father mean age at birth: not found; assume mother +2.5 years (~32, SD ~6.5) [E].
- Census parent-age-by-child-age tables were not retrievable. A census page exists on householder age and presence of children: https://www.census.gov/library/stories/2024/11/family-households.html (403 on fetch). IPUMS CPS parent-linked microdata could replace this estimate in a day of work.

Method: parent age = age at birth + child age, normal approximation (real distribution is right-skewed, so the 45+ tail is a bit understated at older child ages). Share of parents currently 25-45 [E]:

| Child age band | Mid-age used | Mothers 25-45 | Fathers 25-45 | Typical parent age |
|---|---|---|---|---|
| 0-5 | 2.5 | ~88-90% | ~88% | M ~31-32, F ~34 |
| 6-12 | 9 | ~85-88% | ~70-75% | M ~38, F ~41 |
| 13-15 | 14 | ~60-70% | ~42-50% | M ~42-43, F ~46 |
| 16-17 | 16.5 | ~40-55% | ~30-35% | M ~45, F ~48 |

Caveats: mothers are the likelier buyer; first-time parents are younger than the all-births mean, parents with several children are older; the <25 tail matters only for 0-5. Treat the table as ±10 points.

Conclusion: 0-12 fits the buyer band well (mothers about 85-90%). 13-15 is a borderline majority for mothers (60-70%) and under half for fathers. 16-17 is under or near half and is outside the rule for the median parent. This also coincides with the point where teen-parent spend shifts to college counseling/driving, typically beyond 45.

## 6. Synthesis and recommendation

| Criterion | 0-12 | 13-15 | 16-18 |
|---|---|---|---|
| (a) 25-45 buyer fit | strong | partial (M ~65%, F ~45%) | weak |
| (b) Proven willingness to pay | strong (Good Inside-type subscriptions) | real but skewed to monitoring/clinical | high-ticket but 45+ parents |
| (c) US teen independence facts | n/a | independence arrives late (license ~25%, financial help to mid-20s); phone at ~11 creates a conflict window at 10-15 | "launch" lasts to 25+ (57% of 18-24 at home) |
| (d) Household overlap | - | many 25-45 parents with a 13-15 child also have a younger child [E; qualitative, no hard figure found] | rarely inside the band |

Recommendation:
1. Core scope: 0-12, built for the 25-45 parent. This is where the buyer rule, proven pricing and the largest parent pool coincide.
2. Preteen edge: include ages 10-12 explicitly (first phone, first social media, screen negotiations). Common Sense data puts the first phone at ~11, so the teen conflict starts inside the 0-12 band. This captures much of the teen demand without breaking the buyer rule.
3. Optional later module for 13-15: the "Class 5 Road Test" idea (independence readiness, driving, phone/social media contracts, money, curfews). Position it as an add-on for the same household, aimed at the 25-45 parent who already has a younger child. Evidence supporting it: license rate fell to ~25% at 16, parent worry is 89%, and independence arrives later, so parents need a longer runway. Evidence against going bigger: weak pricing evidence for teen skills products, and clinical topics (depression 33-40% persistent sadness) require referral safeguards.
4. Skip 16-18 for the hackathon. Buyer age fit is poor, the spend moves to admissions/clinical, and the product would need legal/medical content depth.
5. Hackathon framing: "0-12 now, 13-15 pathway next" lets the demo show a roadmap without testing an unproven segment.

Open items to firm up before a final decision: Census/IPUMS parent-age microdata; Kazakhstan living-arrangement data; NCES share of freshmen living away from home; a parents-of-teens willingness-to-pay survey of your own (a 20-person interview round would do).

## Sources (URLs cited above)
- Census press release: https://census.gov/newsroom/press-releases/2024/families-and-living-arrangements.html
- Census story: https://www.census.gov/library/stories/2024/05/living-arrangements.html
- Eurostat: https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250923-1
- Pew (Jan 2024): https://www.pewresearch.org/social-trends/2024/01/25/financial-help-and-independence-in-young-adulthood/
- CDC YRBS 2023 / 2025: https://www.cdc.gov/yrbs/results/2023-yrbs-results.html ; https://www.cdc.gov/mmwr/volumes/75/su/su7501a4.htm
- Surgeon General: https://surgeongeneral.gov/ymh-social-media
- Pew (Apr 2025 teens/mental health): https://alpha.pewresearch.org/pewresearch-org/wp-content/uploads/sites/20/2025/04/PI_2025.04.22_teens-social-media-mental-health_REPORT.pdf
- Common Sense: https://www.commonsensemedia.org/research/the-2026-common-sense-media-census-tech-and-media-use-by-tweens-and-teens
- Life360: https://www.life360.com/press/life360-reports-record-q4-and-fy-2024-results
- Fortune on Good Inside: https://fortune.com/2026/03/02/inside-dr-becky-kennedys-34-million-parenting-empire/
- NCES: https://nces.ed.gov/fastfacts/display.asp?id=51
- OJJDP NISMART: https://www.ojp.gov/sites/ojp/files/archives/html/ojjdp/nismart/04/ns4.html
- NCHS/BGSU: https://cdc.gov/nchs/blog/posts/2025/06/the-rising-age-of-motherhood-in-the-united-states.html ; https://www.bgsu.edu/ncfmr/resources/data/family-profiles/mean-age-mother-first-birth-fp-26-12.html
