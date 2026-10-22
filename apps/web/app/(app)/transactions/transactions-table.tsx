"use client";

import { useMemo, useState } from "react";
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
} from "@ledgerly/ui";
import { Copy, MoreHorizontal, Pencil, Receipt, Search, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { Transaction, TransactionStatus } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const ALL = "all";

export function TransactionsTable({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState<TransactionStatus | typeof ALL>(ALL);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        (q === "" || t.merchant.toLowerCase().includes(q) || t.account.toLowerCase().includes(q)) &&
        (category === ALL || t.category === category) &&
        (status === ALL || t.status === status),
    );
  }, [transactions, query, category, status]);

  const net = filtered.reduce((sum, t) => sum + t.amount, 0);
  const hasFilters = query !== "" || category !== ALL || status !== ALL;

  return (
    <Card className="gap-4 py-4">
      <CardContent className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground-subtle" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchant or account"
            aria-label="Search transactions"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
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
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as TransactionStatus | typeof ALL)}
        >
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
          <Button
            variant="ghost"
            onClick={() => {
              setQuery("");
              setCategory(ALL);
              setStatus(ALL);
            }}
          >
            Reset
          </Button>
        )}
      </CardContent>

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
                <Text weight="medium">No transactions match your filters</Text>
                <Text size="sm" tone="muted">
                  Try a different search term or reset the filters.
                </Text>
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="pl-4 font-medium">{t.merchant}</TableCell>
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
                        aria-label={`Actions for ${t.merchant}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil /> Edit category
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Receipt /> Attach receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigator.clipboard?.writeText(t.id)}>
                        <Copy /> Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="danger">
                        <Trash2 /> Delete
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
    </Card>
  );
}
