import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PostHogProvider } from "@/components/analytics";
import type { Locale } from "@/types/i18n";
import { AppConfig } from "@/utils/AppConfig";
import "./globals.css";

/**
 * Font Configuration
 * Using Geist fonts for better typography
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Application Metadata
 * Defines the default metadata for the application
 */
export const metadata: Metadata = {
  title: {
    default: "Next.js Boilerplate",
    template: "%s | Next.js Boilerplate",
  },
  description:
    "A comprehensive Next.js boilerplate with strict TypeScript configuration, error handling, and quality checks",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Boilerplate"],
  authors: [{ name: "Next.js Boilerplate" }],
  creator: "Next.js Boilerplate",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Next.js Boilerplate",
    description:
      "A comprehensive Next.js boilerplate with strict TypeScript configuration",
    siteName: "Next.js Boilerplate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Boilerplate",
    description:
      "A comprehensive Next.js boilerplate with strict TypeScript configuration",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Root Layout Component Props
 */
interface RootLayoutProps {
  readonly children: React.ReactNode;
  readonly params?: Promise<{
    locale?: string;
  }>;
}

/**
 * Root Layout Component
 *
 * This is the root layout that wraps all pages in the application.
 * It includes:
 * - Font variables for the entire app
 * - Basic HTML structure with proper locale
 * - Global CSS imports
 *
 * Error boundaries are handled by:
 * - global-error.tsx (for layout errors)
 * - error.tsx (for page errors)
 */
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps): Promise<React.JSX.Element> {
  // Get the locale from params, fallback to default
  let locale: Locale = AppConfig.defaultLocale;
  if (params) {
    const resolvedParams = await params;
    if (
      resolvedParams.locale &&
      AppConfig.locales.includes(resolvedParams.locale as Locale)
    ) {
      locale = resolvedParams.locale as Locale;
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white font-sans antialiased`}
        suppressHydrationWarning
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
