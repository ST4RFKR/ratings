import { cookies } from "next/headers";

export async function getLocaleFromCookie() {
  const store = await cookies();
  const locale = store.get("NEXT_LOCALE")?.value || "en";
  return locale;
}
