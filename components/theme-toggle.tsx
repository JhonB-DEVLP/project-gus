"use client";

// Client Component: reads and writes localStorage and sets data-theme on <html>.
import { useSyncExternalStore } from "react";
import { applyTheme, readTheme, subscribeTheme, themes } from "@/lib/theme";
import { segmentGroup, segmentItem, type SegmentSize } from "./segmented";

type ThemeToggleProps = {
  labels: { label: string; light: string; dark: string; system: string };
  size: SegmentSize;
};

// The server can't know the stored choice, so no button is pressed in the HTML;
// useSyncExternalStore swaps in the real value right after hydration.
const serverSnapshot = () => null;

export function ThemeToggle({ labels, size }: ThemeToggleProps) {
  const current = useSyncExternalStore(subscribeTheme, readTheme, serverSnapshot);

  return (
    <div role="group" aria-label={labels.label} className={segmentGroup}>
      {themes.map((theme) => (
        <button
          key={theme}
          type="button"
          aria-pressed={current === theme}
          onClick={() => applyTheme(theme)}
          className={segmentItem(size, current === theme)}
        >
          {labels[theme]}
        </button>
      ))}
    </div>
  );
}
