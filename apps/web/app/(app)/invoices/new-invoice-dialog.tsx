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
  toast,
} from "@ledgerly/ui";
import { Plus } from "lucide-react";
import { addDays, demoToday, invoiceTermDays } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { useInvoices } from "./invoices-provider";

type Errors = Partial<Record<"customer" | "amount" | "due", string>>;

function validate(form: FormData) {
  const customer = String(form.get("customer") ?? "").trim();
  const amountText = String(form.get("amount") ?? "")
    .trim()
    .replace(/[$,\s]/g, "");
  const amount = Number(amountText);
  const due = String(form.get("due") ?? "");

  const errors: Errors = {};
  if (!customer) errors.customer = "Enter who you’re billing.";
  if (!amountText || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Enter an amount greater than zero, like 1,250.00.";
  }
  if (!due) errors.due = "Choose when payment is due.";
  else if (due < demoToday) errors.due = "Choose today or a later date.";

  return { errors, values: { customer, amount, due } };
}

export function NewInvoiceDialog() {
  const { add } = useInvoices();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validate(new FormData(event.currentTarget));
    setSubmitted(true);
    setErrors(result.errors);

    const firstInvalid = (["customer", "amount", "due"] as const).find((k) => result.errors[k]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const invoice = add({ ...result.values, issued: demoToday, state: "sent" });
    setOpen(false);
    toast({
      variant: "success",
      title: "Invoice sent",
      description: `${invoice.number} · ${invoice.customer} · ${formatCurrency(invoice.amount)} · due ${formatDate(invoice.due)}`,
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
          <Plus /> New invoice…
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send an invoice</DialogTitle>
          <DialogDescription>
            Your customer gets an email with a link to pay by card or ACH.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          id="new-invoice"
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
          <Field label="Customer" required error={errors.customer}>
            <Input name="customer" placeholder="e.g. Harbor Lane Café" autoComplete="off" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount" required error={errors.amount}>
              <Input name="amount" inputMode="decimal" placeholder="0.00" autoComplete="off" />
            </Field>
            <Field label="Due date" required error={errors.due}>
              <Input
                name="due"
                type="date"
                defaultValue={addDays(demoToday, invoiceTermDays)}
                min={demoToday}
              />
            </Field>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="new-invoice">
            Send invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
