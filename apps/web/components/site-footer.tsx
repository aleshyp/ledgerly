import Link from "next/link";
import { Container, Separator, Text } from "@ledgerly/ui";
import { repoUrl, storybookUrl } from "@/lib/site";
import { Logo } from "./logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Live demo", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Customers", href: "/#customers" },
      { label: "Contact sales", href: "/contact" },
      { label: "Support", href: "/contact?topic=support" },
    ],
  },
  {
    title: "About this demo",
    links: [
      { label: "Design system docs", href: storybookUrl },
      { label: "Source on GitHub", href: repoUrl },
    ],
  },
];

const linkClass =
  "rounded-xs text-sm text-foreground-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <Container className="grid gap-10 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_repeat(3,1fr)]">
          <div className="grid content-start gap-3">
            <Logo />
            <Text size="sm" tone="muted" className="max-w-xs">
              The finance OS for growing businesses. Banking, cards, invoicing and reporting in one
              calm workspace.
            </Text>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="grid content-start gap-3">
              <Text as="div" size="sm" weight="semibold">
                {column.title}
              </Text>
              <ul className="grid gap-2">
                {column.links.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith("http") ? (
                      <a href={href} className={linkClass}>
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className={linkClass}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <Text size="xs" tone="muted">
            © 2026 Ledgerly, Inc. Ledgerly is a fictional company created for a portfolio demo.
          </Text>
          <Text size="xs" tone="muted">
            Not a bank. No real money moves here.
          </Text>
        </div>
      </Container>
    </footer>
  );
}
