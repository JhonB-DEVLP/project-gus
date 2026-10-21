import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { PageShell } from "@/components/page-shell";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { getDictionary } from "../dictionaries";
import { sendMessage } from "./actions";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contact",
    title: dict.contact.title,
    description: dict.meta.contactDescription,
    siteName: dict.name,
  });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  // The locale travels with the action; the action validates it again.
  const action = sendMessage.bind(null, lang);

  return (
    <PageShell lang={lang} dict={dict} path="/contact">
      <Container className="grid gap-8 pt-10 pb-14 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12 lg:pt-16 lg:pb-24">
        <div className="flex flex-col gap-4 lg:col-span-12">
          <p className="font-mono text-label text-accent uppercase">§3 · {dict.nav.contact}</p>
          <h1 className="font-compressed text-display uppercase">{dict.contact.title}</h1>
        </div>
        <p className="text-lead text-muted lg:col-span-4">{dict.contact.lead}</p>
        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm action={action} copy={dict.contact} />
        </div>
      </Container>
    </PageShell>
  );
}
