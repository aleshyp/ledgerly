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

export type Kpi = {
  label: string;
  value: number;
  change: number;
  /** Whether a rising number is good news (revenue) or bad news (spend). */
  goodWhen: "up" | "down";
  hint: string;
};

export const kpis: Kpi[] = [
  {
    label: "Cash on hand",
    value: 256420.18,
    change: 8.2,
    goodWhen: "up",
    hint: "Across all accounts",
  },
  { label: "Revenue (Oct)", value: 128940.0, change: 12.4, goodWhen: "up", hint: "vs. September" },
  { label: "Spend (Oct)", value: 71215.62, change: 3.1, goodWhen: "down", hint: "vs. September" },
  { label: "Runway", value: 18, change: 2, goodWhen: "up", hint: "Months at current burn" },
];

export type TransactionStatus = "completed" | "pending" | "failed";

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  status: TransactionStatus;
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
    status: "failed",
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

export const budgets: Budget[] = [
  { category: "Software", spent: 421, limit: 600 },
  { category: "Travel", spent: 723.1, limit: 1500 },
  { category: "Inventory", spent: 9965.25, limit: 11000 },
  { category: "Infrastructure", spent: 1218.4, limit: 1200 },
];

export type Plan = {
  name: string;
  description: string;
  monthly: number;
  annual: number;
  features: string[];
  featured?: boolean;
  cta: string;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    description: "For new businesses getting their books in order.",
    monthly: 0,
    annual: 0,
    cta: "Start for free",
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

export type CashFlowMonth = { month: string; moneyIn: number; moneyOut: number };

/** Last six months. October matches the KPI tiles. */
export const cashFlow: CashFlowMonth[] = [
  { month: "May", moneyIn: 96420, moneyOut: 64180 },
  { month: "Jun", moneyIn: 101850, moneyOut: 66940 },
  { month: "Jul", moneyIn: 98230, moneyOut: 72510 },
  { month: "Aug", moneyIn: 108760, moneyOut: 67320 },
  { month: "Sep", moneyIn: 114715, moneyOut: 69074 },
  { month: "Oct", moneyIn: 128940, moneyOut: 71215.62 },
];
