"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@ledgerly/ui";
import { useTransactions } from "@/components/transactions-provider";
import type { Transaction } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const describe = (t: Transaction) =>
  `${t.merchant} · ${formatCurrency(t.amount, { signed: true })} · ${formatDate(t.date)}`;

/** Open while `transaction` is set. */
export function EditCategoryDialog({
  transaction,
  categories,
  onClose,
}: {
  transaction: Transaction | null;
  categories: string[];
  onClose: () => void;
}) {
  const { update } = useTransactions();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!transaction) return;
    const category = String(new FormData(event.currentTarget).get("category"));
    if (category !== transaction.category) {
      update(transaction.id, { category });
      toast({
        variant: "success",
        title: "Category updated",
        description: `${transaction.merchant} is now in ${category}.`,
      });
    }
    onClose();
  }

  return (
    <Dialog open={transaction !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>{transaction && describe(transaction)}</DialogDescription>
        </DialogHeader>
        <form id="edit-category" onSubmit={onSubmit}>
          <Field label="Category">
            <Select name="category" defaultValue={transaction?.category}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="edit-category">
            Save category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;

/** Open while `transaction` is set. Keeps only the file name: nothing is uploaded in the demo. */
export function ReceiptDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  const { update } = useTransactions();
  const [error, setError] = useState<string>();

  function close() {
    setError(undefined);
    onClose();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!transaction) return;
    const file = new FormData(event.currentTarget).get("receipt");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a photo or PDF of the receipt.");
      return;
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setError("Choose a file smaller than 10 MB.");
      return;
    }
    update(transaction.id, { receipt: file.name });
    toast({
      variant: "success",
      title: "Receipt attached",
      description: `${file.name} is attached to ${transaction.merchant}.`,
    });
    close();
  }

  return (
    <Dialog open={transaction !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction?.receipt ? "Replace receipt" : "Attach receipt"}</DialogTitle>
          <DialogDescription>{transaction && describe(transaction)}</DialogDescription>
        </DialogHeader>
        <form id="attach-receipt" onSubmit={onSubmit} noValidate>
          <Field
            label="Receipt"
            description={
              transaction?.receipt
                ? `Currently attached: ${transaction.receipt}. JPG, PNG or PDF, up to 10 MB.`
                : "JPG, PNG or PDF, up to 10 MB."
            }
            error={error}
          >
            <Input
              name="receipt"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={() => setError(undefined)}
            />
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="attach-receipt">
            Attach receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
