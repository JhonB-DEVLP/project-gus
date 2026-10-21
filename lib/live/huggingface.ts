import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { parseModels, type LiveModel } from "./parse";

const TRENDING_URL = "https://huggingface.co/api/models?sort=trendingScore&limit=5";
const TIMEOUT_MS = 4000;

export type LiveResult = { ok: true; items: LiveModel[]; readAt: string } | { ok: false };

// Fetched at request time, never cached. `cache` shares one fetch between
// the read time and the table, which render in separate Suspense boundaries.
// Network errors, timeouts, non-2xx and malformed JSON all become { ok: false }.
export const getTrendingModels = cache(async (): Promise<LiveResult> => {
  await connection();
  try {
    const response = await fetch(TRENDING_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
    if (!response.ok) return { ok: false };
    const items = parseModels(await response.json());
    if (!items) return { ok: false };
    // HH:MM:SS in UTC, formatted on the server: no hydration mismatch.
    return { ok: true, items, readAt: new Date().toISOString().slice(11, 19) };
  } catch {
    return { ok: false };
  }
});
