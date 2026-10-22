import type { Step } from "./color";
import type { PaletteName } from "./primitives";

/* ----------------------------------------------------------------------------
 * Semantic tokens: named by purpose, not appearance. Each one points at a
 * primitive for light and dark mode. This is the layer components consume.
 * ------------------------------------------------------------------------- */

export type ColorRef = `${PaletteName}.${Step}` | "white" | "black";
/** A primitive reference, optionally with an alpha percentage: `"black/50"`. */
export type ColorValue = ColorRef | `${ColorRef}/${number}`;

type ThemedColor = { light: ColorValue; dark: ColorValue; description: string };

export const semanticColors = {
  // Surfaces
  background: { light: "white", dark: "neutral.950", description: "Page background" },
  surface: { light: "white", dark: "neutral.900", description: "Cards and panels" },
  "surface-raised": {
    light: "white",
    dark: "neutral.900",
    description: "Popovers, menus and dialogs",
  },
  muted: { light: "neutral.50", dark: "neutral.800", description: "Subtle fills, table headers" },
  overlay: { light: "black/45", dark: "black/65", description: "Scrim behind modals" },

  // Text
  foreground: { light: "neutral.950", dark: "neutral.50", description: "Primary text" },
  "foreground-muted": {
    light: "neutral.600",
    dark: "neutral.400",
    description: "Secondary text and labels",
  },
  "foreground-subtle": {
    light: "neutral.500",
    dark: "neutral.500",
    description: "Placeholders and disabled text",
  },
  positive: { light: "green.700", dark: "green.400", description: "Money in, gains" },
  negative: { light: "red.700", dark: "red.400", description: "Money out, losses, errors" },

  // Lines
  border: { light: "neutral.200", dark: "neutral.800", description: "Default dividers" },
  "border-strong": {
    light: "neutral.300",
    dark: "neutral.700",
    description: "Emphasised borders",
  },
  input: { light: "neutral.300", dark: "neutral.700", description: "Form control borders" },
  ring: { light: "brand.600", dark: "brand.400", description: "Focus indicator" },
  shadow: { light: "neutral.950", dark: "black", description: "Base color for elevation" },

  // Actions
  primary: { light: "brand.700", dark: "brand.400", description: "Primary actions" },
  "primary-hover": { light: "brand.800", dark: "brand.300", description: "Primary hover" },
  "primary-foreground": {
    light: "white",
    dark: "brand.950",
    description: "Content on primary",
  },
  secondary: { light: "neutral.100", dark: "neutral.800", description: "Secondary actions" },
  "secondary-hover": {
    light: "neutral.200",
    dark: "neutral.700",
    description: "Secondary hover",
  },
  "secondary-foreground": {
    light: "neutral.900",
    dark: "neutral.50",
    description: "Content on secondary",
  },
  accent: { light: "neutral.100", dark: "neutral.800", description: "Hovered menu items" },
  "accent-foreground": {
    light: "neutral.900",
    dark: "neutral.50",
    description: "Content on accent",
  },

  // Brand
  "brand-subtle": { light: "brand.50", dark: "brand.950", description: "Tinted brand fill" },
  "brand-subtle-foreground": {
    light: "brand.800",
    dark: "brand.200",
    description: "Content on brand-subtle",
  },

  // Data visualization. Fixed order, never cycled. Validated as a categorical pair
  // (lightness band, chroma floor, CVD separation) against `surface` in both modes.
  // Dark-mode chart-2 sits below 3:1 on surface, so charts must ship a legend + table view.
  "chart-1": { light: "brand.600", dark: "brand.600", description: "Chart series 1" },
  "chart-2": { light: "violet.600", dark: "violet.600", description: "Chart series 2" },

  // Status
  danger: { light: "red.700", dark: "red.700", description: "Destructive actions" },
  "danger-hover": { light: "red.800", dark: "red.800", description: "Destructive hover" },
  "danger-foreground": { light: "white", dark: "white", description: "Content on danger" },
  "danger-subtle": { light: "red.50", dark: "red.950", description: "Error backgrounds" },
  "danger-subtle-foreground": {
    light: "red.800",
    dark: "red.200",
    description: "Content on danger-subtle",
  },
  success: { light: "green.700", dark: "green.500", description: "Success fills" },
  "success-foreground": { light: "white", dark: "green.950", description: "Content on success" },
  "success-subtle": { light: "green.50", dark: "green.950", description: "Success backgrounds" },
  "success-subtle-foreground": {
    light: "green.800",
    dark: "green.200",
    description: "Content on success-subtle",
  },
  warning: { light: "amber.400", dark: "amber.400", description: "Warning fills" },
  "warning-foreground": {
    light: "amber.950",
    dark: "amber.950",
    description: "Content on warning",
  },
  "warning-subtle": { light: "amber.50", dark: "amber.950", description: "Warning backgrounds" },
  "warning-subtle-foreground": {
    light: "amber.800",
    dark: "amber.200",
    description: "Content on warning-subtle",
  },
  info: { light: "blue.700", dark: "blue.400", description: "Informational fills" },
  "info-foreground": { light: "white", dark: "blue.950", description: "Content on info" },
  "info-subtle": { light: "blue.50", dark: "blue.950", description: "Info backgrounds" },
  "info-subtle-foreground": {
    light: "blue.800",
    dark: "blue.200",
    description: "Content on info-subtle",
  },
} as const satisfies Record<string, ThemedColor>;

export type SemanticColor = keyof typeof semanticColors;

/**
 * Text/background pairs the UI actually renders. The token test suite checks each
 * pair against WCAG AA in both themes, so a palette tweak can't silently break contrast.
 */
export const contrastPairs: ReadonlyArray<[SemanticColor, SemanticColor, number]> = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["foreground", "muted", 4.5],
  ["foreground-muted", "background", 4.5],
  ["foreground-muted", "surface", 4.5],
  ["foreground-muted", "muted", 4.5],
  ["positive", "surface", 4.5],
  ["negative", "surface", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["primary-foreground", "primary-hover", 4.5],
  ["primary", "surface", 4.5],
  ["secondary-foreground", "secondary", 4.5],
  ["secondary-foreground", "secondary-hover", 4.5],
  ["accent-foreground", "accent", 4.5],
  ["brand-subtle-foreground", "brand-subtle", 4.5],
  ["danger-foreground", "danger", 4.5],
  ["danger-foreground", "danger-hover", 4.5],
  ["danger-subtle-foreground", "danger-subtle", 4.5],
  ["success-foreground", "success", 4.5],
  ["success-subtle-foreground", "success-subtle", 4.5],
  ["warning-foreground", "warning", 4.5],
  ["warning-subtle-foreground", "warning-subtle", 4.5],
  ["info-foreground", "info", 4.5],
  ["info-subtle-foreground", "info-subtle", 4.5],
  ["ring", "background", 3],
  ["input", "background", 1.4],
];
