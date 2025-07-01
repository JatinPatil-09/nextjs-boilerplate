import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { features, getServerConfig } from "@/lib";
import type { LocalePageProps } from "@/types/i18n";

/**
 * Feature Card Component
 * Displays individual feature information
 */
interface FeatureCardProps {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

const FeatureCard = ({
  title,
  description,
  bgColor,
  textColor,
  icon,
}: FeatureCardProps) => (
  <div
    className={`rounded-lg ${bgColor} p-4 shadow-sm transition-shadow hover:shadow-md`}
  >
    <h3 className={`font-semibold ${textColor} flex items-center gap-2`}>
      <span>{icon}</span>
      {title}
    </h3>
    <p className={`mt-1 text-sm ${textColor.replace("800", "600")}`}>
      {description}
    </p>
  </div>
);

/**
 * Status Card Component
 * Displays application status information
 */
interface StatusCardProps {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

const StatusCard = ({
  title,
  description,
  bgColor,
  textColor,
  icon,
}: StatusCardProps) => (
  <div className={`mt-6 rounded-lg ${bgColor} border p-4`}>
    <h4 className={`font-semibold ${textColor} flex items-center gap-2`}>
      <span>{icon}</span>
      {title}
    </h4>
    <p className={`mt-1 text-sm ${textColor.replace("800", "600")}`}>
      {description}
    </p>
  </div>
);

/**
 * Homepage Content Component (Client)
 * Uses useTranslations for client-side translations
 */
function HomepageContent() {
  const t = useTranslations("HomePage");
  const config = getServerConfig();

  // Core features that are always displayed
  const coreFeatures = [
    {
      title: t("features.typescript_strict.title"),
      description: t("features.typescript_strict.description"),
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: "✅",
    },
    {
      title: t("features.environment_variables.title"),
      description: t("features.environment_variables.description"),
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: "✅",
    },
    {
      title: t("features.precommit_hooks.title"),
      description: t("features.precommit_hooks.description"),
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: "✅",
    },
    {
      title: t("features.error_handling.title"),
      description: t("features.error_handling.description"),
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "✅",
    },
  ];

  // Optional features based on configuration
  const optionalFeatures = [];

  if (features.analytics) {
    optionalFeatures.push({
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      icon: "📊",
    });
  }

  if (features.payments) {
    optionalFeatures.push({
      title: t("features.payments.title"),
      description: t("features.payments.description"),
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: "💳",
    });
  }

  const allFeatures = [...coreFeatures, ...optionalFeatures];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex flex-col items-center gap-8 text-center max-w-4xl">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <LocaleSwitcher />
        </div>

        {/* Header Section */}
        <header className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg text-gray-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* Features Grid */}
        <section className="w-full">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            {t("features_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        {/* Status Cards */}
        <section className="w-full space-y-4">
          {/* Development Mode Status */}
          {config.app.isDevelopment && (
            <StatusCard
              title={t("status.development_mode")}
              description={t("status.api_base_url", {
                url: config.api.baseUrl,
              })}
              bgColor="bg-gray-100"
              textColor="text-gray-800"
              icon="🛠️"
            />
          )}

          {/* Maintenance Mode Status */}
          {features.maintenance && (
            <StatusCard
              title={t("status.maintenance_mode")}
              description={t("status.maintenance_description")}
              bgColor="bg-red-100"
              textColor="text-red-800"
              icon="🚧"
            />
          )}
        </section>

        {/* Navigation Links */}
        <section className="mt-8 flex flex-col gap-4 sm:flex-row">
          {/* Posts Demo Link */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white font-medium transition-all hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span>📝</span>
            {t("navigation.posts")}
          </Link>

          {/* Form Demo Link */}
          <Link
            href="/form"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span>📝</span>
            {t("navigation.form")}
          </Link>

          {/* Development Tools Link */}
          {config.app.isDevelopment && (
            <Link
              href="/dev-tools"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>🔧</span>
              {t("navigation.dev_tools")}
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: LocalePageProps) {
  const resolvedParams = await params;
  const t = await getTranslations({
    locale: resolvedParams.locale,
    namespace: "HomePage",
  });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

/**
 * Localized Homepage Component
 */
export default async function LocalePage({ params }: LocalePageProps) {
  const resolvedParams = await params;

  // Enable static rendering
  setRequestLocale(resolvedParams.locale);

  return <HomepageContent />;
}
