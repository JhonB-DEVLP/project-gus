import { contactSchema } from "./schema";
import { isContactField, type ContactDeps, type ContactField, type ContactInput, type ContactResult } from "./types";

// The decision logic of the contact form, with no network of its own.
// Order (docs/spec.md §7): honeypot → rate limit → schema → store → mail.
export async function handleContact(input: ContactInput, deps: ContactDeps): Promise<ContactResult> {
  if (input.company.trim() !== "") {
    // The action answers the bot with ok; here it is spam. Counting is best effort.
    await deps.store.countSpam().catch((error: unknown) => console.error("contact: spam counter failed", error));
    return { ok: false, error: "spam" };
  }

  try {
    const limit = await deps.limiter.limit(input.clientId);
    if (!limit.ok) return { ok: false, error: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds };
  } catch (error) {
    // Fail open, like @upstash/ratelimit on a timeout: a limiter outage
    // shouldn't block real messages. See the README.
    console.error("contact: rate limiter failed, letting the message through", error);
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (isContactField(field)) fields[field] ??= field;
    }
    return { ok: false, error: "validation", fields };
  }

  const message = {
    id: crypto.randomUUID(),
    time: new Date().toISOString(),
    ...parsed.data,
    locale: input.locale,
  };

  try {
    await deps.store.save(message);
  } catch (error) {
    console.error("contact: could not store the message", error);
    return { ok: false, error: "server" };
  }

  try {
    await deps.mailer.send(message);
  } catch (error) {
    // The message is stored, and the reviewer can read it there: still ok.
    console.error(`contact: stored ${message.id} but the email failed`, error);
  }

  return { ok: true };
}
