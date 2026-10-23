import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Container,
  Heading,
  Progress,
  Text,
} from "@ledgerly/ui";
import {
  ArrowDownLeft,
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  Check,
  CreditCard,
  Landmark,
  Receipt,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { CountUpCurrency } from "@/components/count-up-currency";
import { accounts, budgets, cashFlow, testimonials, transactions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

function ReconcileDemo() {
  return (
    <ul className="grid divide-y rounded-lg border bg-background">
      {transactions.slice(4, 7).map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
          <span className="truncate font-medium">{t.merchant}</span>
          <Badge variant="success">
            <Check /> Matched
          </Badge>
        </li>
      ))}
    </ul>
  );
}

const peakFlow = Math.max(...cashFlow.map((m) => m.moneyIn));

/** Decorative bars; the tile's copy carries the meaning, so the chart is hidden from AT. */
function CashFlowDemo() {
  return (
    <div className="grid gap-3">
      <div aria-hidden="true" className="flex h-40 items-end gap-2">
        {cashFlow.map((m) => (
          <div key={m.month} className="flex h-full flex-1 items-end gap-1">
            <div
              className="flex-1 rounded-t-sm bg-chart-1"
              style={{ height: `${(m.moneyIn / peakFlow) * 100}%` }}
            />
            <div
              className="flex-1 rounded-t-sm bg-chart-2"
              style={{ height: `${(m.moneyOut / peakFlow) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="flex gap-4 text-xs text-foreground-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-1" /> Money in
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-2" /> Money out
        </span>
      </div>
    </div>
  );
}

const invoices = [
  { id: "INV-1042", client: "Tidewater Cycles", amount: 12480, paid: true },
  { id: "INV-1043", client: "Atlas Studio", amount: 3250, paid: false },
];

function InvoiceDemo() {
  return (
    <ul className="grid gap-2">
      {invoices.map((inv) => (
        <li key={inv.id} className="grid gap-1 rounded-lg border bg-background px-3 py-2.5 text-sm">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate font-medium">{inv.client}</span>
            <Badge variant={inv.paid ? "success" : "warning"}>
              {inv.paid ? "Paid" : "Reminder sent"}
            </Badge>
          </span>
          <span className="text-xs text-foreground-muted tabular">
            {inv.id} · {formatCurrency(inv.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}

const auditLog = [
  {
    id: "a1",
    who: "Avery Chen",
    what: `approved a ${formatCurrency(4200)} payout`,
    when: "2m ago",
  },
  { id: "a2", who: "Jordan Patel", what: "raised the marketing card limit", when: "1h ago" },
  { id: "a3", who: "Sam Ortiz", what: "exported the September ledger", when: "Yesterday" },
];

function AuditDemo() {
  return (
    <ul className="grid gap-2">
      {auditLog.map((entry) => (
        <li
          key={entry.id}
          className="flex items-baseline justify-between gap-4 rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <span className="text-pretty">
            <span className="font-medium">{entry.who}</span>{" "}
            <span className="text-foreground-muted">{entry.what}</span>
          </span>
          <span className="shrink-0 text-xs text-foreground-subtle">{entry.when}</span>
        </li>
      ))}
    </ul>
  );
}

// Bento layout at lg: reconciliation is wide, cash flow is tall, controls closes the grid.
// Spans are spelled out so Tailwind can see each class.
const features = [
  {
    icon: Workflow,
    title: "Automated reconciliation",
    body: "Every transaction is matched, categorized and receipt-checked before your accountant ever sees it.",
    span: "lg:col-span-2",
    demo: <ReconcileDemo />,
  },
  {
    icon: ChartNoAxesCombined,
    title: "Live cash flow",
    body: "See runway, burn and upcoming bills update in real time instead of waiting for month-end.",
    span: "lg:row-span-2",
    demo: <CashFlowDemo />,
  },
  {
    icon: Landmark,
    title: "Business accounts",
    body: "Open operating, payroll and reserve accounts in minutes, with no monthly fees on Starter.",
  },
  {
    icon: CreditCard,
    title: "Cards with guardrails",
    body: "Issue virtual and physical cards with per-merchant limits that enforce your budgets automatically.",
  },
  {
    icon: Receipt,
    title: "Invoicing that gets paid",
    body: "Send branded invoices with card and ACH payments built in. Reminders go out on their own.",
    demo: <InvoiceDemo />,
  },
  {
    icon: ShieldCheck,
    title: "Controls & audit trail",
    body: "Approval chains, custom roles and an immutable audit log keep every dollar accountable.",
    span: "lg:col-span-2",
    demo: <AuditDemo />,
  },
];

const stats = [
  { value: "12,000+", label: "businesses" },
  { value: "$4.2B", label: "processed annually" },
  { value: "9 days", label: "saved per month-end close" },
  { value: "99.99%", label: "uptime" },
];

// Spelled out so Tailwind can see each class. Rows land after the preview card (stagger-3).
const rowStagger = ["stagger-6", "stagger-7", "stagger-8", "stagger-9"] as const;

const logos = ["Fernhill", "Tidewater", "Atlas Studio", "Northwind", "Juniper & Co", "Basalt"];

function ProductPreview() {
  const operating = accounts[0]!;
  return (
    <div className="relative stagger-3 motion-safe:animate-rise-in">
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -inset-y-8 -z-10 rounded-3xl bg-linear-to-br from-glow-start via-glow-mid to-transparent blur-2xl"
      />
      <Card className="gap-5 shadow-2xl">
        <CardHeader>
          <CardDescription>
            {operating.name} ···· {operating.mask}
          </CardDescription>
          <CardTitle asChild className="text-3xl">
            <p>
              <CountUpCurrency amount={operating.balance} delayMs={400} className="tabular" />
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {budgets.slice(0, 2).map((budget) => (
            <div key={budget.category} className="grid gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{budget.category}</span>
                <span className="text-foreground-muted tabular">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <Progress
                value={(budget.spent / budget.limit) * 100}
                aria-label={`${budget.category} budget`}
                tone={budget.spent / budget.limit > 0.85 ? "warning" : "primary"}
                entrance="fill"
              />
            </div>
          ))}
          <ul className="grid divide-y rounded-lg border">
            {transactions.slice(0, 4).map((t, i) => (
              <li
                key={t.id}
                className={`${rowStagger[i]} flex items-center justify-between gap-4 px-3 py-2.5 text-sm motion-safe:animate-rise-in`}
              >
                <div className="grid">
                  <span className="font-medium">{t.merchant}</span>
                  <span className="text-xs text-foreground-muted">
                    {t.category} · {formatDate(t.date)}
                  </span>
                </div>
                <span className={`font-medium tabular ${t.amount > 0 ? "text-positive" : ""}`}>
                  {formatCurrency(t.amount, { signed: true })}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Floating layers. Illustrative only, and hidden below sm where they'd cover the card. */}
      <div
        aria-hidden="true"
        className="absolute -top-7 -right-4 hidden stagger-10 motion-safe:animate-rise-in sm:block lg:-right-8"
      >
        <Card className="w-88 flex-row items-center gap-3 px-3 py-3 shadow-xl">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success-subtle text-success-subtle-foreground">
            <ArrowDownLeft className="size-4" />
          </span>
          <span className="grid min-w-0 flex-1">
            <span className="text-sm font-medium">Payment received</span>
            <span className="truncate text-xs text-foreground-muted">
              Tidewater Cycles · INV-1042
            </span>
          </span>
          <span className="text-sm font-medium text-positive tabular">
            {formatCurrency(12480, { signed: true })}
          </span>
        </Card>
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-6 hidden stagger-11 motion-safe:animate-rise-in sm:block lg:-left-12"
      >
        <div className="relative isolate grid w-60 gap-6 overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-2xl">
          <div className="absolute -top-12 -right-12 -z-10 size-40 rounded-full bg-spotlight-2 opacity-30 blur-2xl" />
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Marketing card</span>
            <CreditCard className="size-5" />
          </div>
          <div className="grid gap-1">
            <span className="text-lg tracking-widest tabular">•••• 9034</span>
            <span className="text-xs tabular">
              {formatCurrency(1240)} of {formatCurrency(2000)} limit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-grid" />
        <Container className="grid items-center gap-16 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div className="grid justify-items-start gap-6">
            <Badge variant="brand" className="stagger-0 motion-safe:animate-rise-in">
              <Sparkles /> New: automated month-end close
            </Badge>
            <Heading level={1} size="display" className="stagger-1 motion-safe:animate-rise-in">
              The finance OS for growing businesses
            </Heading>
            <Text size="lg" tone="muted" className="max-w-xl stagger-2 motion-safe:animate-rise-in">
              Ledgerly brings banking, cards, invoicing and reporting into one calm workspace — so
              you spend less time reconciling and more time running the business.
            </Text>
            <div className="flex flex-wrap gap-3 stagger-3 motion-safe:animate-rise-in">
              <Button asChild size="lg">
                <Link href="/signup">
                  Open an account <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">View live demo</Link>
              </Button>
            </div>
            <Text
              size="sm"
              tone="muted"
              className="flex items-center gap-2 stagger-4 motion-safe:animate-rise-in"
            >
              <BadgeCheck className="size-4 text-positive" /> No monthly fees on Starter. Cancel any
              time.
            </Text>
          </div>
          <ProductPreview />
        </Container>
      </section>

      {/* Logos */}
      <section aria-label="Trusted by" className="border-y bg-surface">
        <Container className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-8">
          {logos.map((logo) => (
            <span key={logo} className="text-lg font-semibold tracking-tight text-foreground-muted">
              {logo}
            </span>
          ))}
        </Container>
      </section>

      {/* Features */}
      {/* Always dark: `data-theme` remaps every semantic token inside, so stock components
          render as they do in dark mode. The spotlights set it apart from a dark page. */}
      <section
        id="features"
        data-theme="dark"
        className="relative isolate scroll-mt-16 overflow-hidden border-y bg-background text-foreground"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-50" />
        <div
          aria-hidden="true"
          className="absolute -top-48 left-1/4 -z-10 size-96 rounded-full bg-spotlight-1 opacity-25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-0 -bottom-48 -z-10 size-96 rounded-full bg-spotlight-2 opacity-25 blur-3xl"
        />
        <Container className="grid gap-12 py-24">
          <div className="mx-auto grid max-w-2xl reveal gap-4 text-center">
            <Text size="sm" weight="semibold" className="text-primary">
              Everything in one place
            </Text>
            <Heading level={2} size="xl">
              Replace your finance stack with one ledger
            </Heading>
            <Text tone="muted">
              Ledgerly connects the money coming in, the money going out and the reports in between.
            </Text>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body, span, demo }) => (
              <Card
                key={title}
                className={cn("relative isolate reveal gap-4 overflow-hidden", span)}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-glow-start to-transparent"
                />
                <CardHeader className="gap-4">
                  <span className="grid size-10 place-items-center rounded-lg bg-brand-subtle text-brand-subtle-foreground">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="grid flex-1 content-between gap-6">
                  <Text size="sm" tone="muted" className="max-w-prose">
                    {body}
                  </Text>
                  {demo}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground">
        <Container className="grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="grid reveal gap-1 text-center">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-sm">{stat.label}</span>
            </div>
          ))}
        </Container>
      </section>

      {/* Testimonials */}
      <section id="customers" className="scroll-mt-16">
        <Container className="grid gap-12 py-24">
          <Heading level={2} size="xl" className="text-center">
            Loved by operators who hate spreadsheets
          </Heading>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="reveal">
                <CardContent className="flex-1">
                  <figure className="grid h-full content-between gap-6">
                    <blockquote className="text-pretty">“{t.quote}”</blockquote>
                    <figcaption className="grid gap-0.5">
                      <Text as="span" size="sm" weight="semibold">
                        {t.name}
                      </Text>
                      <Text as="span" size="sm" tone="muted">
                        {t.title}
                      </Text>
                    </figcaption>
                  </figure>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section>
        <Container className="pb-24">
          {/* Surface, not brand-subtle: at panel size the dark-mode tint reads as a muddy hole,
              and neutral text and buttons clash with it. The glow echoes the hero instead. */}
          <div className="relative isolate grid reveal justify-items-center gap-6 overflow-hidden rounded-3xl border bg-surface px-6 py-16 text-center shadow-lg">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 -z-10 h-full bg-linear-to-b from-glow-start via-glow-mid to-transparent"
            />
            <Heading level={2} size="xl" className="max-w-xl">
              Close your books in days, not weeks
            </Heading>
            <Text tone="muted" className="max-w-lg">
              Join thousands of businesses that run their finances on Ledgerly. Setup takes about
              ten minutes.
            </Text>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Get started free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
