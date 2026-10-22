import Link from "next/link";
import { Container, Separator, Text } from "@ledgerly/ui";
import { Logo } from "./logo";

const columns = [
  { title: "Product", links: ["Accounts", "Cards", "Invoicing", "Reporting"] },
  { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { title: "Resources", links: ["Help center", "Guides", "API docs", "Status"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <Container className="grid gap-10 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_repeat(3,1fr)]">
          <div className="grid content-start gap-3">
            <Logo />
            <Text size="sm" tone="muted" className="max-w-xs">
              The finance OS for growing businesses. Banking, spend and reporting in one calm
              workspace.
            </Text>
          </div>
          {columns.map((column) => (
            <div key={column.title} className="grid content-start gap-3">
              <Text as="div" size="sm" weight="semibold">
                {column.title}
              </Text>
              <ul className="grid gap-2">
                {column.links.map((label) => (
                  <li key={label}>
                    <Link href="/" className="text-sm text-foreground-muted hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
