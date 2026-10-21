import type { ReactNode } from "react";

// Page width (1312px) with the side gutter: 16px mobile, 64px desktop.
export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-4 lg:px-16 ${className}`}>{children}</div>;
}
