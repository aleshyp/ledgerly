<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Ledgerly

Code-first design system monorepo: `packages/tokens` (TypeScript tokens → CSS variables and the
Tailwind v4 theme), `packages/ui` (React 19 + Radix component library with Storybook),
`packages/eslint-plugin` (lint rules that enforce the conventions below), and `apps/web`
(Next.js 16 App Router). Ledgerly is fictional; all data is made up.

## Non-negotiables

1. **Semantic tokens only.** No palette steps (`bg-brand-500`), no arbitrary colors or lengths
   (`p-[13px]`), and no `dark:` color overrides. If no token fits, add a semantic token, and add
   its contrast pair if it's used for text.
2. **Screens are built from `@ledgerly/ui`.** Missing a style? Add a variant to the component;
   don't restyle it from the app.
3. **WCAG 2.2 AA.** Native elements first, a label for every control, visible focus, targets of at
   least 24px, and never color alone.
4. **Money and dates go through `apps/web/lib/format.ts`**, rendered with the `tabular` utility.
5. **Copy uses typographic punctuation** (’ “ ” …) and sentence case.
6. **Server Components by default.** `"use client"` goes on leaves only. This is Next 16, so check
   `apps/web/node_modules/next/dist/docs/` before using an API you're unsure of.

Detailed rules live in `.claude/rules/`. Claude Code loads each one automatically when it works on
matching files; other agents should read the relevant file before editing:

| File                                      | Covers                                          |
| ----------------------------------------- | ----------------------------------------------- |
| `.claude/rules/design-system.md`          | Tokens, scale, component authoring, app styling |
| `.claude/rules/accessibility.md`          | WCAG 2.2 AA requirements                        |
| `.claude/rules/typography-and-content.md` | Type, numbers and money, punctuation, voice     |
| `.claude/rules/ux-patterns.md`            | States, forms, actions, feedback, layout        |
| `.claude/rules/responsive.md`             | Mobile-first layout, reflow, touch, viewports   |
| `.claude/rules/react-typescript.md`       | React 19 idioms, TypeScript, file naming        |
| `.claude/rules/nextjs.md`                 | Next.js 16 server/client, data, metadata        |
| `.claude/rules/testing.md`                | Tests, stories, contrast pairs, lint rule tests |

## Done means green

Run these before calling work finished. CI runs the same checks:

```bash
pnpm --filter @ledgerly/tokens build   # Prettier's Tailwind plugin reads the generated theme
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm --filter @ledgerly/web e2e        # Playwright + axe on the build (once: playwright install chromium)
```

If a rule blocks something legitimate, fix the rule (with tests) or disable it on that one line
with a `-- reason`. Never turn a rule off for a whole file to make a check pass.
