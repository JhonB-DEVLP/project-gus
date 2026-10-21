# M0 — Setup (35 min)

Read: `CLAUDE.md`, `docs/spec.md` §1 and §12, `docs/design.md` "Tokens".

## Goal
An empty but correct project: it builds, lints, type-checks and runs one test, locally and in CI. The git history shows plan → context → code.

## Do
1. Move `docs/setup/check-command.md` to `.claude/commands/check.md` (that's the `/check` slash command) and delete `docs/setup/`.
2. Connect to the GitHub repo, which already has one commit (GitHub's `README.md`):
   - `git init -b main`
   - `git remote add origin https://github.com/JhonB-DEVLP/project-gus.git`
   - `git pull origin main` (brings in that README commit; nothing local is overwritten)
   Then two commits **before any code exists**:
   - `git add PLAN.md .gitignore` → `docs: plan`
   - `git add CLAUDE.md DESIGN.md AI_LOG.md docs .claude` → `docs: agent context, spec, design and content`
   Before each commit, run `git status` and confirm `docs/brief.local.pdf` is **not** staged. Then `git push -u origin main`.
3. Scaffold with `create-next-app` (App Router, TypeScript, Tailwind, ESLint, no `src/`, import alias `@/*`). This folder isn't empty, so scaffold into a sibling temp folder and move the files in **without overwriting** existing files (keep GitHub's `README.md`; M6 rewrites it). Merge the scaffold's `.gitignore` entries into ours and keep `*.local.*`. Delete the temp folder.
4. `tsconfig.json`: confirm `strict: true`; add `noUncheckedIndexedAccess: true`.
5. ESLint: make `@typescript-eslint/no-explicit-any` an error.
6. `app/globals.css`: all tokens from `docs/design.md` (color in both themes with the three-block pattern, type, spacing, radius, motion), exposed to Tailwind with `@theme inline`. Remove the starter styles.
7. `next/font/google`: Archivo (variable, include the `wdth` axis) and JetBrains Mono, as CSS variables used by the tokens.
8. Vitest with one smoke test. Scripts: `typecheck` (`tsc --noEmit`), `test`, `test:e2e` (placeholder for now).
9. `.github/workflows/ci.yml`: on push — install (cached), lint, typecheck, test, build. E2E step comes in M5.
10. `.env.example` with the variables in `docs/spec.md` §13, each with a comment.

## Don't
- No pages or components yet beyond a blank home.
- No UI library (no shadcn, no Radix).

## Verify
- `/check` all PASS.
- `git log --stat` shows: GitHub's initial README, then plan, then context, then code. `docs/brief.local.pdf` is in no commit.
- Push and confirm the CI run is green.

## Commit
`chore(m0): project setup, tokens, CI`
