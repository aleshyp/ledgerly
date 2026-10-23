"use client";

import Link from "next/link";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ledgerly/ui";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "./status-badge";
import { useTransactions } from "./transactions-provider";

export function RecentTransactions({ count = 6 }: { count?: number }) {
  const { transactions } = useTransactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>Recent transactions</CardTitle>
        <CardDescription>Latest activity across all accounts</CardDescription>
        <CardAction>
          <Button asChild variant="outline" size="sm">
            <Link href="/transactions">View all transactions</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-3">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Merchant</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, count).map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="font-medium">{t.merchant}</div>
                  <div className="text-xs text-foreground-muted">{t.category}</div>
                </TableCell>
                <TableCell className="hidden text-foreground-muted sm:table-cell">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell
                  className={`text-right font-medium tabular ${t.amount > 0 ? "text-positive" : ""}`}
                >
                  {formatCurrency(t.amount, { signed: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
