export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type Step = (typeof steps)[number];
export type Scale = Record<Step, string>;

/**
 * Every hue shares one OKLCH lightness ramp, so `brand-700` and `red-700` sit at the
 * same perceived lightness. Contrast decisions made for one hue carry over to the others.
 */
const lightness: Record<Step, number> = {
  50: 0.985,
  100: 0.965,
  200: 0.925,
  300: 0.87,
  400: 0.78,
  500: 0.68,
  600: 0.55,
  700: 0.48,
  800: 0.4,
  900: 0.29,
  950: 0.205,
};

/** Chroma peaks in the mid-tones and tapers at both ends to stay inside the sRGB gamut. */
const chromaCurve: Record<Step, number> = {
  50: 0.06,
  100: 0.14,
  200: 0.3,
  300: 0.52,
  400: 0.78,
  500: 0.95,
  600: 1,
  700: 0.9,
  800: 0.78,
  900: 0.6,
  950: 0.45,
};

const round = (value: number, precision: number) => Number(value.toFixed(precision));

export function oklch(l: number, c: number, h: number): string {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`;
}

export function scale({ hue, chroma }: { hue: number; chroma: number }): Scale {
  return Object.fromEntries(
    steps.map((step) => [step, oklch(lightness[step], chroma * chromaCurve[step], hue)]),
  ) as Scale;
}

/** Linear sRGB channels (0–1, clamped to gamut) of an `oklch(L C H)` string. */
function linearSrgb(color: string): [number, number, number] {
  const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(color);
  if (!match) throw new Error(`Unsupported color format: ${color}`);
  const [L, C, H] = match.slice(1).map(Number) as [number, number, number];

  const hue = (H * Math.PI) / 180;
  const a = C * Math.cos(hue);
  const b = C * Math.sin(hue);

  // OKLab -> linear sRGB (https://bottosson.github.io/posts/oklab/)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);

  return [r, g, bl];
}

/** WCAG 2.x relative luminance of an `oklch(L C H)` string. */
export function relativeLuminance(color: string): number {
  const [r, g, b] = linearSrgb(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** `#rrggbb` for an `oklch(L C H)` string, for renderers without OKLCH (OG images, email). */
export function toHex(color: string): string {
  const encode = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  return `#${linearSrgb(color)
    .map((v) =>
      Math.round(encode(v) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (x, y) => y - x,
  ) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}
