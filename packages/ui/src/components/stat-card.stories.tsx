import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownRight, ArrowUpRight, TriangleAlert } from "lucide-react";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { StatCard } from "./stat-card";

const meta = {
  title: "Components/StatCard",
  component: StatCard,
  args: { label: "Money in", value: "$48,210.00" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { meta: "14 transactions" },
};

export const WithTrend: Story = {
  args: {
    meta: (
      <>
        <Badge variant="success">
          <ArrowUpRight />
          <span className="sr-only">Up</span>
          12.4%
        </Badge>
        vs. last month
      </>
    ),
  },
};

/** `tone` follows money direction. Pair it with a sign so color is never the only cue. */
export const Tones: Story = {
  render: () => (
    <div className="grid gap-4">
      <StatCard
        label="Net cash flow"
        value="+$6,420.00"
        tone="positive"
        meta="Across every account"
      />
      <StatCard
        label="Net cash flow"
        value="−$1,180.00"
        tone="negative"
        meta={
          <>
            <Badge variant="danger">
              <ArrowDownRight />
              <span className="sr-only">Down</span>
              18.2%
            </Badge>
            vs. last month
          </>
        }
      />
    </div>
  ),
};

/** Status, such as overdue, goes in a badge rather than recoloring the value. */
export const WithStatus: Story = {
  args: {
    label: "Overdue",
    value: "$5,850.00",
    meta: (
      <>
        2 invoices
        <Badge variant="warning">
          <TriangleAlert /> Oldest is 17 days late
        </Badge>
      </>
    ),
  },
};

export const WithProgress: Story = {
  args: {
    label: "Spent this month",
    value: "$3,412.80",
    meta: "of $4,100.00 in card limits",
    children: <Progress value={83} tone="primary" aria-label="Card limits used" />,
  },
};

export const NoMeta: Story = {};

export const LongContent: Story = {
  args: {
    label: "Paid by customers on the Northwind enterprise plan in October",
    value: "$1,284,560,210.75",
    meta: "Across 1,204 invoices from 312 customers",
  },
};
