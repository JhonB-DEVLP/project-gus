// Link buttons: mono uppercase label in a 2px-radius block. Every variant
// has a 1px border (transparent on fills), so they all measure the same.

export type ButtonVariant = "solid" | "outline" | "accent";

const variants: Record<ButtonVariant, string> = {
  solid: "border-transparent bg-fg text-bg hover:bg-accent hover:text-on-accent",
  outline: "border-fg hover:bg-fg hover:text-bg",
  accent: "border-transparent bg-accent text-on-accent hover:bg-fg hover:text-bg",
};

export const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-5 py-3 font-mono text-data tracking-wider uppercase transition-colors duration-fast ease-standard";

export function buttonClass(variant: ButtonVariant) {
  return `${buttonBase} ${variants[variant]}`;
}
