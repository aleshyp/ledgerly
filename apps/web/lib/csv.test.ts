import { describe, expect, it } from "vitest";
import { transactionsToCsv } from "./csv";
import type { Transaction } from "./data";

const base: Transaction = {
  id: "txn_x",
  date: "2026-10-21",
  merchant: "Figma",
  category: "Software",
  account: "Company card",
  amount: -45,
  status: "completed",
};

describe("transactionsToCsv", () => {
  it("writes a header and plain values", () => {
    expect(transactionsToCsv([base]).split("\n")).toEqual([
      "id,date,merchant,category,account,amount,status,memo",
      "txn_x,2026-10-21,Figma,Software,Company card,-45,completed,",
    ]);
  });

  it("quotes commas, quotes and newlines", () => {
    const row = transactionsToCsv([{ ...base, merchant: 'Juniper & Co, "West"', memo: "a\nb" }]);
    expect(row).toContain('"Juniper & Co, ""West"""');
    expect(row).toContain('"a\nb"');
  });
});
