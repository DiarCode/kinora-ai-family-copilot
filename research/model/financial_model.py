"""
5-year subscription model for the "Family License" (Hearth) parenting + couple-skills product.

Monthly cohort simulation. Plans are billed every 4 weeks (treated as monthly).
Run:  python model/financial_model.py   -> prints the markdown tables in model/output.md

Costs are itemized separately:
  - Paid marketing (ads)                      -> yearly_marketing
  - Payment fees (Stripe ~6% of billings)     -> fees
  - Refunds (on the first charge)             -> refund
  - LLM / AI API per active paying household  -> llm_active
  - Infra per active household (hosting, DB, email/push, monitoring, storage) -> infra_active
  - AI + infra for FREE users (quiz takers who try the free AI rehearsal but don't buy),
    expressed per new paying household       -> free_cost_per_payer
  - Customer support (% of revenue)           -> support_share
  - Fixed: team salaries, content/expert review, tools, legal, base servers -> yearly_fixed

Assumptions are benchmark-anchored; sources in docs/research/unit-economics-benchmarks.md.
"""
from dataclasses import dataclass

import sys
sys.stdout.reconfigure(encoding="utf-8")

MONTHS = 60


@dataclass
class Scenario:
    name: str
    paid_cac: float            # $ ad spend per first paying household from paid social
    organic_share: float       # share of new payers that come free (partner invite, referral, gifting, word of mouth)
    intro_price: float         # first 4-week period
    renew_price: float         # each 4-week renewal (household plan covers 2 partners)
    r1: float                  # share that renews after the intro period
    churn: float               # monthly churn after first renewal
    refund: float              # refund rate on first charge
    fees: float                # payment processing share of billings
    llm_active: float          # LLM API $ per active paying household / month
    infra_active: float        # hosting + DB + email/push + monitoring $ per active household / month
    free_cost_per_payer: float # AI+infra spent on free users, per new paying household
    support_share: float       # support share of revenue
    yearly_marketing: list     # paid marketing budget per year, $
    yearly_fixed: list         # team + content + tools + legal + base infra per year, $
    notes: str = ""

    @property
    def cogs_active(self):
        return self.llm_active + self.infra_active


def survival(s: Scenario, age: int) -> float:
    """Share of a cohort still paying in month `age` (0 = intro month)."""
    if age == 0:
        return 1.0
    return s.r1 * (1 - s.churn) ** (age - 1)


def gross_price(s: Scenario, age: int) -> float:
    return s.intro_price if age == 0 else s.renew_price


def net_price(s: Scenario, age: int) -> float:
    if age == 0:
        return s.intro_price * (1 - s.refund) * (1 - s.fees)
    return s.renew_price * (1 - s.fees)


def ltv(s: Scenario, horizon: int = 24) -> dict:
    rev = sum(survival(s, a) * net_price(s, a) for a in range(horizon))
    cost = sum(survival(s, a) * s.cogs_active for a in range(horizon))
    gross = rev * (1 - s.support_share) - cost
    rev12 = sum(survival(s, a) * net_price(s, a) for a in range(12))
    blended_cac = s.paid_cac * (1 - s.organic_share) + s.free_cost_per_payer
    cum, payback = -s.free_cost_per_payer, None
    for a in range(horizon):
        cum += survival(s, a) * (net_price(s, a) * (1 - s.support_share) - s.cogs_active)
        if payback is None and cum >= blended_cac - s.free_cost_per_payer:
            payback = a + 1
    return dict(rev12=rev12, rev24=rev, gm24=gross, blended_cac=blended_cac,
                ltv_cac=gross / blended_cac, payback=payback,
                avg_life=sum(survival(s, a) for a in range(horizon)),
                gm_pct=gross / rev if rev else 0)


