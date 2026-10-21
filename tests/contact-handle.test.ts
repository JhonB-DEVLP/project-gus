import { afterEach, describe, expect, it, vi } from "vitest";
import { handleContact } from "@/lib/contact/handle";
import type { ContactDeps, ContactInput, StoredMessage } from "@/lib/contact/types";

const input: ContactInput = {
  name: " Gus Fune ",
  email: "gus@example.com",
  message: "Saw your Léia project. Call on Thursday?",
  company: "",
  locale: "en",
  clientId: "client-1",
};

// Fakes that record every call; each test overrides what it needs.
function fakeDeps(overrides: Partial<{ allowed: boolean; saveFails: boolean; sendFails: boolean; limitThrows: boolean }> = {}) {
  const saved: StoredMessage[] = [];
  const sent: StoredMessage[] = [];
  const limited: string[] = [];
  let spam = 0;
  const deps: ContactDeps = {
    store: {
      save: async (message) => {
        if (overrides.saveFails) throw new Error("redis down");
        saved.push(message);
      },
      countSpam: async () => {
        spam += 1;
      },
    },
    mailer: {
      send: async (message) => {
        if (overrides.sendFails) throw new Error("resend down");
        sent.push(message);
      },
    },
    limiter: {
      limit: async (id) => {
        if (overrides.limitThrows) throw new Error("limiter down");
        limited.push(id);
        return overrides.allowed === false ? { ok: false, retryAfterSeconds: 240 } : { ok: true };
      },
    },
  };
  return { deps, saved, sent, limited, spam: () => spam };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("handleContact", () => {
  it("stores, then emails, a valid message and returns ok", async () => {
    const fake = fakeDeps();
    await expect(handleContact(input, fake.deps)).resolves.toEqual({ ok: true });

    expect(fake.limited).toEqual(["client-1"]);
    expect(fake.saved).toHaveLength(1);
    expect(fake.saved[0]).toMatchObject({
      name: "Gus Fune",
      email: "gus@example.com",
      message: input.message,
      locale: "en",
    });
    expect(fake.saved[0]?.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Number.isNaN(Date.parse(fake.saved[0]?.time ?? ""))).toBe(false);
    expect(fake.sent).toEqual(fake.saved);
  });

  it("treats a filled honeypot as spam: counts it, stores and sends nothing, skips the rate limit", async () => {
    const fake = fakeDeps();
    await expect(handleContact({ ...input, company: "ACME" }, fake.deps)).resolves.toEqual({ ok: false, error: "spam" });
    expect(fake.spam()).toBe(1);
    expect(fake.limited).toEqual([]);
    expect(fake.saved).toEqual([]);
    expect(fake.sent).toEqual([]);
  });

  it("checks the honeypot before validation", async () => {
    const fake = fakeDeps();
    const result = await handleContact({ ...input, company: "x", email: "bad" }, fake.deps);
    expect(result).toEqual({ ok: false, error: "spam" });
  });

  it("returns rate_limited with the wait, before validating", async () => {
    const fake = fakeDeps({ allowed: false });
    const result = await handleContact({ ...input, email: "bad" }, fake.deps);
    expect(result).toEqual({ ok: false, error: "rate_limited", retryAfterSeconds: 240 });
    expect(fake.saved).toEqual([]);
  });

  it("lets the message through when the limiter itself fails (fail open)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fake = fakeDeps({ limitThrows: true });
    await expect(handleContact(input, fake.deps)).resolves.toEqual({ ok: true });
    expect(fake.saved).toHaveLength(1);
  });

  it("returns field errors as dictionary keys and delivers nothing", async () => {
    const fake = fakeDeps();
    const result = await handleContact({ ...input, name: "J", email: "gus@", message: "short" }, fake.deps);
    expect(result).toEqual({
      ok: false,
      error: "validation",
      fields: { name: "name", email: "email", message: "message" },
    });
    expect(fake.saved).toEqual([]);
    expect(fake.sent).toEqual([]);
  });

  it("returns server when the store fails, and sends no email", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fake = fakeDeps({ saveFails: true });
    await expect(handleContact(input, fake.deps)).resolves.toEqual({ ok: false, error: "server" });
    expect(fake.sent).toEqual([]);
    expect(error).toHaveBeenCalled();
  });

  it("returns ok when the store works but the email fails, and logs the email error", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fake = fakeDeps({ sendFails: true });
    await expect(handleContact(input, fake.deps)).resolves.toEqual({ ok: true });
    expect(fake.saved).toHaveLength(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("email"), expect.any(Error));
  });
});
