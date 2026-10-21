import type { ProjectStatus } from "@/content/projects";

// Status is a dot plus its label, never color alone (docs/design.md).
const dots: Record<ProjectStatus, string> = {
  production: "bg-accent",
  early: "bg-warn",
  testing: "bg-muted",
};

export function StatusMark({
  status,
  label,
  className = "",
}: {
  status: ProjectStatus;
  label: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dots[status]}`} />
      {label}
    </span>
  );
}
