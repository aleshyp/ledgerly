"use client";

import type * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "./field";
import { controlStyles } from "./input";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const fieldProps = useFieldControl(props);
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlStyles, "field-sizing-content min-h-20 px-3 py-2", className)}
      {...fieldProps}
    />
  );
}
