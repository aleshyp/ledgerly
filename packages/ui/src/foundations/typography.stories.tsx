import type { Meta, StoryObj } from "@storybook/react-vite";
import { fontSize, fontWeight } from "@ledgerly/tokens";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inter for UI, JetBrains Mono for code and figures. Large sizes tighten tracking automatically. */
export const Scale: Story = {
  render: () => (
    <div className="grid gap-5">
      {Object.entries(fontSize)
        .reverse()
        .map(([name, value]) => (
          <div key={name} className="grid grid-cols-[6rem_1fr] items-baseline gap-6 border-b pb-5">
            <div className="grid gap-0.5 font-mono text-xs text-foreground-muted">
              <span className="text-foreground">text-{name}</span>
              <span>
                {value.size} / {value.lineHeight}
              </span>
            </div>
            <div
              className="truncate"
              style={{
                fontSize: `var(--ld-text-${name})`,
                lineHeight: `var(--ld-text-${name}-line-height)`,
                letterSpacing: `var(--ld-text-${name}-letter-spacing, normal)`,
              }}
            >
              Cash flow, simplified.
            </div>
          </div>
        ))}
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="grid gap-3 text-2xl">
      {Object.entries(fontWeight).map(([name, value]) => (
        <div key={name} style={{ fontWeight: value }}>
          {name} · {value} — Reconcile every account in minutes
        </div>
      ))}
    </div>
  ),
};

export const Numerals: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <div className="text-xs text-foreground-muted">Proportional (default)</div>
        <div className="text-2xl font-semibold">$1,111.11 · $8,808.08</div>
      </div>
      <div className="grid gap-1">
        <div className="text-xs text-foreground-muted">
          <code className="font-mono">tabular</code> utility — use where numbers align in columns
          (tables, axes)
        </div>
        <div className="text-2xl font-semibold tabular">$1,111.11 · $8,808.08</div>
      </div>
      <div className="grid gap-1">
        <div className="text-xs text-foreground-muted">Mono</div>
        <div className="font-mono text-lg">INV-2026-00481 · acct_7Hq2kD</div>
      </div>
    </div>
  ),
};
