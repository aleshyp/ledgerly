---
paths:
  - "**/*.{ts,tsx}"
---

# React 19 and TypeScript

## React

- React 19 idioms:
  - Take `ref` as a regular prop. Don't use `forwardRef`.
  - Render `<Context value={…}>`, not `<Context.Provider>`.
  - Read context with `use(Context)`.
- Type component props as `React.ComponentProps<"element">` intersected with your own props, and
  spread the rest onto the root element.
- Don't use `useEffect` for:
  - **Derived values:** compute them during render.
  - **Responding to events:** do it in the handler.
  - **Resetting state on prop change:** use a `key`.

  Effects are for syncing with something outside React (DOM APIs, subscriptions, timers), and
  they must clean up.

- The React Compiler is **not** enabled. Add `useMemo`/`useCallback`/`memo` only for a measured
  problem or a referentially sensitive dependency, not by default.
- `react-hooks` v7 lint (including the compiler-powered rules) is on. Fix its errors instead of
  disabling them; a disable needs a `--` reason.
- Keys are stable IDs from the data, never array indexes when the list can reorder.
- Prefer uncontrolled inputs that read `FormData` on submit (as in `NewTransactionDialog`). Use
  controlled inputs only when the UI reacts to every keystroke.
- Keep components pure: no side effects or reads of `Date.now()`/`Math.random()` during render, or
  hydration will mismatch.

## TypeScript

- `strict`, `noUncheckedIndexedAccess` and `verbatimModuleSyntax` are on. Use `import type` for
  type-only imports (lint-enforced).
- No `any`. Use `unknown` and narrow it. Avoid `as` casts. Use a non-null `!` only where an
  invariant makes it safe, like `accounts[0]!` on static demo data.
- Use `as const satisfies Record<…>` for lookup tables, so each key stays a literal type and a
  missing case is a compile error (see `StatusBadge`).
- Model variants as string-literal unions, not enums and not booleans that conflict
  (`variant: "primary" | "danger"`, not `isPrimary` + `isDanger`).
- Exported functions and components get TSDoc when the name doesn't explain the behavior. Comment
  the _why_, not the _what_.

## Files and naming

- Files are kebab-case (`status-badge.tsx`), components PascalCase, hooks `useThing`.
- Use named exports only. The exception is Next.js route files, which require default exports.
- Import the UI library through `@ledgerly/ui`, never through a deep path into `src/`.
