import { Badge } from "@ledgerly/ui";
import type { InvoiceStatus } from "@/lib/data";

export const invoiceStatusLabels = {
  draft: "Draft",
  open: "Open",
  overdue: "Overdue",
  paid: "Paid",
} as const satisfies Record<InvoiceStatus, string>;

const variants = {
  draft: "neutral",
  open: "info",
  overdue: "danger",
  paid: "success",
} as const satisfies Record<InvoiceStatus, string>;

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge variant={variants[status]}>{invoiceStatusLabels[status]}</Badge>;
}
