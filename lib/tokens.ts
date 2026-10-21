// Color tokens as plain hex, for places that can't read CSS variables
// (ImageResponse: share images and the favicon). app/globals.css stays the
// source of truth; tests/tokens.test.ts fails if these drift from it.

export const colors = {
  light: {
    bg: "#F3F5F2",
    surface: "#FFFFFF",
    fg: "#0E1A14",
    muted: "#4A564F",
    rule: "#D6DCD7",
    field: "#7F8A83",
    accent: "#00573A",
    "on-accent": "#FFFFFF",
    warn: "#8A5A00",
    error: "#B42318",
  },
  dark: {
    bg: "#0F1612",
    surface: "#161F1A",
    fg: "#E4E8E3",
    muted: "#9AA59E",
    rule: "#26302A",
    field: "#5F6B64",
    accent: "#4FBF8A",
    "on-accent": "#0F1612",
    warn: "#E3B341",
    error: "#FF7A6E",
  },
} as const;

export type ColorToken = keyof (typeof colors)["light"];
