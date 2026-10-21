# Design — "Datasheet" in British racing green

The visual reference is the canvas preview (5 screens: home desktop and mobile, project page, contact with all states, 404). Its source is in `docs/preview/` — read `docs/preview/README.md` first. The canvas itself: https://claude.ai/artifact/2YVjuX7fYq3iqYd14C8fku (private; agents can't open it, use `docs/preview/`).

## Direction

The site reads like the technical datasheet of a machine. Every project is a part with a number (`PRJ-01`), a spec table and a revision line (`REV 2026.10`). Type does the work; there are no stock photos. The palette is British racing green, from British motoring and from my Triumph.

References:
1. **Electronic component datasheets** → part numbers, spec tables, revision line, figure captions (`FIG. 1`).
2. **PP Neue Montreal site** (neuemontreal.com) → giant type as the layout, letters rising into place, strong contrast between huge display type and small mono labels.
3. **Emil Kowalski** (emilkowal.ski) → short, purposeful motion on details: hover, focus, state changes.
4. **GiGi energy drink landing** (v0-gigi-energy-drink-landing-page.vercel.app) → the two-tone wordmark idea and the hero entrance (blur-to-sharp, accent last line, staggered details). Not taken: the floating product, glow blobs, pill buttons and lime palette.

## Tokens (the only place for values)

All tokens are CSS variables in `app/globals.css`, exposed to Tailwind with `@theme inline`. Components never use a raw hex, px size or duration.

### Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F3F5F2` | `#0F1612` | Page |
| `--surface` | `#FFFFFF` | `#161F1A` | Inputs, figures, cards |
| `--fg` | `#0E1A14` | `#E4E8E3` | Text, heavy rules |
| `--muted` | `#4A564F` | `#9AA59E` | Secondary text, labels |
| `--rule` | `#D6DCD7` | `#26302A` | Hairlines (decorative) |
| `--field` | `#7F8A83` | `#5F6B64` | Input and control borders |
| `--accent` | `#00573A` | `#4FBF8A` | Part numbers, links, accent band, success |
| `--on-accent` | `#FFFFFF` | `#0F1612` | Text on accent fills |
| `--warn` | `#8A5A00` | `#E3B341` | "Early customers" status |
| `--error` | `#B42318` | `#FF7A6E` | Errors |

Contrast checked (text on `--bg`, light / dark): fg 16.3 / 14.8, muted 7.0 / 7.2, accent 7.9 / 8.0, warn 5.4 / 9.4, error 6.0 / 7.2. Field borders 3.3 / 3.3 (non-text minimum is 3). on-accent on accent 8.7 / 8.0.

The dark theme is designed, not inverted: the accent gets lighter and the text is off-white.

```css
:root {
  --bg: #F3F5F2; --surface: #FFFFFF; --fg: #0E1A14; --muted: #4A564F;
  --rule: #D6DCD7; --field: #7F8A83; --accent: #00573A; --on-accent: #FFFFFF;
  --warn: #8A5A00; --error: #B42318;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0F1612; --surface: #161F1A; --fg: #E4E8E3; --muted: #9AA59E;
    --rule: #26302A; --field: #5F6B64; --accent: #4FBF8A; --on-accent: #0F1612;
    --warn: #E3B341; --error: #FF7A6E;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] { /* same dark values */ }
```

### Type

Two families: **Archivo** (display and body; display uses the condensed width, `font-stretch: 62–70%`, uppercase, weight 700) and **JetBrains Mono** (labels, part numbers, data).

| Token | Size (mobile → desktop) | Line height | Use |
|---|---|---|---|
| `display` | 64px → 176px, `clamp()` | 0.86 | Home `h1`, project title |
| `title` | 28px → 32px | 1.1 | Section titles, project names in lists |
| `lead` | 17px → 20px | 1.5 | Hero intro, contact intro |
| `body` | 16px | 1.6 | Running text, max 65ch |
| `label` | 12px (mono) | 1.4 | Labels, captions, table heads; letter-spacing 0.04–0.08em |
| `data` | 14px (mono) | 1.6 | Part numbers, stack lists, live data |

Five sizes plus the display. Nothing else.

### Spacing, radius, borders

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Section padding is 96 desktop / 56 mobile.
- Radius: `0` for blocks, `2px` for controls. Datasheets are square.
- Rules: `2px solid --fg` opens a section or table; `1px --rule` separates rows.
- Layout: max width 1312px, side gutter 64px desktop / 16px mobile.

### Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 150ms | Hover, focus |
| `--dur-base` | 250ms | State changes, row hover |
| `--dur-hero` | 800ms | Hero lines |
| `--ease` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Everything |

Moments (all off under `prefers-reduced-motion: reduce`):
1. **Hero** (the one big moment): the mono eyebrow types itself in (`steps()` on width in `ch`, caret blinks 4 times). Each line of the `h1` rises from behind a mask and sharpens from a 10px blur (`overflow: hidden` line, inner span `translateY(105%) → 0`, `filter: blur(10px) → 0`), staggered 90ms. The last line is in the accent. A 2px rule draws left to right, then the intro, buttons and the four spec cells fade up in sequence. CSS only. The `h1` never starts at `opacity: 0` (it's the LCP element), and every animated element has its final state as the base style, so reduced motion shows the finished page.
2. **Work list hover**: thumbnail scales to 1.04, arrow moves 6px right.
3. **Live numbers**: likes and downloads count up from 0 in ~1.1s (`CountUp`).
4. **List → project**: React `<ViewTransition>` morphs the project name into the detail title. Optional; only if time allows (see PLAN).

## Pages (see canvas for layout)

- **Header**: two-tone wordmark, "JHON" in `--fg` and "SILVA" in `--accent`, no space, condensed uppercase, + `REV 2026.10` in mono; nav (Work, Live, Contact); `EN / PT` switch; theme group `LIGHT / DARK / AUTO`. Mobile: `MENU` button (`<details>`).
- **Home**: hero → "General specifications" table (Frontend, Backend, AI, Infra) → §1 Selected work (rows: figure thumbnail, part no., product, role, stack, status dot + label, arrow) → §2 Live readings → §3 Contact band → footer ("Sheet 1 of 1").
- **Project page**: breadcrumb `WORK / PRJ-02`, giant title, one-line summary, spec `dl` (Role, Status, Channel, Backend, AI, Infra, Link) → figures (FIG. 1 large, FIG. 2 and 3 small, with mono captions) → 1 · The problem → 2 · What we built → 3 · Decisions (D-01, D-02, D-03) → previous / next project.
- **Contact**: big title, intro, form, states (sending, sent, rate limited, server error, field errors).
- **404**: `ERR-404 · Part not found`, requested path, list of available parts, back link.
- **Status dots**: In production = accent, Early customers = warn, In testing = muted. Always with a text label, never color alone.

## Responsive

Designed at 320, 390, 768, 1280 and 1920. Mobile is designed, not stacked: work rows become cards with the figure on top; the spec table becomes a `dl`; the live table drops to two lines per item.

## Details

- Favicon: monogram "JS" in a square, like a part label: "J" in `--fg`, "S" in `--accent`, same two-tone rule as the wordmark.
- OG image: name, role and `REV` line in the datasheet layout.
- Copy has no typos in either language (review `pt.json` by hand).
