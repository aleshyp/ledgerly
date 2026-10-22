import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Progress,
  Text,
} from "@ledgerly/ui";
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  CreditCard,
  Landmark,
  Receipt,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { CountUpCurrency } from "@/components/count-up-currency";
import { accounts, budgets, testimonials, transactions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const features = [
  {
    icon: Landmark,
    title: "Business accounts",
    body: "Open operating, payroll and reserve accounts in minutes. FDIC-style protection, zero monthly fees.",
  },
  {
    icon: CreditCard,
    title: "Cards with guardrails",
    body: "Issue virtual and physical cards with per-merchant limits that enforce your budgets automatically.",
  },
  {
    icon: Workflow,
    title: "Automated reconciliation",
    body: "Every transaction is matched, categorized and receipt-checked before your accountant ever sees it.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Live cash flow",
    body: "See runway, burn and upcoming bills update in real time instead of waiting for month-end.",
  },
  {
    icon: Receipt,
    title: "Invoicing that gets paid",
    body: "Send branded invoices with card and ACH payments built in. Reminders go out on their own.",
  },
  {
    icon: ShieldCheck,
    title: "Controls & audit trail",
    body: "Approval chains, custom roles and an immutable audit log keep every dollar accountable.",
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
      <Card className="gap-5 shadow-xl">
        <CardHeader>
          <CardDescription>
            {operating.name} ···· {operating.mask}
          </CardDescription>
          <CardTitle className="text-3xl">
            <CountUpCurrency amount={operating.balance} delayMs={400} className="tabular" />
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
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
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
                <Link href="/login">
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
      <section aria-label="Trusted by" className="border-y bg-muted/50">
        <Container className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-8">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-lg font-semibold tracking-tight text-foreground-subtle"
            >
              {logo}
            </span>
          ))}
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16">
        <Container className="grid gap-12 py-24">
          <div className="mx-auto grid max-w-2xl reveal gap-4 text-center">
            <Text size="sm" weight="semibold" className="text-primary">
              Everything in one place
            </Text>
            <Heading level={2} size="xl">
              Replace five tools with one ledger
            </Heading>
            <Text tone="muted">
              Ledgerly connects the money coming in, the money going out and the reports in between.
            </Text>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="reveal gap-4">
                <CardHeader className="gap-4">
                  <span className="grid size-10 place-items-center rounded-lg bg-brand-subtle text-brand-subtle-foreground">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text size="sm" tone="muted">
                    {body}
                  </Text>
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
              <span className="text-sm opacity-80">{stat.label}</span>
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
              <Card key={t.name} className="reveal justify-between">
                <CardContent>
                  <blockquote className="text-pretty">“{t.quote}”</blockquote>
                </CardContent>
                <CardHeader className="gap-0.5">
                  <CardTitle className="text-sm">{t.name}</CardTitle>
                  <CardDescription>{t.title}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section>
        <Container className="pb-24">
          <div className="grid reveal justify-items-center gap-6 rounded-3xl border bg-brand-subtle px-6 py-16 text-center">
            <Heading level={2} size="xl" className="max-w-xl">
              Close your books in days, not weeks
            </Heading>
            <Text tone="muted" className="max-w-lg">
              Join thousands of businesses that run their finances on Ledgerly. Setup takes about
              ten minutes.
            </Text>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/login">Get started free</Link>
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
