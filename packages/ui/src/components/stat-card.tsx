import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Card, CardContent, CardDescription, CardHeader } from "./card";

const statValueVariants = cva("text-2xl font-semibold tabular", {
  variants: {
    /** Money direction only. Status (overdue, over limit) goes in a `Badge` in `meta`. */
    tone: {
      default: "",
      positive: "text-positive",
      negative: "text-negative",
    },
  },
  defaultVariants: { tone: "default" },
});

export type StatCardProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof statValueVariants> & {
    label: React.ReactNode;
    /** The headline number, already formatted. */
    value: React.ReactNode;
    /** A line under the value: a trend badge, a count or a comparison. */
    meta?: React.ReactNode;
    /** Anything below the meta line, such as a `Progress`. */
    children?: React.ReactNode;
  };

/** One headline number with its context, for a row of summary tiles above a page’s content. */
export function StatCard({
  label,
  value,
  meta,
  tone,
  className,
  children,
  ...props
}: StatCardProps) {
  return (
    <Card data-slot="stat-card" className={cn("gap-3", className)} {...props}>
      <CardHeader>
        <CardDescription className="font-medium">{label}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <p data-slot="stat-card-value" className={statValueVariants({ tone })}>
          {value}
        </p>
        {meta != null && meta !== false && (
          <div
            data-slot="stat-card-meta"
            className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted"
          >
            {meta}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
