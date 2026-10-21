import { describe, expect, it } from "vitest";
import { clientId } from "@/lib/contact/client-id";
import { createMemoryLimiter } from "@/lib/contact/memory";

describe("clientId", () => {
  it("is an HMAC of the IP: stable, keyed by the salt, never the raw IP", () => {
    const a = clientId("203.0.113.7", "salt-1");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("203.0.113.7");
    expect(clientId("203.0.113.7", "salt-1")).toBe(a);
    expect(clientId("203.0.113.7", "salt-2")).not.toBe(a);
    expect(clientId("203.0.113.8", "salt-1")).not.toBe(a);
  });
});

describe("memory rate limiter (5 per 10 minutes)", () => {
  it("allows 5 messages, blocks the 6th with the wait until the oldest expires", async () => {
    let now = 0;
    const limiter = createMemoryLimiter(() => now);
    for (let i = 0; i < 5; i++) {
      await expect(limiter.limit("a")).resolves.toEqual({ ok: true });
      now += 60_000;
    }
    // Oldest send was at 0; the window closes at 10:00, it's now 5:00.
    await expect(limiter.limit("a")).resolves.toEqual({ ok: false, retryAfterSeconds: 300 });
    // Other senders are not affected.
    await expect(limiter.limit("b")).resolves.toEqual({ ok: true });
    // Once the oldest is out of the window, one more fits.
    now = 600_001;
    await expect(limiter.limit("a")).resolves.toEqual({ ok: true });
  });
});
