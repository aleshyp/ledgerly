---
paths:
  - "apps/web/**"
---

# Next.js 16 (App Router)

This is Next.js 16, which differs from older training data. Before using any Next API you're not
sure of, read the bundled docs for the installed version in
`apps/web/node_modules/next/dist/docs/` (start with `index.md`).

## Server and client

- Components are Server Components by default. Add `"use client"` only to the smallest leaf that
  needs state, effects, event handlers or browser APIs, as with `settings-tabs.tsx` and
  `login-form.tsx`. Never mark a `page.tsx` or `layout.tsx` as a client component.
- Pass Server Components into Client Components as `children` instead of importing them inside
  the client file.
- Props crossing the server/client boundary must be serializable (no functions, classes or Dates).
- Code that touches secrets or a database imports `server-only`. Only `NEXT_PUBLIC_*` env vars
  reach the browser.

## Routing and data

- `params` and `searchParams` are Promises: `const { id } = await params`.
- Use `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`). `next/router` and
  `next/head` are Pages Router APIs and are lint errors here.
- Use `<Link>` for internal navigation. A raw `<a href="/…">` is a lint error.
- Fetch on the server, in the component that needs the data, and run independent requests in
  parallel (`Promise.all`). Wrap slow parts in `<Suspense>` with a skeleton fallback.
- Mutations go through Server Actions or Route Handlers. Validate input and check auth inside each
  action, not only in a layout or proxy.
- `cacheComponents` is **not** enabled. Don't add `"use cache"`, `cacheLife` or `cacheTag` without
  turning it on in `next.config.ts` first, and read `01-app/01-getting-started/08-caching.md`.
- Reading cookies, headers or `searchParams` makes a route dynamic. Do it on purpose, and as deep
  in the tree as possible.

## Assets and metadata

- Every route exports `metadata` (or `generateMetadata`) with a `title`. The root layout's
  template turns it into "Title · Ledgerly".
- Images use `next/image` with `width`/`height` (or `fill` plus a sized parent) and a real `alt`.
  Mark only above-the-fold images as `priority`.
- Fonts come only from `next/font`, as wired in `app/layout.tsx`.
- Third-party scripts use `next/script`.

## Structure

- Route groups: `(marketing)`, `(auth)` and `(app)`, each with its own layout. Keep route-only
  components next to their `page.tsx`. Shared app components go in `components/`, data and
  helpers in `lib/`.
- Add `loading.tsx`, `error.tsx` and `not-found.tsx` where a segment can be slow or can fail.
  Error boundaries are client components that receive `{ error: unknown, retry }`. In Next 16,
  `retry()` re-fetches the segment and replaces `reset()`. Render them with
  `components/error-state.tsx`. `app/global-error.tsx` covers root-layout failures and brings its
  own `<html>` and styles.
