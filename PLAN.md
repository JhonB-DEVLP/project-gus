# Plan

Time box: 6 h of active work, hard limit 8 h. The total below counts everything, planning included. One commit per milestone. If I reach 8 h, I stop and list what is not finished below.

| # | Milestone | Estimate | Actual | Notes |
|---|---|---|---|---|
| P | Planning and design in Claude (chat): brief, direction, palette, preview, spec, copy, milestone prompts | — | 1 h 30 | Active time. The chat ran on Oct 20, 10:30–13:30, while I was also working for two clients, so it spans longer. Transcript in `docs/sessions/` |
| M0 | Setup: Next.js 16, TS strict, Tailwind v4 tokens, fonts, ESLint, Vitest, CI workflow, `/check` | 25 min | 25 min | |
| M1 | Shell: `[lang]` routing + `proxy.ts`, dictionaries, header/footer, skip link, theme with no flash, mobile menu | 45 min | 50 min | |
| M2 | Home + work: hero with motion, specs, work list, 3 project pages with figures | 1 h | 45 min | |
| M3 | Live data: Hugging Face fetch, Suspense, loading / error / empty states, count-up | 30 min | 20 min | |
| M4 | Contact: schema, Server Action, typed errors, honeypot, rate limit, Redis store + Resend, form states, unit tests | 55 min | 20 min | |
| M5 | SEO + a11y: metadata, canonical, hreflang, OG images, sitemap, robots, JSON-LD, 404, E2E keyboard test, axe | 40 min | 30 min | |
| M6 | Ship: deploy to Vercel, Lighthouse pass, screenshots, README, DESIGN.md, AI_LOG.md | 45 min | 40 min | Includes fixing a regression from M5: the 404 read a request header, which made the project and contact pages dynamic |
| | **Build** | **5 h 00** | **3 h 50** | |
| | **Total with planning** | **6 h 30** | **5 h 20** | Over the 6 h target, under the 8 h limit. The build estimates are shorter because the spec and prompts were written first. |

Optional if time is left: view transition from the work list to the project page.

## Not finished

- **Real project screenshots.** Every project figure is still a drawn placeholder (named in the caption, alt text and README). `next/image` is wired in `components/figure.tsx` but has nothing to render yet.
- **The 404 is blank without JavaScript.** It returns status 404 in the right language, but Next serves its error shell (`<html id="__next_error__">`), so the content only appears after hydration. This was already the case before the M6 fix.
- **Field INP is not measured.** Lighthouse reports TBT as the lab stand-in; a new site has no CrUX data.

## With one more day

- `cacheComponents` + Partial Prerendering on the home, so the static shell is served from the CDN and only the live table renders per request.
- Real screenshots from demo accounts, through `next/image`.
- Vercel Speed Insights for real INP.
- Lighthouse in CI, with the ≥ 90 budget as a failing check.
- A Claude Code hook that runs the typecheck after each edit.
