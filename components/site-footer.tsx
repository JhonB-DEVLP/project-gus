import type { Dictionary } from "@/app/[lang]/dictionaries";
import { sourceUrl } from "@/lib/site";
import { Container } from "./container";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule">
      <Container className="flex flex-col gap-2 pt-6 pb-8 font-mono text-label text-muted uppercase lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <p>
          © {year} {dict.name} · {dict.footer.built}
        </p>
        <a
          href={sourceUrl}
          className="inline-flex min-h-11 items-center gap-1 self-start underline-offset-4 transition-colors duration-fast ease-standard hover:text-fg hover:underline lg:min-h-0 lg:self-auto"
        >
          {dict.footer.source}
          <span aria-hidden="true">↗</span>
        </a>
        <p>{dict.footer.sheet}</p>
      </Container>
    </footer>
  );
}
