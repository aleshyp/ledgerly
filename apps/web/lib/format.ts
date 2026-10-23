const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const wholeCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const shortMonth = new Intl.DateTimeFormat("en-US", { month: "short" });
const longMonth = new Intl.DateTimeFormat("en-US", { month: "long" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

export function formatCurrency(amount: number, { signed = false } = {}) {
  const formatted = currency.format(Math.abs(amount));
  if (amount < 0) return `−${formatted}`;
  return signed && amount > 0 ? `+${formatted}` : formatted;
}

/** Whole dollars, for prices that never have cents. Keep a view on one style or the other. */
export const formatPrice = (amount: number) => wholeCurrency.format(amount);

export const formatCompactCurrency = (amount: number) => compactCurrency.format(amount);

/** A change as a percentage. The sign is left to the caller, which pairs it with an icon. */
export const formatPercent = (value: number) => `${percent.format(Math.abs(value))}%`;

export const formatDate = (iso: string) => shortDate.format(new Date(`${iso}T12:00:00`));

/** Noon on the 15th keeps every time zone inside the same month. */
const monthDate = (isoMonth: string) => new Date(`${isoMonth}-15T12:00:00`);

/** `2026-10` → “Oct” */
export const formatMonth = (isoMonth: string) => shortMonth.format(monthDate(isoMonth));

/** `2026-10` → “October” */
export const formatMonthLong = (isoMonth: string) => longMonth.format(monthDate(isoMonth));

/** `2026-10` → “Oct 2026” */
export const formatMonthYear = (isoMonth: string) => monthYear.format(monthDate(isoMonth));

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
