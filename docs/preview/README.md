# Design preview (reference only)

Source of the 5 canvas screens. Not app code: read them for layout, spacing, sizes and copy.

- Inline `style="…"` holds the real values (font sizes, gaps, borders).
- `{{c.bg}}`, `{{c.accent}}`… are color tokens; their light and dark values are in the `<script>` at the bottom of each file (`var L = {…}` light, `var D = {…}` dark) and match `docs/design.md`.
- `<sc-for>` repeats a block for each item in a list defined in that same script.
- Motion is in the `<style>` block at the top (`@keyframes rise`, `.ln`, `.type`, `.cell`).

| File | Screen |
|---|---|
| `Main.dc.html` | Home, desktop |
| `HomeMobile.dc.html` | Home, mobile |
| `Project.dc.html` | Project page (Léia), desktop |
| `ContactMobile.dc.html` | Contact, mobile, every form state |
| `NotFound.dc.html` | 404, mobile |
