"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Field, Heading, Input, Label, Separator, Text } from "@ledgerly/ui";
import { isEmail } from "@/lib/validation";

type Errors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const next: Errors = {};
    if (!isEmail(email)) next.email = "Enter a valid email address, like you@company.com.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);

    const firstInvalid = (["email", "password"] as const).find((k) => next[k]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setPending(true);
    // Simulate a network round-trip before entering the demo app.
    setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <>
      <div className="grid gap-2">
        <Heading level={1} size="lg">
          Welcome back
        </Heading>
        <Text size="sm" tone="muted">
          Sign in to your Ledgerly workspace.
        </Text>
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <Field label="Work email" error={errors.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@company.com"
            defaultValue="avery@northwindcoffee.co"
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue="demo-password"
          />
        </Field>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <Label htmlFor="remember">Remember me</Label>
          </div>
          <Button asChild variant="link" size="sm">
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" size="lg" loading={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <Text as="span" size="xs" tone="muted">
          or
        </Text>
        <Separator className="flex-1" />
      </div>
      <Button asChild variant="outline" size="lg">
        <Link href="/dashboard">Continue with SSO</Link>
      </Button>

      <Text size="sm" tone="muted" className="text-center">
        New to Ledgerly?{" "}
        <Button asChild variant="link" size="sm">
          <Link href="/signup">Create an account</Link>
        </Button>
      </Text>
    </>
  );
}
