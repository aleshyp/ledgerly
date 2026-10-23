import { StatCard } from "@ledgerly/ui";
import type { Transaction } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const plural = (count: number, noun = "transaction") => `${count} ${noun}${count === 1 ? "" : "s"}`;

/** Totals for the rows the table is showing. Failed transactions moved no money, so they’re left out. */
export function TransactionsSummary({
  transactions,
  hasFilters,
}: {
  transactions: Transaction[];
  hasFilters: boolean;
}) {
  const settled = transactions.filter((t) => t.status !== "failed");
  const failed = transactions.length - settled.length;
  const moneyIn = settled.filter((t) => t.amount > 0);
  const moneyOut = settled.filter((t) => t.amount < 0);
  const sum = (list: Transaction[]) => list.reduce((total, t) => total + t.amount, 0);
  const net = sum(settled);

  return (
    <section aria-label="Transaction totals" className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Money in"
        value={formatCurrency(sum(moneyIn))}
        meta={plural(moneyIn.length)}
      />
      <StatCard
        label="Money out"
        value={formatCurrency(-sum(moneyOut))}
        meta={plural(moneyOut.length)}
      />
      <StatCard
        label="Net"
        value={formatCurrency(net, { signed: true })}
        tone={net > 0 ? "positive" : net < 0 ? "negative" : "default"}
        meta={
          failed > 0
            ? `Leaves out ${plural(failed, "failed transaction")}`
            : hasFilters
              ? "Matching your filters"
              : "Across every account"
        }
      />
    </section>
  );
}
