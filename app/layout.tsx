import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg font-sans text-body text-fg antialiased">{children}</body>
    </html>
  );
}
