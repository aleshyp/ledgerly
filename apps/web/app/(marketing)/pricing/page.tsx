import type { Metadata } from "next";
import { Container, Heading, Text } from "@ledgerly/ui";
import { PricingPlans } from "./pricing-plans";

export const metadata: Metadata = { title: "Pricing" };

const faqs = [
  {
    q: "Is Ledgerly a bank?",
    a: "No — and in this demo, it isn’t anything at all. Ledgerly is a fictional company built to showcase a design system.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrades take effect immediately and downgrades apply at the end of your billing period.",
  },
  {
    q: "Do you offer discounts for nonprofits?",
    a: "Registered nonprofits get 50% off Growth and Scale. Contact sales with your documentation.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export everything as CSV or PDF for 90 days after cancelling.",
  },
];

export default function PricingPage() {
  return (
    <Container className="grid gap-16 py-20">
      <div className="mx-auto grid max-w-2xl gap-4 text-center">
        <Heading level={1} size="2xl">
          Simple pricing that scales with you
        </Heading>
        <Text tone="muted" size="lg">
          Start free. Upgrade when you need cards, budgets and automation.
        </Text>
      </div>

      <PricingPlans />

      <section className="mx-auto grid w-full max-w-3xl gap-8">
        <Heading level={2} size="lg" className="text-center">
          Frequently asked questions
        </Heading>
        <dl className="grid gap-6 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="grid content-start gap-2">
              <dt className="font-semibold">{faq.q}</dt>
              <dd className="text-sm text-foreground-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}