def simulate(s: Scenario):
    cohorts = []
    years = []
    cum_cash = 0.0
    min_cash = 0.0
    weights = [(i + 1) for i in range(12)]
    for m in range(MONTHS):
        y = m // 12
        mk = s.yearly_marketing[y] * weights[m % 12] / sum(weights)
        paid_new = mk / s.paid_cac
        new = paid_new / (1 - s.organic_share)
        cohorts.append(new)
        ages = [(c, m - i) for i, c in enumerate(cohorts)]
        active = sum(c * survival(s, a) for c, a in ages)
        billings = sum(c * survival(s, a) * gross_price(s, a) for c, a in ages)
        refunds = new * s.intro_price * s.refund
        fees = (billings - refunds) * s.fees
        revenue = billings - refunds - fees               # net revenue
        llm = active * s.llm_active
        infra = active * s.infra_active
        free = new * s.free_cost_per_payer
        support = revenue * s.support_share
        fixed = s.yearly_fixed[y] / 12
        profit = revenue - llm - infra - free - support - mk - fixed
        cum_cash += profit
        min_cash = min(min_cash, cum_cash)
        if m % 12 == 0:
            years.append(dict(billings=0, refunds=0, fees=0, rev=0, llm=0, infra=0, free=0,
                              support=0, mk=0, fixed=0, profit=0, new=0))
        Y = years[-1]
        for k, v in dict(billings=billings, refunds=refunds, fees=fees, rev=revenue, llm=llm,
                         infra=infra, free=free, support=support, mk=mk, fixed=fixed,
                         profit=profit, new=new).items():
            Y[k] += v
        Y["active_end"] = active
        Y["arr_end"] = sum(c * survival(s, a) for c, a in ages if a > 0) * s.renew_price * 12
        Y["cum_cash"] = cum_cash
    return years, min_cash


PRICING = dict(intro_price=9.99, renew_price=24.99, fees=0.06)

SCENARIOS = [
    Scenario("Conservative (standalone)", paid_cac=120, organic_share=0.05, r1=0.40, churn=0.20,
             refund=0.06, llm_active=1.20, infra_active=0.80, free_cost_per_payer=1.50,
             support_share=0.05,
             yearly_marketing=[60e3, 150e3, 300e3, 500e3, 700e3],
             yearly_fixed=[80e3, 150e3, 200e3, 250e3, 300e3],
             notes="Paid social barely works; growth capped by unit economics.", **PRICING),
    Scenario("Base (standalone)", paid_cac=60, organic_share=0.15, r1=0.50, churn=0.14,
             refund=0.045, llm_active=0.70, infra_active=0.50, free_cost_per_payer=1.00,
             support_share=0.03,
             yearly_marketing=[200e3, 1.2e6, 4e6, 9e6, 16e6],
             yearly_fixed=[200e3, 700e3, 1.8e6, 3.5e6, 6e6], **PRICING),
    Scenario("Optimistic (standalone)", paid_cac=45, organic_share=0.25, r1=0.55, churn=0.11,
             refund=0.03, llm_active=0.50, infra_active=0.30, free_cost_per_payer=0.70,
             support_share=0.02,
             yearly_marketing=[400e3, 2.5e6, 8e6, 18e6, 30e6],
             yearly_fixed=[300e3, 1.2e6, 3.5e6, 7e6, 11e6],
             notes="Couple-invite + gifting + word-of-mouth loops work; retention ~ top-quartile web funnels.",
             **PRICING),
    Scenario("Inside Zimran (base retention, Zimran media machine)", paid_cac=45, organic_share=0.20,
             r1=0.50, churn=0.14, refund=0.045, llm_active=0.70, infra_active=0.50,
             free_cost_per_payer=1.00, support_share=0.03,
             yearly_marketing=[600e3, 4e6, 10e6, 20e6, 32e6],
             yearly_fixed=[250e3, 900e3, 2e6, 3.5e6, 5.5e6],
             notes="Shared creative studio, funnel stack, payments, data; CAC -25% vs standalone base.",
             **PRICING),
]


