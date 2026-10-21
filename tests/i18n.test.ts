import { describe, expect, it } from "vitest";
import { matchLocale } from "@/lib/i18n";

describe("matchLocale", () => {
  it.each([
    ["pt-BR,pt;q=0.9,en;q=0.8", "pt"],
    ["en-US,en;q=0.9", "en"],
    ["en;q=0.5, pt;q=0.8", "pt"],
    ["fr-FR,fr;q=0.9,pt;q=0.5", "pt"],
    ["fr-FR,de;q=0.9", "en"],
    ["PT", "pt"],
    ["pt;q=0, en;q=0.1", "en"],
    ["*", "en"],
    ["", "en"],
  ])("%j -> %s", (header, expected) => {
    expect(matchLocale(header)).toBe(expected);
  });

  it("falls back to en without a header", () => {
    expect(matchLocale(null)).toBe("en");
  });

  it("keeps header order when quality ties", () => {
    expect(matchLocale("pt, en")).toBe("pt");
    expect(matchLocale("en, pt")).toBe("en");
  });
});
