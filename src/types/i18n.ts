import type { AppConfig } from "@/utils/AppConfig";

export type Locale = (typeof AppConfig.locales)[number];

export interface I18nConfig {
  locale: Locale;
  messages: Record<string, unknown>;
}

export type TranslationNamespace =
  | "Common"
  | "Navigation"
  | "LocaleSwitcher"
  | "HomePage";

export interface LocalePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}
