# M2 — Home and work pages (1 h 10)

Read: `docs/design.md` (all of "Motion" and "Pages"), `docs/content.md` "Home" and "Projects". Match the design preview: read `docs/preview/README.md`, then `docs/preview/Main.dc.html`, `HomeMobile.dc.html` and `Project.dc.html`. Jhon will also paste screenshots of the canvas.

## Goal
The home page and the three project pages look like the preview, in both languages and both themes.

## Do
1. `content/projects.ts`: typed data for `zapichat`, `leia`, `nextech` from `docs/content.md` (EN + PT fields, status enum, spec rows, figures with alt text, decisions). Skip items marked [confirm] that have no answer yet; leave a `// TODO(confirm)`.
2. Home `app/[lang]/page.tsx`: hero, general specifications, work list, contact band. Leave a slot for the live section (M3).
3. Hero motion: CSS only, per `docs/design.md` Motion #1. Lines are spans inside the `h1`; the `h1` has the full sentence for screen readers. No `opacity: 0` on the `h1`.
4. Work list: rows on desktop, cards on mobile; status = dot + label; hover per Motion #2.
5. `app/[lang]/work/[slug]/page.tsx` with `generateStaticParams` (3 slugs × 2 langs) and `notFound()` for unknown slugs.
6. Figures: `next/image` with `sizes`; until real screenshots exist, use a placeholder figure component in the datasheet style with the caption `FIG. n · … · placeholder`.

## Don't
- No hardcoded copy in components.
- No new client components (all of this is server + CSS).

## Verify
- `/check` PASS.
- Compare with the canvas at 390px and 1280px, light and dark.
- Turn on reduced motion in the OS: hero appears with no animation.
- `/en/work/does-not-exist` → 404.

## Commit
`feat(m2): home, work list and project pages`
