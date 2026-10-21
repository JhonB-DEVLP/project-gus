import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "./dictionaries";

// Blank until M2 (hero, specifications, work list).
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <PageShell lang={lang} dict={dict} path="" />;
}
