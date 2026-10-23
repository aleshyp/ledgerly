"use client";

import { Button, toast } from "@ledgerly/ui";
import { Download } from "lucide-react";
import type { Transaction } from "@/lib/data";
import { transactionsToCsv } from "@/lib/csv";
import { useTransactions } from "./transactions-provider";

/** Downloads transactions as CSV. Exports everything in the store unless `rows` narrows it. */
export function ExportButton({
  rows,
  filename = "ledgerly-transactions.csv",
}: {
  rows?: Transaction[];
  filename?: string;
}) {
  const { transactions } = useTransactions();
  const list = rows ?? transactions;

  function download() {
    const blob = new Blob([transactionsToCsv(list)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export ready",
      description: `${list.length} transaction${list.length === 1 ? "" : "s"} saved as ${filename}.`,
    });
  }

  return (
    <Button variant="outline" onClick={download} disabled={list.length === 0}>
      <Download /> Export CSV
    </Button>
  );
}
