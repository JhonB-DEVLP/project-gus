import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { MessageStore, RateLimiter } from "./types";

// Upstash Redis: the message list the reviewer reads in the console, the
// spam counter and the rate limit.

export const MESSAGES_KEY = "contact:messages";
const SPAM_KEY = "contact:spam";
// Keep the newest 500 messages.
const MESSAGES_KEPT = 500;

// UPSTASH_REDIS_REST_URL / _TOKEN, or the KV_REST_API_* names of the Vercel integration.
export function hasUpstashEnv(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

export function createUpstash(): { store: MessageStore; limiter: RateLimiter } {
  const redis = Redis.fromEnv();
  // 5 messages per 10 minutes per sender. On a Redis timeout the library
  // lets the request through (fail open); see the README.
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "contact:ratelimit",
  });

  return {
    store: {
      async save(message) {
        // One transaction: newest first, then drop anything past 500.
        await redis
          .multi()
          .lpush(MESSAGES_KEY, JSON.stringify(message))
          .ltrim(MESSAGES_KEY, 0, MESSAGES_KEPT - 1)
          .exec();
      },
      async countSpam() {
        await redis.incr(SPAM_KEY);
      },
    },
    limiter: {
      async limit(clientId) {
        const { success, reset } = await ratelimit.limit(clientId);
        if (success) return { ok: true };
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
      },
    },
  };
}
