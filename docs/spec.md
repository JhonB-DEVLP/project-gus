# Spec — Jhon Silva portfolio

Source of truth for what we build. The brief is `docs/brief.local.pdf` (Full-Stack Web Engineer Assessment v2; kept local and gitignored, since it's the company's test). When this spec and the brief disagree, the brief wins: flag it, don't guess.

Design decisions live in `docs/design.md`. Copy (EN + PT) lives in `docs/content.md`.

## 1. Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Required by the brief |
| Language | TypeScript, `strict: true`, no `any` | Required |
| Styling | Tailwind CSS v4, tokens in `app/globals.css` (`@theme`) | Required; one place for tokens |
| Fonts | `next/font/google`: Archivo (variable, `wdth` axis) + JetBrains Mono | Required (`next/font`) |
| Validation | Zod | Schema on the server, inferred types |
| Rate limit + message store | Upstash Redis (`@upstash/redis`, `@upstash/ratelimit`) | Works on serverless, where memory is per instance |
| Email | Resend | Already used in other projects |
| Unit tests | Vitest | Fast, TS-native |
| E2E + a11y | Playwright + `@axe-core/playwright` | Keyboard-only submit + automated a11y check |
| Deploy | Vercel | Git integration |

Read the Next.js docs in `node_modules/next/dist/docs/` before using an API you are not sure about. Next 16 renamed `middleware` to `proxy` and `params` is a Promise.

## 2. Routes

All pages live under `app/[lang]/`, with `lang` in `en | pt`. Default locale: `en`.

| Route | Page | Rendering |
|---|---|---|
| `/` | Redirects to `/en` or `/pt` by `Accept-Language` (in `proxy.ts`) | — |
| `/[lang]` | Home: hero, specifications, work list, live readings, contact band | Static shell, live section streams |
| `/[lang]/work/[slug]` | Project detail (`zapichat`, `leia`, `nextech`) | Static (`generateStaticParams`) |
| `/[lang]/contact` | Contact form | Static shell + Server Action |
| not found | `app/[lang]/not-found.tsx` ("ERR-404 · Part not found") | Static |

Each project has its own URL, as the brief requires.

## 3. Server and Client Components

Pages are Server Components. A Client Component exists only where state or browser APIs are needed. Each `"use client"` gets one line in the README explaining why.

| Client Component | Why it must be client |
|---|---|
| `ThemeToggle` | Reads and writes `localStorage`, sets `data-theme` on `<html>` |
| `ContactForm` | `useActionState` for pending, field errors and success without a reload |
| `CountUp` | Animates numbers with `requestAnimationFrame`; skipped when `prefers-reduced-motion` |

Not client, on purpose:
- Language switch: plain `<Link>`s to the other locale.
- Mobile menu: native `<details>`/`<summary>`, no JS.
- Hero motion: CSS only.
- Live section error state: the Server Component catches the fetch error and renders the error UI; "Retry" is a link to the same page.

## 4. Theme (light, dark, system — no flash)

- Tokens are CSS variables. Light values on `:root`. Dark values under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and again under `:root[data-theme="dark"]`.
- A tiny inline script in `<head>` (in the root layout, `dangerouslySetInnerHTML`) reads `localStorage.theme` (`light | dark | system`). For `light` or `dark` it sets `data-theme` on `<html>` before first paint. For `system` or nothing, it sets nothing and CSS follows the OS.
- `<html suppressHydrationWarning>`.
- `ThemeToggle` is a 3-button group (`aria-pressed`) and writes the choice to `localStorage`.
- Reference: `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` (Themes section).

## 5. i18n

- `proxy.ts` redirects paths without a locale to the best match from `Accept-Language`, falling back to `en`. Skip `_next`, `api`, static files and metadata routes in the matcher.
- Dictionaries: `app/[lang]/dictionaries/en.json` and `pt.json`, loaded with `import 'server-only'` and a typed `getDictionary(lang)`. The `pt` dictionary must have the same keys as `en` (type-checked: derive the type from `en.json`).
- `<html lang>` follows the route (`en` / `pt-BR`).
- Project content (long text) lives in typed objects in `content/projects.ts`, one entry per slug with `en` and `pt` fields.

## 6. Live data section

- Source: Hugging Face Hub, `GET https://huggingface.co/api/models?sort=trendingScore&limit=5`. No key needed.
- Fields used: `id`, `pipeline_tag`, `likes`, `downloads`. Validate the response with a Zod schema; drop items that fail.
- Fetched on the server at request time (`await connection()` before the fetch, or `cache: 'no-store'`).
- The section is its own async Server Component wrapped in `<Suspense fallback={<LiveSkeleton />}>`, so the rest of the page renders first.
- Timeout: abort after 4 s (`AbortSignal.timeout`).
- States:
  - Loading: skeleton rows with the same height as real rows (no CLS).
  - Error (network, timeout, invalid JSON): "Couldn't reach Hugging Face. The rest of the page still works." + "Retry" link.
  - Empty (0 valid items): "No trending models right now."
