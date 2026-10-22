"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

// Renders inside the app shell, so the sidebar and header stay usable.
export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState error={error} retry={retry} homeHref="/dashboard" homeLabel="Go to dashboard" />
  );
}
