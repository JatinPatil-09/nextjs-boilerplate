import { config, features } from "@/lib";

export default function Home(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">{config.app.name}</h1>
        <p className="max-w-md text-lg text-gray-600">
          A comprehensive Next.js boilerplate with strict TypeScript
          configuration, linting, formatting, and quality checks.
        </p>

        <div className="mb-4 text-sm text-gray-500">
          <p>Version: {config.app.version}</p>
          <p>Environment: {config.app.environment}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-green-100 p-4">
            <h3 className="font-semibold text-green-800">
              ✅ TypeScript Strict Mode
            </h3>
            <p className="text-sm text-green-600">
              No &quot;any&quot; types allowed
            </p>
          </div>

          <div className="rounded-lg bg-blue-100 p-4">
            <h3 className="font-semibold text-blue-800">
              ✅ Environment Variables
            </h3>
            <p className="text-sm text-blue-600">Type-safe configuration</p>
          </div>

          <div className="rounded-lg bg-purple-100 p-4">
            <h3 className="font-semibold text-purple-800">
              ✅ Pre-commit Hooks
            </h3>
            <p className="text-sm text-purple-600">
              Quality checks before push
            </p>
          </div>

          {features.analytics && (
            <div className="rounded-lg bg-orange-100 p-4">
              <h3 className="font-semibold text-orange-800">📊 Analytics</h3>
              <p className="text-sm text-orange-600">
                PostHog integration enabled
              </p>
            </div>
          )}

          {features.errorReporting && (
            <div className="rounded-lg bg-red-100 p-4">
              <h3 className="font-semibold text-red-800">🔍 Error Tracking</h3>
              <p className="text-sm text-red-600">Sentry monitoring enabled</p>
            </div>
          )}

          {features.payments && (
            <div className="rounded-lg bg-yellow-100 p-4">
              <h3 className="font-semibold text-yellow-800">💳 Payments</h3>
              <p className="text-sm text-yellow-600">
                Stripe integration ready
              </p>
            </div>
          )}
        </div>

        {config.app.isDevelopment && (
          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <h4 className="font-semibold text-gray-800">🛠️ Development Mode</h4>
            <p className="text-sm text-gray-600">
              API Base URL: {config.api.baseUrl}
            </p>
          </div>
        )}

        {features.maintenance && (
          <div className="mt-6 rounded-lg bg-red-100 p-4">
            <h4 className="font-semibold text-red-800">🚧 Maintenance Mode</h4>
            <p className="text-sm text-red-600">
              The application is currently under maintenance.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
