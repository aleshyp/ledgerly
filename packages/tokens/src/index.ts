import { base, palette, type PaletteName } from "./primitives";
import type { ColorRef, ColorValue, SemanticColor } from "./semantic";

export * from "./color";
export * from "./primitives";
export * from "./semantic";

/** Every generated CSS custom property is namespaced to avoid collisions. */
export const prefix = "ld";

export const cssVar = (name: string) => `--${prefix}-${name}`;

/** CSS variable for a semantic color, e.g. `var(--ld-primary)`. */
export const semanticVar = (name: SemanticColor) => `var(${cssVar(name)})`;

function splitAlpha(value: ColorValue): [ColorRef, number | undefined] {
  const [ref, alpha] = value.split("/") as [ColorRef, string | undefined];
  return [ref, alpha === undefined ? undefined : Number(alpha)];
}

function primitiveName(ref: ColorRef): string {
  if (ref === "white" || ref === "black") return `color-${ref}`;
  const [name, step] = ref.split(".");
  return `color-${name}-${step}`;
}

/** Turn a semantic value into CSS that references the primitive variable. */
export function colorValueToCss(value: ColorValue): string {
  const [ref, alpha] = splitAlpha(value);
  const variable = `var(${cssVar(primitiveName(ref))})`;
  return alpha === undefined ? variable : `color-mix(in oklab, ${variable} ${alpha}%, transparent)`;
}

/** Resolve a semantic value to its raw `oklch()` string (alpha is not supported). */
export function resolveColor(value: ColorValue): string {
  const [ref, alpha] = splitAlpha(value);
  if (alpha !== undefined) throw new Error(`Cannot resolve translucent color ${value}`);
  if (ref === "white" || ref === "black") return base[ref];
  const [name, step] = ref.split(".") as [PaletteName, string];
  return palette[name][Number(step) as keyof (typeof palette)[PaletteName]];
}
