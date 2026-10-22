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
  DialogTrigger,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@ledgerly/ui";
import { Plus } from "lucide-react";

export function NewTransactionDialog({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(new FormData(event.currentTarget).get("amount"));
    if (!amount) {
      setError("Enter an amount greater than zero.");
      return;
    }
    // Demo only: nothing is persisted.
    setError(undefined);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus /> New transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record a transaction</DialogTitle>
          <DialogDescription>
            Add a manual entry, like a cash expense or a check deposit.
          </DialogDescription>
        </DialogHeader>
        <form id="new-transaction" onSubmit={onSubmit} noValidate className="grid gap-4">
          <Field label="Merchant or payer" required>
            <Input name="merchant" placeholder="e.g. Farmers market" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount" required error={error}>
              <Input name="amount" inputMode="decimal" placeholder="0.00" />
            </Field>
            <Field label="Category">
              <Select name="category" defaultValue={categories[0]}>
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
          </div>
          <Field label="Memo" description="Visible to your accountant.">
            <Textarea name="memo" rows={2} />
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="new-transaction">
            Save transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
