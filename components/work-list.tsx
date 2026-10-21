import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Project } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { Thumbnail } from "./figure";
import { StatusMark } from "./status-mark";

type WorkListProps = {
  lang: Locale;
  dict: Dictionary;
  projects: Project[];
};

// Hover (and keyboard focus): the thumbnail scales to 1.04, the arrow moves 6px.
const thumbMotion =
  "transition-transform duration-base ease-standard group-hover:scale-104 group-focus-visible:scale-104";
const arrowMotion =
  "transition-transform duration-base ease-standard group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5";

// One entry has two layouts: a card below xl (figure on top on phones,
// beside the text on tablets) and a table row at xl. Only one is displayed,
// so only one is in the tab order and the accessibility tree.
export function WorkList({ lang, dict, projects }: WorkListProps) {
  const cols = dict.work.cols;

  return (
    <div className="border-t-2 border-fg">
      <div
        aria-hidden="true"
        className="hidden grid-work gap-6 border-b border-rule py-3 font-mono text-label text-muted uppercase xl:grid"
      >
        <span>{cols.fig}</span>
        <span>{cols.part}</span>
        <span>{cols.product}</span>
        <span>{cols.role}</span>
        <span>{cols.stack}</span>
        <span>{cols.status}</span>
      </div>
      <ul>
        {projects.map((project) => {
          const copy = project.copy[lang];
          const href = `/${lang}/work/${project.slug}`;
          const alt = copy.figures[0]?.alt ?? project.name;
          const status = dict.status[project.status];

          return (
            <li key={project.slug} className="border-b border-rule">
              {/* Card */}
              <Link href={href} className="group flex flex-col gap-3 py-5 md:flex-row md:gap-6 xl:hidden">
                <span className="md:w-2/5 md:shrink-0">
                  <Thumbnail
                    image={project.thumbnail}
                    alt={alt}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className={thumbMotion}
                  />
                </span>
                <span className="flex flex-1 flex-col gap-3">
                  <span className="flex justify-between gap-4 font-mono text-label uppercase">
                    <span className="text-accent">{project.code}</span>
                    <StatusMark status={project.status} label={status} />
                  </span>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-condensed text-title leading-none font-bold uppercase">{project.name}</span>
                    <span aria-hidden="true" className={`text-lead ${arrowMotion}`}>
                      →
                    </span>
                  </span>
                  <span className="text-muted">{copy.list.summary}</span>
                  <span className="font-mono text-label">
                    {copy.list.role} · {project.stack}
                  </span>
                </span>
              </Link>

              {/* Row */}
              <Link href={href} className="group hidden grid-work items-center gap-6 py-5 xl:grid">
                <Thumbnail image={project.thumbnail} alt={alt} sizes="176px" className={thumbMotion} />
                <span className="font-mono text-data text-accent">{project.code}</span>
                <span className="flex flex-col gap-1">
                  <span className="font-condensed text-title leading-none font-bold uppercase">{project.name}</span>
                  <span className="text-muted">{copy.list.summary}</span>
                </span>
                <span>{copy.list.role}</span>
                <span className="font-mono text-data text-muted">{project.stack}</span>
                <StatusMark status={project.status} label={status} className="font-mono text-label uppercase" />
                <span aria-hidden="true" className={`text-lead ${arrowMotion}`}>
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
