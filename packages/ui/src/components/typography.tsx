import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const headingVariants = cva("text-pretty text-foreground", {
  variants: {
    size: {
      display: "text-5xl font-bold md:text-6xl",
      "2xl": "text-4xl font-bold",
      xl: "text-3xl font-semibold",
      lg: "text-2xl font-semibold",
      md: "text-xl font-semibold",
      sm: "text-lg font-semibold",
      xs: "text-base font-semibold",
    },
  },
});

const defaultHeadingSize = { 1: "2xl", 2: "xl", 3: "lg", 4: "md", 5: "sm", 6: "xs" } as const;

export type HeadingProps = React.ComponentProps<"h1"> &
  VariantProps<typeof headingVariants> & {
    /** Document outline level. Visual size is independent — set `size` to change it. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  };

export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      data-slot="heading"
      className={cn(headingVariants({ size: size ?? defaultHeadingSize[level] }), className)}
      {...props}
    />
  );
}

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    tone: {
      default: "text-foreground",
      muted: "text-foreground-muted",
      subtle: "text-foreground-subtle",
      positive: "text-positive",
      negative: "text-negative",
      inherit: "",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: { size: "base", tone: "default" },
});

export type TextProps = React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    as?: "p" | "span" | "div" | "strong" | "small";
  };

export function Text({ as: Tag = "p", size, tone, weight, className, ...props }: TextProps) {
  return (
    <Tag
      data-slot="text"
      className={cn(textVariants({ size, tone, weight }), className)}
      {...props}
    />
  );
}
