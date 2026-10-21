# M6 — Ship (50 min)

## Goal
Live URL, Lighthouse mobile ≥ 90 in all four categories, and every document the submission checklist asks for.

## Do
1. Deploy on Vercel from GitHub. Set env vars from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the real URL.
2. Run Lighthouse (mobile) on `/en`, `/en/work/leia`, `/en/contact`. Fix anything under 90. Record LCP, CLS, INP in the README.
3. Screenshots of the home on mobile and desktop, light and dark → `docs/screenshots/`.
4. README: project structure, local setup, every `"use client"` with its reason, main decisions with trade-offs, where reviewers can check contact messages, placeholder content, Lighthouse numbers.
5. DESIGN.md (≤ 300 words) — I edit the draft in my own words.
6. AI_LOG.md (≤ 500 words) — I write it from my notes; you can check the word count.
7. Export the 3 most important sessions to `docs/sessions/`; remove secrets and personal data.
8. PLAN.md: actual times, "Not finished", "With one more day".

## Verify
- Submission checklist in the brief, item by item.
- Green CI on the final commit.
- The live form delivers a message.

## Commit
`docs(m6): README, design note, AI log, plan actuals`
