import { headers } from "next/headers";

export async function getLocaleFromHeaders() {
  const store = await headers();
  const acceptLanguage = store.get("accept-language");
  const locale = acceptLanguage?.split(",")[0];
  const localeWithoutRegion = locale?.split("-")[0];

  if (!localeWithoutRegion) {
    return null;
  }

  return localeWithoutRegion?.toLocaleLowerCase();
}
