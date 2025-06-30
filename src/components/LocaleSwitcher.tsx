"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/lib/I18nNavigation";
import { AppConfig } from "@/utils/AppConfig";

const localeNames: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
};

export const LocaleSwitcher = () => {
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
        aria-label={t("select_language")}
      >
        {AppConfig.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc] || loc}
          </option>
        ))}
      </select>
    </div>
  );
};
