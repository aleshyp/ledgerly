import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, Skeleton } from "@ledgerly/ui";
import { NewTransactionDialog } from "@/components/new-transaction-dialog";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/lib/data";
import { TransactionsTable } from "./transactions-table";

export const metadata: Metadata = { title: "Transactions" };

/** Same footprint as the table, so nothing shifts when the filters hydrate from the URL. */
function TableSkeleton() {
  return (
    <Card className="gap-4 py-4">
      <div className="flex flex-col gap-3 px-4 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 sm:w-44" />
        <Skeleton className="h-9 sm:w-36" />
      </div>
      <div className="grid gap-3 px-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    </Card>
  );
}

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Search, filter and categorize activity across every account."
        actions={<NewTransactionDialog />}
      />
      <Suspense fallback={<TableSkeleton />}>
        <TransactionsTable categories={categories} />
      </Suspense>
    </>
  );
}
