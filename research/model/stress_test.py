"""
Stress test: which combinations of pessimistic assumptions still make money?

For each lever we take a PESSIMISTIC and a BASE value (benchmark-anchored, see
docs/research/unit-economics-benchmarks.md) and run every combination (2^7 = 128).

A combination "works" if LTV/CAC > 1 (each customer returns more than they cost to acquire,
after fees, refunds, AI, servers, support and free-user AI).
We also report the ad spend needed per year just to cover a lean fixed-cost base,
and a disciplined 5-year plan (ads only scale while payback <= 12 months).

Run: python model/stress_test.py  -> model/stress_output.md
"""
import itertools
import sys
from financial_model import Scenario, ltv, simulate

sys.stdout.reconfigure(encoding="utf-8")

LEVERS = {  # name: (pessimistic, base, description)
    "paid_cac":      (120, 60,   "Paid CAC $ (Adapty median cost per payer $43-82; 120 = 2x worse)"),
    "organic_share": (0.05, 0.15, "Share of payers arriving free (invites, referrals, gifts)"),
    "r1":            (0.40, 0.50, "Renew after the $9.99 intro month"),
    "churn":         (0.20, 0.14, "Monthly churn after first renewal"),
    "refund":        (0.06, 0.045,"Refunds on first charge"),
    "ai":            (2.00, 1.20, "AI + infra $ per active household / month"),
    "renew_price":   (19.99, 24.99,"Price per 4 weeks after intro (pessimistic = forced discount)"),
}
NAMES = list(LEVERS)
LEAN_FIXED = 150_000  # lean team in Almaty: 3-4 people + tools + legal, per year


def make(combo):
    v = {n: LEVERS[n][i] for n, i in zip(NAMES, combo)}  # i=0 pessimistic, 1 base
    ai = v["ai"]
    return Scenario("x", paid_cac=v["paid_cac"], organic_share=v["organic_share"], r1=v["r1"],
                    churn=v["churn"], refund=v["refund"], fees=0.06, intro_price=9.99,
                    renew_price=v["renew_price"], llm_active=ai * 0.6, infra_active=ai * 0.4,
                    free_cost_per_payer=1.5 if combo[NAMES.index("ai")] == 0 else 1.0,
                    support_share=0.05, yearly_marketing=[0] * 5, yearly_fixed=[LEAN_FIXED] * 5)


