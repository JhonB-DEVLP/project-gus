import { afterEach, describe, expect, it, vi } from "vitest";

// siteUrl is read once at module load, so each case imports a fresh copy.
async function siteUrlWith(env: Record<string, string>) {
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  vi.resetModules();
  return (await import("@/lib/site")).siteUrl;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("siteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL without a trailing slash", async () => {
    expect(
      await siteUrlWith({
        NEXT_PUBLIC_SITE_URL: "https://jhon.dev/",
        VERCEL_PROJECT_PRODUCTION_URL: "project-gus.vercel.app",
      }),
    ).toBe("https://jhon.dev");
  });

  it("falls back to the Vercel production domain", async () => {
    expect(
      await siteUrlWith({ NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "project-gus.vercel.app" }),
    ).toBe("https://project-gus.vercel.app");
  });

  it("falls back to localhost outside Vercel", async () => {
    expect(await siteUrlWith({ NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" })).toBe(
      "http://localhost:3000",
    );
  });
});
