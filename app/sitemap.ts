import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { htmlLang, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

// Every page in both locales; each entry lists its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/contact", ...projects.map((project) => `/work/${project.slug}`)];

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      alternates: {
        languages: Object.fromEntries(locales.map((locale) => [htmlLang[locale], `${siteUrl}/${locale}${path}`])),
      },
    })),
  );
}
