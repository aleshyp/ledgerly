"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@ledgerly/ui";
import { CircleCheck } from "lucide-react";
import { isEmail } from "@/lib/validation";
import { type Topic, topics } from "./topics";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
const fieldOrder = ["name", "email", "message"] as const;

function validate(form: FormData) {
  const value = (key: string) => String(form.get(key) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = "Enter your name.";
  if (!isEmail(value("email"))) errors.email = "Enter a valid email address, like you@company.com.";
  if (value("message").length < 10) errors.message = "Tell us a little more, in a sentence or two.";
  return errors;
}

export function ContactForm({ defaultTopic }: { defaultTopic: Topic }) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(new FormData(event.currentTarget));
    setSubmitted(true);
    setErrors(next);

    const firstInvalid = fieldOrder.find((k) => next[k]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setPending(true);
    // Demo only: nothing is sent.
    setTimeout(() => {
      setPending(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Thanks — your message is in</AlertTitle>
        <AlertDescription>
          This is a demo, so nobody will actually reply. In the real product you’d hear back by
          email within one business day.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={onSubmit}
          // After the first attempt, re-check as each field is corrected.
          onChange={(e) => submitted && setErrors(validate(new FormData(e.currentTarget)))}
          noValidate
          className="grid gap-5"
        >
          <Field label="What can we help with?">
            <Select name="topic" defaultValue={defaultTopic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(topics).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required error={errors.name}>
              <Input name="name" autoComplete="name" />
            </Field>
            <Field label="Work email" required error={errors.email}>
              <Input name="email" type="email" autoComplete="email" spellCheck={false} />
            </Field>
          </div>
          <Field label="Message" required error={errors.message}>
            <Textarea name="message" rows={5} />
          </Field>
          <Button type="submit" className="justify-self-start" loading={pending}>
            {pending ? "Sending message…" : "Send message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
