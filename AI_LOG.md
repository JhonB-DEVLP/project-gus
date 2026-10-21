# AI log

> Skeleton. Fill it in from your notes as you go; keep it under 500 words.

## Tools and models

- **Claude (chat), Opus** — planning before the build: reading the brief, design direction and palette (with contrast checks), the canvas preview, the spec, the copy in EN/PT and one prompt per milestone. About 1 h 30 of active time (the chat spans longer because I was working for two clients in between), before the build, counted in the total in `PLAN.md`. Everything it produced is in `docs/`. Transcript: `docs/sessions/00-planning.md`.
- **Claude Code, [model]** — the build, one milestone per session.
- Skills: frontend-design, emil-design-eng, react-best-practices, verification-before-completion, executing-plans, webapp-testing. Why each: [one line each].

## What I gave the agent and what I did myself

- Agent: [ ]
- Me: [ ]
- Why: [ ]

## Three times the agent was wrong

1. **What it did:** [ ] **How I found it:** [ ] **What I changed:** [ ]
2. **What it did:** [ ] **How I found it:** [ ] **What I changed:** [ ]
3. **What it did:** [ ] **How I found it:** [ ] **What I changed:** [ ]

## How I checked output before committing

- `/check` (lint, typecheck, tests, build) before every commit
- Unit tests for the contact schema and handler; Playwright keyboard-only E2E; axe
- Every UI change opened at 390px and 1280px, light and dark, and tabbed through
- Diff read before each commit

## Cost

[tokens or money, if the tool shows it]
