# Stress test results

| Levers | Pessimistic value | Base value |
|---|---|---|
| Paid CAC $ (Adapty median cost per payer $43-82; 120 = 2x worse) | 120 | 60 |
| Share of payers arriving free (invites, referrals, gifts) | 0.05 | 0.15 |
| Renew after the $9.99 intro month | 0.4 | 0.5 |
| Monthly churn after first renewal | 0.2 | 0.14 |
| Refunds on first charge | 0.06 | 0.045 |
| AI + infra $ per active household / month | 2.0 | 1.2 |
| Price per 4 weeks after intro (pessimistic = forced discount) | 19.99 | 24.99 |

**32 of 128 combinations have LTV/CAC > 1.**

All 7 pessimistic: LTV $38 vs blended CAC $116 → LTV/CAC **0.33** (loses money on every paid customer).

## All pessimistic except ONE lever at base

| Lever kept at base | LTV | Blended CAC | LTV/CAC | Works? |
|---|---|---|---|---|
| paid_cac | $38 | $58 | 0.65 | ❌ |
| organic_share | $38 | $104 | 0.37 | ❌ |
| r1 | $46 | $116 | 0.40 | ❌ |
| churn | $50 | $116 | 0.44 | ❌ |
| refund | $38 | $116 | 0.33 | ❌ |
| ai | $40 | $115 | 0.35 | ❌ |
| renew_price | $47 | $116 | 0.41 | ❌ |

## All pessimistic except TWO levers at base (only combinations that work)

| Levers kept at base | LTV/CAC | Payback |
|---|---|---|

## Which levers matter most (average LTV/CAC gain when moved from pessimistic to base)

| Lever | Avg gain |
|---|---|
| paid_cac | +0.51 |
| churn | +0.22 |
| renew_price | +0.16 |
| r1 | +0.15 |
| organic_share | +0.08 |
| ai | +0.05 |
| refund | +0.00 |

## Break-even thresholds (everything else pessimistic)

- **paid_cac** must reach **35** (LTV/CAC 1.09)
- **organic_share** must reach **0.7** (LTV/CAC 1.01)
- r1 alone can't fix it (even 100% renewal after month 1 isn't enough with 20%/mo churn and $120 CAC)

### Stress A: pessimistic organic, refunds, AI cost; price $24.99
LTV $77 · blended CAC $58 · LTV/CAC **1.31** · payback 10 mo · peak burn $1.9M

| Year | Ads | Payers (end) | Revenue | ARR | P/L | Cumulative |
|---|---|---|---|---|---|---|
| Y1 | $100K | 754 | $70K | $145K | $-194K | $-194K |
| Y2 | $400K | 3,121 | $358K | $612K | $-310K | $-504K |
| Y3 | $1.0M | 7,977 | $1.0M | $1.6M | $-463K | $-967K |
| Y4 | $2.0M | 16,200 | $2.2M | $3.2M | $-568K | $-1.5M |
| Y5 | $3.0M | 24,901 | $3.8M | $5.0M | $-369K | $-1.9M |

### Stress B: + price forced down to $19.99
LTV $61 · blended CAC $58 · LTV/CAC **1.05** · payback 18 mo · peak burn $3.1M

| Year | Ads | Payers (end) | Revenue | ARR | P/L | Cumulative |
|---|---|---|---|---|---|---|
| Y1 | $100K | 754 | $59K | $116K | $-205K | $-205K |
| Y2 | $400K | 3,121 | $299K | $490K | $-366K | $-570K |
| Y3 | $1.0M | 7,977 | $850K | $1.3M | $-628K | $-1.2M |
| Y4 | $2.0M | 16,200 | $1.8M | $2.6M | $-933K | $-2.1M |
| Y5 | $3.0M | 24,901 | $3.1M | $4.0M | $-1.0M | $-3.1M |
