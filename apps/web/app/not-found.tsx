import type { Metadata } from "next";
import Link from "next/link";
import { Button, Heading, Text } from "@ledgerly/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center px-4">
      <div className="grid max-w-md justify-items-center gap-4 text-center">
        <Text size="sm" weight="semibold" className="text-primary">
          404
        </Text>
        <Heading level={1}>This page isn’t on the books</Heading>
        <Text tone="muted">The page you’re looking for doesn’t exist or has been moved.</Text>
        <Button asChild className="mt-2">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
