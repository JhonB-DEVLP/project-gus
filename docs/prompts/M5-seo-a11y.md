# M5 — SEO, accessibility, E2E (50 min)

Read: `docs/spec.md` §8, §9, §11, §12; `docs/content.md` "404".
Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/`, `.../02-guides/json-ld.md`.

## Goal
Every SEO item in the brief exists, a keyboard-only E2E test submits the form, and axe finds zero violations. All of it runs in CI.

## Do
1. `generateMetadata` for home, project and contact pages: title, description, `alternates.canonical`, `alternates.languages` (`en`, `pt-BR`). `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
2. `opengraph-image.tsx` for home and `work/[slug]`, datasheet style (name, part number, REV line), using the tokens' hex values.
3. `app/sitemap.ts` (both locales, all projects) and `app/robots.ts`.
4. JSON-LD `Person` in the `[lang]` layout.
5. `not-found.tsx` as in `docs/preview/NotFound.dc.html`.
6. Favicon: "JS" monogram (`app/icon.tsx` or a static SVG).
7. Playwright: build + start with `CONTACT_DRIVER=memory`. Test 1: on `/en/contact`, reach and fill every field with `Tab` and typing, submit with `Enter`, expect the success status. Test 2: axe on `/en`, `/en/work/leia`, `/en/contact` → zero violations.
8. Add the Playwright step to CI.

## Verify
- `/check` PASS and `npm run test:e2e` PASS locally.
- `/sitemap.xml`, `/robots.txt`, page source shows canonical, hreflang and the JSON-LD.
- Rich Results Test (or the JSON-LD validator) accepts the Person.
- CI green.

## Commit
`feat(m5): SEO, 404, E2E keyboard test and axe`
