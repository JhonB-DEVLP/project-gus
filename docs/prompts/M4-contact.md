# M4 — Contact API and form (1 h 05)

Read: `docs/spec.md` §7 (all of it); `docs/content.md` "Contact page"; `docs/preview/ContactMobile.dc.html` (every form state).
Next docs: `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `.../server-actions.md`.

## Goal
A message sent from the form is validated on the server, protected from spam and floods, stored where a reviewer can check it, and emailed to me. Every outcome has a typed result and a designed state.

## Do (test first for steps 1–3)
1. `lib/contact/schema.ts`: Zod schema; export the inferred type.
2. `lib/contact/types.ts`: `ContactResult` union exactly as in the spec; interfaces `MessageStore`, `Mailer`, `RateLimiter`.
3. `lib/contact/handle.ts`: pure function `handleContact(input, deps)` in the order honeypot → rate limit → schema → store → mail. Unit tests for every branch, including "store ok + mail fails → ok".
4. Drivers: `upstash.ts` (Redis list + sliding window 5/10 min, hashed IP), `resend.ts` (plain text, `replyTo` = sender), `memory.ts`. Pick by `CONTACT_DRIVER`.
5. Server Action `sendMessage` that reads the form, gets the IP from headers, calls `handleContact`.
6. `ContactForm` client component with `useActionState`: field errors with `aria-invalid` + `aria-describedby`, error summary that gets focus, pending state, success in `role="status"`, keeps the text on server error. Honeypot field `company`: visually hidden, `tabIndex={-1}`, `aria-hidden`, `autoComplete="off"`.
7. Works without JavaScript (the action still posts).

## Before writing driver code
Check the env var names in my Upstash console and the current `@upstash/ratelimit` and `resend` docs. Tell me what you found.

## Verify
- `/check` PASS, with the new unit tests.
- Manually with `CONTACT_DRIVER=memory`: empty submit, bad email, honeypot filled, 6 quick sends (6th is rate limited), valid send.
- With real keys: one message arrives by email and appears in the Redis list.

## Commit
`feat(m4): contact API with validation, spam protection and rate limit`
