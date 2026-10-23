---
paths:
  - "apps/web/**/*.tsx"
  - "packages/ui/src/components/**"
  - "packages/ui/src/styles.css"
---

# Responsive and mobile

The bar is WCAG 2.2 AA Reflow (1.4.10): everything works at 320 CSS px wide (a 1280px window at
400% zoom) without the page scrolling sideways, and nothing is lost on the way down.

## Layout

- Mobile first. Unprefixed classes are the phone layout; `sm:`/`md:`/`lg:` add columns. Reach for
  `max-*:` only to undo something that is genuinely desktop-only.
- Choose a breakpoint where the content breaks, not by device name. Use the token breakpoints,
  never a one-off `min-[37rem]:`.
- Prefer intrinsic layout over breakpoints: `flex-wrap`, `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]`,
  and `min-w-0` on any flex or grid child that holds text.
- Viewport breakpoints are for page layout. A component that can sit in containers of different
  widths (a card in the main column or a sidebar) responds to its container: `@container` on
  the parent, `@md:` on the children.
- Never size full-bleed elements with `w-screen` or `100vw`; it includes the scrollbar and causes
  sideways scroll. Use `w-full`.

## Overflow

- `Button` is `whitespace-nowrap shrink-0`, so a row of buttons overflows instead of shrinking.
  Rows of actions (`PageHeader` actions, toolbars, filters) use `flex-wrap` or stack below `sm`.
- Long unbroken text (emails, IDs, invoice numbers, URLs) gets `break-words`, or `truncate` (plus
  `min-w-0` on its flex parent) with the full value reachable some other way. A `title` tooltip
  doesn't count; touch can't hover.
- Tables scroll inside `Table`'s container, never the page. The table itself is exempt from
  reflow; the heading, filters and pagination around it are not.

## Hiding content

- Hiding is not adapting. If a column or panel hides at a breakpoint, its information must still
  be reachable on a phone: fold it into another cell as a secondary line, or move it into a
  details view or disclosure. Dates, status and amounts are never dropped (WCAG F102).
- A `colSpan` that covers responsively hidden columns creates phantom columns, which widens the
  table and misaligns totals. Give footer and summary rows one cell per column, hidden with the
  same classes as the headers.
- `hidden lg:block` is fine for decorative art, and for navigation that has a mobile equivalent
  with the same destinations, names and order (3.2.3).

## Viewport height

- Page shells use `min-h-dvh`. Heroes that must be fully visible use `svh`. Never use `h-screen` or
  `vh`: they equal the large viewport, so content hides behind mobile browser toolbars. Don't put
  `dvh` on content people scroll through, because it resizes as the toolbar moves.
- Anything that can be taller than the screen scrolls itself. Dialogs, sheets and popovers cap
  their height to the viewport (`max-h-[calc(100dvh-2rem)] overflow-y-auto`). Assume the
  on-screen keyboard covers about half of a phone screen.
- Sticky or fixed chrome stays under about 15% of the viewport height on phones. On short
  viewports (a landscape phone or high zoom), let it scroll away with `short:static` (the `short`
  variant lives in `packages/ui/src/styles.css`). Anything sticky needs
  matching `scroll-mt-*` on scroll targets (2.4.11).

## Touch

- Targets are at least 24px (2.5.8). On touch, primary and repeated actions grow to 44px with
  `pointer-coarse:` (`pointer-coarse:h-11`). Grow the hit area with padding or a pseudo-element
  rather than redesigning the desktop look.
- Tailwind's `hover:` only matches devices that can hover, so nothing essential lives behind
  hover: no hover-only actions, reveals or tooltips.
- Form controls render at 16px or larger on touch (`text-base pointer-fine:text-sm`). iOS Safari
  zooms the page when a focused field is smaller. Never block zoom with `maximum-scale` or
  `user-scalable=no` in the viewport.
- Set `enterKeyHint` where the on-screen keyboard's Enter key should read “search”, “next” or
  “send”.
- Swipes and drags always have a tap alternative (2.5.1, 2.5.7). Never lock orientation or ask
  people to rotate (1.3.4).
- Fixed elements on the viewport edge pad with `env(safe-area-inset-*)`.

## Navigation

- On a phone, primary navigation shows where you are and that more destinations exist. If a nav
  row scrolls sideways, the active item scrolls into view and the edges fade (`scroll-fade-x`) to
  show there's more.
- Keep destinations, names and order the same at every width.

## Checking

- Check every new screen at 320×640, 390×844, 640×360 (landscape), 768, 1024 and 1440+, with
  dialogs and menus open, the longest realistic content and the empty state.
- Test with touch emulation. `hover:` and `pointer-coarse:` behave differently from a mouse.
- `document.documentElement.scrollWidth` must equal `clientWidth` at every width. That's the
  quickest automated check for sideways scroll.
