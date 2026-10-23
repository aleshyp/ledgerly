"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
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
import { Copy, MoreHorizontal, Paperclip, Pencil, Receipt, Search, Trash2 } from "lucide-react";
import { ExportButton } from "@/components/export-button";
import { StatusBadge } from "@/components/status-badge";
import { useTransactions } from "@/components/transactions-provider";
import type { Transaction, TransactionStatus } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { EditCategoryDialog, ReceiptDialog } from "./row-dialogs";
import { TransactionsSummary } from "./transactions-summary";

const ALL = "all";
const statuses = ["completed", "pending", "failed"] as const satisfies TransactionStatus[];

const isStatus = (value: string | null): value is TransactionStatus =>
  statuses.some((s) => s === value);

type RowDialog = { kind: "category" | "receipt"; transaction: Transaction } | null;

export function TransactionsTable({ categories }: { categories: string[] }) {
  const { transactions, remove, restore } = useTransactions();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dialog, setDialog] = useState<RowDialog>(null);

  // Filters live in the URL so refresh, Back and shared links keep the view.
  const query = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category");
  const category = categoryParam && categories.includes(categoryParam) ? categoryParam : ALL;
  const statusParam = searchParams.get("status");
  const status = isStatus(statusParam) ? statusParam : ALL;

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === "" || value === ALL) params.delete(key);
    else params.set(key, value);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  const q = query.trim().toLowerCase();
  const filtered = transactions.filter(
    (t) =>
      (q === "" ||
        t.merchant.toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)) &&
      (category === ALL || t.category === category) &&
      (status === ALL || t.status === status),
  );

  // Matches the summary above the table: a failed transaction moved no money.
  const net = filtered.filter((t) => t.status !== "failed").reduce((sum, t) => sum + t.amount, 0);
  const hasFilters = query !== "" || category !== ALL || status !== ALL;

  function onDelete(transaction: Transaction) {
    remove(transaction.id);
    toast({
      title: "Transaction deleted",
      description: `${transaction.merchant} · ${formatCurrency(transaction.amount, { signed: true })}`,
      action: {
        label: "Undo",
        altText: "Undo deleting the transaction",
        onClick: () => restore(transaction),
      },
    });
  }

  async function onCopyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      toast({ title: "Transaction ID copied", description: id });
    } catch {
      toast({
        variant: "danger",
        title: "Couldn’t copy the ID",
        description: "Your browser blocked clipboard access. Select the ID and copy it instead.",
      });
    }
  }

  return (
    <>
      <TransactionsSummary transactions={filtered} hasFilters={hasFilters} />
      <Card className="gap-4 py-4">
        <CardContent className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground-subtle" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Search merchant, account or category"
              aria-label="Search transactions"
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={(v) => setParam("category", v)}>
            <SelectTrigger aria-label="Filter by category" className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setParam("status", v)}>
            <SelectTrigger aria-label="Filter by status" className="sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={() => router.replace(pathname, { scroll: false })}>
              Reset filters
            </Button>
          )}
          <ExportButton rows={filtered} />
        </CardContent>

        <p role="status" className="sr-only">
          {hasFilters
            ? `${filtered.length} transaction${filtered.length === 1 ? "" : "s"} match your filters`
            : ""}
        </p>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Merchant</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Account</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12 pr-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-16 text-center">
                  {transactions.length === 0 ? (
                    <>
                      <Text weight="medium">No transactions yet</Text>
                      <Text size="sm" tone="muted">
                        Transactions from your accounts appear here. Use “New transaction” to record
                        one by hand.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text weight="medium">No transactions match your filters</Text>
                      <Text size="sm" tone="muted">
                        Try a different search term or reset the filters.
                      </Text>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-4 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {t.merchant}
                      {t.receipt && (
                        <>
                          <Paperclip
                            aria-hidden="true"
                            className="size-3.5 text-foreground-muted"
                          />
                          <span className="sr-only">(receipt attached)</span>
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-foreground-muted md:table-cell">
                    {t.category}
                  </TableCell>
                  <TableCell className="hidden text-foreground-muted lg:table-cell">
                    {t.account}
                  </TableCell>
                  <TableCell className="hidden text-foreground-muted sm:table-cell">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium tabular ${t.amount > 0 ? "text-positive" : ""}`}
                  >
                    {formatCurrency(t.amount, { signed: true })}
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${t.merchant}, ${formatDate(t.date)}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => setDialog({ kind: "category", transaction: t })}
                        >
                          <Pencil /> Edit category…
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setDialog({ kind: "receipt", transaction: t })}
                        >
                          <Receipt /> {t.receipt ? "Replace receipt…" : "Attach receipt…"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onCopyId(t.id)}>
                          <Copy /> Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="danger" onSelect={() => onDelete(t)}>
                          <Trash2 /> Delete transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {filtered.length > 0 && (
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="pl-4 text-foreground-muted">
                  {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
                </TableCell>
                <TableCell className={`text-right tabular ${net > 0 ? "text-positive" : ""}`}>
                  {formatCurrency(net, { signed: true })}
                </TableCell>
                <TableCell className="pr-4" />
              </TableRow>
            </TableFooter>
          )}
        </Table>

        <EditCategoryDialog
          transaction={dialog?.kind === "category" ? dialog.transaction : null}
          categories={categories}
          onClose={() => setDialog(null)}
        />
        <ReceiptDialog
          transaction={dialog?.kind === "receipt" ? dialog.transaction : null}
          onClose={() => setDialog(null)}
        />
      </Card>
    </>
  );
}
