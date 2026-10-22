import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { merchant: "Figma", category: "Software", date: "Oct 18", amount: -45, status: "Completed" },
  {
    merchant: "Stripe payout",
    category: "Revenue",
    date: "Oct 17",
    amount: 12400,
    status: "Completed",
  },
  {
    merchant: "Delta Air Lines",
    category: "Travel",
    date: "Oct 16",
    amount: -684.2,
    status: "Pending",
  },
  { merchant: "Gusto", category: "Payroll", date: "Oct 15", amount: -18250, status: "Completed" },
  {
    merchant: "AWS",
    category: "Infrastructure",
    date: "Oct 14",
    amount: -1218.4,
    status: "Failed",
  },
] as const;

const statusVariant = { Completed: "success", Pending: "warning", Failed: "danger" } as const;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const Transactions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Merchant</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.merchant}>
            <TableCell className="font-medium">{row.merchant}</TableCell>
            <TableCell className="text-foreground-muted">{row.category}</TableCell>
            <TableCell className="text-foreground-muted">{row.date}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
            </TableCell>
            <TableCell
              className={`text-right font-medium tabular ${row.amount > 0 ? "text-positive" : ""}`}
            >
              {row.amount > 0 ? "+" : ""}
              {currency.format(row.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
