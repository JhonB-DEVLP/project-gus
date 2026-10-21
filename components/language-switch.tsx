import Link from "next/link";
import { htmlLang, locales, type Locale } from "@/lib/i18n";
import { segmentGroup, segmentItem, type SegmentSize } from "./segmented";

type LanguageSwitchProps = {
  lang: Locale;
  path: string;
  label: string;
  size: SegmentSize;
};

// Plain links to the same page in each locale: no client JS.
export function LanguageSwitch({ lang, path, label, size }: LanguageSwitchProps) {
  return (
    <div role="group" aria-label={label} className={segmentGroup}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${path}`}
          hrefLang={htmlLang[locale]}
          lang={htmlLang[locale]}
          aria-current={locale === lang ? "page" : undefined}
          className={segmentItem(size, locale === lang)}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
