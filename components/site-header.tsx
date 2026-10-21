import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Container } from "./container";
import { LanguageSwitch } from "./language-switch";
import { ThemeToggle } from "./theme-toggle";

type SiteHeaderProps = {
  lang: Locale;
  dict: Dictionary;
  path: string;
};

const navLink =
  "underline-offset-4 decoration-1 transition-colors duration-fast ease-standard hover:underline hover:text-accent";

export function SiteHeader({ lang, dict, path }: SiteHeaderProps) {
  // Two-tone wordmark: first name in fg, surname in accent, no space.
  const [first, ...rest] = dict.name.split(" ");
  const nav = [
    { href: `/${lang}#work`, label: dict.nav.work },
    { href: `/${lang}#live`, label: dict.nav.live },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="border-b border-fg">
      <Container className="relative flex flex-wrap items-center justify-between gap-x-6 py-4 lg:flex-nowrap lg:py-6">
        <div className="flex min-h-12 flex-col justify-center gap-0.5 lg:min-h-0 lg:flex-row lg:items-baseline lg:gap-4">
          <Link
            href={`/${lang}`}
            aria-label={dict.name}
            className="font-condensed text-title leading-none font-bold uppercase"
          >
            {first}
            <span className="text-accent">{rest.join(" ")}</span>
          </Link>
          <span className="font-mono text-label text-muted">{dict.rev}</span>
        </div>

        {/* Desktop */}
        <nav aria-label={dict.nav.label} className="hidden lg:block">
          <ul className="flex gap-8 font-mono text-data tracking-wider uppercase">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden gap-4 lg:flex">
          <LanguageSwitch lang={lang} path={path} label={dict.lang.label} size="compact" />
          <ThemeToggle labels={dict.theme} size="compact" />
        </div>

        {/* Mobile: native disclosure, no JS. The summary sits on the first row;
            the panel opens below it, in the page flow. */}
        <details className="group w-full lg:hidden">
          <summary className="absolute top-4 right-4 inline-flex h-12 min-w-11 items-center justify-center rounded-control border border-field px-4 font-mono text-label uppercase transition-colors duration-fast ease-standard group-open:bg-fg group-open:text-bg">
            {dict.nav.menu}
          </summary>
          <div className="mt-4 border-t-2 border-fg">
            <nav aria-label={dict.nav.label}>
              <ul className="font-mono text-data tracking-wider uppercase">
                {nav.map((item) => (
                  <li key={item.href} className="border-b border-rule">
                    <Link href={item.href} className={`flex min-h-12 items-center ${navLink}`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex min-h-14 items-center justify-between gap-4 border-b border-rule py-2">
              <span className="font-mono text-label text-muted uppercase">{dict.lang.label}</span>
              <LanguageSwitch lang={lang} path={path} label={dict.lang.label} size="touch" />
            </div>
            <div className="flex min-h-14 items-center justify-between gap-4 py-2">
              <span className="font-mono text-label text-muted uppercase">{dict.theme.label}</span>
              <ThemeToggle labels={dict.theme} size="touch" />
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}
