import type { LocalePrefixMode } from "next-intl/routing";

const localePrefix: LocalePrefixMode = "as-needed";

// Update this configuration file based on your project information
export const AppConfig = {
  name: "Next.js Boilerplate",
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  localePrefix,
} as const;

export type Locale = (typeof AppConfig.locales)[number];
