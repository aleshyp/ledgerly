import type { Metadata } from "next";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ledgerly/ui";
import { ArrowDownRight, ArrowUpRight, Download, Info, Plus, TriangleAlert } from "lucide-react";
import { CashFlowCard } from "@/components/cash-flow-chart";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { accounts, budgets, cashFlow, currentUser, kpis, transactions, type Kpi } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

function KpiCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.change >= 0;
  const good = up === (kpi.goodWhen === "up");
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const value = kpi.label === "Runway" ? `${kpi.value} mo` : formatCurrency(kpi.value);

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardDescription className="font-medium">{kpi.label}</CardDescription>
        {kpi.label === "Runway" && (
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="How runway is calculated"
                  className="-mt-1.5 -mr-2"
                >
                  <Info />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Cash on hand divided by average net burn over the last 3 months.
              </TooltipContent>
            </Tooltip>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant={good ? "success" : "danger"}>
            <Icon />
            {kpi.label === "Runway" ? `+${kpi.change} mo` : `${Math.abs(kpi.change)}%`}
          </Badge>
          <span className="text-foreground-muted">{kpi.hint}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const overBudget = budgets.filter((b) => b.spent > b.limit);

  return (
    <>
      <PageHeader
        title={`Good morning, ${currentUser.name.split(" ")[0]}`}
        description={`Here’s how ${currentUser.company} is doing this month.`}
        actions={
          <>
            <Button variant="outline">
              <Download /> Export
            </Button>
            <Button asChild>
              <Link href="/transactions">
                <Plus /> New transaction
              </Link>
            </Button>
          </>
        }
      />

      {overBudget.length > 0 && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>{overBudget.map((b) => b.category).join(", ")} is over budget</AlertTitle>
          <AlertDescription>
            Spend is {formatCurrency(overBudget[0]!.spent - overBudget[0]!.limit)} over the monthly
            limit. Review recent charges or raise the limit in Settings.
          </AlertDescription>
        </Alert>
      )}

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <CashFlowCard data={cashFlow} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>Latest activity across all accounts</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/transactions">View all</Link>
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
                {transactions.slice(0, 6).map((t) => (
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

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Balances as of today</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid divide-y">
                {accounts.map((account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="grid">
                      <span className="text-sm font-medium">{account.name}</span>
                      <span className="text-xs text-foreground-muted">
                        {account.type} ···· {account.mask}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold tabular ${account.balance < 0 ? "text-negative" : ""}`}
                    >
                      {formatCurrency(account.balance)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
              <CardDescription>October spend by category</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {budgets.map((budget) => {
                const ratio = budget.spent / budget.limit;
                const tone = ratio > 1 ? "danger" : ratio > 0.85 ? "warning" : "primary";
                return (
                  <div key={budget.category} className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium">{budget.category}</span>
                      <span className="text-xs text-foreground-muted tabular">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <Progress
                      value={ratio * 100}
                      tone={tone}
                      aria-label={`${budget.category} budget used`}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
