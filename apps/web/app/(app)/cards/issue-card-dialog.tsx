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
  toast,
} from "@ledgerly/ui";
import { Plus } from "lucide-react";
import { team } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useCards } from "./cards-provider";

type Errors = Partial<Record<"name" | "limit", string>>;

function validate(form: FormData) {
  const name = String(form.get("name") ?? "").trim();
  const limitText = String(form.get("limit") ?? "")
    .trim()
    .replace(/[$,\s]/g, "");
  const limit = Number(limitText);

  const errors: Errors = {};
  if (!name) errors.name = "Enter what the card is for, like Office supplies.";
  if (!limitText || !Number.isFinite(limit) || limit <= 0) {
    errors.limit = "Enter a monthly limit greater than zero, like 500.";
  }

  return { errors, values: { name, limit } };
}

export function IssueCardDialog() {
  const { cards, add } = useCards();
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

    const firstInvalid = (["name", "limit"] as const).find((k) => result.errors[k]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const kind = form.get("kind") === "physical" ? "physical" : "virtual";
    const holder = String(form.get("holder") ?? team[0]!.name);
    // Demo card numbers only need to be distinct from the cards already on the page.
    const taken = new Set(cards.map((c) => c.mask));
    let mask = "";
    do mask = String(1000 + Math.floor(Math.random() * 9000));
    while (taken.has(mask));

    const card = add({ ...result.values, holder, kind, mask, status: "active" });
    setOpen(false);
    toast({
      variant: "success",
      title: "Card issued",
      description:
        kind === "physical"
          ? `${card.name} · ships to ${holder} in 5–7 business days.`
          : `${card.name} · ready to use, up to ${formatCurrency(card.limit)} a month.`,
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
          <Plus /> Issue card…
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue a card</DialogTitle>
          <DialogDescription>
            Charges post to the Company card account and count against the card’s monthly limit.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          id="issue-card"
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
            name="kind"
            defaultValue="virtual"
            aria-label="Card type"
            className="flex gap-6"
          >
            {[
              { value: "virtual", label: "Virtual" },
              { value: "physical", label: "Physical" },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`kind-${option.value}`} />
                <Label htmlFor={`kind-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <Field label="Card name" required error={errors.name}>
            <Input name="name" placeholder="e.g. Office supplies" autoComplete="off" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cardholder">
              <Select name="holder" defaultValue={team[0]!.name}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {team.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Monthly limit" required error={errors.limit}>
              <Input name="limit" inputMode="decimal" placeholder="500.00" autoComplete="off" />
            </Field>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="issue-card">
            Issue card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
