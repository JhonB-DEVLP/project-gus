"use client";

// Client Component: usePathname gives the 404 the requested path. Reading it
// from request headers on the server would make every page under [lang]
// dynamic, because not-found is rendered as part of each route.
import { usePathname } from "next/navigation";

export function RequestedPath({ label }: { label: string }) {
  const path = usePathname();
  if (!path) return null;

  return (
    <div className="flex gap-4 border-b border-rule">
      <dt className="w-24 shrink-0 py-3 text-muted uppercase">{label}</dt>
      {/* Plain text: React escapes it. */}
      <dd className="min-w-0 py-3 wrap-anywhere">{path}</dd>
    </div>
  );
}
