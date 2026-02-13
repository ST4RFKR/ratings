"use client";
import { LanguageSwitcher } from "@/shared/components/common/language-switcher/language-switcher";
import { ModeToggle } from "@/shared/components/common/mode-toggle";
import { useTranslations } from "next-intl";

export function Wrapper() {
  const t = useTranslations("main");
  return (
    <div>
      <ModeToggle />
      <LanguageSwitcher />
      <h1>{t("hello")}</h1>
    </div>
  );
}
