# US family structure, divorce and non-resident parenting: population facts for a "parenting-as-a-team" app

Compiled 2026-11-14. Audience: hackathon team building a B2C co-parenting web app for US parents aged 25-45.

**Tags:** [S] primary official source (CDC/NCHS, Census, HHS/ACF, FRED republishing Census CPS). [SEC] secondary analysis (Pew, NCFMR/BGSU, Child Trends, NBER, IRP Wisconsin, journals). [E] estimate, derived by me or a non-authoritative source. Every number has a URL in the row or in the Sources section (S1...).

## Access and verification notes (read first)

- **census.gov blocked all fetches (HTTP 403)**, including press releases, P60-285, P20-587, CH-1 and the AFCARS dashboards on acf.gov. Census numbers below therefore come from three routes. (a) Search snippets of census.gov pages. (b) FRED, which republishes Census CPS tables and was fetchable. (c) Mirrors and secondary analyses (NCFMR, OJJDP, Statista, N-IUSSP). Each is labelled.
- **Not verified against the primary PDF:** Census P60-285 (custodial parents, 2022) figures. They come from secondary pages that cite the report. The Census report page confirms only that the report exists and uses the CPS Child Support Supplement.
- **Not found:** Census 2024 and 2025 headline percentages of children living with two parents, mother only, father only and neither parent. The latest I could confirm are 2023 (and NCFMR's 2025 CPS profile, which uses a different definition).
- **Not found:** the share of divorces that involve minor children (CDC does not collect it), a national estimate of children with zero contact with a non-resident parent, and the P60-285 sections on joint custody, visitation and health insurance.
- The user-supplied figure "~25% / 18.3M children without a father" was not confirmed as 18.3M. The Census-based figure is about 19M children (about 25%) in 2023, with a definition that matters (see 5.2).

---

## 1. Divorce and marriage

### 1.1 CDC/NCHS NVSS provisional counts and crude rates [S]

| Year | Marriages | Marriage rate per 1,000 pop. | Divorces + annulments (reporting states) | Divorce rate per 1,000 pop. (reporting states) |
|---|---|---|---|---|
| 2024 | 2,128,446 | 6.3 | 662,950 | 2.3 |
| 2023 | 2,041,926 | 6.1 | 672,502 | 2.4 |
| 2022 | 2,065,905 | 6.2 | 673,989 | 2.4 |
| 2021 | 1,985,072 | 5.1 | 695,509 | 2.5 |
| 2019 | 2,015,603 | 6.9 | 746,971 | 2.7 |
| 2000 | 2,315,000 | 8.2 | 944,000 | 4.0 |

- Source (extracted from the PDF text): S1 (https://www.cdc.gov/nchs/data/dvs/marriage-divorce/national-marriage-divorce-rates-00-24.pdf). The FastStats page confirms the 2023 values (2,041,926 marriages, 6.1; 672,502 divorces, 2.4; "45 reporting States and D.C."): https://www.cdc.gov/nchs/fastats/marriage-divorce.htm.
- **States that do not report divorces (2017-2024 footnote):** California, Hawaii, Indiana, Minnesota and New Mexico. The divorce rate denominator is only the population of the 45 reporting states plus DC (about 284.4M of about 340.1M in 2024). The national divorce **count is therefore an undercount**, because California alone is about 12% of the US population.
- The CDC crude divorce rate has fallen from 4.0 per 1,000 (2000) to 2.3 (2024). The marriage rate fell from 8.2 to 6.1-6.3, with a post-pandemic rebound.

### 1.2 Refined divorce and marriage rates (ACS, NCFMR at Bowling Green) [SEC]

| Measure | Value | Source |
|---|---|---|
| Refined divorce rate 2023 | **14.4 per 1,000 married women 15+** (+/-0.3); 992,677 women divorced in the prior 12 months | https://www.bgsu.edu/ncfmr/resources/data/family-profiles/FP-24-26.html |
| Refined divorce rate 2024 | **14.2**; 986,810 women divorced | S2 FP-25-31 PDF (https://www.bgsu.edu/content/dam/BGSU/college-of-arts-and-sciences/NCFMR/documents/FP/fp-25-31-geo-var-div-rt-2025-09-18-kkp-cms.pdf), text extracted |
| Refined divorce rate 2022 | 14.6; 989,518 women | FP-24-26 (link above) |
| Peak and trend | about 22.6 around 1980; 20.5 in 2008; 14.4 in 2023 | Pew: https://www.pewresearch.org/short-reads/2025/10/16/8-facts-about-divorce-in-the-united-states.md |
| Gray divorce (50+) 2023 | 10.3 per 1,000 married women 50+ (3.9 in 1990; 11.0 in 2008) | Pew, same page |
| Refined marriage rate 2024 | **31.2 per 1,000 unmarried women 15+** (stable); 2,390,482 women married (2,361,030 in 2023) | https://www.bgsu.edu/ncfmr/resources/data/family-profiles/FP-25-30.html |
| Marriage-to-divorce ratio 2024 | 2.42 (2,390,482 / 986,810) | search snippet of https://www.bgsu.edu/ncfmr/resources/data/family-profiles/fp-25-32.html |

- **Why CDC and ACS differ:** CDC counts events in 45 states and DC only. ACS counts women who report divorcing in the last 12 months nationally. About 1.0M divorce events a year [E] is the better national figure. Pew's "over 1.8 million divorces in 2023" (same Pew page) is not reconciled with these numbers and is likely counting individuals, not events. Do not quote it as divorces.
- **Divorce is not "50% of marriages".** Pew: about one-third of ever-married adults have divorced, and "this does not mean 33% of marriages end in divorce". Share of ever-married adults who divorced by marriage decade: 42% (1960s), 47% (1970s), 46% (1980s). Source: Pew link above.

### 1.3 Duration of marriage at divorce [SEC] (Pew, 2023 ACS data)

- Median length of marriages ending in divorce: **12 years in 2023** (10 in 2008).
- 16% of divorces occur within 5 years, 24% at 5-9 years, 22% after 25+ years. About four in ten happen in the first decade.
- Source: https://www.pewresearch.org/short-reads/2025/10/16/8-facts-about-divorce-in-the-united-states.md
- Implication: the modal divorcing couple with minor kids has been together 5-15 years, matching the 25-45 parent age band.

### 1.4 Share of divorces with minor children, and children affected per year

| Item | Value | Tag and source |
|---|---|---|
| Share of divorces involving minor children | **Not published nationally**; CDC no longer collects it | gap |
| Proxy: recently divorced adults (18-55) with at least one resident minor child | 41% in 2022 (40% in 2012; 39% in 2020). Women 52%, men 30%. Undercounts, because ACS misses non-resident children | [SEC] https://www.bgsu.edu/ncfmr/resources/data/family-profiles/FP-24-13.html |
| Children experiencing parental divorce before adulthood | "Nearly a third of American children" | [SEC] NBER WP 33776 (Johnston, Jones, Pope, May 2025), abstract: https://www.nber.org/system/files/working_papers/w33776/w33776.pdf |
| Children affected per year (older, widely cited) | "over 1 million" per year (early 2000s Census-attributed) | [E] weak: https://www.heritage.org/node/19572 |
| Children affected per year, my derivation | about 0.99M divorces x 41% with resident kids x about 1.7 children = **about 0.7M children, plausibly 0.7-1.0M** | [E] derived; the 1.7 children per divorce is an assumption. Historical average was 0.91 children per divorce in 1995 (Stevenson and Wolfers via Newsweek, https://newsweek.com/id/161233) |

- NBER also finds that after divorce parents move apart, household income falls, and mothers typically take the children (the paper says mothers "live with" the children). It is useful as a framing caveat: outcomes depend on income and parent proximity, so co-parenting logistics matter.

---

## 2. Single parents and children's living arrangements

### 2.1 Counts of one-parent families with own children under 18 (Census CPS ASEC, via FRED) [S]

| Year | Total one-parent families | Mother-only | Father-only | Father share |
|---|---|---|---|---|
| 2025 | 10,239K | 7,666K | 2,574K | 25% |
| 2024 | 9,927K | 7,330K | 2,597K | 26% |
| 2023 | 9,767K | 7,291K | 2,476K | 25% |
| 2022 | 10,579K | 7,906K | 2,673K | 25% |

- Source: https://fred.stlouisfed.org/data/TTLOPFWCU (total), https://fred.stlouisfed.org/data/OPFWCUMO (mother), https://fred.stlouisfed.org/series/OPFWCUFO (father). They are Census CPS "Families and Living Arrangements" Table FM-1. Census "National Single Parent Day" also reports 9.8M one-parent households in 2023 (7.3M mother-only, 2.5M father-only), seen as a search snippet of https://www.census.gov/newsroom/stories/single-parent-day.html. The 2023 dip is a CPS weighting artifact, so treat 2022-2025 as about 10M.
- The one-parent total includes cohabiting-but-unmarried parents who are counted as "one parent" only if the partner is not a parent. Never-married mothers are a large part (2.2).

### 2.2 Marital status of single parents [S, 2022 data; via secondary quote of Census Table FG6]

| | Never married | Divorced | Other (separated / widowed) |
|---|---|---|---|
| Single mothers | 51% | 29% | about 20% |
| Single fathers | 41% | 38% | about 21% |

- Source: Census CPS 2022, quoted in https://fathercraft.com/?p=32062 (search result). Census's own page: https://census.gov/data/tables/2022/demo/families/cps-2022.html (Table FG6). The Census graphic https://census.gov/library/visualizations/2022/comm/marital-status-one-parent-family.html notes that "separated" includes "married, spouse absent" and that a separated-mother share was revised, so do not quote a separated percentage. The FG6 2023-2025 values were not retrievable.
- Share maintained by mothers: about 80% (Census 2022 release, 10.9M one-parent family groups). Implication: roughly half of single parents were never married (so the "divorce" framing excludes them).

### 2.3 Children's living arrangements

| Measure | Value | Tag and source |
|---|---|---|
| Children living with two parents, 2023 | **71.1%** (includes married, cohabiting and stepparent households) | [S] CPS table CH-1 as summarized by OJJDP: https://www.ojjdp.gov/ojstatbb/population/qa01201.asp?qaDate=2023 (search snippet; fetch failed) |
| Children with a single mother, 2023 | **about 15.09M** (about 20.5%) | [SEC] Statista citing Census: https://statista.com/statistics/252847/number-of-children-living-with-a-single-mother-or-single-father/. % is my calc using 73.7M children (Census 2023 press: https://census.gov/newsroom/press-releases/2023/children-families-living-arrangements.html) |
| Children with a single father, 2023 | **about 3.05M** (about 4.1%) | same Statista, [E] % |
| Neither parent, 2023 | about 4% | [E] residual (100 - 71.1 - 20.5 - 4.1 = 4.3). Matches Census 2022 childstats: 70/22/5/4 (https://www.childstats.gov/americaschildren23/family1.asp, snippet) |
| 2022 (ChildStats/Census CPS) | 70% two parents; 22% mother only; 5% father only; 4% neither | [S] snippet, same ChildStats URL |
| 2025 (NCFMR on CPS ASEC, biological definition) | 65% two biological/adoptive parents (94% married, 6% cohabiting); **21% single parent** (86% mothers, 14% fathers); **10% stepfamily** (60% married, 40% cohabiting) | [SEC] https://www.bgsu.edu/ncfmr/resources/data/family-profiles/childrens-family-structure-2025-fp-26-06.html. Remaining 4% unaccounted in the page |
| By race, 2025, two biological parents | Asian 86%, White 73%, Black 37% | [SEC] same NCFMR page (snippet) |

- Definition warning: Census "two parents" = any two co-resident parents including stepparents and cohabiting. NCFMR's 65% counts only two biological/adoptive parents. Do not mix the two.

### 2.4 Poverty and income of single-parent families (Census CPS ASEC, 2024)

| Measure | Value | Tag and source |
|---|---|---|
| Poverty, married-couple families with children under 18 | **4.8% (2024)**, 4.7% (2025) | [S] FRED/Census: https://fred.stlouisfed.org/data/HSTPOVARWCU18YMCFBPP |
| Poverty, female-householder (no spouse) families with children under 18 | **30.8% (2024)**, 29.5% (2025); 31.6% (2023) | [S] FRED/Census: https://fred.stlouisfed.org/data/HSTPOVARWCU18YFWFHNSPBPP |
| Poverty, all female-householder families, with or without children | 21.8% (2024) | [S] via https://www.poverty.ucdavis.edu/faq/how-does-family-structure-relate-poverty and https://usafacts.org/answers/what-is-the-us-poverty-rate/country/united-states/ |
| Poverty, male-householder families, with or without children | 11% (2024) | [SEC] UC Davis page above |
| Median household income 2024, female householder, no spouse | $60,440 | [SEC] https://wiareport.com/2025/09/the-persistent-gender-gap-in-median-income-in-the-united-states |
| Median income, married-couple families 2024 | about $128,700 | [SEC] same WIA report |
| Median income, male householder no spouse | WIA reports $83,260 | [E] doubtful: the figure coincides with the all-household 2019 median, so verify in Census HINC-02 (https://www.census.gov/data/tables/time-series/demo/income-poverty/cps-hinc/hinc-02.html) before use |

- Primary source: *Poverty in the United States: 2024* (P60-287) and *Income in the United States: 2024* (P60-286, https://www.census.gov/library/publications/2025/demo/p60-286.html). FRED rows are a Census republication.
- Divorced adults 18-64: median household income $84,900 vs $118,600 for first-married and $114,600 for remarried; median wealth $98,700 vs $326,900 and $329,100 [SEC]. Pew link in 1.3.

---

## 3. Custodial and non-custodial parents (Census P60-285, "Custodial Parents and Their Child Support: 2022", published 2025)

Note: the report was retitled from "Custodial Mothers and Fathers..." to "Custodial Parents...". Official page: https://www.census.gov/library/publications/2025/demo/p60-285.html (403 on fetch). PDF: https://www2.census.gov/library/publications/2025/demo/p60-285.pdf (403). The figures below are from secondary pages quoting the report and are **not primary-verified**: https://www.aecf.org/blog/child-support-statistics, https://www.modernfamilylaw.com/resources/average-child-support-payment/ and https://legalhelp.us/child-support-statistics-by-gender-custody-orders-and-payments/ (all search snippets).

| Measure (2022) | Value | Tag |
|---|---|---|
| Custodial parents (parents living apart from the child's other parent) | **13.9 million** (report text); one secondary source says 12.9M, probably a typo | [S] via secondary |
| Mothers vs fathers | 78.2% mothers (about 10.9M) / 21.8% fathers (about 3.0M) | [S] via secondary |
| Custodial parents with a legal child support agreement | **37.3%** (55.1% in 2003) | [S] via secondary |
| Custodial parents supposed to receive support (formal or informal) | about 4.7M | [S] via secondary |
| Received full amount owed | 49.5% overall; mothers 49.0%, fathers 52.5% | [S] via secondary |
| Partial payment / nothing | 26% / 24.5% overall; nothing: mothers 22.2%, fathers 35.9% | [S] via secondary; the gender split does not weight exactly to the overall figure, so treat as approximate |
| Total due vs received | $29.9B due; $19.2B received | [S] via secondary |
| Average due per year (among those with agreements) | $6,390 (about $533/month) | [S] via secondary |
| Average received per year | $4,106 (about $342/month) | [S] via secondary |

- **Definitions:** the CPS Child Support Supplement covers parents with own children under 21 whose other parent lives elsewhere. It includes never-married parents. "Custodial" is the Census definition (child lives with the parent more than half of the time, or the parent has primary custody), and so it understates shared 50/50 families.
- **Joint custody / visitation / non-custodial health insurance in the 2022 report:** not retrievable. Earlier reports in the P60 series (e.g. P60-269, 2017 data: https://census.gov/library/publications/2020/demo/p60-269.html) covered visitation and noncash support, but I could not fetch them. Treat as a gap and re-check the PDF tables manually.
- **Shared physical custody after divorce (national):** share of divorced parents with shared physical custody rose from **13% before 1985 to 34% in 2010-2014** (CPS-CSS, 8 waves). Meyer, Carlson, Alam (2022), *Demographic Research*: https://ideas.repec.org/a/dem/demres/v46y2022i38.html [SEC]. It covers divorce only, not never-married separation.
- **Wisconsin court records:** shared placement went from about 14% of divorces involving children (early 1990s) to about 50% in 2010 (IRP, Meyer, Cancian and Cook), with "shared" defined by a time threshold of about 25-30%, so it is not 50/50. Wisconsin is among the highest-prevalence states. National growth was slower. Sources: https://irp.wisc.edu/research1/childsup/cspolicy/placeoutcomes-sum.htm and https://www.irp.wisc.edu/publications/sr/pdfs/sr83.pdf (search snippets) [SEC].

---

## 4. Non-resident parent involvement

### 4.1 How many fathers live apart from children

| Measure | Value | Source |
|---|---|---|
| Men 15-44 living apart from one or more biological/adopted children, NSFG 2006-10 | **12% (7.5M)** (38% or 23.5M live with children; about 5% have both) | [S] NHSR No. 71, Jones and Mosher 2013 (text extracted from https://www.cdc.gov/nchs/data/nhsr/nhsr071.pdf) |
| Fathers with children 18 or under living apart | 27% (11% from some, 16% from all) | [SEC] Pew 2011 on NSFG 2006-08: https://www.pewresearch.org/social-trends/2011/06/15/a-tale-of-two-fathers/ |
| Fathers with children 17 or under living apart, NSFG 2017 | **24%** from at least one child; 17% from all. Black fathers 47% (36% from all), Hispanic 26%, White 17%. No 4-year degree 28%, degree 8% | [SEC] Pew 2018: https://www.pewresearch.org/short-reads/2018/01/08/most-dads-say-they-spend-too-little-time-with-their-children-about-a-quarter-live-apart-from-them/ |
| Fathers with at least one non-resident minor child, NSFG 2017-19 | about 23% (27% in 2006-08) | [SEC] Child Trends write-up via search; also NCFMR FP-22-22, pooled 2015-19: 78% co-resident only, 12% non-resident only, 10% both: https://www.bgsu.edu/ncfmr/resources/data/family-profiles/graham-coresidential-fathers-minor-children-fp-22-22.html |
| Children living apart from father (Pew 2011) | 11% in 1960 to 27% in 2010 (mother: 4% to 8%) | [SEC] Pew 2011 link |

- Pew 2023 "Key facts about dads" does **not** include living-apart or contact figures. It has time-use data only (dads with kids under 18 at home: 1.02 hours/day caregiving, ATUS 2021) and 56% of married or cohabiting dads feel judged by their spouse or partner at least sometimes (vs 49% of mothers): https://www.pewresearch.org/short-reads/2023/06/15/key-facts-about-dads-in-the-us/.

### 4.2 How often non-resident fathers see their children (Pew 2011, NSFG 2006-08) [SEC]

| Visits in the past year | Share of non-resident fathers |
|---|---|
| More than once a week | about 22% |
| 1-4 times a month | 29% |
| Several times a year | 21% |
| Not at all | **27%** |

- Phone/email contact: 41% several times a week; 28% at least monthly; 31% less than monthly.
- Contact by race/ethnicity, at least monthly: Hispanic 32%, white 59%, Black 67%. By education: 41% without HS diploma vs 57% with.
- Source: https://www.pewresearch.org/social-trends/2011/06/15/a-tale-of-two-fathers/ (and the fetched markdown version).
- Caveat: data are from 2006-08 and from the father's report, which fathers may over- or under-state. Pew's 2011 figure for "no visit in the past year" is the best national estimate of **no contact**, but it is for fathers only and 15+ years old.

### 4.3 NSFG father involvement in the last 4 weeks [S] (Jones and Mosher, NHSR 71, NSFG 2006-2010)

| Activity | Resident fathers | Non-resident fathers |
|---|---|---|
| Children under 5: played, **every day** | 81% (plus 18% several times a week) | 10% daily + 29% several times a week; **37% not at all** |
| Under 5: ate meals/fed, every day or several times a week | 96% | 30% (several times a week or more) |
| Under 5: bathed/dressed/diapered, daily or several times a week | 90% | 31% (several times a week or more) |
| Under 5: read to, several times a week or more | 60% | 23% |
| Ages 5-18: ate meals together, every day | 66% (1.4% not at all) | 2.9% (**53% not at all**) |
| Ages 5-18: helped with homework, every day | 30% (14% not at all) | 6.0% (**69% not at all**) |
| Ages 5-18: talked about the day, every day | 65% | 16% (37% not at all) |
| Ages 5-18: took to or from activities, every day | 21% (15% not at all) | 3.9% (71% not at all) |
| "Doing a very good job" as a father (self-rating) | 44% | 21% (24% of non-resident fathers say "not very good" or "bad") |

- Source: https://www.cdc.gov/nchs/data/nhsr/nhsr071.pdf (text extracted from the PDF). Key statistics table (nonresident fathers, several times a week or more): https://cdc.gov/nchs/nsfg/key_statistics/f.htm. For ages 5-18: homework 8.2% (2002) to 13.6% (2006-10); talked about day 26.4% to 35.7%; the page says CDC cannot update these because comparable questions are no longer collected.
- Within non-resident fathers, those neither married nor cohabiting were more involved with visiting than those cohabiting or married to another partner (e.g. 38% had not eaten meals with the children, vs 61% of married or cohabiting fathers). Fathers' new partnership and fertility reduce contact, so involvement tracks the father's life stage, not only attitude.
- Sample: 10,403 men aged 15-44; non-resident n = 410 (children under 5) and 1,075 (ages 5-18).

### 4.4 Co-parenting after separation (best evidence)

- Shared physical custody: 34% of divorced parents with children (2010-14), up from 13% (Meyer et al., 3 above) [SEC].
- Non-resident father contact: about 22% see the child weekly or more, about 51% monthly or more, 27% no visits in the past year [SEC] (4.2).
- Child support: only 37.3% have a legal agreement, and about half of those owed get full payment [S via secondary] (3).
- No national statistical series on "co-parenting quality" (communication, conflict) exists in the official sources reviewed. This is a gap and also a product opportunity.

---

## 5. "Absent" parents, foster care and grandparent caregivers

### 5.1 Language and framing

Official definitions differ. "Father-absent" in Census-based reports means no biological, step or adoptive father in the household. It does not mean no contact, no involvement or "abandonment". Avoid "fatherless" or "abandoned" framing in product copy.

### 5.2 Children living without a father or mother

| Measure | Value | Source |
|---|---|---|
| Children (0-17) in a household with no biological, step or adoptive father, 2023 | **about 19 million, about 25%** (about 85% of them live with their mother). By group: White 20%, Hispanic 29%, Black 50%. Up from 11% in 1960 | [SEC] N-IUSSP (Chamie, Jan 2025) citing Census CH-1: https://www.niussp.org/family-and-households/americas-single-parent-households-and-missing-fathers/ |
| "18.3M / 25%" figure | Not confirmed. Older Census versions give about 18-19M (2020-2022 CPS), same definition. Use "about 19M (2023) of whom about 15M live with their mother only" | [E] |
| Children who live with neither parent, 2022 | 4% (about 3M) | [S] ChildStats snippet |

### 5.3 Foster care (AFCARS, HHS/ACF Children's Bureau)

| Measure | Value | Source |
|---|---|---|
| In care on last day FY2022 | **368,530** (-5.9% vs FY2021: 391,641); peak 437,010 in FY2017 | [SEC] CWLA summary of AFCARS #30: https://www.cwla.org/2022-afcars-data-show-decreases-in-foster-care/ |
| Entries FY2022 / exits | 186,602 entries (lowest on record) / 201,372 exits; reunification 46%; adoptions 53,665 (27% of exits) | same CWLA |
| In care FY2023 | about 343,077; more than 175,000 entered; adoptions 50,193 | [SEC] https://fosterlove.com/blog/how-many-kids-are-in-foster-care-2025/ (search snippet; weak, verify in the ACF AFCARS report) |
| Entries FFY2025 | **175,008**; neglect **55%** (95,790); **abandonment 5%** (7,938); caretaker drug use 29% (51,603) | [S] AFCARS Dashboard FFY2025 print version: https://acf.gov/sites/default/files/documents/cb/2025-afcars-dashboard-printable.pdf (search snippet; PDF blocked) |
| Abandonment on earlier dashboards | 5% (8,162) on the 2023 dashboard; 5% (7,910) on the 2024 dashboard | [S] https://acf.gov/sites/default/files/documents/cb/2023-afcars-dashboard-printable.pdf and https://acf.gov/sites/default/files/documents/cb/2024-afcars-dashboard-printable.pdf (snippets) |
| Removal reasons FY2022 (% of entries; categories overlap) | neglect 62%, parental drug abuse 33%, caretaker inability to cope 13%, physical abuse 13%, housing 11%, parental incarceration 6%, parental alcohol abuse 6%, sexual abuse 4% (abandonment not shown in this source) | [SEC] CWLA link above |
| Parental drug use at entry | 33-36% of entries in 2017-2023; 2023 by state under 1% to 60%. 27% of those had no other listed reason; of the rest, 81% neglect, 25% inadequate housing, 13% parental incarceration | [SEC] Child Trends: https://www.childtrends.org/publications/parental-drug-use-foster-care-entries |
| Parental alcohol/drug abuse as removal circumstance, 2025 | 38% overall (34% age 1+, 55.1% under age 1) | [S] NCSACW (HHS): https://ncsacw.acf.gov/research/child-welfare-statistics/interactive-statistics-series/ (snippet) |

- "Abandonment" in AFCARS is a circumstance the caseworker records (child left without arrangements for care, or the whereabouts of the parent unknown), and is a flag on a small share of foster entries. About 5% of about 175K entries is about 8,000 children a year. It is **not** a measure of divorced or separated parents who are less involved. Foster care is a different population (child welfare involvement), and about 0.2% of all US children enter care each year [E: 175K / 73.7M].

### 5.4 Safe haven relinquishments

- National Safe Haven Alliance: **5,444 infants** "saved" since 1999 (unofficial cumulative count; the 2021 impact report said 4,505 surrendered vs 1,604 illegally abandoned): https://www.nationalsafehavenalliance.org (and https://www.nationalsafehavenalliance.org/_files/ugd/1c34fd_ce89293fdf7e4338988a40e05621314c.pdf). Annual counts are small (73 in 2021) [SEC]. No official national federal database exists. This is irrelevant for the target segment's size.

### 5.5 Grandparents raising grandchildren

- Census (ACS Table B10050): about **32.7%** of grandparents living with grandchildren under 18 are responsible for them (year likely 2021; Census story https://census.gov/library/stories/2024/03/grandparents-living-with-grandchildren.html, snippet). Absolute count not confirmed: a Stacker analysis of Census data gives "more than 2.2 million" grandparent caregivers [E]. The user-supplied 2.3-2.5M is not confirmed. Pull B10050 from data.census.gov to confirm.

---

## 6. Stepfamilies and cohabiting-parent families

| Measure | Value | Tag and source |
|---|---|---|
| Children living with cohabiting parents, 2023 | **about 3.2M** (2.2M in 2007) | [S] Census, search snippet of https://census.gov/newsroom/press-releases/2023/children-families-living-arrangements.html (see also https://census.gov/content/dam/Census/library/visualizations/time-series/demo/families-and-households/ad-2b.pdf) |
| Children in stepfamilies, 2025 | **10%** (9% in 2019); 60% of those with married parents, 40% with cohabiting parents | [SEC] NCFMR FP-26-06 (CPS ASEC) |
| Births to cohabiting unions (recent births, NSFG 2006-10) | 23% (14% in 2002) | [S] NHSR 71 (text extracted) |
| Divorced adults who remarried | 66% (68% of men, 64% of women); 46% of remarried divorced adults had a child with the new spouse; remarried men with a resident stepchild 9%, women 4% | [SEC] Pew 2025 link in 1.3 |
| Divorced, not remarried, living with an unmarried partner | 19% of men, 15% of women | [SEC] Pew 2025 |
| Children in same-sex couple households, 2023 | about 380,000 (0.69%) | [SEC] https://www.bgsu.edu/ncfmr/resources/data/family-profiles/fp-25-33 (snippet) |

- NCFMR counts adults who are stepparents only if they live with the child, and counts stepfamilies via the household reference (so non-resident stepparents are missed). This understates the share of children with a step-relationship, which is why the user's "% of children living with a stepparent" is best quoted as "about 10% of children (CPS 2025)".

---

## 7. Synthesis for the product

### 7.1 Size of the segment (US, about 2022-2025)

| Segment | Size | Tag and basis |
|---|---|---|
| Children under 18 | about 73.7M | [S] Census 2023 |
| Children in two-parent households (any type) | about 71% (about 52M) | [S] CH-1 2023 |
| Children in single-parent households | about 25% (about 18-19M children; about 10.0-10.2M one-parent families) | [S] CPS 2023-2025 (FRED) |
| Parents "living apart from the child's other parent" (custodial) | **about 13.9M** (about 78% mothers) | [S] via secondary, P60-285, 2022 |
| Non-resident parents (mostly fathers) | roughly the same order, **about 10-14M** [E]. NSFG 2006-10 found 7.5M men aged 15-44 alone, and 24% of fathers with kids under 18 in 2017 live apart from at least one child | [E] derived from NSFG and Pew; not an official count, and some are non-resident from a different child's household |
| **"Co-parenting after separation" universe (both parents, two households)** | **about 20-28M parents** [E] (13.9M custodial + about 6-14M non-resident, minus overlap) | [E] |
| Of whom 25-45 (target band) | most, perhaps 70%+ [E]; no official age split found | [E] |
| Newly divorcing each year | about 1.0M divorce events; about 0.7-1.0M children affected | [E] (1.2, 1.4) |
| Stepfamily children | about 10% of children (about 7M) | [SEC] |
| Cohabiting-parent children | about 3.2M | [S] |

### 7.2 How many separated parents still co-parent actively (best evidence)

- **Contact:** about half of non-resident fathers see their children at least monthly (22% weekly+, 29% 1-4x/month), and about 27% not at all in a year (Pew/NSFG 2006-08). Older and small-sample, but it is the best national figure. NSFG 2006-10 shows involvement in daily tasks is low: only about 6% of non-resident fathers help with homework daily, 3% eat meals daily with school-age children.
- **Shared custody:** about one third (34%) of divorced parents have shared physical custody (2010-14), a rising trend (Meyer et al.). Wisconsin shows about half under a broad definition, so the US value is probably 35-45% for new divorces by 2025 [E, extrapolation].
- **Financial coordination:** only 37% have a legal child support agreement, about half of those owed receive in full. About 1 in 4 of those owed receive nothing.
- **Working estimate [E]:** of about 20-28M separated parents in two households, roughly **40-50%** have regular, at least monthly cross-household parenting contact, which is about 8-14M "active co-parents" (potentially double-counting both parents of the same child). Roughly a quarter to a third have little or no contact. Treat this as a planning range, not a statistic.

### 7.3 Product implications

1. **A "Co-parent seat" for separated parents is a real, large segment.** At least 13.9M custodial parents in the US are in two-household arrangements (Census, 2022), and about 1M divorces a year feed it. The team's tooling (shared calendar, handoffs, expense split and reimbursement, school and medical records, a neutral message log) addresses the documented gaps: low child support formalization (37%), unreliable payments, and shared custody now at about one third of divorces.
2. **"Solo + village" mode for single parents** (about 10M one-parent families, 80% mother-led). Never-married parents are about half of single parents, so do not make the product assume a divorce story. Single mothers' families have about 30% poverty (vs 4.8% for married couples with kids), so free or low-cost tiers matter, and "village" features (grandparents, relatives, friends, school contacts) should be first-class. About 2.2M+ grandparents are primary caregivers [E].
3. **Respect and non-judgment.** Avoid "fatherless", "broken home" and "abandonment" language. Official "father absent" and AFCARS "abandonment" categories are not about co-parenting separated parents. Nearly a quarter of non-resident fathers rate themselves as doing a "not very good" job, and 27% had no visits in a year, so framing should be about logistics and support, not blame. Offer equal treatment of mothers and fathers (about 22% of custodial parents are fathers; fathers get the "nothing paid" rate of about 36% in the secondary-quoted data).
4. **Design for the 5-15-year-marriage parent with kids under 12** and for blended families: about 10% of children are in stepfamilies and 40% of those are with cohabiting step-couples. Roles beyond "mom" and "dad" (stepparent, partner, grandparent, other adult) are needed.
5. **Data caveats for pitch decks:** use "about 13.9M custodial parents (Census 2022)", "about 10M single-parent families", "about 1M divorces/year (ACS-based)", "71% of children live with two parents (any type), Census 2023". Do not use "50% of marriages end in divorce" or the CDC divorce count as national.

---

## Sources

**Official [S]**
- S1 CDC/NCHS provisional marriage and divorce tables 2000-2024: https://www.cdc.gov/nchs/data/dvs/marriage-divorce/national-marriage-divorce-rates-00-24.pdf
- CDC FastStats marriage and divorce (2023): https://www.cdc.gov/nchs/fastats/marriage-divorce.htm
- NCHS NHSR No. 71, Jones and Mosher (2013): https://www.cdc.gov/nchs/data/nhsr/nhsr071.pdf
- NSFG key statistics, fathers: https://cdc.gov/nchs/nsfg/key_statistics/f.htm
- Census, Custodial Parents and Their Child Support: 2022 (P60-285): https://www.census.gov/library/publications/2025/demo/p60-285.html
- Census, Income in the United States: 2024 (P60-286): https://www.census.gov/library/publications/2025/demo/p60-286.html
- Census CPS families tables 2022 and 2023: https://census.gov/data/tables/2022/demo/families/cps-2022.html, https://census.gov/data/tables/2023/demo/families/cps-2023.html
- Census press release (2023) on children and living arrangements: https://census.gov/newsroom/press-releases/2023/children-families-living-arrangements.html
- Census National Single Parent Day: https://www.census.gov/newsroom/stories/single-parent-day.html
- Census grandparents story: https://census.gov/library/stories/2024/03/grandparents-living-with-grandchildren.html
- Census CH-1 figure: https://census.gov/content/dam/Census/library/visualizations/time-series/demo/families-and-households/ch-1.pdf
- ChildStats (America's Children 2023): https://www.childstats.gov/americaschildren23/family1.asp
- OJJDP table (Census CH-1 2023): https://www.ojjdp.gov/ojstatbb/population/qa01201.asp?qaDate=2023
- FRED (Census CPS republished): https://fred.stlouisfed.org/data/TTLOPFWCU, https://fred.stlouisfed.org/data/OPFWCUMO, https://fred.stlouisfed.org/series/OPFWCUFO, https://fred.stlouisfed.org/data/HSTPOVARWCU18YMCFBPP, https://fred.stlouisfed.org/data/HSTPOVARWCU18YFWFHNSPBPP
- HHS/ACF AFCARS dashboards: https://acf.gov/sites/default/files/documents/cb/2023-afcars-dashboard-printable.pdf, https://acf.gov/sites/default/files/documents/cb/2024-afcars-dashboard-printable.pdf, https://acf.gov/sites/default/files/documents/cb/2025-afcars-dashboard-printable.pdf
- HHS NCSACW child welfare statistics: https://ncsacw.acf.gov/research/child-welfare-statistics/interactive-statistics-series/

**Secondary [SEC]**
- Pew, 8 facts about divorce (2025): https://www.pewresearch.org/short-reads/2025/10/16/8-facts-about-divorce-in-the-united-states.md
- Pew, A Tale of Two Fathers (2011): https://www.pewresearch.org/social-trends/2011/06/15/a-tale-of-two-fathers/
- Pew, fathers living apart (2018): https://www.pewresearch.org/short-reads/2018/01/08/most-dads-say-they-spend-too-little-time-with-their-children-about-a-quarter-live-apart-from-them/
- Pew, Key facts about dads (2023): https://www.pewresearch.org/short-reads/2023/06/15/key-facts-about-dads-in-the-us/
- NCFMR (Bowling Green): FP-24-26 https://www.bgsu.edu/ncfmr/resources/data/family-profiles/FP-24-26.html; FP-25-31 (PDF above); FP-25-30 https://www.bgsu.edu/ncfmr/resources/data/family-profiles/FP-25-30.html; FP-24-13 https://www.bgsu.edu/ncfmr/resources/data/family-profiles/FP-24-13.html; FP-26-06 https://www.bgsu.edu/ncfmr/resources/data/family-profiles/childrens-family-structure-2025-fp-26-06.html; FP-22-22 https://www.bgsu.edu/ncfmr/resources/data/family-profiles/graham-coresidential-fathers-minor-children-fp-22-22.html
- Child Trends, parental drug use and foster care entries: https://www.childtrends.org/publications/parental-drug-use-foster-care-entries
- NBER WP 33776, Divorce, Family Arrangements, and Children's Adult Outcomes: https://www.nber.org/system/files/working_papers/w33776/w33776.pdf
- Meyer, Carlson, Alam (2022), Demographic Research: https://ideas.repec.org/a/dem/demres/v46y2022i38.html
- IRP Wisconsin placement outcomes: https://irp.wisc.edu/research1/childsup/cspolicy/placeoutcomes-sum.htm
- CWLA, 2022 AFCARS summary: https://www.cwla.org/2022-afcars-data-show-decreases-in-foster-care/
- N-IUSSP (Chamie, 2025): https://www.niussp.org/family-and-households/americas-single-parent-households-and-missing-fathers/
- WIA Report on median income: https://wiareport.com/2025/09/the-persistent-gender-gap-in-median-income-in-the-united-states
- UC Davis Center for Poverty and Inequality: https://www.poverty.ucdavis.edu/faq/how-does-family-structure-relate-poverty
- National Safe Haven Alliance: https://www.nationalsafehavenalliance.org

**Weak / used only for flagged [E] items:** Statista (https://statista.com/statistics/252847/number-of-children-living-with-a-single-mother-or-single-father/), fathercraft (https://fathercraft.com/?p=32062), Annie E. Casey blog (https://www.aecf.org/blog/child-support-statistics), Modern Family Law (https://www.modernfamilylaw.com/resources/average-child-support-payment/), LegalHelp (https://legalhelp.us/child-support-statistics-by-gender-custody-orders-and-payments/), Heritage (https://www.heritage.org/node/19572), Newsweek (https://newsweek.com/id/161233), fosterlove (https://fosterlove.com/blog/how-many-kids-are-in-foster-care-2025/).

## Open items to verify manually (census.gov blocked)

1. P60-285 Tables: joint custody, visitation, health insurance provided by the non-custodial parent, poverty of custodial parents.
2. Census CH-1 / FG tables for 2024-2025: two-parent, mother-only, father-only, neither parent; FG6 marital status of single parents.
3. ACS B10050 2023/2024: grandparents responsible for grandchildren (count).
4. Census HINC-02 2024: median income of male-householder families.
5. ACF AFCARS Report #31/#32: official FY2023-24 totals and "abandonment" in removal circumstances.