- Show the read time: "READ 14:32:07 UTC" (server time in UTC, so there is no hydration mismatch).

## 7. Contact API

Server Action `sendMessage` in `app/[lang]/contact/actions.ts`, used with `useActionState`.

**Schema (Zod, server):**

| Field | Rule |
|---|---|
| `name` | trimmed, 2–80 chars |
| `email` | trimmed, valid email, max 254 |
| `message` | trimmed, 10–2000 chars |
| `company` | honeypot, must be empty (hidden from people and screen readers) |

**Typed result:**
```ts
type ContactResult =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Partial<Record<'name' | 'email' | 'message', string>> }
  | { ok: false; error: 'rate_limited'; retryAfterSeconds: number }
  | { ok: false; error: 'spam' }
  | { ok: false; error: 'server' }
```
Field messages are dictionary keys, so they translate.

**Order of checks:** honeypot → rate limit → schema → deliver.
- Honeypot filled: return `{ ok: true }` to the bot (don't teach it), but store nothing and send nothing. Log a counter only.
- Rate limit: Upstash sliding window, 5 messages per 10 minutes per IP (from `x-forwarded-for`, first value). Identifier is hashed before use.
- Deliver: write the message to Redis (list `contact:messages`, JSON with id, time, name, email, message, locale), then send an email via Resend with `replyTo` set to the sender. If Redis write succeeds and email fails, still return `ok` (the message is stored; the reviewer can check it) and log the email error.
- Never put user input into HTML without escaping. Send plain text email.

**Testability:** `lib/contact/` exposes interfaces `MessageStore`, `Mailer`, `RateLimiter`. Production uses Upstash + Resend. Tests and E2E use in-memory versions, picked by `CONTACT_DRIVER=memory`. The schema and the action's decision logic are pure functions tested without network.

**Where the reviewer checks messages:** the Upstash console (list `contact:messages`) and the inbox in `CONTACT_EMAIL_TO`. Say this in the README.

## 8. SEO

- `generateMetadata` per page: title, description, canonical (`alternates.canonical`), `alternates.languages` for `en` / `pt-BR`.
- `opengraph-image.tsx` with `ImageResponse` for home and each project, in the datasheet style.
- `app/sitemap.ts` with both locales and every project; `app/robots.ts`.
- JSON-LD `Person` in the root layout (name, jobTitle, url, sameAs). Reference: `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`.

## 9. Accessibility (WCAG 2.2 AA)

- Skip link as the first focusable element, visible on focus.
- Landmarks: `header`, `nav`, `main`, `footer`. One `h1` per page.
- Visible focus on every interactive element (2px outline, 3px offset, token color).
- Form: `<label for>`, `aria-invalid`, `aria-describedby` to the error text, error summary focused on submit failure, success in `role="status"`.
- Touch targets ≥ 44 × 44 px on mobile.
- `prefers-reduced-motion`: all animation off.
- Color contrast already checked for every token pair (see `docs/design.md`).

## 10. Performance budget

- Lighthouse mobile ≥ 90 in all four categories; LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- The hero `h1` is the LCP element. Its text is in the HTML; the animation only moves it with `transform` inside an `overflow: hidden` line. No `opacity: 0` start state on the `h1`.
- Images: `next/image` with explicit `sizes`; only the first project figure on a detail page gets `priority`.
- Client JS: only the three Client Components above. No animation library.

## 11. Tests

- Unit (Vitest): schema accepts and rejects (each field, boundaries, honeypot), action decision logic (spam, rate limited, store ok + mail fail).
- E2E (Playwright): fill and submit the contact form using only the keyboard (`Tab`, typing, `Enter`), assert the success status. Runs with `CONTACT_DRIVER=memory`.
- A11y: axe on home, one project page and contact; zero violations.

## 12. CI

`.github/workflows/ci.yml` on every push: install, lint, typecheck (`tsc --noEmit`), unit tests, build, Playwright (E2E + axe) against the built app. Cache dependencies. Uses `CONTACT_DRIVER=memory`, so no secrets needed in CI.

## 13. Security

- No secrets in the repo. `.env.example` lists: `NEXT_PUBLIC_SITE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`, `CONTACT_DRIVER`.
- Confirm the Upstash env var names in the Upstash console before writing code; the Vercel integration may name them differently.
