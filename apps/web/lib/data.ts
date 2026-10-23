/* Fictional data for the Ledgerly demo. Nothing here is real. */

export const currentUser = {
  name: "Avery Chen",
  email: "avery@northwindcoffee.co",
  role: "Finance lead",
  company: "Northwind Coffee Co.",
};

export type Account = {
  id: string;
  name: string;
  institution: string;
  mask: string;
  balance: number;
  type: "checking" | "savings" | "credit";
};

export const accounts: Account[] = [
  {
    id: "acc_op",
    name: "Operating",
    institution: "Ledgerly",
    mask: "4821",
    balance: 84320.18,
    type: "checking",
  },
  {
    id: "acc_pay",
    name: "Payroll",
    institution: "Ledgerly",
    mask: "1937",
    balance: 22100.0,
    type: "checking",
  },
  {
    id: "acc_res",
    name: "Tax reserve",
    institution: "Ledgerly",
    mask: "7710",
    balance: 150000.0,
    type: "savings",
  },
  {
    id: "acc_cc",
    name: "Company card",
    institution: "Ledgerly",
    mask: "0042",
    balance: -4212.55,
    type: "credit",
  },
];

/** The demo is frozen on this day, so dates stay believable and renders stay pure. */
export const demoToday = "2026-10-22";

export type TransactionStatus = "completed" | "pending" | "failed";

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  status: TransactionStatus;
  memo?: string;
  receipt?: string;
  /** The company card a charge on the credit account was made with. */
  card?: string;
};

export const transactions: Transaction[] = [
  {
    id: "txn_01",
    date: "2026-10-21",
    merchant: "Stripe payout",
    category: "Revenue",
    account: "Operating",
    amount: 12400.0,
    status: "completed",
  },
  {
    id: "txn_02",
    date: "2026-10-21",
    merchant: "Figma",
    category: "Software",
    account: "Company card",
    amount: -45.0,
    status: "completed",
    card: "card_sw",
  },
  {
    id: "txn_03",
    date: "2026-10-20",
    merchant: "Blue Bottle Roasters",
    category: "Inventory",
    account: "Operating",
    amount: -6840.25,
    status: "pending",
  },
  {
    id: "txn_04",
    date: "2026-10-20",
    merchant: "Delta Air Lines",
    category: "Travel",
    account: "Company card",
    amount: -684.2,
    status: "completed",
    card: "card_travel",
  },
  {
    id: "txn_05",
    date: "2026-10-19",
    merchant: "Gusto",
    category: "Payroll",
    account: "Payroll",
    amount: -18250.0,
    status: "completed",
  },
  {
    id: "txn_06",
    date: "2026-10-18",
    merchant: "AWS",
    category: "Infrastructure",
    account: "Company card",
    amount: -1218.4,
    status: "completed",
    card: "card_cloud",
  },
  {
    id: "txn_07",
    date: "2026-10-18",
    merchant: "Shopify payout",
    category: "Revenue",
    account: "Operating",
    amount: 8932.6,
    status: "completed",
  },
  {
    id: "txn_08",
    date: "2026-10-17",
    merchant: "WeWork",
    category: "Rent",
    account: "Operating",
    amount: -4500.0,
    status: "completed",
  },
  {
    id: "txn_09",
    date: "2026-10-16",
    merchant: "Notion",
    category: "Software",
    account: "Company card",
    amount: -96.0,
    status: "completed",
    card: "card_sw",
  },
  {
    id: "txn_10",
    date: "2026-10-15",
    merchant: "Square payout",
    category: "Revenue",
    account: "Operating",
    amount: 5210.45,
    status: "completed",
  },
  {
    id: "txn_11",
    date: "2026-10-15",
    merchant: "Uber",
    category: "Travel",
    account: "Company card",
    amount: -38.9,
    status: "completed",
    card: "card_travel",
  },
  {
    id: "txn_12",
    date: "2026-10-14",
    merchant: "Pacific Gas & Electric",
    category: "Utilities",
    account: "Operating",
    amount: -912.33,
    status: "pending",
  },
  {
    id: "txn_13",
    date: "2026-10-13",
    merchant: "Google Workspace",
    category: "Software",
    account: "Company card",
    amount: -216.0,
    status: "completed",
    card: "card_sw",
  },
  {
    id: "txn_14",
    date: "2026-10-12",
    merchant: "Transfer to Tax reserve",
    category: "Transfer",
    account: "Operating",
    amount: -10000.0,
    status: "completed",
  },
  {
    id: "txn_15",
    date: "2026-10-11",
    merchant: "Equal Exchange Co-op",
    category: "Inventory",
    account: "Operating",
    amount: -3125.0,
    status: "completed",
  },
  {
    id: "txn_16",
    date: "2026-10-10",
    merchant: "Stripe payout",
    category: "Revenue",
    account: "Operating",
    amount: 11875.2,
    status: "completed",
  },
  {
    id: "txn_17",
    date: "2026-10-09",
    merchant: "Linear",
    category: "Software",
    account: "Company card",
    amount: -64.0,
    status: "failed",
    card: "card_sw",
  },
  {
    id: "txn_18",
    date: "2026-10-08",
    merchant: "Hiscox",
    category: "Insurance",
    account: "Operating",
    amount: -389.0,
    status: "completed",
  },
];

