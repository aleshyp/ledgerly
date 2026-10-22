---
paths:
  - "apps/web/**/*.tsx"
  - "packages/ui/src/components/**"
---

# UX patterns

## Every screen has every state

- Design and build the **loading**, **empty**, **error** and **populated** states, plus the
  extremes: a single item, hundreds of items, and very long names or amounts.
- Skeletons match the final layout's shape and size so nothing shifts when data arrives
  (`Skeleton`). Reserve space for images and charts.
- Empty states explain what belongs here and offer the next action ("Record a transaction").
- No dead ends: errors and 404s link back somewhere useful.

## Forms

- Use `Field` for every control, so the label, help text and error are wired automatically.
- Don't disable the submit button to signal "incomplete". Let people submit, then show errors next
  to the fields and move focus to the first invalid one.
- While a submit is in flight, keep the button's label and show progress (`Button loading`).
  Disable it then to prevent double submits.
- Validate on submit, then re-validate a field as it's corrected. Don't show errors on a field the
  person hasn't touched yet.
- Pick the right `type`, `inputMode` and `autoComplete` (`email`, `current-password`, `one-time-code`;
  `inputMode="decimal"` for amounts). Turn off `spellCheck` for emails, codes and IDs.
- Trim input before validating it.
- Enter submits a single-line form. In a `Textarea`, Enter adds a new line.
- Warn before discarding unsaved changes.
- Ask only for what you need, and don't ask for the same thing twice in one flow (3.3.7).

## Actions

- Destructive actions use `variant="danger"` and either a confirmation dialog that names the thing
  ("Delete ‘Operating account’?") or an undo window.
- Confirmation dialogs make the safe choice the easy one: Cancel is the `outline` button, and the
  destructive button names the action.
- Navigation is a link (`<Link>` or `Button asChild`), never a button with `router.push` in an
  `onClick`, so middle-click, copy link and prefetch work.
- Put shareable view state (search, filters, tab, sort, page) in the URL search params, so refresh,
  Back and sharing all work.

## Feedback

- Prefer inline help over tooltips. Tooltips are for supplementary info on controls that are
  already labeled, never for essential content, and never on disabled elements.
- Avoid flashing loaders: delay spinners about 150–300 ms, and once one shows, keep it up long
  enough to read.
- Confirm async results in place, or with a polite live region.
- Optimistic updates must roll back visibly if the server rejects them.

## Layout

- Use flex and grid with intrinsic sizing. Don't measure layout in JavaScript.
- Check layouts at 320px, a laptop width and an ultra-wide width. Tables scroll horizontally inside
  their container, never the page.
- Respect safe-area insets for anything fixed to the viewport edges.
