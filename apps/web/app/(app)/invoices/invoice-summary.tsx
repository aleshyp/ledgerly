"use client";

import { Card, CardContent, CardDescription, CardHeader, Text } from "@ledgerly/ui";
import { demoToday, invoiceStatus } from "@/lib/data";
import { formatCurrency, formatMonthLong } from "@/lib/format";
import { useInvoices } from "./invoices-provider";

const plural = (count: number) => `${count} invoice${count === 1 ? "" : "s"}`;

export function InvoiceSummary() {
  const { invoices } = useInvoices();
  const month = demoToday.slice(0, 7);

  const outstanding = invoices.filter((i) => i.state === "sent");
  const overdue = outstanding.filter((i) => invoiceStatus(i) === "overdue");
  const paid = invoices.filter((i) => i.paidOn?.startsWith(month));
  const total = (list: typeof invoices) => list.reduce((sum, i) => sum + i.amount, 0);

  const tiles = [
    { label: "Outstanding", value: total(outstanding), hint: plural(outstanding.length) },
    { label: "Overdue", value: total(overdue), hint: plural(overdue.length) },
    {
      label: `Paid in ${formatMonthLong(month)}`,
      value: total(paid),
      hint: plural(paid.length),
    },
  ];

  return (
    <section aria-label="Invoice summary" className="grid gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <Card key={tile.label} className="gap-3">
          <CardHeader>
            <CardDescription className="font-medium">{tile.label}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            <div className="text-2xl font-semibold tabular">{formatCurrency(tile.value)}</div>
            <Text size="xs" tone="muted">
              {tile.hint}
            </Text>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