export const categories = Array.from(new Set(transactions.map((t) => t.category))).sort();

export type Budget = { category: string; spent: number; limit: number };

/** Spend that counts against a budget: money out that went through or is about to. */
export function categorySpend(list: Transaction[], category: string) {
  return list
    .filter((t) => t.category === category && t.amount < 0 && t.status !== "failed")
    .reduce((sum, t) => sum - t.amount, 0);
}

const budgetLimits = { Software: 600, Travel: 1500, Inventory: 11000, Infrastructure: 1200 };

export const budgets: Budget[] = Object.entries(budgetLimits).map(([category, limit]) => ({
  category,
  limit,
  spent: categorySpend(transactions, category),
}));

export const team = [
  { name: currentUser.name, role: currentUser.role },
  { name: "Sam Okafor", role: "Operations manager" },
  { name: "Riley Santos", role: "Events lead" },
];

export type CardStatus = "active" | "frozen";

export type CompanyCard = {
  id: string;
  /** What the card is for, shown as its title. */
  name: string;
  holder: string;
  mask: string;
  kind: "virtual" | "physical";
  status: CardStatus;
  /** Monthly spend limit. */
  limit: number;
};

export const companyCards: CompanyCard[] = [
  {
    id: "card_sw",
    name: "Software subscriptions",
    holder: "Avery Chen",
    mask: "3307",
    kind: "virtual",
    status: "active",
    limit: 600,
  },
  {
    id: "card_travel",
    name: "Travel",
    holder: "Sam Okafor",
    mask: "5518",
    kind: "physical",
    status: "active",
    limit: 1500,
  },
  {
    id: "card_cloud",
    name: "Cloud hosting",
    holder: "Avery Chen",
    mask: "9264",
    kind: "virtual",
    status: "active",
    limit: 1500,
  },
  {
    id: "card_events",
    name: "Farmers market stall",
    holder: "Riley Santos",
    mask: "6043",
    kind: "physical",
    status: "frozen",
    limit: 500,
  },
];

/** Spend that counts against a card’s limit, on the same terms as `categorySpend`. */
export function cardSpend(list: Transaction[], cardId: string) {
  return list
    .filter((t) => t.card === cardId && t.amount < 0 && t.status !== "failed")
    .reduce((sum, t) => sum - t.amount, 0);
}

/** `draft` and `sent` are stored; whether a sent invoice is open or overdue depends on the day. */
export type InvoiceState = "draft" | "sent" | "paid";
export type InvoiceStatus = "draft" | "open" | "overdue" | "paid";

export type Invoice = {
  id: string;
  number: string;
  customer: string;
  issued: string;
  due: string;
  amount: number;
  state: InvoiceState;
  paidOn?: string;
};

export function invoiceStatus(invoice: Invoice, today = demoToday): InvoiceStatus {
  if (invoice.state === "sent") return invoice.due < today ? "overdue" : "open";
  return invoice.state;
}

/** Adds days to an ISO date, in UTC so no time zone can shift the result. */
export function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whole days from one ISO date to another, in UTC like `addDays`. */
export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000);
}

/** Net 30. */
export const invoiceTermDays = 30;

export const invoices: Invoice[] = [
  {
    id: "inv_1048",
    number: "INV-1048",
    customer: "Harbor Lane Café",
    issued: "2026-10-22",
    due: "2026-11-21",
    amount: 2180.0,
    state: "draft",
  },
  {
    id: "inv_1047",
    number: "INV-1047",
    customer: "Copperleaf Hotel",
    issued: "2026-10-20",
    due: "2026-11-19",
    amount: 5640.0,
    state: "sent",
  },
  {
    id: "inv_1046",
    number: "INV-1046",
    customer: "Fernhill Bakery",
    issued: "2026-10-15",
    due: "2026-11-14",
    amount: 3215.5,
    state: "sent",
  },
  {
    id: "inv_1045",
    number: "INV-1045",
    customer: "Marlow & Finch Grocers",
    issued: "2026-10-08",
    due: "2026-11-07",
    amount: 4980.0,
    state: "paid",
    paidOn: "2026-10-18",
  },
  {
    id: "inv_1044",
    number: "INV-1044",
    customer: "Tidewater Cycles",
    issued: "2026-09-30",
    due: "2026-10-30",
    amount: 1120.75,
    state: "paid",
    paidOn: "2026-10-14",
  },
  {
    id: "inv_1043",
    number: "INV-1043",
    customer: "Fernhill Bakery",
    issued: "2026-09-15",
    due: "2026-10-15",
    amount: 2890.0,
    state: "paid",
    paidOn: "2026-10-10",
  },
  {
    id: "inv_1042",
    number: "INV-1042",
    customer: "Atlas Studio",
    issued: "2026-09-12",
    due: "2026-10-12",
    amount: 640.0,
    state: "sent",
  },
  {
    id: "inv_1041",
    number: "INV-1041",
    customer: "Copperleaf Hotel",
    issued: "2026-09-05",
    due: "2026-10-05",
    amount: 5210.0,
    state: "sent",
  },
];

