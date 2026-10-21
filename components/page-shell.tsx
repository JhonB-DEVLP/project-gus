import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type PageShellProps = {
  lang: Locale;
  dict: Dictionary;
  // Route after the locale ("" for home, "/contact"…), so the language
  // switch can link to the same page in the other locale. Layouts only
  // receive params, not the path, so each page passes it.
  path: string;
  children?: ReactNode;
};

export function PageShell({ lang, dict, path, children }: PageShellProps) {
  return (
    <>
      <SiteHeader lang={lang} dict={dict} path={path} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
