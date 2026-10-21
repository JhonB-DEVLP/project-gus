import type { Metadata } from "next";
import { htmlLang, locales, type Locale } from "./i18n";

export const sourceUrl = "https://github.com/JhonB-DEVLP/project-gus";

// Profiles for the JSON-LD `sameAs`.
export const profileUrls = ["https://github.com/JhonB-DEVLP"];

// Request header that proxy.ts sets to the path, for the 404 page
// (not-found gets no props).
export const PATHNAME_HEADER = "x-pathname";

// Public origin, no trailing slash (metadataBase, canonical, sitemap).
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

// Canonical for this locale plus the same page in every locale (hreflang).
// `path` is the route after the locale: "" for home, "/contact"…
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: `/${lang}${path}`,
    languages: Object.fromEntries(locales.map((locale) => [htmlLang[locale], `/${locale}${path}`])),
  };
}

type PageMeta = {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  siteName: string;
  // Skip the layout's "%s · Jhon Silva" template (home already starts with the name).
  absolute?: boolean;
};

// Title, description, canonical, hreflang and Open Graph for one page.
// A page's `openGraph` replaces the layout's whole object, so it is built
// complete here; the share image comes from the opengraph-image files.
export function pageMetadata({ lang, path, title, description, siteName, absolute }: PageMeta): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      title,
      description,
      url: `/${lang}${path}`,
      siteName,
      locale: htmlLang[lang].replace("-", "_"),
      type: "website",
    },
  };
}
