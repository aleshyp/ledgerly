---
paths:
  - "**/*.test.{ts,tsx,js}"
  - "**/*.stories.{ts,tsx}"
  - "packages/tokens/**"
  - "packages/eslint-plugin/**"
---

# Tests and stories

## Component tests (Vitest + Testing Library)

- Test behavior people can observe, not implementation details: what renders, what's announced,
  and what happens on click or keypress.
- Query by role and accessible name first (`getByRole("button", { name: "Save" })`), then by
  label or text. Use `data-testid` only as a last resort. A query that can't find an element by
  role is often an accessibility bug.
- Drive interactions with `userEvent`, not `fireEvent`.
- Cover keyboard paths for interactive components (Tab, Enter, Space, Escape, arrow keys).
- Assert ARIA wiring where it matters: `aria-invalid`, `aria-describedby`, `aria-busy`.

## Stories (Storybook 10)

- Every exported component has stories covering each variant, size and state (disabled, loading,
  invalid, empty, long content), so autodocs and the a11y addon see them all.
- Fix a11y addon violations; don't suppress them.
- Stories use the same semantic tokens as components. Only `src/foundations/` may show raw scales.

## Tokens

- Adding a semantic color that's used for text, or as a background behind text, means adding the
  pair to `contrastPairs`. CI fails if contrast drops below the threshold in either theme.

## Lint rules

- A change to `@ledgerly/eslint-plugin` comes with `RuleTester` cases: at least one valid and one
  invalid example per pattern, including the false positives you're guarding against.
