import type { Transaction } from "./data";

const columns = [
  "id",
  "date",
  "merchant",
  "category",
  "account",
  "amount",
  "status",
  "memo",
] as const;

function cell(value: string | number | undefined) {
  const text = value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Transactions as CSV for spreadsheets and accountants: ISO dates and plain signed amounts, not
 * the display formats.
 */
export function transactionsToCsv(list: Transaction[]) {
  const rows = list.map((t) => columns.map((key) => cell(t[key])).join(","));
  return [columns.join(","), ...rows].join("\n");
}
