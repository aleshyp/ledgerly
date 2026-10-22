import Link from "next/link";
import { Button, Container } from "@ledgerly/ui";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#customers", label: "Customers" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-(--ld-z-sticky) border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-8">
        <Link
          href="/"
          aria-label="Ledgerly home"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get started</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
