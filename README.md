# project-gus

## Client Components

Everything is a Server Component except these:

- `components/theme-toggle.tsx`: reads and writes `localStorage` and sets `data-theme` on `<html>`.
- `components/count-up.tsx`: animates the live numbers with `requestAnimationFrame` after hydration. The server renders the final number, so it is correct without JS and with reduced motion.

## Rendering

- Project pages are static (`generateStaticParams`, 3 projects × 2 languages).
- The home page is rendered on each request, because the live section fetches Hugging Face at request time (`connection()`). It streams: the hero, specifications, work list and the live skeletons go out in the first chunk, and the live table follows when the fetch resolves (4 s timeout).
- Trade-off: Next 16 can prerender that first chunk at build time and serve it from the CDN (a static shell with Partial Prerendering), but only with `cacheComponents: true`. That flag changes caching for the whole app (for example, `new Date()` in the footer would need its own boundary), so it is off for now. Without it, each home request renders the shell on the server; it has no data to wait for, so it is fast, but it is not served from the CDN.
