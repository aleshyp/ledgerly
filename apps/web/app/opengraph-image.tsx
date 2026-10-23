import { ImageResponse } from "next/og";
import { resolveColor, semanticColors, toHex } from "@ledgerly/tokens";
import { tagline } from "@/lib/site";

export const alt = "Ledgerly — the finance OS for growing businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The image renderer has no OKLCH or CSS variables, so resolve the light-theme tokens to hex.
const color = (token: keyof typeof semanticColors) =>
  toHex(resolveColor(semanticColors[token].light));

export default function OpengraphImage() {
  const primary = color("primary");
  const onPrimary = color("primary-foreground");
  const accent = color("logo-accent");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: primary,
        color: onPrimary,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="88" height="88" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill={onPrimary} />
          <path
            d="M10 8v16h12"
            fill="none"
            stroke={primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 19l3-4 3 2 3-5"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ fontSize: 56, fontWeight: 700 }}>Ledgerly</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
          {tagline}
        </span>
        <span style={{ fontSize: 30, opacity: 0.85 }}>
          A code-first design system, from tokens to a shipped product
        </span>
      </div>
    </div>,
    size,
  );
}
