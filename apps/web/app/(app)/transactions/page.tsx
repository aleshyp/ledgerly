import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { categories, transactions } from "@/lib/data";
import { NewTransactionDialog } from "./new-transaction-dialog";
import { TransactionsTable } from "./transactions-table";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Search, filter and categorize activity across every account."
        actions={<NewTransactionDialog categories={categories} />}
      />
      <TransactionsTable transactions={transactions} categories={categories} />
    </>
  );
}
