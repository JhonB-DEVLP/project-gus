# M3 — Live data section (35 min)

Read: `docs/spec.md` §6; `docs/design.md` Motion #3; `docs/content.md` keys `live.*`.
Next docs: `node_modules/next/dist/docs/01-app/02-guides/streaming.md`, `.../03-api-reference/04-functions/connection.md`.

## Goal
Trending Hugging Face models stream into the home page after the rest of it has rendered, with loading, error and empty states.

## Do
1. `lib/live/huggingface.ts`: fetch `https://huggingface.co/api/models?sort=trendingScore&limit=5` at request time, 4s timeout, Zod-validate (`id`, `pipeline_tag`, `likes`, `downloads`), return a typed result `{ ok: true, items, readAt } | { ok: false }`.
2. `LiveReadings` async Server Component that renders table, empty or error state.
3. In the home page: `<Suspense fallback={<LiveSkeleton />}>`. Skeleton rows match real row height.
4. `CountUp` client component for likes and downloads (rAF, ~1.1s, ease-out). Renders the final number on the server and when reduced motion is on.
5. Unit test for the parser: valid payload, payload with one bad item, non-array payload.

## Verify
- `/check` PASS.
- Add an artificial 2s delay locally: the hero and work list appear first, then the table. Remove the delay.
- Point the URL at a bad host locally: error state shows, the rest of the page works. Revert.
- No CLS when the table replaces the skeleton (Lighthouse or Performance panel).

## Commit
`feat(m3): live Hugging Face readings with Suspense`
