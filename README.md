# project-gus

Jhon Silva's portfolio, built for the Full-Stack Web Engineer Assessment v2. Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4.

- **Live:** https://project-gus.vercel.app
- **Design note:** [DESIGN.md](DESIGN.md) · **AI log:** [AI_LOG.md](AI_LOG.md) · **Plan and actual times:** [PLAN.md](PLAN.md)
- **Agent setup:** [CLAUDE.md](CLAUDE.md), [.claude/commands/check.md](.claude/commands/check.md), one prompt per milestone in [docs/prompts/](docs/prompts/), transcripts in [docs/sessions/](docs/sessions/)

## Local setup

Node 22 (the version CI uses).

```
npm ci
cp .env.example .env.local     # every variable has a comment
npm run dev                    # http://localhost:3000
```

To run without Upstash or Resend accounts, set `CONTACT_DRIVER=memory` in `.env.local`: the contact form then uses an in-memory store, mailer and rate limiter.

| Command | What it does |
|---|---|
| `npm run lint` | ESLint (Next config) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | Vitest: contact schema and handler, rate limit, proxy, dictionaries, theme script, tokens, live data parser |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright against the production build (`npm run build` first): keyboard-only contact form, and axe (WCAG 2.2 AA tags) on home, a project page, contact and the 404, in light and dark |

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs all five on every push with `CONTACT_DRIVER=memory`, so it needs no secrets.

## Project structure

```
app/
  [lang]/                    every page lives under /en or /pt
    page.tsx                 home: hero, specifications, work list, live readings, contact strip
    work/[slug]/page.tsx     project pages (static, 3 projects × 2 languages)
    contact/page.tsx         contact page; actions.ts is the Server Action
    [...missing]/, not-found.tsx   404 inside the layout, in the visitor's language
    dictionaries/{en,pt}.json      every UI string; en.json defines the type
    opengraph-image.tsx      share images (also under work/[slug] and contact)
  globals.css                design tokens (@theme) and the light/dark palettes
  icon.tsx, robots.ts, sitemap.ts
components/                  Server Components, except the four listed below
content/projects.ts          project pages in EN and PT; screenshots in content/images/
lib/
  contact/                   schema (Zod), handleContact, drivers: Upstash, Resend, in-memory
  live/                      Hugging Face fetch (server-only) and its parser
  i18n.ts, site.ts, theme.ts shared config; theme.ts holds the no-flash script
  tokens.ts, og/             token mirror for ImageResponse, share image layout
proxy.ts                     redirects / to /en or /pt by Accept-Language
tests/                       Vitest unit tests
e2e/                         Playwright: keyboard-only contact, axe
docs/                        spec, design, copy, milestone prompts, sessions, screenshots
```

## Client Components

Everything is a Server Component except these:

- `components/theme-toggle.tsx`: reads and writes `localStorage` and sets `data-theme` on `<html>`.
- `components/count-up.tsx`: animates the live numbers with `requestAnimationFrame` after hydration. The server renders the final number, so it is correct without JS and with reduced motion.
- `components/contact-form.tsx`: `useActionState` for the pending state, field errors and success without a reload. Without JS the form still posts to the Server Action and the page renders the result.
- `components/requested-path.tsx`: shows the requested path on the 404 with `usePathname`. Added in M6: reading it from request headers on the server made every page under `[lang]` dynamic (see Rendering).

## Main decisions and trade-offs

- **i18n without a library.** A `[lang]` segment, JSON dictionaries typed by `en.json` (a missing key in `pt.json` fails the typecheck), and `proxy.ts` for the redirect from `/`. No i18n JavaScript reaches the client. The cost: no plural or formatting helpers, which the copy doesn't need yet.
- **Theme with no flash.** An inline script in `<head>` sets `data-theme` before the first paint, and only for an explicit light or dark choice; "system" leaves it unset so CSS follows `prefers-color-scheme`. The cost: the server can't know the stored choice, so the toggle shows no pressed button until hydration.
- **Contact as a Server Action.** It works without JavaScript and needs no client fetch code. The cost: there is no public REST endpoint for other clients. The logic is a pure function with injected dependencies, so every branch is unit tested without the network (details below).
- **Live data from the Hugging Face Hub** (trending models). It's a public API with no key, so there's no secret and no quota per user. Fetched at request time with a 4 s timeout; any failure becomes the error state instead of a thrown error.
- **Tokens in one place.** `app/globals.css` is the source of truth. `lib/tokens.ts` mirrors the colors for `ImageResponse`, which can't read CSS variables, and `tests/tokens.test.ts` fails if the two drift.
- **Fonts and images.** `next/font` for Archivo (variable, with the `wdth` axis for the condensed display type) and JetBrains Mono. Project screenshots are static imports through `next/image` (served as WebP in responsive sizes from the PNGs in `content/images/`; only FIG. 1 is `priority`). They are wider than the 16:10 and 4:3 frames, so each one sets the `object-position` that keeps what matters in view.

