"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toast as ToastPrimitive } from "radix-ui";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "../lib/cn";

export const ToastProvider = ToastPrimitive.Provider;

export function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed right-0 bottom-0 z-(--ld-z-toast) flex w-full flex-col gap-2 p-4 outline-none sm:max-w-sm",
        "pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  [
    "grid grid-cols-[auto_1fr_auto] items-start gap-x-3 gap-y-1 rounded-lg border bg-surface-raised p-4 text-sm text-foreground shadow-lg",
    "data-[state=closed]:animate-fade-out data-[state=open]:animate-slide-up",
    "data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)",
    "data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-fade-out",
    "[&>svg]:mt-0.5 [&>svg]:size-4",
  ],
  {
    variants: {
      variant: {
        neutral: "border-border",
        success: "border-border [&>svg]:text-success",
        danger: "border-danger/40 [&>svg]:text-negative",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export type ToastProps = React.ComponentProps<typeof ToastPrimitive.Root> &
  VariantProps<typeof toastVariants>;

export function Toast({ className, variant, ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      // Errors interrupt; everything else waits for the screen reader to finish.
      type={variant === "danger" ? "foreground" : "background"}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
}

export function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("col-start-2 font-semibold", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("col-start-2 text-foreground-muted", className)}
      {...props}
    />
  );
}

/** `altText` tells screen-reader users how to do the same thing without the toast. */
export function ToastAction({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "col-start-2 mt-1 inline-flex h-8 w-fit items-center rounded-md border border-border-strong bg-surface px-3 text-sm font-medium",
        "transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Dismiss notification"
      className={cn(
        "relative col-start-3 row-start-1 -mt-1 -mr-1 grid size-6 place-items-center rounded-sm text-foreground-muted",
        "pointer-coarse:after:absolute pointer-coarse:after:-inset-2",
        "transition-colors hover:bg-accent hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      <X className="size-4" />
    </ToastPrimitive.Close>
  );
}

/* ----------------------------------------------------------------------------
 * Imperative API: render <Toaster /> once, then call toast() from any handler.
 * ------------------------------------------------------------------------- */

export type ToastOptions = {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: "neutral" | "success" | "danger";
  action?: { label: string; altText: string; onClick: () => void };
};

type ToastEntry = ToastOptions & { id: number; open: boolean };

let entries: ToastEntry[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => entries;
const noEntries: ToastEntry[] = [];
const getServerSnapshot = () => noEntries;

/** Show a notification. Returns its id for `dismissToast`. */
export function toast(options: ToastOptions) {
  const id = nextId++;
  // Closed entries have finished animating out by the time another toast arrives.
  entries = [...entries.filter((entry) => entry.open), { ...options, id, open: true }].slice(-3);
  emit();
  return id;
}

export function dismissToast(id: number) {
  entries = entries.map((entry) => (entry.id === id ? { ...entry, open: false } : entry));
  emit();
}

const icons = { neutral: null, success: CircleCheck, danger: CircleAlert } as const;

/** Renders notifications queued with `toast()`. Mount once near the root. */
export function Toaster({ duration = 5000 }: { duration?: number }) {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ToastProvider duration={duration} swipeDirection="right" label="Notifications">
      {items.map(({ id, open, title, description, variant = "neutral", action }) => {
        const Icon = icons[variant];
        return (
          <Toast
            key={id}
            open={open}
            variant={variant}
            onOpenChange={(next) => {
              if (!next) dismissToast(id);
            }}
          >
            {Icon ? <Icon aria-hidden="true" /> : <span />}
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
            {action && (
              <ToastAction altText={action.altText} onClick={action.onClick}>
                {action.label}
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
