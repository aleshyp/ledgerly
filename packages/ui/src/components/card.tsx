import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "../lib/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-border bg-surface py-6 text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

export type CardTitleProps = React.ComponentProps<"h3"> & {
  /** Document outline level. Pick it by structure; the visual size stays the same. */
  level?: 2 | 3 | 4 | 5 | 6;
  /** Render the child element instead, for a title that isn't a heading (a balance, a name). */
  asChild?: boolean;
};

export function CardTitle({ level = 3, asChild = false, className, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot.Root : (`h${level}` as const);
  return (
    <Comp
      data-slot="card-title"
      className={cn("text-base leading-tight font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-foreground-muted", className)}
      {...props}
    />
  );
}

/** Top-right slot in a CardHeader, for a button or menu. */
export function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center px-6", className)} {...props} />
  );
}
