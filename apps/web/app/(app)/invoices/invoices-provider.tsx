"use client";

import { createContext, use, useState } from "react";
import type { Invoice } from "@/lib/data";

type InvoicesContextValue = {
  invoices: Invoice[];
  /** Creates the invoice with the next number in sequence. */
  add: (invoice: Omit<Invoice, "id" | "number">) => Invoice;
  /** Swap in a new version of an invoice, or put back an old one for undo. */
  replace: (invoice: Invoice) => void;
};

const InvoicesContext = createContext<InvoicesContextValue | null>(null);

const sequence = (invoice: Invoice) => Number(invoice.number.replace(/\D/g, ""));

/** Holds the page’s invoices in memory, so the header’s dialog and the table share them. */
export function InvoicesProvider({
  initial,
  children,
}: {
  initial: Invoice[];
  children: React.ReactNode;
}) {
  const [invoices, setInvoices] = useState(initial);

  const value: InvoicesContextValue = {
    invoices,
    add(input) {
      const next = Math.max(0, ...invoices.map(sequence)) + 1;
      const invoice = { ...input, id: `inv_${next}`, number: `INV-${next}` };
      setInvoices((list) => [invoice, ...list]);
      return invoice;
    },
    replace(invoice) {
      setInvoices((list) => list.map((i) => (i.id === invoice.id ? invoice : i)));
    },
  };

  return <InvoicesContext value={value}>{children}</InvoicesContext>;
}

export function useInvoices() {
  const context = use(InvoicesContext);
  if (!context) throw new Error("useInvoices must be used inside InvoicesProvider.");
  return context;
}
