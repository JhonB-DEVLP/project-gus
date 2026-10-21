import "server-only";
import type { Locale } from "@/lib/i18n";
import type en from "./dictionaries/en.json";

// en.json is the source of truth: pt.json must have every key it has.
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
