import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buttonClass } from "@/components/button";
import { Container } from "@/components/container";
import { LiveReadTime, LiveReadTimeSkeleton, LiveSkeleton, LiveTable } from "@/components/live-readings";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { WorkList } from "@/components/work-list";
import { projects } from "@/content/projects";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { getDictionary } from "./dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "",
    title: `${dict.name} · ${dict.hero.eyebrow}`,
    description: dict.hero.lead,
    siteName: dict.name,
    absolute: true,
  });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { hero, specs } = dict;
  const lastLine = hero.title.length - 1;

  const specRows = [
    { label: specs.frontendLabel, value: specs.frontend },
    { label: specs.backendLabel, value: specs.backend },
    { label: specs.aiLabel, value: specs.ai },
    { label: specs.infraLabel, value: specs.infra },
  ];

  return (
    <PageShell lang={lang} dict={dict} path="">
      {/* Hero: the one big motion moment (classes in globals.css). */}
      <section>
        <Container className="flex flex-col gap-6 pt-12 pb-10 lg:gap-8 lg:pt-24 lg:pb-16">
          <p className="font-mono text-label tracking-normal text-accent uppercase lg:text-data">
            <span className="hero-type" style={{ "--chars": hero.eyebrow.length }}>
              {hero.eyebrow}
            </span>
          </p>
          {/* Lines are visual only; screen readers get the sentence once. */}
          <h1 className="font-compressed text-display uppercase">
            {hero.title.map((line, i) => (
              <span key={line} aria-hidden="true" className="hero-line" style={{ "--i": i }}>
                <span className={i === lastLine ? "text-accent" : undefined}>{line}</span>
              </span>
            ))}
            <span className="sr-only">{hero.title.join(" ")}</span>
          </h1>
          <div aria-hidden="true" className="hero-rule hidden h-0.5 bg-fg lg:block" />
          <div className="hero-after flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <p className="max-w-140 text-lead text-muted">{hero.lead}</p>
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              <a href="#work" className={buttonClass("solid")}>
                {hero.ctaWork}
                <span aria-hidden="true">→</span>
              </a>
              <a href="#contact" className={buttonClass("outline")}>
                {hero.ctaContact}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* General specifications: four cells on desktop, a list on mobile. */}
      <section aria-labelledby="specs-h">
        <Container className="flex flex-col gap-3 pb-14 lg:gap-4 lg:pb-24">
          <h2 id="specs-h" className="font-mono text-label font-medium text-muted uppercase">
            {specs.title}
          </h2>
          <dl className="border-t-2 border-fg lg:grid lg:grid-cols-4">
            {specRows.map((row, i) => (
              <div
                key={row.label}
                className="hero-cell flex border-b border-rule lg:flex-col lg:gap-2 lg:p-4 lg:first:pl-0 lg:not-first:border-l"
                style={{ "--i": i }}
              >
                <dt className="w-24 shrink-0 py-3 font-mono text-label text-muted uppercase lg:w-auto lg:py-0">
                  {row.label}
                </dt>
                <dd className="py-3 leading-normal lg:py-0">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* §1 Selected work */}
      <section id="work" aria-labelledby="work-h">
        <Container className="flex flex-col gap-4 pb-14 lg:gap-6 lg:pb-24">
          <div className="flex items-baseline justify-between gap-4">
            <SectionHeading id="work-h" n={1}>
              {dict.work.title}
            </SectionHeading>
            <span className="hidden font-mono text-label text-muted uppercase md:inline">{dict.work.count}</span>
          </div>
          <WorkList lang={lang} dict={dict} projects={projects} />
        </Container>
      </section>

      {/* §2 Live readings: fetched per request, streamed after the rest. */}
      <section id="live" aria-labelledby="live-h">
        <Container className="flex flex-col gap-4 pb-14 lg:gap-6 lg:pb-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
            <SectionHeading id="live-h" n={2}>
              {dict.live.title}
            </SectionHeading>
            <Suspense fallback={<LiveReadTimeSkeleton />}>
              <LiveReadTime dict={dict} />
            </Suspense>
          </div>
          <p className="max-w-160 text-muted">{dict.live.lead}</p>
          <Suspense fallback={<LiveSkeleton dict={dict} />}>
            <LiveTable lang={lang} dict={dict} />
          </Suspense>
        </Container>
      </section>

      {/* §3 Contact band */}
      <section id="contact" aria-labelledby="contact-h">
        <Container>
          <div className="flex flex-col gap-6 border-t-2 border-fg pt-10 pb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:pt-16 lg:pb-24">
            <div className="flex max-w-180 flex-col gap-4">
              <SectionHeading id="contact-h" n={3}>
                {dict.contactBand.title}
              </SectionHeading>
              <p className="text-lead">{dict.contactBand.text}</p>
            </div>
            <Link href={`/${lang}/contact`} className={buttonClass("accent")}>
              {dict.contactBand.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
