import { Archivo, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";
import { getDictionary } from "./dictionaries";
import "../globals.css";

// Archivo keeps the `wdth` axis so display type can use the condensed width.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    // The theme script may set data-theme before hydration.
    <html
      lang={htmlLang[lang]}
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg font-sans text-body text-fg antialiased">
        <a
          href="#main"
          className="sr-only z-10 bg-accent px-4 py-3 font-mono text-label text-on-accent uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {dict.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
