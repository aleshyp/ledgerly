---
paths:
  - "**/*.tsx"
  - "apps/web/lib/**"
---

# Typography and content

## Type

- Use `Heading` and `Text` from `@ledgerly/ui` rather than restyling raw tags. Headings already
  apply `text-pretty` and tight tracking at large sizes.
- Headings and short titles: `text-balance`. Paragraphs and descriptions: `text-pretty`. Don't
  apply either to long-form text.
- Cap reading text at about 65 characters per line (`max-w-prose`). Don't justify text.
- Line height comes with each `text-*` size. Don't add `leading-*` unless the text is a single
  line inside a fixed-height control.
- Keep to four weights: normal for body, medium for labels and buttons, semibold for headings,
  bold for display only.
- Font families come from `next/font` variables (`--font-inter`, `--font-jetbrains-mono`). Never
  load fonts from a `<link>` or CSS `@import`.

## Numbers and money

- Every money amount and every number in a column or comparison uses tabular figures: the
  `tabular` utility.
- Format through `apps/web/lib/format.ts` (`formatCurrency`, `formatCompactCurrency`,
  `formatDate`). Calling `toFixed`, `toLocale*` or `new Intl.*` anywhere else is a lint error. Add
  a helper there if you need a new format.
- Negative amounts use the minus sign `−` (U+2212), not a hyphen. `formatCurrency` already does
  this; pass `{ signed: true }` to show `+` on income.
- Don't mix 0 and 2 decimal places for currency in the same view.
- Use numerals for counts ("3 accounts"), and keep a number and its unit together with a
  non-breaking space (`12 GB`).
- Format dates for people: "Oct 22", not `2026-10-22`. Keep ISO strings in data only.

## Punctuation (enforced by `ledgerly/typography`)

- Use curly quotes and apostrophes in copy: ’ “ ”. Straight quotes in JSX text are a lint error.
- Use the ellipsis character `…`, not `...`. It's auto-fixable.
- End labels for actions that open a further step, and in-progress labels, with `…`: "Export…",
  "Saving…".
- Use an em dash `—` without spaces for asides, and an en dash `–` for ranges ("Mon–Fri").

## Voice

- Write in sentence case everywhere, including headings, buttons, menu items and tabs.
- Write in second person ("your accounts") and the active voice. Be short and specific.
- Button labels are verb + noun and name the result: "Save transaction", "Delete account". Avoid
  "OK", "Submit" and "Continue".
- Use the same noun for the same thing everywhere (always "transaction", never "entry" in one
  place and "payment" in another).
- Error messages say what happened and how to fix it, with no blame and no codes:
  "Enter an amount greater than zero."
- Placeholders show an example of the format ("e.g. Farmers market"). They never replace a label.
- Mark brand names and code tokens `translate="no"` when they appear in running text.
- All people, companies and figures are fictional; keep them believable and consistent with
  `apps/web/lib/data.ts`.
