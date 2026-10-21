import { notFound } from "next/navigation";

// Any path under a locale that no route matches lands here, so the 404
// renders inside the [lang] layout (header, footer, fonts, theme).
export default function Missing() {
  notFound();
}
