# AI log

## Tools and models

- **Claude (chat), Opus 5.5** — planning before any code: design direction, palette with contrast checks, the spec, the EN/PT copy and one prompt per milestone in `docs/prompts/`. 1 h 30 active, in `PLAN.md`. Transcript: `docs/sessions/00-planning.md`.
- **Claude Code, Opus 5.5** — the build, one session per milestone. Each one started with: read `CLAUDE.md`, run the milestone prompt, show me the plan first.
- **Skills:**
  - `using-superpowers` + `executing-plans` (obra/superpowers): the agent follows the milestone prompt step by step and stops for my approval, so long sessions keep their context.
  - `frontend-design` (Anthropic): used in M1–M2, with a limit: follow `docs/design.md` and `docs/preview/`, don't invent another direction.

## What I gave the agent and what I did myself

- **Me:** visual direction, palette and hero copy; which projects to show and what to say about them; the security choices in the contact form; approving or changing every plan; reading every diff; checking CI.
- **Agent:** code, tests, CI, README and transcript conversion.
- **Why:** these decisions are expensive to get wrong and I have to defend them. The agent works inside a spec it can't change without asking.

## Three times the agent was wrong

1. **M4: the contact plan was weaker than it looked.** SHA-256 of the IP with no salt, the `lang` from `.bind` used without validation, no cap on the Redis list, and line breaks allowed in the name, which goes into the email subject. **How I found it:** reading the plan before approving it. **What I changed:** HMAC-SHA-256 with a secret salt (a plain hash of an IPv4 can be brute-forced), `hasLocale` on `lang` because `.bind` values come from the client, `LTRIM` to the last 500 messages, control characters rejected in the name.
2. **M3: `CountUp` jumped straight to the final number in production.** It read the CSS duration with `parseFloat`; the minifier rewrites `1100ms` as `1.1s`, so the animation lasted 1.1 ms. **How I found it:** the milestone's verification step (Playwright against the production build) showed the numbers already final halfway through. **What I changed:** a `toMs()` that accepts `ms` and `s`, with a unit test.
3. **M5: one `headers()` call in the 404 made `/work/[slug]` and `/contact` dynamic.** **How I found it:** the build report showed ƒ instead of ● on those routes. **What I changed:** in M6 the 404 gets its language from `next/root-params`, and the path is read on the client by `RequestedPath`, a fourth Client Component I approved.

## How I checked output before committing

- No code before a plan I approved or changed.
- `/check` (lint, typecheck, tests, build) before every commit, and no commit without my approval after reading the diff.
- Playwright screenshots at 320, 390 and 1280 px, light and dark, plus the Tab order from the top. I reviewed the prints.
- I checked CI on GitHub myself, and that commits used my personal account.
- Before submitting: a real message through the live form, keyboard only, reduced motion, PageSpeed.

## Cost

About US$ 28 in Claude Code for M0–M6.