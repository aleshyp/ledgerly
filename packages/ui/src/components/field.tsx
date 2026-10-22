"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Label } from "./label";

type FieldContextValue = {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

export type FieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message. When set, the control is marked `aria-invalid`. */
  error?: React.ReactNode;
  required?: boolean;
  /** Id for the control. Generated when omitted. */
  controlId?: string;
  children: React.ReactNode;
};

/**
 * Wires a label, help text and error message to a single form control
 * (Input, Textarea, SelectTrigger) through context — no manual `id`s needed.
 */
export function Field({
  label,
  description,
  error,
  required = false,
  controlId: controlIdProp,
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId();
  const controlId = controlIdProp ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext value={{ controlId, describedBy, invalid: Boolean(error), required }}>
      <div data-slot="field" className={cn("grid gap-2", className)} {...props}>
        {label && (
          <Label htmlFor={controlId}>
            {label}
            {required && (
              <span aria-hidden="true" className="text-negative">
                *
              </span>
            )}
          </Label>
        )}
        {children}
        {description && (
          <p id={descriptionId} className="text-xs text-foreground-muted">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs font-medium text-negative">
            {error}
          </p>
        )}
      </div>
    </FieldContext>
  );
}

type ControlProps = {
  id?: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

/** Merge Field context into a control's props. Explicit props win. */
export function useFieldControl<P extends ControlProps>(props: P): P {
  const field = React.use(FieldContext);
  if (!field) return props;
  return {
    ...props,
    id: props.id ?? field.controlId,
    required: props.required ?? (field.required || undefined),
    "aria-describedby": props["aria-describedby"] ?? field.describedBy,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
  };
}
