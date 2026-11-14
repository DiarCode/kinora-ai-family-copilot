"""
Uniform-haircut sensitivity: make base (market-median) assumptions X% worse,
all together and one lever at a time, and see where unit economics break.

"X% worse" per lever:
  paid CAC        x (1 + X)        organic share   x (1 - X)
  renewal (r1)    x (1 - X)        monthly churn   x (1 + X)
  refunds         x (1 + X)        AI + infra cost x (1 + X)  (incl. free-user AI)
  price (renewal) x (1 - X)   <- optional: price is our decision, reported separately

Run: python model/sensitivity.py  -> model/sensitivity_output.md
"""
import sys
from dataclasses import replace
from financial_model import SCENARIOS, ltv, simulate, fmt

sys.stdout.reconfigure(encoding="utf-8")
STEPS = [0, .15, .20, .25, .33, .40, .50, .60, .67, .75]


def worse(s, x, levers, price=False):
    kw = {}
    if "cac" in levers: kw["paid_cac"] = s.paid_cac * (1 + x)
    if "organic" in levers: kw["organic_share"] = s.organic_share * (1 - x)
    if "r1" in levers: kw["r1"] = s.r1 * (1 - x)
    if "churn" in levers: kw["churn"] = min(.95, s.churn * (1 + x))
    if "refund" in levers: kw["refund"] = s.refund * (1 + x)
    if "ai" in levers:
        kw.update(llm_active=s.llm_active * (1 + x), infra_active=s.infra_active * (1 + x),
                  free_cost_per_payer=s.free_cost_per_payer * (1 + x))
    if price: kw["renew_price"] = s.renew_price * (1 - x)
    return replace(s, **kw)


ALL = ["cac", "organic", "r1", "churn", "refund", "ai"]
LABEL = {"cac": "Ad cost per customer (CAC)", "organic": "Free arrivals (referrals, invites)",
         "r1": "Renewal after intro month", "churn": "Monthly churn", "refund": "Refunds",
         "ai": "AI + server costs"}


def row(s):
    u = ltv(s)
    return u


def main():
    for base in (SCENARIOS[1], SCENARIOS[3]):
        print(f"\n# Baseline: {base.name}\n")
        print("## A. ALL six levers X% worse at the same time (price unchanged)\n")
        print("| X% worse | Paid CAC | Free arrivals | Renewal | Churn/mo | LTV (24m) | Blended CAC | LTV/CAC | Payback | Per-customer profit |")
        print("|---|---|---|---|---|---|---|---|---|---|")
        for x in STEPS:
            s = worse(base, x, ALL); u = row(s)
            ok = "✅" if u["ltv_cac"] > 1 else "❌"
            print(f"| {x:.0%} | ${s.paid_cac:.0f} | {s.organic_share:.0%} | {s.r1:.0%} | {s.churn:.1%} | ${u['gm24']:.0f} | ${u['blended_cac']:.0f} | {ok} **{u['ltv_cac']:.2f}** | {u['payback'] or '>24'} mo | ${u['gm24']-u['blended_cac']:.0f} |")

        print("\n## B. ALL six levers + price X% worse together\n")
        print("| X% worse | LTV/CAC | Payback |\n|---|---|---|")
        for x in STEPS:
            u = row(worse(base, x, ALL, price=True))
            print(f"| {x:.0%} | {'✅' if u['ltv_cac']>1 else '❌'} {u['ltv_cac']:.2f} | {u['payback'] or '>24'} mo |")

        print("\n## C. ONE lever X% worse, the rest at base (how much can each lever alone degrade?)\n")
        print("| Lever | " + " | ".join(f"{x:.0%}" for x in STEPS[1:]) + " | Breaks at |")
        print("|---|" + "---|" * (len(STEPS) - 1) + "---|")
        for lv in ALL + ["price"]:
            cells, brk = [], None
            for x in STEPS[1:]:
                s = worse(base, x, [] if lv == "price" else [lv], price=(lv == "price"))
                v = row(s)["ltv_cac"]
                cells.append(f"{v:.2f}")
            # find exact break point
            for i in range(0, 300):
                x = i / 100
                if lv in ("organic", "r1", "price") and x >= 1: break
                s = worse(base, x, [] if lv == "price" else [lv], price=(lv == "price"))
                if row(s)["ltv_cac"] <= 1:
                    brk = x; break
            name = LABEL.get(lv, "Price per 4 weeks")
            print(f"| {name} | " + " | ".join(cells) + f" | {('never (≤ −100%)' if brk is None else f'{brk:.0%} worse')} |")

        # exact break-even for "all together"
        for price in (False, True):
            for i in range(0, 100):
                x = i / 100
                if row(worse(base, x, ALL, price=price))["ltv_cac"] <= 1:
                    print(f"\n**All six levers{' + price' if price else ''} together break even at ≈ {x:.0%} worse than baseline.**")
                    break

        print("\n## D. Company-level check (same ad plan as the baseline, all six levers X% worse)\n")
        print("| X% worse | Y5 ARR | Y5 profit | 5-yr cumulative | Peak burn |\n|---|---|---|---|---|")
        for x in (0, .15, .20, .25, .33):
            s = worse(base, x, ALL); ys, mn = simulate(s)
            print(f"| {x:.0%} | {fmt(ys[-1]['arr_end'])} | {fmt(ys[-1]['profit'])} | {fmt(ys[-1]['cum_cash'])} | {fmt(-mn)} |")


if __name__ == "__main__":
    main()
