const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatCurrency(amount: number, { signed = false } = {}) {
  const formatted = currency.format(Math.abs(amount));
  if (amount < 0) return `−${formatted}`;
  return signed && amount > 0 ? `+${formatted}` : formatted;
}

export const formatCompactCurrency = (amount: number) => compactCurrency.format(amount);

export const formatDate = (iso: string) => shortDate.format(new Date(`${iso}T12:00:00`));

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
