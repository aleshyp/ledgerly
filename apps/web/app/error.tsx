"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function RootError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="grid min-h-dvh place-items-center px-4">
      <ErrorState error={error} retry={retry} />
    </main>
  );
}
