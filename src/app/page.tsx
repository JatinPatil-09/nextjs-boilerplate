import Link from "next/link";

import { features, getServerConfig } from "@/lib";

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
 * Homepage Component
 *
 * The main landing page that showcases the boilerplate features
 * and provides access to development tools.
 */
export default function HomePage(): React.JSX.Element {
  const config = getServerConfig();

  // Core features that are always displayed
  const coreFeatures = [
    {
      title: "TypeScript Strict Mode",
      description: 'No "any" types allowed',
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: "✅",
    },
    {
      title: "Environment Variables",
      description: "Type-safe configuration",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: "✅",
    },
    {
      title: "Pre-commit Hooks",
      description: "Quality checks before push",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: "✅",
    },
    {
      title: "Error Handling",
      description: "Next.js error boundaries",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "✅",
    },
  ];

  // Optional features based on configuration
  const optionalFeatures = [];

  if (features.analytics) {
    optionalFeatures.push({
      title: "Analytics",
      description: "PostHog integration enabled",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      icon: "📊",
    });
  }

  if (features.payments) {
    optionalFeatures.push({
      title: "Payments",
      description: "Stripe integration ready",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: "💳",
    });
  }

  const allFeatures = [...coreFeatures, ...optionalFeatures];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex flex-col items-center gap-8 text-center max-w-4xl">
        {/* Header Section */}
        <header className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {config.app.name}
          </h1>
          <p className="max-w-2xl text-lg text-gray-600 leading-relaxed">
            A comprehensive Next.js boilerplate with strict TypeScript
            configuration, error handling, linting, formatting, and quality
            checks.
          </p>
        </header>

        {/* Features Grid */}
        <section className="w-full">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Included Features
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
              title="Development Mode"
              description={`API Base URL: ${config.api.baseUrl}`}
              bgColor="bg-gray-100"
              textColor="text-gray-800"
              icon="🛠️"
            />
          )}

          {/* Maintenance Mode Status */}
          {features.maintenance && (
            <StatusCard
              title="Maintenance Mode"
              description="The application is currently under maintenance."
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
            Posts Demo
          </Link>

          {/* Development Tools Link */}
          {config.app.isDevelopment && (
            <Link
              href="/dev-tools"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>🔧</span>
              Development Tools
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}