def fmt(x):
    if abs(x) >= 1e6:
        return f"${x/1e6:,.1f}M"
    if abs(x) >= 1e3:
        return f"${x/1e3:,.0f}K"
    return f"${x:,.0f}"


def main():
    print("## Unit economics per paying household (24-month horizon)\n")
    print("| Scenario | Paid CAC | Organic share | Blended CAC* | Renew after intro | Monthly churn | Avg paid months (24m) | Net rev 12m | Net rev 24m | AI+infra / active / mo | Gross-margin LTV 24m | GM % | LTV/CAC | Payback |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    for s in SCENARIOS:
        u = ltv(s)
        print(f"| {s.name} | ${s.paid_cac:.0f} | {s.organic_share:.0%} | ${u['blended_cac']:.0f} | {s.r1:.0%} | {s.churn:.0%} | "
              f"{u['avg_life']:.1f} | ${u['rev12']:.0f} | ${u['rev24']:.0f} | ${s.cogs_active:.2f} | ${u['gm24']:.0f} | {u['gm_pct']:.0%} | **{u['ltv_cac']:.2f}** | "
              f"{str(u['payback']) + ' mo' if u['payback'] else '> 24 mo'} |")
    print("\n*Blended CAC = paid CAC × (1 − organic share) + AI/infra cost of free users per payer.\n")

    print("## Word-of-mouth sensitivity (Base scenario, only the organic share changes)\n")
    print("| Organic share of new payers | Blended CAC | LTV/CAC | Payback | Y5 ARR (same ad budget) |")
    print("|---|---|---|---|---|")
    base = SCENARIOS[1]
    for org in (0.15, 0.30, 0.45, 0.60):
        t = Scenario(**{**base.__dict__, "organic_share": org})
        u = ltv(t)
        ys, _ = simulate(t)
        print(f"| {org:.0%} | ${u['blended_cac']:.0f} | {u['ltv_cac']:.2f} | {u['payback']} mo | {fmt(ys[-1]['arr_end'])} |")
    print()

    for s in SCENARIOS:
        years, min_cash = simulate(s)
        print(f"### {s.name}\n")
        if s.notes:
            print(f"_{s.notes}_\n")
        print("| Year | Paid marketing | New paying households | Active payers (end) | Net revenue | ARR run-rate (end) | Profit / loss | Cumulative cash |")
        print("|---|---|---|---|---|---|---|---|")
        for i, Y in enumerate(years):
            print(f"| Y{i+1} | {fmt(Y['mk'])} | {Y['new']:,.0f} | {Y['active_end']:,.0f} | {fmt(Y['rev'])} | {fmt(Y['arr_end'])} | {fmt(Y['profit'])} | {fmt(Y['cum_cash'])} |")
        print(f"\nPeak funding need (max cumulative burn): **{fmt(-min_cash)}**\n")
        print("Cost breakdown (where the money goes):\n")
        print("| Year | Gross billings | Refunds | Payment fees | LLM / AI API | Infra (hosting, DB, email) | Free-user AI | Support | **Ads** | Team & fixed | Ads % of costs | AI+infra % of revenue |")
        print("|---|---|---|---|---|---|---|---|---|---|---|---|")
        for i, Y in enumerate(years):
            costs = Y['llm'] + Y['infra'] + Y['free'] + Y['support'] + Y['mk'] + Y['fixed'] + Y['refunds'] + Y['fees']
            ai = Y['llm'] + Y['infra'] + Y['free']
            print(f"| Y{i+1} | {fmt(Y['billings'])} | {fmt(Y['refunds'])} | {fmt(Y['fees'])} | {fmt(Y['llm'])} | {fmt(Y['infra'])} | {fmt(Y['free'])} | {fmt(Y['support'])} | **{fmt(Y['mk'])}** | {fmt(Y['fixed'])} | {Y['mk']/costs:.0%} | {ai/Y['rev']:.1%} |")
        print()


if __name__ == "__main__":
    main()
