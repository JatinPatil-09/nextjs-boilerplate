import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { Locale } from "@/types/i18n";
import { AppConfig } from "@/utils/AppConfig";

export function generateStaticParams() {
  return AppConfig.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!AppConfig.locales.includes(resolvedParams.locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(resolvedParams.locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
