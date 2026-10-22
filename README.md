# Ledgerly

A finance platform for small businesses, built to show a **code-first design system** working from
tokens all the way to a shipped product.

> Ledgerly is a fictional company. All names, figures and transactions are made up.

## What's inside

```
ledgerly/
├── packages/
│   ├── tokens/   @ledgerly/tokens  Design tokens in TypeScript → CSS variables + Tailwind theme
│   └── ui/       @ledgerly/ui      React component library, Storybook docs, Vitest tests
└── apps/
    └── web/      @ledgerly/web     Next.js marketing site + product app
```

| Layer      | Stack                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Monorepo   | pnpm workspaces, Turborepo                                            |
| Tokens     | TypeScript (source of truth), OKLCH color, generated CSS custom props |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`), class-variance-authority        |
| Components | React 19, Radix UI primitives, lucide-react icons                     |
| Docs       | Storybook 10 with autodocs and the a11y addon                         |
| App        | Next.js 16 App Router, React Server Components, next-themes           |
| Quality    | TypeScript strict, ESLint, Prettier, Vitest + Testing Library, CI     |

## Getting started

Requires Node 22+ and pnpm 9.

```bash
pnpm install
pnpm dev          # web app on http://localhost:3000 (tokens rebuild on change)
pnpm storybook    # design system docs on http://localhost:6006
```

Other scripts, all run through Turborepo:

```bash
pnpm build        # tokens → Storybook static site → Next.js production build
pnpm test         # token contrast tests + component tests
pnpm lint
pnpm typecheck
pnpm format
```

## How the design system works

### 1. Tokens are code

`packages/tokens/src` is the single source of truth.

- **Primitives** (`primitives.ts`): OKLCH color ramps generated from a hue and chroma on one shared
  lightness curve, plus spacing, radius, type scale, shadows, motion, z-index and breakpoints.
- **Semantic tokens** (`semantic.ts`): purpose-named aliases such as `primary`, `surface`,
  `foreground-muted` and `negative`, each mapped to a primitive for light and dark mode.

`pnpm build` in that package generates:

| File               | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `dist/tokens.css`  | `--ld-*` custom properties; dark mode remaps only the semantic layer |
| `dist/theme.css`   | Tailwind v4 `@theme` that turns tokens into utilities (`bg-primary`) |
| `dist/tokens.json` | Resolved values for docs or non-CSS consumers                        |

`theme.css` also **removes Tailwind's default palette, radii and shadows**, so `bg-blue-500` doesn't
exist. If a value isn't a token, you can't use it by accident.

### 2. Accessibility is tested

`contrast.test.ts` converts every semantic text/background pair from OKLCH to sRGB and asserts
WCAG AA contrast in **both** themes. Changing a palette value that breaks contrast fails CI.

### 3. Components consume semantics only

`@ledgerly/ui` components use semantic utilities (`bg-surface`, `text-foreground-muted`, `ring-ring`),
so theming is a token remap with no component changes. Patterns used throughout:

- `cva` variants with `tailwind-merge`, so consumers can override with `className`
- `asChild` (Radix Slot) to render links with button styles
- `data-slot` attributes on every part for targeted styling
- `Field` wires label, help text, errors and `aria-*` to any control through context

### 4. The product is built only from the system

`apps/web` imports tokens and components and adds no new colors or one-off styles. Routes:

| Route           | Shows                                                         |
| --------------- | ------------------------------------------------------------- |
| `/`             | Marketing page: hero, product preview, features, testimonials |
| `/pricing`      | Plan cards with a monthly/annual toggle, FAQ                  |
| `/login`        | Sign-in form with validation (any credentials work)           |
| `/dashboard`    | KPIs, budgets, accounts, recent transactions, alerts          |
| `/transactions` | Searchable, filterable table, row menus, create dialog        |
| `/settings`     | Tabs, forms, switches, radio groups, destructive confirm      |

## Adding a component

1. Create `packages/ui/src/components/thing.tsx` using semantic utilities only.
2. Export it from `packages/ui/src/index.ts`.
3. Add `thing.stories.tsx` (and `thing.test.tsx` for behavior).
4. Use it in `apps/web`.

## Deploying

- **Web app:** import the repo into Vercel and set the root directory to `apps/web`. Vercel detects
  Turborepo and builds the workspace dependencies.
- **Storybook:** `pnpm --filter @ledgerly/ui build` outputs a static site to
  `packages/ui/storybook-static`. Host it on Vercel, Netlify, GitHub Pages or Chromatic.