export type Plan = {
  name: string;
  description: string;
  monthly: number;
  annual: number;
  features: string[];
  featured?: boolean;
  cta: string;
  href: string;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    description: "For new businesses getting their books in order.",
    monthly: 0,
    annual: 0,
    cta: "Start for free",
    href: "/signup?plan=starter",
    features: [
      "1 business account",
      "2 team members",
      "Expense categorization",
      "Monthly statements",
    ],
  },
  {
    name: "Growth",
    description: "For teams that want spend controls and automation.",
    monthly: 39,
    annual: 32,
    featured: true,
    cta: "Start 14-day trial",
    href: "/signup?plan=growth",
    features: [
      "Unlimited accounts",
      "10 team members",
      "Virtual & physical cards",
      "Budgets and approvals",
      "Automated reconciliation",
      "QuickBooks & Xero sync",
    ],
  },
  {
    name: "Scale",
    description: "For finance teams running multiple entities.",
    monthly: 129,
    annual: 108,
    cta: "Talk to sales",
    href: "/contact?topic=sales",
    features: [
      "Everything in Growth",
      "Unlimited team members",
      "Multi-entity consolidation",
      "Custom roles & audit log",
      "Dedicated account manager",
    ],
  },
];

export const testimonials = [
  {
    quote:
      "We closed the books in two days instead of two weeks. Ledgerly is the first finance tool our whole team actually opens.",
    name: "Priya Raman",
    title: "COO, Fernhill Bakery",
  },
  {
    quote:
      "Budgets that update in real time changed how we talk about spend. No more month-end surprises.",
    name: "Marcus Oyelaran",
    title: "Founder, Tidewater Cycles",
  },
  {
    quote:
      "Setup took an afternoon. Our accountant now gets clean, categorized exports every Friday.",
    name: "Lena Fischer",
    title: "Finance Manager, Atlas Studio",
  },
];

export type CashFlowMonth = {
  /** ISO year-month, e.g. `2026-10`. Format it with `formatMonth`. */
  month: string;
  moneyIn: number;
  moneyOut: number;
};

/** Last six months. The KPI tiles are derived from the last two. */
export const cashFlow: CashFlowMonth[] = [
  { month: "2026-05", moneyIn: 96420, moneyOut: 64180 },
  { month: "2026-06", moneyIn: 101850, moneyOut: 66940 },
  { month: "2026-07", moneyIn: 98230, moneyOut: 72510 },
  { month: "2026-08", moneyIn: 108760, moneyOut: 67320 },
  { month: "2026-09", moneyIn: 114715, moneyOut: 69074 },
  { month: "2026-10", moneyIn: 128940, moneyOut: 71215.62 },
];

export type Kpi = {
  label: string;
  value: number;
  /** Percent change against the comparison period in `hint`. */
  change: number;
  /** Whether a rising number is good news (revenue) or bad news (spend). */
  goodWhen: "up" | "down";
  hint: string;
};

const percentChange = (now: number, before: number) =>
  Math.round(((now - before) / Math.abs(before)) * 1000) / 10;

const thisMonth = cashFlow.at(-1)!;
const lastMonth = cashFlow.at(-2)!;

export const kpis: Kpi[] = [
  {
    label: "Cash on hand",
    // Card debt isn't cash, so the credit account is left out.
    value: accounts.filter((a) => a.type !== "credit").reduce((sum, a) => sum + a.balance, 0),
    change: 8.2,
    goodWhen: "up",
    hint: "vs. last month",
  },
  {
    label: "Money in",
    value: thisMonth.moneyIn,
    change: percentChange(thisMonth.moneyIn, lastMonth.moneyIn),
    goodWhen: "up",
    hint: "vs. last month",
  },
  {
    label: "Money out",
    value: thisMonth.moneyOut,
    change: percentChange(thisMonth.moneyOut, lastMonth.moneyOut),
    goodWhen: "down",
    hint: "vs. last month",
  },
  {
    label: "Net cash flow",
    value: thisMonth.moneyIn - thisMonth.moneyOut,
    change: percentChange(
      thisMonth.moneyIn - thisMonth.moneyOut,
      lastMonth.moneyIn - lastMonth.moneyOut,
    ),
    goodWhen: "up",
    hint: "vs. last month",
  },
];
