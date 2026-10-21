// Locale config shared by proxy.ts and the [lang] routes. No `server-only`:
// the proxy imports it too.

export const locales = ["en", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Value for <html lang> and hreflang.
export const htmlLang: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Picks the best supported locale from an Accept-Language header,
// e.g. "pt-BR,pt;q=0.9,en;q=0.8" -> "pt". Falls back to the default.
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const quality = q === undefined ? 1 : Number(q.slice(2));
      return {
        base: tag.trim().toLowerCase().split("-")[0] ?? "",
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter((entry) => entry.base !== "" && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  return ranked.map((entry) => entry.base).find(hasLocale) ?? defaultLocale;
}
