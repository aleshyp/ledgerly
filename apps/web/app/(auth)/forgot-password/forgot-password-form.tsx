"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  Heading,
  Input,
  Text,
} from "@ledgerly/ui";
import { MailCheck } from "lucide-react";
import { isEmail } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [sentTo, setSentTo] = useState<string>();
  const [pending, setPending] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!isEmail(email)) {
      setError("Enter a valid email address, like you@company.com.");
      event.currentTarget.querySelector<HTMLInputElement>("input[name=email]")?.focus();
      return;
    }
    setError(undefined);
    setPending(true);
    // Simulate the request so the loading state is visible.
    setTimeout(() => {
      setPending(false);
      setSentTo(email);
    }, 600);
  }

  return (
    <>
      <div className="grid gap-2">
        <Heading level={1} size="lg">
          Reset your password
        </Heading>
        <Text size="sm" tone="muted">
          Enter the email you sign in with and we’ll send you a reset link.
        </Text>
      </div>

      {sentTo ? (
        <Alert variant="success">
          <MailCheck />
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            If {sentTo} has a Ledgerly account, a reset link is on its way. It expires in 30
            minutes.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid gap-5">
          <Field label="Work email" error={error}>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="you@company.com"
            />
          </Field>
          <Button type="submit" size="lg" loading={pending}>
            {pending ? "Sending link…" : "Send reset link"}
          </Button>
        </form>
      )}

      <Button asChild variant="link" size="sm" className="justify-self-center">
        <Link href="/login">Back to sign in</Link>
      </Button>
    </>
  );
}
