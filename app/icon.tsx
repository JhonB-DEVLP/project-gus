import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { colors } from "@/lib/tokens";

// Favicon: "JS" monogram on a square part label, same two-tone rule as the
// wordmark ("J" fg, "S" accent). Dark theme, like the share images.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const c = colors.dark;

export default async function Icon() {
  const display = await readFile(join(process.cwd(), "assets/fonts/archivo-extracondensed-700.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: c.bg,
        border: `2px solid ${c.fg}`,
        borderRadius: 2,
        fontFamily: "Archivo Display",
        fontSize: 24,
        lineHeight: 1,
        color: c.fg,
      }}
    >
      <span>J</span>
      <span style={{ color: c.accent }}>S</span>
    </div>,
    { ...size, fonts: [{ name: "Archivo Display", data: display, weight: 700, style: "normal" }] },
  );
}
