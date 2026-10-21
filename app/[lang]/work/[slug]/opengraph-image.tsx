import { getProject, type ProjectStatus } from "@/content/projects";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { og, ogSize, sheetImage } from "@/lib/og/sheet";
import { getDictionary } from "../../dictionaries";

// Share image for a project: part number, name, summary, spec cells.

type Params = { lang: string; slug: string };

const localeOf = (lang: string): Locale => (hasLocale(lang) ? lang : defaultLocale);

// Same mapping as the status dots on the site (docs/design.md).
const dot: Record<ProjectStatus, string> = {
  production: og.colors.accent,
  early: og.colors.warn,
  testing: og.colors.muted,
};

export async function generateImageMetadata({ params }: { params: Params }) {
  const project = getProject(params.slug);
  const lang = localeOf(params.lang);
  const alt = project ? `${project.code} · ${project.name} · ${project.copy[lang].summary}` : "";
  return [{ id: "sheet", alt, size: ogSize, contentType: "image/png" }];
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { lang: raw, slug } = await params;
  const lang = localeOf(raw);
  const dict = await getDictionary(lang);
  // dynamicParams is false on the page, so the slug is always one of ours.
  const project = getProject(slug);
  if (!project) return new Response(null, { status: 404 });

  const copy = project.copy[lang];
  const [first, ...rest] = dict.name.split(" ");

  return sheetImage({
    head: (
      <div style={{ ...og.display, display: "flex", fontSize: 44, lineHeight: 1 }}>
        <span>{first}</span>
        <span style={{ color: og.colors.accent }}>{rest.join(" ")}</span>
      </div>
    ),
    rev: dict.rev,
    cells: [
      { label: dict.project.spec.role, value: copy.role },
      {
        label: dict.project.spec.status,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 12, height: 12, flexShrink: 0, borderRadius: 6, background: dot[project.status] }} />
            <span>{dict.status[project.status]}</span>
          </div>
        ),
      },
      { label: dict.project.spec.link, value: project.link.label },
    ],
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ ...og.mono, fontSize: 24, color: og.colors.accent }}>{project.code}</span>
        <span style={{ ...og.display, fontSize: 184 }}>{project.name}</span>
        <span style={{ maxWidth: 960, fontSize: 30, lineHeight: 1.35, color: og.colors.muted }}>{copy.summary}</span>
      </div>
    ),
  });
}
