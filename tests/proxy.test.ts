// Next 16.4 docs call this unstable_doesProxyMatch; the package still exports the old name.
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";

function request(path: string, acceptLanguage?: string) {
  const headers = acceptLanguage ? { "accept-language": acceptLanguage } : undefined;
  return new NextRequest(new URL(path, "https://example.com"), { headers });
}

describe("proxy redirects", () => {
  it("sends / to /pt for a Portuguese browser", () => {
    const response = proxy(request("/", "pt-BR,pt;q=0.9"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/pt");
  });

  it("sends / to /en without Accept-Language", () => {
    expect(proxy(request("/")).headers.get("location")).toBe("https://example.com/en");
  });

  it("keeps the rest of the path and the query", () => {
    const response = proxy(request("/work/leia?ref=cv", "en-US"));
    expect(response.headers.get("location")).toBe("https://example.com/en/work/leia?ref=cv");
  });

  it.each(["/en", "/pt", "/en/contact", "/pt/work/leia"])("lets %s through", (path) => {
    const response = proxy(request(path, "pt-BR"));
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not treat a lookalike prefix as a locale", () => {
    expect(proxy(request("/english")).headers.get("location")).toBe("https://example.com/en/english");
  });
});

describe("proxy matcher", () => {
  const matches = (url: string) => unstable_doesMiddlewareMatch({ config, nextConfig: {}, url });

  it.each(["/", "/work/leia", "/en/contact"])("runs on %s", (url) => {
    expect(matches(url)).toBe(true);
  });

  it.each([
    "/_next/static/chunks/main.js",
    "/_next/image?url=x",
    "/api/health",
    "/favicon.ico",
    "/sitemap.xml",
    "/robots.txt",
    "/icon",
    "/opengraph-image",
  ])("skips %s", (url) => {
    expect(matches(url)).toBe(false);
  });
});
