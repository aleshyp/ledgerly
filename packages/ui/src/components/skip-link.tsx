import type * as React from "react";
import { cn } from "../lib/cn";

export type SkipLinkProps = React.ComponentProps<"a">;

/**
 * First focusable element on every page. Hidden until focused, then jumps keyboard and
 * screen-reader users past the navigation. Give the page's `<main>` the matching `id`.
 */
export function SkipLink({
  href = "#main-content",
  className,
  children = "Skip to content",
  ...props
}: SkipLinkProps) {
  return (
    <a
      data-slot="skip-link"
      href={href}
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-(--ld-z-toast)",
        "rounded-md bg-surface-raised px-4 py-2 text-sm font-medium text-foreground shadow-lg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
