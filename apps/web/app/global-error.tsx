"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";
import "./globals.css";

// Replaces the root layout when it fails, so it brings its own document and styles.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh">
        <title>Something went wrong · Ledgerly</title>
        <main id="main-content" className="grid min-h-dvh place-items-center px-4">
          <ErrorState error={error} retry={retry} />
        </main>
      </body>
    </html>
  );
}
