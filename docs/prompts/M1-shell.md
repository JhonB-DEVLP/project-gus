# M1 — Shell: i18n, layout, theme (55 min)

Read: `docs/spec.md` §2, §3, §4, §5, §9; `docs/design.md` "Pages → Header"; `docs/content.md` "Global".
Next docs to read first: `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`, `.../03-api-reference/03-file-conventions/proxy.md`, `.../02-guides/preventing-flash-before-hydration.md` (Themes).

## Goal
Every page sits inside a correct shell in both languages, with a theme that never flashes.

## Do
1. `app/[lang]/layout.tsx` with `generateStaticParams` for `en` and `pt`; `<html lang>` = `en` or `pt-BR`; `suppressHydrationWarning`.
2. `proxy.ts`: redirect paths without a locale using `Accept-Language`, default `en`. Exclude `_next`, `api`, files with an extension, and metadata routes.
3. Dictionaries `en.json` / `pt.json` with the Global keys. `getDictionary` typed from `en.json`, `server-only`.
4. Inline theme script in `<head>` (reads `localStorage.theme`, sets `data-theme` for light/dark only). `ThemeToggle` client component: 3 buttons with `aria-pressed`.
5. Header: name + `REV`, nav, language links (plain `<Link>` to the same path in the other locale), theme toggle. Mobile: `<details>`/`<summary>` menu, 44px targets.
6. Skip link → `#main`. Footer.
7. Visible focus style from tokens on every interactive element.

## Don't
- No i18n library.
- No `useEffect` to set the theme.

## Verify
- `/check` PASS.
- Load `/` → lands on `/en` (or `/pt` with a Portuguese browser).
- Pick Dark, hard reload with throttling on: no light flash. Pick Auto and switch the OS theme: page follows.
- Tab from the top: skip link first, then nav in order, focus always visible.
- Check at 320px and 1280px.

## Commit
`feat(m1): i18n shell, header, theme without flash`
