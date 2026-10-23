import type { Metadata } from "next";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@ledgerly/ui";
import { ArrowDownRight, ArrowUpRight, TriangleAlert } from "lucide-react";
import { CashFlowCard } from "@/components/cash-flow-chart";
import { ExportButton } from "@/components/export-button";
import { NewTransactionDialog } from "@/components/new-transaction-dialog";
import { PageHeader } from "@/components/page-header";
import { RecentTransactions } from "@/components/recent-transactions";
import { accounts, budgets, cashFlow, currentUser, kpis, type Kpi } from "@/lib/data";
import { formatCurrency, formatMonthLong, formatPercent } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

function KpiCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.change >= 0;
  const good = up === (kpi.goodWhen === "up");
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardDescription className="font-medium">{kpi.label}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className={`text-2xl font-semibold tabular ${kpi.value < 0 ? "text-negative" : ""}`}>
          {formatCurrency(kpi.value)}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant={good ? "success" : "danger"}>
            <Icon />
            <span className="sr-only">{up ? "Up" : "Down"}</span>
            {formatPercent(kpi.change)}
          </Badge>
          <span className="text-foreground-muted">{kpi.hint}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function OverBudgetAlert() {
  const over = budgets.filter((b) => b.spent > b.limit);
  if (over.length === 0) return null;

  const title =
    over.length === 1
      ? `${over[0]!.category} is over budget`
      : `${over.length} categories are over budget`;

  return (
    <Alert variant="warning">
      <TriangleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {over
          .map((b) => `${b.category} is ${formatCurrency(b.spent - b.limit)} over its limit`)
          .join("; ")}
        . Review recent charges or raise the limit in Settings.
      </AlertDescription>
    </Alert>
  );
}

export default function DashboardPage() {
  const month = formatMonthLong(cashFlow.at(-1)!.month);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description={`Here’s how ${currentUser.company} is doing in ${month}.`}
        actions={
          <>
            <ExportButton />
            <NewTransactionDialog />
          </>
        }
      />

      <OverBudgetAlert />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <CashFlowCard data={cashFlow} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentTransactions />

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle level={2}>Accounts</CardTitle>
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
                      <span className="text-xs text-foreground-muted capitalize">
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
              <CardTitle level={2}>Budgets</CardTitle>
              <CardDescription>{month} spend by category</CardDescription>
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
                      value={Math.min(ratio, 1) * 100}
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
