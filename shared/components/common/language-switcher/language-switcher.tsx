"use client";
import { Locale, useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { setLocaleInCookie } from "@/shared/lib/server/set-locale-in-cookie";

import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { Flags } from "./flags";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("header.language-switcher");

  const locales = [
    { locale: "en", name: t("lang.en") },
    { locale: "uk", name: t("lang.uk") },
    { locale: "ru", name: t("lang.ru") },
  ] satisfies { locale: Locale; name: string }[];

  async function changeLocale(locale: Locale) {
    await setLocaleInCookie(locale);
  }
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-none bg-transparent">
            <Globe className="text-emerald-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="end"
          className="flex flex-col gap-2 w-full"
        >
          {locales.map((l) => (
            <Button
              key={l.name}
              className={cn(
                "flex items-center gap-2 p-2 text-light-100 max-w-37.5 w-full",
              )}
              disabled={l.locale === locale}
              variant={"ghost"}
              onClick={() => changeLocale(l.locale)}
            >
              {<Flags locale={l.locale} />} {l.name}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
