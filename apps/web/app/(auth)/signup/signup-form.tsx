"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, Heading, Input, Text } from "@ledgerly/ui";
import { isEmail } from "@/lib/validation";

type Errors = Partial<Record<"name" | "email" | "company" | "password", string>>;

const MIN_PASSWORD = 12;
const fieldOrder = ["name", "email", "company", "password"] as const;

function validate(form: FormData) {
  const value = (key: string) => String(form.get(key) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = "Enter your full name.";
  if (!isEmail(value("email"))) errors.email = "Enter a valid email address, like you@company.com.";
  if (!value("company")) errors.company = "Enter your business name.";
  if (String(form.get("password") ?? "").length < MIN_PASSWORD) {
    errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  }
  return errors;
}

export function SignupForm({ planName }: { planName?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(new FormData(event.currentTarget));
    setSubmitted(true);
    setErrors(next);

    const firstInvalid = fieldOrder.find((k) => next[k]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setPending(true);
    // Simulate account creation, then drop into the demo workspace.
    setTimeout(() => router.push("/dashboard"), 900);
  }

  return (
    <>
      <div className="grid gap-2">
        <Heading level={1} size="lg">
          {planName ? `Start your ${planName} trial` : "Create your account"}
        </Heading>
        <Text size="sm" tone="muted">
          {planName
            ? "Free for 14 days, then billed on the plan you chose. Cancel any time."
            : "Starter is free. Upgrade when you need cards, budgets and automation."}
        </Text>
      </div>

      <form
        onSubmit={onSubmit}
        // After the first attempt, re-check as each field is corrected.
        onChange={(e) => submitted && setErrors(validate(new FormData(e.currentTarget)))}
        noValidate
        className="grid gap-5"
      >
        <Field label="Full name" required error={errors.name}>
          <Input name="name" autoComplete="name" />
        </Field>
        <Field label="Work email" required error={errors.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Business name" required error={errors.company}>
          <Input
            name="company"
            autoComplete="organization"
            placeholder="e.g. Northwind Coffee Co."
          />
        </Field>
        <Field
          label="Password"
          required
          description={`At least ${MIN_PASSWORD} characters.`}
          error={errors.password}
        >
          <Input name="password" type="password" autoComplete="new-password" />
        </Field>
        <Button type="submit" size="lg" loading={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <Text size="sm" tone="muted" className="text-center">
        Already have an account?{" "}
        <Button asChild variant="link" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
      </Text>
    </>
  );
}
