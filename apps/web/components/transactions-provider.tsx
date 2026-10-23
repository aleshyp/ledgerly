"use client";

import { createContext, use, useState } from "react";
import type { Transaction } from "@/lib/data";

type TransactionsContextValue = {
  transactions: Transaction[];
  add: (transaction: Omit<Transaction, "id">) => Transaction;
  update: (id: string, patch: Partial<Omit<Transaction, "id">>) => void;
  remove: (id: string) => void;
  /** Put a removed transaction back, for undo. */
  restore: (transaction: Transaction) => void;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

// Newest first; Array.prototype.sort is stable, so same-day rows keep their order.
const byDateDesc = (a: Transaction, b: Transaction) => b.date.localeCompare(a.date);

let created = 0;

/**
 * Holds the demo’s transactions in memory for the app shell, so a transaction recorded on the
 * dashboard shows up on the transactions page. Nothing is persisted; a refresh resets it.
 */
export function TransactionsProvider({
  initial,
  children,
}: {
  initial: Transaction[];
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState(initial);

  const value: TransactionsContextValue = {
    transactions,
    add(input) {
      created += 1;
      const transaction = { ...input, id: `txn_new_${created}` };
      setTransactions((list) => [transaction, ...list].sort(byDateDesc));
      return transaction;
    },
    update(id, patch) {
      setTransactions((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    remove(id) {
      setTransactions((list) => list.filter((t) => t.id !== id));
    },
    restore(transaction) {
      setTransactions((list) =>
        list.some((t) => t.id === transaction.id) ? list : [...list, transaction].sort(byDateDesc),
      );
    },
  };

  return <TransactionsContext value={value}>{children}</TransactionsContext>;
}

export function useTransactions() {
  const context = use(TransactionsContext);
  if (!context) throw new Error("useTransactions must be used inside TransactionsProvider.");
  return context;
}
