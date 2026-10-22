---
paths:
  - "**/*.tsx"
---

# Accessibility (WCAG 2.2 AA)

The bar is WCAG 2.2 AA. `eslint-plugin-jsx-a11y` runs on `packages/ui` and `apps/web`, and the
Storybook a11y addon runs axe on every story, but most of the rules below can't be linted, so
check them by hand.

## Semantics

- Use native elements before ARIA: `<button>` for actions, `<a>`/`<Link>` for navigation,
  `<table>` for tabular data. Never put `onClick` on a `div` or `span`.
- Keep one `<h1>` per page and don't skip heading levels. `Heading`'s `level` sets the outline and
  `size` sets the look, so pick the level by structure and the size by design.
- Use landmarks: `header`, `nav` (with `aria-label` when there's more than one), `main`, `footer`.
- Every page has exactly one `<main id="main-content">`. That's where the root layout's `SkipLink`
  jumps, so a new layout or full-page route must keep the id.
- Set `lang` on `<html>`, and give every page an accurate `metadata.title`.

## Names and labels

- Every form control is wrapped in `Field` with a `label`, or has an explicit `aria-label`.
  Placeholders are not labels.
- Icon-only buttons need an accessible name: `aria-label="Delete transaction"` or a
  `<span className="sr-only">` child. Decorative icons next to text get no label and must not be
  announced, so check the accessibility tree once when you add a new icon pattern.
- Name links and buttons by their destination or result: "View all transactions", not "Click here".
- Images that carry information get `alt`; decorative ones get `alt=""`.

## Keyboard and focus

- Everything that works by mouse also works by keyboard, following WAI-ARIA patterns (Radix
  provides them, so don't override its key handling).
- Focus is always visible. Use the system ring:
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. Never ship
  `outline-none` without a `focus-visible:` replacement.
- Focus must not be hidden under sticky headers or footers (2.4.11). Give scroll targets
  `scroll-mt-*` that matches the header height.
- Dialogs trap focus and return it to the trigger on close. Radix `Dialog` does this, so don't
  build modals any other way.
- Don't use positive `tabIndex`.

## Pointer targets

- Targets are at least 24×24 CSS px (2.5.8). Button sizes `sm`/`icon-sm` (32px) are the
  smallest allowed. Smaller visuals, like the 16px checkbox, need a clickable label or 24px of
  clear space around them.
- Anything you can drag must also work with a single click or tap (2.5.7).

## Color, motion, content

- Never rely on color alone. Status pairs color with text or an icon (`StatusBadge` uses a label),
  and money direction pairs color with a sign (+/−).
- Contrast is enforced for token pairs in `contrast.test.ts`. If you put a token on a background
  that isn't listed there, add the pair.
- Charts ship with a legend and a table or text alternative (`chart-2` is below 3:1 in dark mode).
- Respect `prefers-reduced-motion`. The base layer zeroes transitions, but use `motion-safe:` for
  anything decorative or looping, and never autoplay motion longer than 5 seconds.
- Announce async results (saved, failed, filtered to N results) with `role="status"` or
  `aria-live="polite"`; use `role="alert"` only for errors that need immediate attention.
- Don't disable zoom or paste, and don't make sign-in depend on remembering or transcribing
  something (3.3.8). Let password managers fill fields.
