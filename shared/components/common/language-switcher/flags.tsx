import { Locale } from "next-intl";

export function Flags({ locale }: { locale: Locale }) {
  switch (locale) {
    case "en":
      return <div>🇬🇧</div>;
    case "uk":
      return <div>🇺🇦</div>;
    case "ru":
      return <div>🇷🇺</div>;
    default:
      return <div>🇬🇧</div>;
  }
}
