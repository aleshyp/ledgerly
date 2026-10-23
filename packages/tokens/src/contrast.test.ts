import { describe, expect, it } from "vitest";
import { contrastPairs, contrastRatio, resolveColor, semanticColors, toHex } from "./index";

describe.each(["light", "dark"] as const)("%s theme", (mode) => {
  it.each(contrastPairs)("%s on %s has at least %s:1 contrast", (fg, bg, min) => {
    const ratio = contrastRatio(
      resolveColor(semanticColors[fg][mode]),
      resolveColor(semanticColors[bg][mode]),
    );
    expect(ratio).toBeGreaterThanOrEqual(min);
  });
});

describe("contrastRatio", () => {
  it("matches the WCAG reference value for black on white", () => {
    expect(contrastRatio("oklch(0 0 0)", "oklch(1 0 0)")).toBeCloseTo(21, 1);
  });
});

describe("toHex", () => {
  it("converts the gamut corners exactly", () => {
    expect(toHex("oklch(1 0 0)")).toBe("#ffffff");
    expect(toHex("oklch(0 0 0)")).toBe("#000000");
  });

  it("keeps a mid gray neutral", () => {
    const [, r, g, b] = /^#(..)(..)(..)$/.exec(toHex("oklch(0.6 0 0)"))!;
    expect(r).toBe(g);
    expect(g).toBe(b);
  });
});
