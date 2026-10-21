import "server-only";
import { createMemoryContact, type MemoryContact } from "./memory";
import { createResendMailer } from "./resend";
import type { ContactDeps } from "./types";
import { createUpstash, hasUpstashEnv } from "./upstash";

// Picks the drivers by CONTACT_DRIVER: "memory" for tests, E2E and CI;
// anything else is production (Upstash + Resend). Returns null when the
// production config is incomplete, and the action answers "server".

type Drivers = ContactDeps & { salt: string };

// One in-memory instance per server process, so the rate limit holds
// across requests (and across module reloads in dev).
const globalForContact = globalThis as typeof globalThis & { __contactMemory?: MemoryContact };

let production: Drivers | null = null;

export function getContactDrivers(): Drivers | null {
  if (process.env.CONTACT_DRIVER === "memory") {
    globalForContact.__contactMemory ??= createMemoryContact();
    return { ...globalForContact.__contactMemory, salt: process.env.RATE_LIMIT_SALT || "memory-driver" };
  }

  if (production) return production;

  const { RESEND_API_KEY, CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO, RATE_LIMIT_SALT } = process.env;
  const missing = [
    hasUpstashEnv() ? null : "UPSTASH_REDIS_REST_URL/TOKEN",
    RESEND_API_KEY ? null : "RESEND_API_KEY",
    CONTACT_EMAIL_FROM ? null : "CONTACT_EMAIL_FROM",
    CONTACT_EMAIL_TO ? null : "CONTACT_EMAIL_TO",
    RATE_LIMIT_SALT ? null : "RATE_LIMIT_SALT",
  ].filter((name) => name !== null);

  if (missing.length > 0 || !RESEND_API_KEY || !CONTACT_EMAIL_FROM || !CONTACT_EMAIL_TO || !RATE_LIMIT_SALT) {
    console.error(`contact: missing env ${missing.join(", ")}`);
    return null;
  }

  production = {
    ...createUpstash(),
    mailer: createResendMailer({ apiKey: RESEND_API_KEY, from: CONTACT_EMAIL_FROM, to: CONTACT_EMAIL_TO }),
    salt: RATE_LIMIT_SALT,
  };
  return production;
}
