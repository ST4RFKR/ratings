import { getRequestConfig } from "next-intl/server";

import { Locale } from "next-intl";
import { getLocaleFromHeaders } from "@/shared/lib/server/get-locale-from-header";
import { getLocaleFromCookie } from "@/shared/lib/server/get-local-from-cookie";

const locales = ["en", "uk", "ru"] satisfies Locale[];

export default getRequestConfig(async () => {
  const x = await getLocaleFromHeaders();
  console.log(x);
  const locale =
    (await getLocaleFromCookie()) ||
    (await getLocaleFromHeaders()) ||
    locales[0];

  console.log(locale);

  if (!locales.includes(locale)) {
    return {
      locale: locales[0],
      messages: (await import(`../messages/${locales[0]}.json`)).default,
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
