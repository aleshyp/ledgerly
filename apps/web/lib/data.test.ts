import { describe, expect, it } from "vitest";
import {
  accounts,
  budgets,
  cashFlow,
  categorySpend,
  demoToday,
  kpis,
  plans,
  transactions,
} from "./data";

// The demo’s numbers are cross-checked here so a data edit can’t quietly contradict itself.
describe("demo data", () => {
  it("lists transactions newest first and never in the future", () => {
    const dates = transactions.map((t) => t.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(dates.every((d) => d <= demoToday)).toBe(true);
  });

  it("gives every transaction a unique id and a real account", () => {
    const names = new Set(accounts.map((a) => a.name));
    expect(new Set(transactions.map((t) => t.id)).size).toBe(transactions.length);
    expect(transactions.every((t) => names.has(t.account))).toBe(true);
  });

  it("leaves failed charges out of budget spend", () => {
    const failed = transactions.filter((t) => t.status === "failed");
    expect(failed.length).toBeGreaterThan(0);
    for (const budget of budgets) {
      const counted = transactions
        .filter((t) => t.category === budget.category && t.amount < 0 && t.status !== "failed")
        .reduce((sum, t) => sum - t.amount, 0);
      expect(budget.spent).toBeCloseTo(counted, 2);
    }
    expect(categorySpend([{ ...failed[0]!, category: "X" }], "X")).toBe(0);
  });

  it("derives the KPI tiles from accounts and the latest cash-flow month", () => {
    const latest = cashFlow.at(-1)!;
    const value = (label: string) => kpis.find((k) => k.label === label)!.value;
    expect(value("Cash on hand")).toBeCloseTo(
      accounts.filter((a) => a.type !== "credit").reduce((s, a) => s + a.balance, 0),
      2,
    );
    expect(value("Money in")).toBe(latest.moneyIn);
    expect(value("Money out")).toBe(latest.moneyOut);
    expect(value("Net cash flow")).toBeCloseTo(latest.moneyIn - latest.moneyOut, 2);
  });

  it("only discounts paid plans when billed annually", () => {
    for (const plan of plans) expect(plan.annual).toBeLessThanOrEqual(plan.monthly);
  });
});
