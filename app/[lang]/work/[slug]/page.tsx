import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/button";
import { Container } from "@/components/container";
import { Figure } from "@/components/figure";
import { PageShell } from "@/components/page-shell";
import { StatusMark } from "@/components/status-mark";
import { getAdjacent, getProject, projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { getDictionary } from "../../dictionaries";

// Only the three projects exist; any other slug is a 404.
export const dynamicParams = false;

// Runs once per locale from the [lang] layout: 3 slugs × 2 languages.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: `/work/${project.slug}`,
    title: `${project.name} · ${project.code}`,
    description: project.copy[lang].summary,
    siteName: dict.name,
  });
}

const sectionHeading = "font-mono text-label font-medium text-accent uppercase lg:w-50 lg:shrink-0";
const section = "flex flex-col gap-6 border-b border-rule py-14 lg:flex-row lg:gap-16 lg:py-16";

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const project = getProject(slug);
  const adjacent = getAdjacent(slug);
  if (!project || !adjacent) notFound();

  const dict = await getDictionary(lang);
  const t = dict.project;
  const copy = project.copy[lang];
  const { previous, next } = adjacent;
  const hasSideColumn = copy.figures.length > 2;

  const specRows: { label: string; value: ReactNode }[] = [
    { label: t.spec.role, value: copy.role },
    { label: t.spec.status, value: <StatusMark status={project.status} label={dict.status[project.status]} /> },
    ...copy.specs.map((row) => ({ label: t.spec[row.key], value: row.value })),
    {
      label: t.spec.link,
      value: (
        <a
          href={project.link.href}
          className="underline underline-offset-4 transition-colors duration-fast ease-standard hover:text-accent"
        >
          {project.link.label}
          <span aria-hidden="true"> ↗</span>
        </a>
      ),
    },
  ];

  return (
    <PageShell lang={lang} dict={dict} path={`/work/${project.slug}`}>
      <Container>
        <nav aria-label={t.breadcrumb} className="pt-8 font-mono text-label text-muted uppercase">
          <ol className="flex gap-2">
            <li>
              <Link
                href={`/${lang}#work`}
                className="underline-offset-4 transition-colors duration-fast ease-standard hover:text-fg hover:underline"
              >
                {dict.nav.work}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-accent">
              {project.code}
            </li>
          </ol>
        </nav>

        {/* Title, summary and the spec table */}
        <section
          aria-labelledby="project-h"
          className="grid gap-12 border-b-2 border-fg pt-8 pb-14 lg:grid-cols-12 lg:items-end lg:gap-16 lg:pb-20"
        >
          <div className="flex flex-col gap-6 lg:col-span-7">
            <h1 id="project-h" className="font-compressed text-display uppercase">
              <span className="title-line">
                <span>{project.name}</span>
              </span>
            </h1>
            <p className="title-after max-w-140 text-lead">{copy.summary}</p>
            <p className="title-after max-w-140 text-muted">{copy.pitch}</p>
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener"
              className={`title-after self-start ${buttonClass("outline")}`}
            >
              {t.visit}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">({t.newTab})</span>
            </a>
          </div>
          <dl className="border-t-2 border-fg lg:col-span-5">
            {specRows.map((row) => (
              <div key={row.label} className="flex gap-4 border-b border-rule">
                <dt className="w-28 shrink-0 py-3 font-mono text-label text-muted uppercase">{row.label}</dt>
                <dd className="py-3 leading-normal">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FIG. 1 large; the others beside it (stacked when there are two). */}
        <section
          aria-label={t.screenshots}
          className="title-figures grid items-start gap-6 border-b border-rule py-12 lg:grid-cols-3"
        >
          {copy.figures.map((figure, i) => (
            <Figure
              key={figure.caption}
              n={i + 1}
              image={project.images?.[i]}
              caption={figure.caption}
              alt={figure.alt}
              aspect={i === 0 ? "wide" : "standard"}
              sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              priority={i === 0}
              labels={dict.figure}
              className={i === 0 ? `lg:col-span-2 ${hasSideColumn ? "lg:row-span-2" : ""}` : ""}
            />
          ))}
        </section>

        <section aria-labelledby="problem-h" className={section}>
          <h2 id="problem-h" className={sectionHeading}>
            1 · {t.problem}
          </h2>
          <p className="max-w-170 text-lead">{copy.problem}</p>
        </section>

        <section aria-labelledby="built-h" className={section}>
          <h2 id="built-h" className={sectionHeading}>
            2 · {copy.built.title}
          </h2>
          <ul className="grid max-w-225 flex-1 gap-x-12 md:grid-cols-2">
            {copy.built.items.map((item) => (
              <li key={item} className="border-t border-rule py-3 leading-normal">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="decisions-h" className={`${section} border-b-2 border-fg`}>
          <h2 id="decisions-h" className={sectionHeading}>
            3 · {t.decisions}
          </h2>
          <ol className="flex max-w-190 flex-col gap-8">
            {copy.decisions.map((decision, i) => (
              <li key={decision.title} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 font-mono text-data text-muted">
                  D-{String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lead font-semibold">{decision.title}</h3>
                  <p className="text-muted">{decision.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <nav aria-label={t.pager} className="flex justify-between gap-6 pt-8 pb-12">
          <Link href={`/${lang}/work/${previous.slug}`} rel="prev" className="group flex flex-col gap-1">
            <span className="font-mono text-label text-muted">
              <span aria-hidden="true">← </span>
              <span className="sr-only">{t.previous}: </span>
              {previous.code}
            </span>
            <span className="font-condensed text-title font-bold uppercase transition-colors duration-fast ease-standard group-hover:text-accent">
              {previous.name}
            </span>
          </Link>
          <Link href={`/${lang}/work/${next.slug}`} rel="next" className="group flex flex-col items-end gap-1 text-right">
            <span className="font-mono text-label text-muted">
              <span className="sr-only">{t.next}: </span>
              {next.code}
              <span aria-hidden="true"> →</span>
            </span>
            <span className="font-condensed text-title font-bold uppercase transition-colors duration-fast ease-standard group-hover:text-accent">
              {next.name}
            </span>
          </Link>
        </nav>
      </Container>
    </PageShell>
  );
}
