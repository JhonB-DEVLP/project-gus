import { createHmac } from "node:crypto";

// The rate limit key for a sender: HMAC-SHA-256 of the IP with a secret
// salt (RATE_LIMIT_SALT), so the IP is never stored and can't be recovered
// by hashing every address.
export function clientId(ip: string, salt: string): string {
  return createHmac("sha256", salt).update(ip).digest("hex");
}
