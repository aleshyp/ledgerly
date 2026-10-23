# Ledgerly

A finance platform for small businesses, built to show a **code-first design system** working from
tokens all the way to a shipped product.

**[View the live demo →](https://ledgerly-one-ashy.vercel.app/)** · Jump straight to the
[dashboard](https://ledgerly-one-ashy.vercel.app/dashboard) or
[transactions](https://ledgerly-one-ashy.vercel.app/transactions). Browse the components in the
**[Storybook docs →](https://aleshyp.github.io/ledgerly/)**

> Ledgerly is a fictional company. All names, figures and transactions are made up.

## What's inside

```
ledgerly/
├── packages/
│   ├── tokens/   @ledgerly/tokens  Design tokens in TypeScript → CSS variables + Tailwind theme
│   ├── ui/       @ledgerly/ui      React component library, Storybook docs, Vitest tests
│   └── eslint-plugin/              Lint rules that enforce the system (@ledgerly/eslint-plugin)
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
| End to end | Playwright with axe-core, in light, dark and mobile                   |

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
pnpm test         # token contrast, component, lint-rule and data/format tests
pnpm --filter @ledgerly/web e2e   # after `pnpm build`: Playwright flows + axe on every route
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

| Route              | Shows                                                              |
| ------------------ | ------------------------------------------------------------------ |
| `/`                | Marketing page: hero, product preview, features, testimonials      |
| `/pricing`         | Plan cards with an annual billing switch, FAQ                      |
| `/contact`         | Sales and support form with inline validation                      |
| `/signup`          | Account creation, with the chosen plan from pricing                |
| `/login`           | Sign-in form with validation (any credentials work)                |
| `/forgot-password` | Reset request with a confirmation state                            |
| `/dashboard`       | KPIs, cash-flow chart, budgets, accounts, recent transactions      |
| `/transactions`    | Filters in the URL, CSV export, row actions with undo, create form |
| `/settings`        | Tabs in the URL, profile photo, auto-saving preferences, confirm   |

Transactions recorded, edited or deleted in the app shell live in memory and show up on every
page until you refresh. Feedback goes through the library’s `Toaster`.

### 5. The rules are enforced, not just written down

`@ledgerly/eslint-plugin` turns the conventions into CI failures:

| Rule                           | Catches                                                        |
| ------------------------------ | -------------------------------------------------------------- |
| `ledgerly/no-primitive-colors` | Palette steps like `bg-brand-500` that skip the semantic layer |
| `ledgerly/no-arbitrary-values` | Off-scale values like `p-[13px]` or `bg-[#0af]`                |
| `ledgerly/no-transition-all`   | `transition-all` instead of named properties                   |
| `ledgerly/typography`          | Straight quotes and `...` in user-facing copy (auto-fixes `…`) |

`eslint-plugin-jsx-a11y` covers both the library and the app. The app also blocks Pages Router
imports, raw `<a>` for internal links, and number or date formatting outside `lib/format.ts`.

The written guidance on accessibility (WCAG 2.2 AA), typography, UX patterns, React 19 and
Next.js 16 lives in [`.claude/rules/`](.claude/rules), indexed from [`AGENTS.md`](AGENTS.md), so
people and coding agents work from the same rules.

## Adding a component

1. Create `packages/ui/src/components/thing.tsx` using semantic utilities only.
2. Export it from `packages/ui/src/index.ts`.
3. Add `thing.stories.tsx` (and `thing.test.tsx` for behavior).
4. Use it in `apps/web`.

## Deploying

- **Web app:** import the repo into Vercel and set the root directory to `apps/web`. Vercel detects
  Turborepo and builds the workspace dependencies.
- **Storybook:** `pnpm --filter @ledgerly/ui build` outputs a static site to
  `packages/ui/storybook-static`. `.github/workflows/storybook.yml` publishes it to GitHub Pages on
  every push to `main` (set Settings → Pages → Source to “GitHub Actions” once).
