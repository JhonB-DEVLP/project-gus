import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { colors } from "@/lib/tokens";

// Share images (opengraph-image.tsx) in the datasheet layout, dark theme.
// ImageResponse can't read CSS variables or Tailwind, so colors come from
// lib/tokens.ts and sizes are pixels on the fixed 1200×630 sheet.

export const ogSize = { width: 1200, height: 630 };

const c = colors.dark;

// Satori has no `font-stretch`: the condensed display width is its own
// static file (Archivo at wdth 62.5). OFL licenses sit next to the fonts.
const fontDir = join(process.cwd(), "assets/fonts");
type Fonts = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"];
let fonts: Promise<Fonts> | undefined;

function loadFonts(): Promise<Fonts> {
  fonts ??= Promise.all([
    readFile(join(fontDir, "archivo-extracondensed-700.ttf")),
    readFile(join(fontDir, "archivo-400.ttf")),
    readFile(join(fontDir, "jetbrains-mono-400.ttf")),
  ]).then(([display, body, mono]) => [
    { name: "Archivo Display", data: display, weight: 700, style: "normal" },
    { name: "Archivo", data: body, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
  ]);
  return fonts;
}

export type SheetCell = { label: string; value: ReactNode };

type SheetProps = {
  // Top row: left slot, and the REV line on the right.
  head: ReactNode;
  rev: string;
  children: ReactNode;
  cells: SheetCell[];
};

const mono = { fontFamily: "JetBrains Mono", textTransform: "uppercase", letterSpacing: "0.06em" } as const;

export const og = {
  colors: c,
  // The giant title: condensed, uppercase, tight.
  display: { fontFamily: "Archivo Display", fontWeight: 700, textTransform: "uppercase", lineHeight: 0.86, letterSpacing: "-0.015em" },
  mono,
} as const;

export async function sheetImage({ head, rev, children, cells }: SheetProps): Promise<ImageResponse> {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 64px",
        background: c.bg,
        color: c.fg,
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingBottom: 20,
          borderBottom: `2px solid ${c.fg}`,
        }}
      >
        {head}
        <span style={{ ...mono, fontSize: 20, color: c.muted }}>{rev}</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>

      <div style={{ display: "flex", borderTop: `2px solid ${c.fg}`, paddingTop: 20 }}>
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingLeft: i === 0 ? 0 : 20,
              paddingRight: 20,
              borderLeft: i === 0 ? "none" : `1px solid ${c.rule}`,
            }}
          >
            <span style={{ ...mono, fontSize: 16, color: c.muted }}>{cell.label}</span>
            <span style={{ display: "flex", fontSize: 22, lineHeight: 1.3 }}>
              {/* Keep each "·" with the word before it when a stack line wraps. */}
              {typeof cell.value === "string" ? cell.value.replaceAll(" · ", " · ") : cell.value}
            </span>
          </div>
        ))}
      </div>
    </div>,
    { ...ogSize, fonts: await loadFonts() },
  );
}