def main():
    rows = []
    for combo in itertools.product([0, 1], repeat=len(NAMES)):
        s = make(combo)
        u = ltv(s)
        rows.append((combo, u))

    print("# Stress test results\n")
    print("| Levers | Pessimistic value | Base value |\n|---|---|---|")
    for n in NAMES:
        p, b, d = LEVERS[n]
        print(f"| {d} | {p} | {b} |")

    ok = [r for r in rows if r[1]["ltv_cac"] > 1]
    print(f"\n**{len(ok)} of {len(rows)} combinations have LTV/CAC > 1.**\n")

    allp = rows[0][1]
    print(f"All 7 pessimistic: LTV ${allp['gm24']:.0f} vs blended CAC ${allp['blended_cac']:.0f} → LTV/CAC **{allp['ltv_cac']:.2f}** (loses money on every paid customer).\n")

    print("## All pessimistic except ONE lever at base\n")
    print("| Lever kept at base | LTV | Blended CAC | LTV/CAC | Works? |\n|---|---|---|---|---|")
    for i, n in enumerate(NAMES):
        combo = tuple(1 if j == i else 0 for j in range(len(NAMES)))
        u = ltv(make(combo))
        print(f"| {n} | ${u['gm24']:.0f} | ${u['blended_cac']:.0f} | {u['ltv_cac']:.2f} | {'✅' if u['ltv_cac']>1 else '❌'} |")

    print("\n## All pessimistic except TWO levers at base (only combinations that work)\n")
    print("| Levers kept at base | LTV/CAC | Payback |\n|---|---|---|")
    for i, j in itertools.combinations(range(len(NAMES)), 2):
        combo = tuple(1 if k in (i, j) else 0 for k in range(len(NAMES)))
        u = ltv(make(combo))
        if u["ltv_cac"] > 1:
            print(f"| {NAMES[i]} + {NAMES[j]} | {u['ltv_cac']:.2f} | {u['payback']} mo |")

    # Lever importance: average LTV/CAC uplift when lever moves pessimistic -> base
    print("\n## Which levers matter most (average LTV/CAC gain when moved from pessimistic to base)\n")
    print("| Lever | Avg gain |\n|---|---|")
    imp = []
    for i, n in enumerate(NAMES):
        gains = [r1[1]["ltv_cac"] - r0[1]["ltv_cac"] for r0 in rows for r1 in rows
                 if r0[0][i] == 0 and r1[0][i] == 1 and all(r0[0][k] == r1[0][k] for k in range(len(NAMES)) if k != i)]
        imp.append((sum(gains) / len(gains), n))
    for g, n in sorted(imp, reverse=True):
        print(f"| {n} | +{g:.2f} |")

    # Break-even thresholds with everything else pessimistic
    print("\n## Break-even thresholds (everything else pessimistic)\n")
    base_p = tuple([0] * len(NAMES))
    for lever, rng in (("paid_cac", [x for x in range(120, 9, -5)]),
                       ("organic_share", [x / 100 for x in range(5, 96, 5)])):
        for val in rng:
            s = make(base_p)
            setattr(s, lever, val)
            if ltv(s)["ltv_cac"] > 1:
                print(f"- **{lever}** must reach **{val}** (LTV/CAC {ltv(s)['ltv_cac']:.2f})")
                break
        else:
            print(f"- {lever}: no break-even in range")
    # retention: find r1 with churn pessimistic
    for r1 in [x / 100 for x in range(40, 101, 5)]:
        s = make(base_p); s.r1 = r1
        if ltv(s)["ltv_cac"] > 1:
            print(f"- **r1 (renew after intro)** must reach **{r1:.0%}** with 20% churn"); break
    else:
        print("- r1 alone can't fix it (even 100% renewal after month 1 isn't enough with 20%/mo churn and $120 CAC)")

    # Honest pessimistic 5-year plans (CAC + retention at MEDIAN benchmarks, the rest pessimistic)
    from financial_model import simulate, fmt
    common = dict(organic_share=0.05, refund=0.06, llm_active=1.2, infra_active=0.8, free_cost_per_payer=1.5,
                  r1=0.50, churn=0.14, paid_cac=60, intro_price=9.99, fees=0.06, support_share=0.05,
                  yearly_marketing=[100e3, 400e3, 1e6, 2e6, 3e6], yearly_fixed=[150e3, 200e3, 300e3, 400e3, 500e3])
    for name, price in (("Stress A: pessimistic organic, refunds, AI cost; price $24.99", 24.99),
                        ("Stress B: + price forced down to $19.99", 19.99)):
        s = Scenario(name, renew_price=price, **common)
        u = ltv(s); ys, mn = simulate(s)
        print(f"\n### {name}\nLTV ${u['gm24']:.0f} · blended CAC ${u['blended_cac']:.0f} · LTV/CAC **{u['ltv_cac']:.2f}** · payback {u['payback']} mo · peak burn {fmt(-mn)}\n")
        print("| Year | Ads | Payers (end) | Revenue | ARR | P/L | Cumulative |\n|---|---|---|---|---|---|---|")
        for i, Y in enumerate(ys):
            print(f"| Y{i+1} | {fmt(Y['mk'])} | {Y['active_end']:,.0f} | {fmt(Y['rev'])} | {fmt(Y['arr_end'])} | {fmt(Y['profit'])} | {fmt(Y['cum_cash'])} |")

if __name__ == "__main__":
    main()
