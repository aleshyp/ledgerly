import { Badge } from "@ledgerly/ui";
import type { TransactionStatus } from "@/lib/data";

const config = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
} as const satisfies Record<TransactionStatus, { label: string; variant: string }>;

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
