"use client";

import { Badge, StatCard } from "@ledgerly/ui";
import { TriangleAlert } from "lucide-react";
import { daysBetween, demoToday, invoiceStatus } from "@/lib/data";
import { formatCurrency, formatMonthLong } from "@/lib/format";
import { useInvoices } from "./invoices-provider";

const plural = (count: number) => `${count} invoice${count === 1 ? "" : "s"}`;
const days = (count: number) => `${count} day${count === 1 ? "" : "s"}`;

export function InvoiceSummary() {
  const { invoices } = useInvoices();
  const month = demoToday.slice(0, 7);

  const outstanding = invoices.filter((i) => i.state === "sent");
  const overdue = outstanding.filter((i) => invoiceStatus(i) === "overdue");
  const paid = invoices.filter((i) => i.paidOn?.startsWith(month));
  const total = (list: typeof invoices) => list.reduce((sum, i) => sum + i.amount, 0);
  const oldestLate = Math.max(0, ...overdue.map((i) => daysBetween(i.due, demoToday)));

  return (
    <section aria-label="Invoice summary" className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Outstanding"
        value={formatCurrency(total(outstanding))}
        meta={plural(outstanding.length)}
      />
      <StatCard
        label="Overdue"
        value={formatCurrency(total(overdue))}
        meta={
          <>
            {plural(overdue.length)}
            {overdue.length > 0 && (
              <Badge variant="warning">
                <TriangleAlert /> Oldest is {days(oldestLate)} late
              </Badge>
            )}
          </>
        }
      />
      <StatCard
        label={`Paid in ${formatMonthLong(month)}`}
        value={formatCurrency(total(paid))}
        meta={plural(paid.length)}
      />
    </section>
  );
}
