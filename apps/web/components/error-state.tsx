import Link from "next/link";
import { Button, Heading, Text } from "@ledgerly/ui";

/** Server errors arrive with a `digest` that matches the server log entry. */
function errorReference(error: unknown) {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }
}

export function ErrorState({
  error,
  retry,
  homeHref = "/",
  homeLabel = "Back to home",
}: {
  error: unknown;
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
}) {
  const reference = errorReference(error);

  return (
    <div className="grid max-w-md justify-items-center gap-4 justify-self-center py-16 text-center">
      <Text size="sm" weight="semibold" className="text-negative">
        Something went wrong
      </Text>
      <Heading level={1}>We couldn’t load this page</Heading>
      <Text tone="muted">Try again in a moment, or head back and pick up where you left off.</Text>
      {reference && (
        <Text size="xs" tone="muted">
          Reference: <span className="font-mono">{reference}</span>
        </Text>
      )}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href={homeHref}>{homeLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
