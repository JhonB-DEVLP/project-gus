"use server";

import { headers } from "next/headers";
import { clientId } from "@/lib/contact/client-id";
import { getContactDrivers } from "@/lib/contact/drivers";
import { handleContact } from "@/lib/contact/handle";
import { EMPTY_VALUES, type ContactState, type ContactValues } from "@/lib/contact/state";
import type { ContactResult } from "@/lib/contact/types";
import { defaultLocale, hasLocale } from "@/lib/i18n";

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

// Bound with the page's locale: sendMessage.bind(null, lang). Everything
// here comes from the client, the bound locale and the previous state too.
export async function sendMessage(lang: string, previous: ContactState, formData: FormData): Promise<ContactState> {
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const version = (typeof previous?.version === "number" ? previous.version : 0) + 1;
  const values: ContactValues = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    message: text(formData, "message"),
  };
  const reply = (result: ContactResult): ContactState => ({ result, values, sentName: "", version });

  const drivers = getContactDrivers();
  if (!drivers) return reply({ ok: false, error: "server" });

  // First hop of x-forwarded-for is the client (set by Vercel's proxy).
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const result = await handleContact(
    { ...values, company: text(formData, "company"), locale, clientId: clientId(ip, drivers.salt) },
    drivers,
  );

  // A filled honeypot gets the same answer as a real message: don't teach the bot.
  if (result.ok || result.error === "spam") {
    return { result: { ok: true }, values: EMPTY_VALUES, sentName: values.name.trim(), version };
  }
  return reply(result);
}
