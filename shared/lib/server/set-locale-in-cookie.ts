"use server";
import { cookies } from "next/headers";
import type { Locale } from "next-intl";

export async function setLocaleInCookie(locale: Locale) {
  const store = await cookies();
  store.set("NEXT_LOCALE", locale);
}
