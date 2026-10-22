"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Field, Heading, Input, Label, Separator, Text } from "@ledgerly/ui";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
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
        <Field label="Work email" error={error}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            defaultValue="avery@northwindcoffee.co"
          />
        </Field>
        <Field label="Password">
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
          <Button variant="link" size="sm" type="button">
            Forgot password?
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
      <Button variant="outline" size="lg" type="button" onClick={() => router.push("/dashboard")}>
        Continue with SSO
      </Button>
    </>
  );
}
