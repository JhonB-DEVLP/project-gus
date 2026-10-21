"use client";

import { useEffect, useRef } from "react";

// A CSS time in ms. The minifier may rewrite the token "1100ms" as "1.1s".
export function toMs(time: string) {
  const value = parseFloat(time);
  return time.trim().endsWith("ms") ? value : value * 1000;
}

// Live numbers count up from 0 (docs/design.md, Motion #3). The server
// renders the final number, so it is right without JS and with reduced
// motion; the animation only rewrites the text node after hydration.
export function CountUp({ value, locale }: { value: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = new Intl.NumberFormat(locale);

  useEffect(() => {
    const text = ref.current?.firstChild;
    if (!(text instanceof Text)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const formatter = new Intl.NumberFormat(locale);
    const duration = toMs(getComputedStyle(document.documentElement).getPropertyValue("--dur-count"));
    if (!(duration > 0)) return;

    // Pad with figure spaces to the final length: in the mono face every
    // character has the same width, so the right-aligned number never
    // changes width while it counts (no layout shift).
    const final = formatter.format(value);
    let frame = 0;
    let start: number | null = null;
    const step = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3; // ease-out
      text.data = formatter.format(Math.round(value * eased)).padStart(final.length, " ");
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      text.data = final;
    };
  }, [value, locale]);

  return <span ref={ref}>{format.format(value)}</span>;
}
