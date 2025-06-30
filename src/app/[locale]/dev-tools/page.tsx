"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

/**
 * Error Components for Testing
 * These components intentionally throw errors during render to test error boundaries
 */
const ErrorComponents = {
  RenderError: () => {
    throw new Error(
      "Component render error: This component intentionally failed during rendering"
    );
  },

  AsyncError: () => {
    useState(() => {
      throw new Error(
        "Async component error: Failed to initialize async state"
      );
    });
    return <div>This will never render</div>;
  },

  TypeError: () => {
    const data: unknown = null;
    // @ts-expect-error - Intentionally accessing property on null for error testing
    return <div>{data.someProperty.nested}</div>;
  },

  NetworkError: () => {
    throw new Error(
      "Network error: Failed to fetch required data during render"
    );
  },
};

/**
 * Navigation Component
 */
const BackToHomeLink = () => (
  <Link
    href="/"
    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
  >
    <svg
      className="mr-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
    Back to Home
  </Link>
);

/**
 * Page Header Component
 */
const PageHeader = () => (
  <div className="mb-8 flex items-center">
    <div className="mr-4 rounded-full bg-blue-100 p-3">
      <svg
        className="h-8 w-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
    <div>
      <h1 className="text-4xl font-bold text-gray-900">Development Tools</h1>
      <p className="text-lg text-gray-600 mt-1">
        Error handling and debugging utilities
      </p>
    </div>
  </div>
);

/**
 * Warning Banner Component
 */
const WarningBanner = () => (
  <div className="mb-8 rounded-lg bg-amber-50 border-l-4 border-amber-400 p-6">
    <div className="flex items-start">
      <svg
        className="h-6 w-6 text-amber-400 mr-3 mt-0.5 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <h3 className="text-lg font-semibold text-amber-800">
          Development Environment Only
        </h3>
        <p className="mt-2 text-amber-700">
          This page is only accessible in development mode and will return 404
          in production. Use these tools to test error handling and debugging
          features.
        </p>
      </div>
    </div>
  </div>
);

/**
 * Error Boundary Information Component
 */
const ErrorBoundaryInfo = () => (
  <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-6">
    <h3 className="text-xl font-semibold text-blue-900 mb-4">
      🛡️ Understanding Next.js Error Boundaries
    </h3>
    <div className="grid md:grid-cols-2 gap-6 text-sm">
      <div>
        <h4 className="font-semibold text-blue-800 mb-2">
          ✅ Error boundaries CATCH:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Component rendering errors</li>
          <li>Lifecycle method errors</li>
          <li>Constructor errors</li>
          <li>useState/useEffect initialization errors</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-blue-800 mb-2">
          ❌ Error boundaries do NOT catch:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Event handler errors (onClick, onChange)</li>
          <li>Asynchronous code (setTimeout, promises)</li>
          <li>Server-side rendering errors</li>
          <li>Errors in the error boundary itself</li>
        </ul>
      </div>
    </div>
  </div>
);

/**
 * Error Test Button Component
 */
interface ErrorTestButtonProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const ErrorTestButton = ({
  title,
  description,
  icon,
  color,
  onClick,
}: ErrorTestButtonProps) => (
  <div
    className={`rounded-lg border-2 ${color} p-6 hover:shadow-md transition-shadow`}
  >
    <div className="flex items-start mb-4">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <button
      onClick={onClick}
      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
      Trigger {title}
    </button>
  </div>
);

/**
 * Test Results Component
 */
interface TestResultsProps {
  errorType: string | null;
  onReset: () => void;
}

const TestResults = ({ errorType, onReset }: TestResultsProps) => {
  if (!errorType) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-yellow-800">
            ⚠️ Error Component Active
          </h4>
          <p className="text-yellow-700 mt-1">
            An error component is about to render. This will be caught by the
            error boundary.
          </p>
        </div>
        <button
          onClick={onReset}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

/**
 * Main Dev Tools Page Component
 */
export default function DevToolsPage(): React.JSX.Element {
  // Redirect to 404 if not in development
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [errorType, setErrorType] = useState<string | null>(null);

  const resetErrors = () => setErrorType(null);

  // Error test configurations
  const errorTests = [
    {
      title: "Render Error",
      description: "Throws an error during component rendering",
      errorType: "render-error",
      icon: "💥",
      color: "border-red-200 bg-red-50",
    },
    {
      title: "Async Error",
      description: "Throws an error during async state initialization",
      errorType: "async-error",
      icon: "⏱️",
      color: "border-orange-200 bg-orange-50",
    },
    {
      title: "Type Error",
      description: "Throws a TypeError by accessing null properties",
      errorType: "type-error",
      icon: "🔤",
      color: "border-purple-200 bg-purple-50",
    },
    {
      title: "Network Error",
      description: "Simulates a network error during render",
      errorType: "network-error",
      icon: "🌐",
      color: "border-blue-200 bg-blue-50",
    },
  ];

  // Render error components based on state
  const renderErrorComponent = () => {
    switch (errorType) {
      case "render-error":
        return <ErrorComponents.RenderError />;
      case "async-error":
        return <ErrorComponents.AsyncError />;
      case "type-error":
        return <ErrorComponents.TypeError />;
      case "network-error":
        return <ErrorComponents.NetworkError />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BackToHomeLink />

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <PageHeader />
          <WarningBanner />
          <ErrorBoundaryInfo />

          {/* Error Testing Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🧪 Error Boundary Testing
            </h2>
            <p className="text-gray-600 mb-6">
              Click any button below to trigger a component render error that
              will be caught by Next.js error boundaries.
            </p>

            <TestResults errorType={errorType} onReset={resetErrors} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {errorTests.map((test) => (
                <ErrorTestButton
                  key={test.errorType}
                  {...test}
                  onClick={() => setErrorType(test.errorType)}
                />
              ))}
            </div>
          </section>

          {/* Render the error component if one is selected */}
          {renderErrorComponent()}

          {/* Additional Information */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📚 Additional Resources
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Error Boundaries Documentation:</strong>{" "}
                <a
                  href="https://nextjs.org/docs/app/building-your-application/routing/error-handling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Next.js Error Handling
                </a>
              </p>
              <p>
                <strong>React Error Boundaries:</strong>{" "}
                <a
                  href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  React Documentation
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
