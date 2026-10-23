"use client";

import type * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "./field";

/**
 * Shared by Input, Textarea and SelectTrigger so every control looks and focuses the same.
 * Text is 16px on touch screens because iOS Safari zooms the page into smaller focused fields.
 */
export const controlStyles = [
  "w-full min-w-0 rounded-md border border-input bg-surface text-base text-foreground shadow-xs pointer-fine:text-sm",
  "transition-[color,border-color,box-shadow] duration-150 outline-none",
  "placeholder:text-foreground-subtle",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25",
  "aria-invalid:border-negative aria-invalid:focus-visible:ring-negative/25",
  "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
];

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  const fieldProps = useFieldControl(props);
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        controlStyles,
        "h-9 px-3 py-1",
        "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...fieldProps}
    />
  );
}
