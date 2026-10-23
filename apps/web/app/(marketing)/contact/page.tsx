import type { Metadata } from "next";
import { Container, Heading, Text } from "@ledgerly/ui";
import { ContactForm } from "./contact-form";
import { isTopic } from "./topics";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Ledgerly sales or get help from support.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string | string[] }>;
}) {
  const { topic } = await searchParams;

  return (
    <Container className="grid max-w-2xl gap-10 py-20">
      <div className="grid gap-4 text-center">
        <Heading level={1} size="2xl">
          Talk to a person
        </Heading>
        <Text tone="muted" size="lg">
          Sales replies within one business day. Support answers around the clock.
        </Text>
      </div>
      <ContactForm defaultTopic={typeof topic === "string" && isTopic(topic) ? topic : "sales"} />
    </Container>
  );
}
