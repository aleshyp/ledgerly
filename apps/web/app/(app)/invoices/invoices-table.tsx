"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  toast,
} from "@ledgerly/ui";
import { BellRing, CircleCheck, Copy, MoreHorizontal, Send } from "lucide-react";
import { type Invoice, type InvoiceStatus, demoToday, invoiceStatus } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { InvoiceStatusBadge, invoiceStatusLabels } from "./invoice-status-badge";
import { useInvoices } from "./invoices-provider";

const ALL = "all";
const statuses = ["draft", "open", "overdue", "paid"] as const satisfies InvoiceStatus[];

const isStatus = (value: string | null): value is InvoiceStatus =>
  statuses.some((s) => s === value);

export function InvoicesTable() {
  const { invoices, replace } = useInvoices();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The filter lives in the URL so refresh, Back and shared links keep the view.
  const statusParam = searchParams.get("status");
  const status = isStatus(statusParam) ? statusParam : ALL;

  function setStatus(value: string) {
    router.replace(value === ALL ? pathname : `${pathname}?status=${value}`, { scroll: false });
  }

  const filtered = invoices.filter((i) => status === ALL || invoiceStatus(i) === status);
  const total = filtered.reduce((sum, i) => sum + i.amount, 0);

  function onSend(invoice: Invoice) {
    replace({ ...invoice, state: "sent" });
    toast({
      variant: "success",
      title: "Invoice sent",
      description: `${invoice.number} · ${invoice.customer} · ${formatCurrency(invoice.amount)}`,
    });
  }

  function onMarkPaid(invoice: Invoice) {
    replace({ ...invoice, state: "paid", paidOn: demoToday });
    toast({
      title: "Invoice marked as paid",
      description: `${invoice.number} · ${invoice.customer} · ${formatCurrency(invoice.amount)}`,
      action: {
        label: "Undo",
        altText: "Undo marking the invoice as paid",
        onClick: () => replace(invoice),
      },
    });
  }

  function onRemind(invoice: Invoice) {
    toast({
      title: "Reminder sent",
      description: `${invoice.customer} will get a reminder about ${invoice.number} today.`,
    });
  }

  async function onCopyNumber(number: string) {
    try {
      await navigator.clipboard.writeText(number);
      toast({ title: "Invoice number copied", description: number });
    } catch {
      toast({
        variant: "danger",
        title: "Couldn’t copy the invoice number",
        description:
          "Your browser blocked clipboard access. Select the number and copy it instead.",
      });
    }
  }

  return (
    <Card className="gap-4 py-4">
      <CardContent className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Filter by status" className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {invoiceStatusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {status !== ALL && (
          <Button variant="ghost" onClick={() => setStatus(ALL)}>
            Reset filter
          </Button>
        )}
      </CardContent>

      <p role="status" className="sr-only">
        {status !== ALL
          ? `${filtered.length} invoice${filtered.length === 1 ? "" : "s"} match your filter`
          : ""}
      </p>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Customer</TableHead>
            <TableHead className="hidden md:table-cell">Issued</TableHead>
            <TableHead className="hidden sm:table-cell">Due</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-12 pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-16 text-center">
                {invoices.length === 0 ? (
                  <>
                    <Text weight="medium">No invoices yet</Text>
                    <Text size="sm" tone="muted">
                      Invoices you send appear here. Use “New invoice” to bill a customer.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text weight="medium">
                      {status === ALL
                        ? "No invoices"
                        : `No ${invoiceStatusLabels[status].toLowerCase()} invoices`}
                    </Text>
                    <Text size="sm" tone="muted">
                      Try a different status or reset the filter.
                    </Text>
                  </>
                )}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((invoice) => {
              const current = invoiceStatus(invoice);
              const unpaid = current === "open" || current === "overdue";
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="pl-4 whitespace-normal">
                    <div className="font-medium">{invoice.customer}</div>
                    {/* The date columns hide on small screens, so their values fold in here. */}
                    <div className="text-xs text-foreground-muted tabular">
                      {invoice.number}
                      <span className="md:hidden"> · Issued {formatDate(invoice.issued)}</span>
                      <span className="sm:hidden">
                        {" · "}
                        {invoice.paidOn
                          ? `Paid ${formatDate(invoice.paidOn)}`
                          : `Due ${formatDate(invoice.due)}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-foreground-muted md:table-cell">
                    {formatDate(invoice.issued)}
                  </TableCell>
                  <TableCell className="hidden text-foreground-muted sm:table-cell">
                    {invoice.paidOn
                      ? `Paid ${formatDate(invoice.paidOn)}`
                      : formatDate(invoice.due)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <InvoiceStatusBadge status={current} />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular">
                    {formatCurrency(invoice.amount)}
                    {/* Status has its own column from `sm`; below that it sits under the amount. */}
                    <div className="mt-1 sm:hidden">
                      <InvoiceStatusBadge status={current} />
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${invoice.number}, ${invoice.customer}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {current === "draft" && (
                          <DropdownMenuItem onSelect={() => onSend(invoice)}>
                            <Send /> Send invoice
                          </DropdownMenuItem>
                        )}
                        {unpaid && (
                          <>
                            <DropdownMenuItem onSelect={() => onMarkPaid(invoice)}>
                              <CircleCheck /> Mark as paid
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onRemind(invoice)}>
                              <BellRing /> Send reminder
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onSelect={() => onCopyNumber(invoice.number)}>
                          <Copy /> Copy invoice number
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
        {filtered.length > 0 && (
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              {/* One cell per column, hidden like the headers: a colSpan over hidden columns
                  makes phantom ones, which widens the table and misaligns the total. */}
              <TableCell className="pl-4 text-foreground-muted">
                {filtered.length} invoice{filtered.length === 1 ? "" : "s"}
              </TableCell>
              <TableCell className="hidden md:table-cell" />
              <TableCell className="hidden sm:table-cell" />
              <TableCell className="hidden sm:table-cell" />
              <TableCell className="text-right tabular">{formatCurrency(total)}</TableCell>
              <TableCell className="pr-4" />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Card>
  );
}
