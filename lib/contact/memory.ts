import type { ContactDeps, RateLimiter, StoredMessage } from "./types";

// In-memory drivers for tests, E2E and CI (CONTACT_DRIVER=memory). State
// lives as long as the server process.

export const WINDOW_MS = 10 * 60 * 1000;
export const MAX_PER_WINDOW = 5;

// Sliding window: the send times of each sender within the last 10 minutes.
export function createMemoryLimiter(now: () => number = Date.now): RateLimiter {
  const sends = new Map<string, number[]>();
  return {
    async limit(id) {
      const t = now();
      const recent = (sends.get(id) ?? []).filter((time) => t - time < WINDOW_MS);
      const oldest = recent[0];
      if (recent.length >= MAX_PER_WINDOW && oldest !== undefined) {
        sends.set(id, recent);
        return { ok: false, retryAfterSeconds: Math.ceil((oldest + WINDOW_MS - t) / 1000) };
      }
      sends.set(id, [...recent, t]);
      return { ok: true };
    },
  };
}

export type MemoryContact = ContactDeps & { messages: StoredMessage[]; sent: StoredMessage[]; spam: () => number };

export function createMemoryContact(): MemoryContact {
  const messages: StoredMessage[] = [];
  const sent: StoredMessage[] = [];
  let spam = 0;
  return {
    messages,
    sent,
    spam: () => spam,
    store: {
      async save(message) {
        messages.unshift(message);
      },
      async countSpam() {
        spam += 1;
      },
    },
    mailer: {
      async send(message) {
        sent.push(message);
        console.info(`contact (memory): would email message ${message.id} from ${message.email}`);
      },
    },
    limiter: createMemoryLimiter(),
  };
}
