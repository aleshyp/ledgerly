import { scale } from "./color";

/* ----------------------------------------------------------------------------
 * Primitive tokens: raw values with no meaning attached. Components should not
 * use these directly — they go through the semantic layer in ./semantic.ts.
 * ------------------------------------------------------------------------- */

export const base = {
  white: "oklch(1 0 0)",
  black: "oklch(0 0 0)",
} as const;

export const palette = {
  neutral: scale({ hue: 262, chroma: 0.022 }),
  brand: scale({ hue: 168, chroma: 0.14 }),
  violet: scale({ hue: 292, chroma: 0.2 }),
  blue: scale({ hue: 255, chroma: 0.17 }),
  green: scale({ hue: 150, chroma: 0.16 }),
  amber: scale({ hue: 75, chroma: 0.16 }),
  red: scale({ hue: 25, chroma: 0.2 }),
} as const;

export type PaletteName = keyof typeof palette;

/** 4px grid. Tailwind multiplies this, so `p-4` = 1rem. */
export const spacingUnit = "0.25rem";

export const radius = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
} as const;

export const fontFamily = {
  sans: 'var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif',
  mono: 'var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, SFMono-Regular, monospace',
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

type FontSize = { size: string; lineHeight: string; letterSpacing?: string };

export const fontSize = {
  xs: { size: "0.75rem", lineHeight: "1rem" },
  sm: { size: "0.875rem", lineHeight: "1.25rem" },
  base: { size: "1rem", lineHeight: "1.5rem" },
  lg: { size: "1.125rem", lineHeight: "1.75rem" },
  xl: { size: "1.25rem", lineHeight: "1.75rem", letterSpacing: "-0.01em" },
  "2xl": { size: "1.5rem", lineHeight: "2rem", letterSpacing: "-0.015em" },
  "3xl": { size: "1.875rem", lineHeight: "2.25rem", letterSpacing: "-0.02em" },
  "4xl": { size: "2.25rem", lineHeight: "2.5rem", letterSpacing: "-0.025em" },
  "5xl": { size: "3rem", lineHeight: "1.1", letterSpacing: "-0.03em" },
  "6xl": { size: "3.75rem", lineHeight: "1.05", letterSpacing: "-0.035em" },
} as const satisfies Record<string, FontSize>;

type ShadowLayer = { y: number; blur: number; spread: number; opacity: number };

/** Shadow color comes from the semantic `shadow` token so it can change per theme. */
export const shadow = {
  xs: [{ y: 1, blur: 2, spread: 0, opacity: 6 }],
  sm: [
    { y: 1, blur: 3, spread: 0, opacity: 10 },
    { y: 1, blur: 2, spread: -1, opacity: 10 },
  ],
  md: [
    { y: 4, blur: 6, spread: -1, opacity: 10 },
    { y: 2, blur: 4, spread: -2, opacity: 10 },
  ],
  lg: [
    { y: 10, blur: 15, spread: -3, opacity: 10 },
    { y: 4, blur: 6, spread: -4, opacity: 10 },
  ],
  xl: [
    { y: 20, blur: 25, spread: -5, opacity: 12 },
    { y: 8, blur: 10, spread: -6, opacity: 10 },
  ],
} as const satisfies Record<string, ShadowLayer[]>;

export const duration = {
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  /** Page-level entrances: hero content, scroll reveals, filling bars. */
  entrance: "640ms",
  /** Gap between items in a staggered entrance (`stagger-*`). */
  stagger: "80ms",
} as const;

export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export const keyframes = {
  "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
  "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
  "scale-in": {
    from: { opacity: "0", transform: "scale(0.96)" },
    to: { opacity: "1", transform: "scale(1)" },
  },
  "scale-out": {
    from: { opacity: "1", transform: "scale(1)" },
    to: { opacity: "0", transform: "scale(0.96)" },
  },
  "slide-up": {
    from: { opacity: "0", transform: "translateY(4px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "rise-in": {
    from: { opacity: "0", transform: "translateY(16px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  // No `to`: the bar fills from empty to whatever its inline transform says.
  "progress-fill": { from: { transform: "translateX(-100%)" } },
} as const satisfies Record<string, Partial<Record<"from" | "to", Record<string, string>>>>;

export const animation = {
  "fade-in": `fade-in ${duration.base} ${easing.enter}`,
  "fade-out": `fade-out ${duration.fast} ${easing.exit}`,
  "scale-in": `scale-in ${duration.base} ${easing.enter}`,
  "scale-out": `scale-out ${duration.fast} ${easing.exit}`,
  "slide-up": `slide-up ${duration.base} ${easing.enter}`,
  // The delay lives in the shorthand so `stagger-*` (which sets `--ld-delay`) can't be reset by
  // class order. `both` keeps a staggered item hidden until its delay runs out.
  "rise-in": `rise-in ${duration.entrance} ${easing.enter} var(--ld-delay, 0s) both`,
  // Waits for its container's stagger delay (`--ld-delay`, inherited) plus a beat.
  "progress-fill": `progress-fill ${duration.entrance} ${easing.standard} calc(var(--ld-delay, 0s) + ${duration.slow}) both`,
} as const satisfies Record<string, string>;

export const zIndex = {
  dropdown: "1000",
  sticky: "1100",
  overlay: "1300",
  modal: "1400",
  popover: "1500",
  toast: "1600",
  tooltip: "1700",
} as const;

export const breakpoint = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;
