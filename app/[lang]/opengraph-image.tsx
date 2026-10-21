import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { og, ogSize, sheetImage } from "@/lib/og/sheet";
import { getDictionary } from "./dictionaries";

// Share image for home (and contact, which has none of its own).

const localeOf = (lang: string): Locale => (hasLocale(lang) ? lang : defaultLocale);

export async function generateImageMetadata({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(localeOf(params.lang));
  return [{ id: "sheet", alt: `${dict.name} · ${dict.hero.eyebrow}`, size: ogSize, contentType: "image/png" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const dict = await getDictionary(localeOf((await params).lang));
  const { specs } = dict;
  // Same two-tone rule as the header wordmark: first name fg, surname accent.
  const [first, ...rest] = dict.name.split(" ");

  return sheetImage({
    head: <span style={{ ...og.mono, fontSize: 20, color: og.colors.accent }}>{dict.hero.eyebrow}</span>,
    rev: dict.rev,
    cells: [
      { label: specs.frontendLabel, value: specs.frontend },
      { label: specs.backendLabel, value: specs.backend },
      { label: specs.aiLabel, value: specs.ai },
      { label: specs.infraLabel, value: specs.infra },
    ],
    children: (
      <div style={{ ...og.display, display: "flex", fontSize: 232 }}>
        <span>{first}</span>
        <span style={{ color: og.colors.accent }}>{rest.join(" ")}</span>
      </div>
    ),
  });
}