## Contact form

- Server Action `app/[lang]/contact/actions.ts` → `handleContact` in `lib/contact/handle.ts`, a pure function with the order honeypot → rate limit → schema (Zod) → store → email. Every branch has a unit test.
- **Where to check messages:** the Upstash console, list `contact:messages` (newest first, the latest 500 are kept), and the inbox in `CONTACT_EMAIL_TO`. The email is plain text with Reply-To set to the sender. If storing works but the email fails, the sender still sees "sent" (the message is in Redis) and the error is logged.
- **Spam:** a hidden `company` field. When a bot fills it, it gets the same "sent" answer, nothing is stored or emailed, and `contact:spam` is incremented.
- **Rate limit:** 5 messages per 10 minutes per sender (Upstash sliding window). The key is an HMAC-SHA-256 of the IP with `RATE_LIMIT_SALT`, so IPs are never stored.
- **Fail open:** if Upstash doesn't answer the rate limit check in time, `@upstash/ratelimit` lets the message through, and so does `handleContact` if the limiter throws. A Redis outage shouldn't block real messages; the trade-off is that a flood during an outage isn't limited (storing would fail anyway, so nothing is delivered).
- **Drivers:** `CONTACT_DRIVER=memory` uses in-memory store, mailer and limiter (tests, E2E, CI, no secrets). Otherwise Upstash + Resend; if a variable is missing, the form answers "not sent" and the server logs which one.

## Rendering

- Project and contact pages are static (`generateStaticParams`: 3 projects × 2 languages, contact × 2).
- The 404 keeps them static. Next renders `not-found.tsx` as part of every route under `[lang]`, so a dynamic API there makes all of them dynamic. In M5 it read the path from a request header and every page became server-rendered; now the language comes from `next/root-params` (known at build time) and the path from `usePathname` in the browser.
- The home page is rendered on each request, because the live section fetches Hugging Face at request time (`connection()`). It streams: the hero, specifications, work list and the live skeletons go out in the first chunk, and the live table follows when the fetch resolves (4 s timeout).
- Trade-off: Next 16 can prerender that first chunk at build time and serve it from the CDN (a static shell with Partial Prerendering), but only with `cacheComponents: true`. That flag changes caching for the whole app (for example, `new Date()` in the footer would need its own boundary), so it is off for now. Without it, each home request renders the shell on the server; it has no data to wait for, so it is fast, but it is not served from the CDN.

## Performance

PageSpeed Insights, mobile (Lighthouse 13.5, Moto G Power, slow 4G), production URL after commit `9945a8d`, measured on Oct 21, 2026, 15:39–15:44.

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index | Report |
|---|---|---|---|---|---|---|---|---|---|---|
| `/en` | 99 | 100 | 100 | 100 | 0.9 s | 2.0 s | 0 ms | 0 | 1.1 s | [PSI](https://pagespeed.web.dev/analysis/https-project-gus-vercel-app-en/uvs9u3qem7?form_factor=mobile) |
| `/en/work/leia` | 98 | 100 | 100 | 100 | 0.9 s | 2.4 s | 10 ms | 0 | 2.3 s | [PSI](https://pagespeed.web.dev/analysis/https-project-gus-vercel-app-en-work-leia/ky6ewpi0he?form_factor=mobile) |
| `/en/contact` | 100 | 100 | 100 | 100 | 0.9 s | 1.8 s | 30 ms | 0 | 0.9 s | [PSI](https://pagespeed.web.dev/analysis/https-project-gus-vercel-app-en-contact/e0nfbxsjwq?form_factor=mobile) |

INP needs real interactions, so Lighthouse doesn't report it; TBT is its lab stand-in. A new site has no field data (CrUX) yet.

**Local check (observation only).** Lighthouse 13.5.0 from my machine, mobile defaults, 3 runs per page against the same deploy. Median Performance: `/en` 98, `/en/work/leia` 93, `/en/contact` 97; Accessibility, Best Practices and SEO 100 on every run. Single runs ranged from 88 to 100, so the margin over 90 is real but not wide. My local DNS resolver takes about 4.5 s on a cold lookup, which Lighthouse counted as page load (Speed Index around 7 s), so these runs pin the host to its IP in Chrome (`--host-resolver-rules`).

## Placeholder content

None. Projects, roles, stacks, decisions, copy and screenshots are real. The Nextech dashboard (FIG. 3) runs in the product's demo mode, so the patients and events in it are fictional; the caption says so.
