"use client";

import { useRef, useState } from "react";
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
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@ledgerly/ui";
import { Plus } from "lucide-react";
import { accounts, categories, demoToday } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { useTransactions } from "./transactions-provider";

type Errors = Partial<Record<"merchant" | "amount" | "date", string>>;

function validate(form: FormData) {
  const merchant = String(form.get("merchant") ?? "").trim();
  const amountText = String(form.get("amount") ?? "")
    .trim()
    .replace(/[$,\s]/g, "");
  const amount = Number(amountText);
  const date = String(form.get("date") ?? "");

  const errors: Errors = {};
  if (!merchant) errors.merchant = "Enter who you paid or who paid you.";
  if (!amountText || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Enter an amount greater than zero, like 84.20.";
  }
  if (!date) errors.date = "Choose the date of the transaction.";
  else if (date > demoToday) errors.date = "Choose today or an earlier date.";

  return { errors, values: { merchant, amount, date } };
}

export function NewTransactionDialog() {
  const { add } = useTransactions();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = validate(form);
    setSubmitted(true);
    setErrors(result.errors);

    const firstInvalid = (["merchant", "amount", "date"] as const).find((k) => result.errors[k]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const direction = form.get("direction") === "in" ? 1 : -1;
    const memo = String(form.get("memo") ?? "").trim();
    const transaction = add({
      merchant: result.values.merchant,
      amount: direction * result.values.amount,
      date: result.values.date,
      category: String(form.get("category") ?? categories[0]),
      account: String(form.get("account") ?? accounts[0]!.name),
      status: "completed",
      memo: memo || undefined,
    });
    setOpen(false);
    toast({
      variant: "success",
      title: "Transaction saved",
      description: `${transaction.merchant} · ${formatCurrency(transaction.amount, { signed: true })} · ${formatDate(transaction.date)}`,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setErrors({});
          setSubmitted(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus /> New transaction…
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record a transaction</DialogTitle>
          <DialogDescription>
            Add a manual transaction, like a cash expense or a check deposit.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          id="new-transaction"
          onSubmit={onSubmit}
          // After the first attempt, re-check as each field is corrected.
          onChange={() => {
            if (submitted && formRef.current) {
              setErrors(validate(new FormData(formRef.current)).errors);
            }
          }}
          noValidate
          className="grid gap-4"
        >
          <RadioGroup
            name="direction"
            defaultValue="out"
            aria-label="Direction"
            className="flex gap-6"
          >
            {[
              { value: "out", label: "Money out" },
              { value: "in", label: "Money in" },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`direction-${option.value}`} />
                <Label htmlFor={`direction-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <Field label="Merchant or payer" required error={errors.merchant}>
            <Input name="merchant" placeholder="e.g. Farmers market" autoComplete="off" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount" required error={errors.amount}>
              <Input name="amount" inputMode="decimal" placeholder="0.00" autoComplete="off" />
            </Field>
            <Field label="Date" required error={errors.date}>
              <Input name="date" type="date" defaultValue={demoToday} max={demoToday} />
            </Field>
            <Field label="Account">
              <Select name="account" defaultValue={accounts[0]!.name}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.name}>
                      {a.name} ···· {a.mask}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
