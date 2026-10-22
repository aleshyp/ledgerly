import type { Metadata } from "next";
import Link from "next/link";
import { Text } from "@ledgerly/ui";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main id="main-content" className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" aria-label="Ledgerly home" className="w-fit">
          <Logo />
        </Link>
        <div className="mx-auto grid w-full max-w-sm flex-1 content-center gap-8 py-12">
          <LoginForm />
        </div>
        <Text size="xs" tone="muted">
          Demo only — any email and password will sign you in.
        </Text>
      </div>
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-spotlight-1),transparent_55%),radial-gradient(circle_at_80%_80%,var(--color-spotlight-2),transparent_50%)] opacity-70"
        />
        <figure className="relative flex h-full flex-col justify-end gap-6 p-12 text-primary-foreground">
          <blockquote className="max-w-md text-2xl font-medium text-balance">
            “Ledgerly gave us a real-time view of cash for the first time. Month-end used to be a
            dread; now it’s a Tuesday.”
          </blockquote>
          <figcaption className="text-sm opacity-80">Priya Raman — COO, Fernhill Bakery</figcaption>
        </figure>
      </div>
    </main>
  );
}
