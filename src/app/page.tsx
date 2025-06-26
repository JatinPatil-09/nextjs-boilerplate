export default function Home(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">
          Next.js Strict TypeScript Boilerplate
        </h1>
        <p className="max-w-md text-lg text-gray-600">
          A comprehensive Next.js boilerplate with strict TypeScript
          configuration, linting, formatting, and quality checks.
        </p>
        <div className="flex gap-4">
          <div className="rounded-lg bg-green-100 p-4">
            <h3 className="font-semibold text-green-800">
              ✅ TypeScript Strict Mode
            </h3>
            <p className="text-sm text-green-600">
              No &quot;any&quot; types allowed
            </p>
          </div>
          <div className="rounded-lg bg-blue-100 p-4">
            <h3 className="font-semibold text-blue-800">✅ Code Quality</h3>
            <p className="text-sm text-blue-600">
              ESLint + Prettier configured
            </p>
          </div>
          <div className="rounded-lg bg-purple-100 p-4">
            <h3 className="font-semibold text-purple-800">
              ✅ Pre-commit Hooks
            </h3>
            <p className="text-sm text-purple-600">
              Quality checks before push
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
