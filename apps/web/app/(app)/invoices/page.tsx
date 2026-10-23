import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, Skeleton } from "@ledgerly/ui";
import { PageHeader } from "@/components/page-header";
import { invoices } from "@/lib/data";
import { InvoiceSummary } from "./invoice-summary";
import { InvoicesProvider } from "./invoices-provider";
import { InvoicesTable } from "./invoices-table";
import { NewInvoiceDialog } from "./new-invoice-dialog";

export const metadata: Metadata = { title: "Invoices" };

/** Same footprint as the table, so nothing shifts when the filter hydrates from the URL. */
function TableSkeleton() {
  return (
    <Card className="gap-4 py-4">
      <div className="px-4">
        <Skeleton className="h-9 sm:w-44" />
      </div>
      <div className="grid gap-3 px-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    </Card>
  );
}

export default function InvoicesPage() {
  return (
    <InvoicesProvider initial={invoices}>
      <PageHeader
        title="Invoices"
        description="Bill customers, see what’s outstanding and follow up on late payments."
        actions={<NewInvoiceDialog />}
      />
      <InvoiceSummary />
      <Suspense fallback={<TableSkeleton />}>
        <InvoicesTable />
      </Suspense>
    </InvoicesProvider>
  );
}
