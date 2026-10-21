# project-gus

## Client Components

Everything is a Server Component except these:

- `components/theme-toggle.tsx`: reads and writes `localStorage` and sets `data-theme` on `<html>`.
- `components/count-up.tsx`: animates the live numbers with `requestAnimationFrame` after hydration. The server renders the final number, so it is correct without JS and with reduced motion.
- `components/contact-form.tsx`: `useActionState` for the pending state, field errors and success without a reload. Without JS the form still posts to the Server Action and the page renders the result.

## Contact form

- Server Action `app/[lang]/contact/actions.ts` → `handleContact` in `lib/contact/handle.ts`, a pure function with the order honeypot → rate limit → schema (Zod) → store → email. Every branch has a unit test.
- **Where to check messages:** the Upstash console, list `contact:messages` (newest first, the latest 500 are kept), and the inbox in `CONTACT_EMAIL_TO`. The email is plain text with Reply-To set to the sender. If storing works but the email fails, the sender still sees "sent" (the message is in Redis) and the error is logged.
- **Spam:** a hidden `company` field. When a bot fills it, it gets the same "sent" answer, nothing is stored or emailed, and `contact:spam` is incremented.
- **Rate limit:** 5 messages per 10 minutes per sender (Upstash sliding window). The key is an HMAC-SHA-256 of the IP with `RATE_LIMIT_SALT`, so IPs are never stored.
- **Fail open:** if Upstash doesn't answer the rate limit check in time, `@upstash/ratelimit` lets the message through, and so does `handleContact` if the limiter throws. A Redis outage shouldn't block real messages; the trade-off is that a flood during an outage isn't limited (storing would fail anyway, so nothing is delivered).
- **Drivers:** `CONTACT_DRIVER=memory` uses in-memory store, mailer and limiter (tests, E2E, CI, no secrets). Otherwise Upstash + Resend; if a variable is missing, the form answers "not sent" and the server logs which one.

## Rendering

- Project pages are static (`generateStaticParams`, 3 projects × 2 languages).
- The home page is rendered on each request, because the live section fetches Hugging Face at request time (`connection()`). It streams: the hero, specifications, work list and the live skeletons go out in the first chunk, and the live table follows when the fetch resolves (4 s timeout).
- Trade-off: Next 16 can prerender that first chunk at build time and serve it from the CDN (a static shell with Partial Prerendering), but only with `cacheComponents: true`. That flag changes caching for the whole app (for example, `new Date()` in the footer would need its own boundary), so it is off for now. Without it, each home request renders the shell on the server; it has no data to wait for, so it is fast, but it is not served from the CDN.
