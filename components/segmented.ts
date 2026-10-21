// Shared look for the language and theme groups: a bordered strip of
// mono labels, the active one inverted (fg on bg swapped).

export type SegmentSize = "compact" | "touch";

export const segmentGroup = "flex border border-field font-mono text-label uppercase";

const sizes: Record<SegmentSize, string> = {
  compact: "min-h-9 px-3",
  // 44px targets in the mobile menu.
  touch: "min-h-11 min-w-11 px-3",
};

export function segmentItem(size: SegmentSize, active: boolean) {
  const state = active ? "bg-fg text-bg" : "text-fg hover:bg-rule";
  // `uppercase` again here: preflight resets text-transform on <button>.
  return `inline-flex items-center justify-center uppercase transition-colors duration-fast ease-standard ${sizes[size]} ${state}`;
}
