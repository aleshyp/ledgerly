import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  contrastRatio,
  palette,
  resolveColor,
  semanticColors,
  steps,
  type SemanticColor,
} from "@ledgerly/tokens";

const meta = {
  title: "Foundations/Color",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Raw OKLCH ramps. Every hue shares one lightness curve, so steps line up across hues. */
export const Palette: Story = {
  render: () => (
    <div className="grid gap-6">
      {Object.entries(palette).map(([name, scale]) => (
        <div key={name} className="grid gap-2">
          <div className="text-sm font-semibold capitalize">{name}</div>
          <div className="grid grid-cols-11 gap-1.5">
            {steps.map((step) => (
              <div key={step} className="grid gap-1">
                <div
                  className="h-12 rounded-md border border-border"
                  style={{ background: `var(--ld-color-${name}-${step})` }}
                />
                <div className="text-xs font-medium">{step}</div>
                <div className="truncate font-mono text-[10px] text-foreground-muted">
                  {scale[step].replace("oklch", "")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

const contrastAgainst: Partial<Record<SemanticColor, SemanticColor>> = {
  foreground: "background",
  "foreground-muted": "background",
  positive: "surface",
  negative: "surface",
  "primary-foreground": "primary",
  "secondary-foreground": "secondary",
  "brand-subtle-foreground": "brand-subtle",
  "danger-foreground": "danger",
  "danger-subtle-foreground": "danger-subtle",
  "success-foreground": "success",
  "success-subtle-foreground": "success-subtle",
  "warning-foreground": "warning",
  "warning-subtle-foreground": "warning-subtle",
  "info-foreground": "info",
  "info-subtle-foreground": "info-subtle",
};

function ratio(fg: SemanticColor, bg: SemanticColor, mode: "light" | "dark") {
  return contrastRatio(
    resolveColor(semanticColors[fg][mode]),
    resolveColor(semanticColors[bg][mode]),
  ).toFixed(1);
}

/**
 * Purpose-named tokens that components consume. Swatches follow the active theme
 * (toggle it in the toolbar). Contrast is shown for text tokens against their pair.
 */
export const Semantic: Story = {
  render: () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-foreground-muted">
            <th className="py-2 pr-4 font-medium">Token</th>
            <th className="py-2 pr-4 font-medium">Swatch</th>
            <th className="py-2 pr-4 font-medium">Light</th>
            <th className="py-2 pr-4 font-medium">Dark</th>
            <th className="py-2 pr-4 font-medium">Contrast (L / D)</th>
            <th className="py-2 font-medium">Usage</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(semanticColors) as SemanticColor[]).map((name) => {
            const token = semanticColors[name];
            const pair = contrastAgainst[name];
            return (
              <tr key={name} className="border-b">
                <td className="py-2 pr-4 font-mono text-xs">{name}</td>
                <td className="py-2 pr-4">
                  <div
                    className="h-8 w-16 rounded-md border border-border"
                    style={{ background: `var(--ld-${name})` }}
                  />
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-foreground-muted">{token.light}</td>
                <td className="py-2 pr-4 font-mono text-xs text-foreground-muted">{token.dark}</td>
                <td className="py-2 pr-4 font-mono text-xs">
                  {pair ? `${ratio(name, pair, "light")} / ${ratio(name, pair, "dark")}` : "—"}
                </td>
                <td className="py-2 text-foreground-muted">{token.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};
