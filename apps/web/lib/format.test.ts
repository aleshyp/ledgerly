import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatMonth,
  formatMonthYear,
  formatPercent,
  formatPrice,
  initials,
} from "./format";

describe("formatCurrency", () => {
  it("uses a true minus sign for negatives", () => {
    expect(formatCurrency(-45)).toBe("−$45.00");
  });

  it("adds a plus only when asked", () => {
    expect(formatCurrency(12400)).toBe("$12,400.00");
    expect(formatCurrency(12400, { signed: true })).toBe("+$12,400.00");
    expect(formatCurrency(0, { signed: true })).toBe("$0.00");
  });
});

describe("formatPrice", () => {
  it("drops cents", () => {
    expect(formatPrice(39)).toBe("$39");
    expect(formatPrice(0)).toBe("$0");
  });
});

describe("formatPercent", () => {
  it("leaves the sign to the caller", () => {
    expect(formatPercent(-3.14)).toBe("3.1%");
    expect(formatPercent(12)).toBe("12%");
  });
});

describe("dates", () => {
  it("formats ISO dates and months for people", () => {
    expect(formatDate("2026-10-21")).toBe("Oct 21");
    expect(formatMonth("2026-05")).toBe("May");
    expect(formatMonthYear("2026-10")).toBe("Oct 2026");
  });
});

describe("initials", () => {
  it("takes up to two letters", () => {
    expect(initials("Avery Chen")).toBe("AC");
    expect(initials("Mary Ann Lee")).toBe("MA");
  });
});
