# Jhon Silva — portfolio

Personal portfolio built for the Full-Stack Web Engineer Assessment v2. Next.js 16 App Router, TypeScript strict, Tailwind v4.

## Read first

- `docs/spec.md` — what to build, routes, Server/Client boundaries, contact API, SEO, a11y, tests, CI
- `docs/design.md` — tokens, type scale, motion, page layouts (canvas preview linked there)
- `docs/content.md` — every string in EN and PT, and the project pages
- `PLAN.md` — milestones; work on one milestone per session
- `docs/brief.local.pdf` — the original brief (local only, not committed)

Read only what the current task needs. Don't load all of `docs/` for a one-file change.

## Rules

1. **No `any`.** Not in code, not in tests. Use `unknown` and narrow, or infer from Zod.
2. **Server Components by default.** Add `"use client"` only for the three components listed in `docs/spec.md` §3. A new client boundary needs my approval and a line in the README.
3. **Tokens only.** Colors, sizes, spacing, radius and durations come from `app/globals.css`. No raw hex, no arbitrary Tailwind values (`text-[37px]`) in components.
4. **Copy comes from the dictionaries.** No hardcoded user-facing strings in components. `pt.json` must have every key in `en.json` (the type enforces it).
5. **Next.js 16 changed APIs.** `middleware` is now `proxy`; `params` is a Promise. When unsure, read `node_modules/next/dist/docs/` before writing code. Don't rely on memory of older versions.
6. **External calls live in `lib/`.** Hugging Face in `lib/live/`, Upstash and Resend behind the interfaces in `lib/contact/`. Never call them from components.
7. **Never put user input into HTML unescaped.** Contact email is plain text.
8. **No secrets in the repo.** New env vars go into `.env.example` with a comment.
9. **Motion respects `prefers-reduced-motion`.** The hero `h1` never starts invisible (it's the LCP element).
10. **External skills:** before installing a skill with `npx skills add`, read its whole `SKILL.md` and tell me what it instructs. Only then install.
11. **Deploy is mine.** Vercel deploys from GitHub on every push. Never run the Vercel CLI (`vercel`, `vercel deploy`, `vercel --prod`) and don't poll CI or deploy status. After a push, stop and tell me; I check GitHub Actions and Vercel myself.

## Definition of done (every task)

Run `/check`. A task is done only when all of these pass:
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- for UI work: open the page at 390px and 1280px, in light and dark, and tab through it once

"Should work" is not done. If something can't be verified, say so explicitly.

## Workflow

- One milestone per session. Start by reading the milestone's prompt in `docs/prompts/`.
- Plan before code for anything over ~30 lines; show me the plan.
- Small commits. One commit at the end of each milestone: `feat(m2): home and work pages`.
- Don't commit until I've reviewed the diff.
- If you hit something the spec doesn't cover, stop and ask. Don't invent product decisions.

## Skills in use

- `frontend-design` (Anthropic) — keep the design away from generic defaults
- `emil-design-eng` — polish: states, focus, hover, motion details
- `react-best-practices` (Vercel Labs) — RSC, composition, performance
- `verification-before-completion` (obra/superpowers) — verify before claiming done
- `executing-plans` + `using-superpowers` (obra/superpowers) — keep context across long tasks
- `webapp-testing` — Playwright checks and screenshots

## Commands

```
npm run dev          # local
npm run lint
npm run typecheck    # tsc --noEmit
npm test             # vitest
npm run test:e2e     # playwright (needs a build + CONTACT_DRIVER=memory)
npm run build
```
