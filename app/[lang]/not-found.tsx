import type { Metadata } from "next";
import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { buttonClass } from "@/components/button";
import { Container } from "@/components/container";
import { PageShell } from "@/components/page-shell";
import { RequestedPath } from "@/components/requested-path";
import { projects } from "@/content/projects";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "./dictionaries";

// not-found gets no params. The locale is a root param, so next/root-params
// reads it without request headers, and the page stays static.
async function requestedLang(): Promise<Locale> {
  const segment = await rootLang();
  return hasLocale(segment) ? segment : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(await requestedLang());
  return { title: dict.nf.title };
}

export default async function NotFound() {
  const lang = await requestedLang();
  const dict = await getDictionary(lang);
  const t = dict.nf;

  return (
    <PageShell lang={lang} dict={dict} path="">
      <Container className="grid gap-6 py-16 lg:grid-cols-12 lg:items-end lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <p className="font-mono text-label text-accent">{t.code}</p>
          <h1 className="font-compressed text-display uppercase">
            <span className="title-line">
              <span>{t.title}</span>
            </span>
          </h1>
          <p className="title-after max-w-140 text-lead text-muted">{t.text}</p>
        </div>

        <div className="title-after flex flex-col gap-6 lg:col-span-5">
          <dl className="border-t-2 border-fg font-mono text-label">
            <RequestedPath label={t.requested} />
            <div className="flex gap-4 border-b border-rule">
              <dt className="w-24 shrink-0 py-3 text-muted uppercase">{t.available}</dt>
              <dd>
                <ul className="flex flex-wrap items-center gap-x-2">
                  {projects.map((project, i) => (
                    <li key={project.slug} className="flex items-center gap-2">
                      {i > 0 ? <span aria-hidden="true">·</span> : null}
                      <Link
                        href={`/${lang}/work/${project.slug}`}
                        className="inline-flex min-h-11 items-center underline-offset-4 transition-colors duration-fast ease-standard hover:text-accent hover:underline"
                      >
                        {project.code}
                        <span className="sr-only"> {project.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <Link href={`/${lang}`} className={`${buttonClass("solid")} lg:self-start`}>
            <span aria-hidden="true">←</span>
            {t.back}
          </Link>
        </div>
      </Container>
    </PageShell>
  );
}
