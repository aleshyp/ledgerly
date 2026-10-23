import { describe, expect, it } from "vitest";
import {
  accounts,
  addDays,
  budgets,
  cardSpend,
  cashFlow,
  categorySpend,
  companyCards,
  demoToday,
  invoiceStatus,
  invoiceTermDays,
  invoices,
  kpis,
  plans,
  team,
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

  it("only charges company cards to the credit account", () => {
    const credit = accounts.find((a) => a.type === "credit")!.name;
    const ids = new Set(companyCards.map((c) => c.id));
    for (const t of transactions.filter((t) => t.card)) {
      expect(t.account).toBe(credit);
      expect(ids.has(t.card!)).toBe(true);
    }
    expect(new Set(companyCards.map((c) => c.mask)).size).toBe(companyCards.length);
    expect(companyCards.every((c) => team.some((m) => m.name === c.holder))).toBe(true);
  });

  it("leaves failed charges out of card spend", () => {
    const failed = transactions.find((t) => t.card && t.status === "failed")!;
    expect(cardSpend([failed], failed.card!)).toBe(0);
  });

  it("numbers invoices in issue order and keeps their dates consistent", () => {
    const issued = invoices.map((i) => i.issued);
    expect(issued).toEqual([...issued].sort().reverse());
    expect(new Set(invoices.map((i) => i.number)).size).toBe(invoices.length);
    for (const invoice of invoices) {
      expect(invoice.issued <= demoToday).toBe(true);
      expect(invoice.due).toBe(addDays(invoice.issued, invoiceTermDays));
      expect(Boolean(invoice.paidOn)).toBe(invoice.state === "paid");
      if (invoice.paidOn) expect(invoice.paidOn <= demoToday).toBe(true);
    }
  });

  it("marks a sent invoice overdue only after its due date", () => {
    const sent = invoices.find((i) => i.state === "sent")!;
    expect(invoiceStatus(sent, sent.due)).toBe("open");
    expect(invoiceStatus(sent, addDays(sent.due, 1))).toBe("overdue");
    expect(invoiceStatus({ ...sent, state: "paid" }, addDays(sent.due, 1))).toBe("paid");
    expect(new Set(invoices.map((i) => invoiceStatus(i)))).toEqual(
      new Set(["draft", "open", "overdue", "paid"]),
    );
  });

  it("adds days across month and year ends", () => {
    expect(addDays("2026-10-22", 30)).toBe("2026-11-21");
    expect(addDays("2026-12-20", 30)).toBe("2027-01-19");
  });

  it("only discounts paid plans when billed annually", () => {
    for (const plan of plans) expect(plan.annual).toBeLessThanOrEqual(plan.monthly);
  });
});
