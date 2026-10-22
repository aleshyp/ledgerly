---
paths:
  - "packages/ui/**"
  - "packages/tokens/**"
  - "apps/web/**/*.{ts,tsx,css}"
---

# Design system

The token pipeline is `packages/tokens/src` (TypeScript) → `dist/tokens.css` + `dist/theme.css` →
Tailwind utilities. Tailwind's default palette, radii and shadows are removed, so only token values
exist. Never edit anything in `dist/`; change the source and rebuild.

## Color

- Use **semantic** utilities only: `bg-surface`, `text-foreground-muted`, `border-border-strong`,
  `ring-ring`, `bg-danger-subtle text-danger-subtle-foreground`. Enforced by
  `ledgerly/no-primitive-colors`.
- Never use palette steps (`bg-brand-500`, `var(--color-red-700)`) outside
  `packages/tokens` and `packages/ui/src/foundations/`. If no semantic token fits, add one to
  `packages/tokens/src/semantic.ts` with a light value, a dark value and a description.
- Name tokens by purpose (`negative`, `surface-raised`), never by appearance (`light-gray`).
- Every new text/background combination goes into `contrastPairs` in `semantic.ts` (4.5:1 for
  text, 3:1 for focus rings and large text). The contrast test then guards it in both themes.
- Pair a fill with its `-foreground` token (`bg-primary text-primary-foreground`). Don't put
  `text-foreground` on a colored fill.
- `positive`/`negative` are for money direction; `success`/`danger`/`warning`/`info` are for
  status. Don't swap them.
- Decorative tokens (`logo-accent`, `glow-*`, `spotlight-*`) are for `aria-hidden` art only.
- Never use the `dark:` variant to pick a color. Dark mode is a token remap; if a color needs to
  differ per theme, that's a token.

## Scale

- Spacing is a 4px grid (`p-4` = 1rem). Use the scale, not `p-[13px]`. Type sizes come from
  `text-xs` to `text-6xl`; radii from `rounded-xs` to `rounded-3xl`. Enforced by
  `ledgerly/no-arbitrary-values`, which allows layout expressions such as
  `grid-cols-[16rem_1fr]`, `w-[calc(100%-2rem)]` and `transition-[color,box-shadow]`.
- Z-index comes from tokens: `z-(--ld-z-overlay)`, never `z-50`.
- Motion uses `duration-150 ease-standard` (or `ease-enter` / `ease-exit`). Never use
  `transition-all` (enforced by `ledgerly/no-transition-all`). Animate `opacity` and `transform`,
  not layout properties.
- Page entrances use `motion-safe:animate-rise-in` with `stagger-<n>` (n × `--ld-duration-stagger`)
  for sequencing; scroll-in content uses `reveal`. Both live in `packages/ui/src/styles.css`. Write
  `stagger-*` classes out in full so Tailwind can see them.
- Nested radii shrink: a child's radius is never larger than its parent's.
- Breakpoints are `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem. Design mobile first.

## Components (`packages/ui`)

- Variants live in `cva`. Merge consumer classes last: `cn(variants({ size }), className)`.
- Put `data-slot="<part>"` on every rendered part.
- Spread `...props` onto the root element so `aria-*`, `id` and handlers pass through.
- Offer `asChild` (Radix `Slot`) when a component could reasonably render as a link.
- Wrap Radix primitives instead of hand-rolling behavior (focus traps, roving focus, dismiss on
  Escape). Import them from `radix-ui`.
- Form controls call `useFieldControl(props)` so `Field` can wire `id`, `aria-describedby` and
  `aria-invalid`.
- New component checklist: file in `src/components/`, export from `src/index.ts`, a story that
  covers every variant and state, and a test for any behavior beyond styling.

## App (`apps/web`)

- Build screens only from `@ledgerly/ui` and tokens. Don't import `radix-ui` or
  `class-variance-authority` here (lint-enforced). If you need a new variant, add it to the
  component.
- One-off `className` overrides are for layout (grid, gap, width). If you're overriding color,
  radius or type on a component, the component is missing a variant.
