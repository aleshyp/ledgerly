import type { Meta, StoryObj } from "@storybook/react-vite";
import { duration, easing, radius, shadow } from "@ledgerly/tokens";

const meta = {
  title: "Foundations/Spacing, Radius & Elevation",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const spacingSteps = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];

/** A 4px grid. Tailwind multiplies the unit, so `gap-4` is 16px. */
export const Spacing: Story = {
  render: () => (
    <div className="grid gap-2">
      {spacingSteps.map((step) => (
        <div key={step} className="grid grid-cols-[4rem_4rem_1fr] items-center gap-4 text-xs">
          <span className="font-mono">{step}</span>
          <span className="font-mono text-foreground-muted">{step * 4}px</span>
          <div
            className="h-3 rounded-xs bg-primary"
            style={{ width: `calc(var(--ld-space-unit) * ${step})` }}
          />
        </div>
      ))}
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {Object.entries(radius).map(([name, value]) => (
        <div key={name} className="grid justify-items-center gap-2 text-xs">
          <div
            className="size-20 border border-border-strong bg-brand-subtle"
            style={{ borderRadius: `var(--ld-radius-${name})` }}
          />
          <span className="font-mono">rounded-{name}</span>
          <span className="text-foreground-muted">{value}</span>
        </div>
      ))}
    </div>
  ),
};

/** Shadows tint from the semantic `shadow` token, so they stay soft in dark mode. */
export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 bg-muted p-8">
      {Object.keys(shadow).map((name) => (
        <div
          key={name}
          className="grid size-28 place-items-center rounded-xl bg-surface font-mono text-xs"
          style={{ boxShadow: `var(--ld-shadow-${name})` }}
        >
          shadow-{name}
        </div>
      ))}
    </div>
  ),
};

export const Motion: Story = {
  render: () => (
    <div className="grid gap-6 text-sm">
      <div className="grid gap-2">
        <div className="font-semibold">Durations</div>
        {Object.entries(duration).map(([name, value]) => (
          <div key={name} className="font-mono text-xs">
            --ld-duration-{name}: <span className="text-foreground-muted">{value}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <div className="font-semibold">Easing</div>
        {Object.entries(easing).map(([name, value]) => (
          <div key={name} className="font-mono text-xs">
            ease-{name}: <span className="text-foreground-muted">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {["animate-fade-in", "animate-scale-in", "animate-slide-up"].map((cls) => (
          <div
            key={cls}
            className={`${cls} grid h-16 w-36 place-items-center rounded-lg border bg-surface font-mono text-xs shadow-sm`}
          >
            {cls}
          </div>
        ))}
      </div>
    </div>
  ),
};
