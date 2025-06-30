"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Dev Tools Error Props Interface
 * Props passed to the dev-tools error boundary component by Next.js
 */
interface DevToolsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Development Error Icon Component
 * Displays a tools icon for dev tools errors
 */
const DevToolsErrorIcon = () => (
  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
    <svg
      className="h-8 w-8 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
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
);

/**
 * Dev Tools Error Details Component
 * Shows detailed error information for development tools errors
 */
interface DevToolsErrorDetailsProps {
  error: Error & { digest?: string };
}

const DevToolsErrorDetails = ({ error }: DevToolsErrorDetailsProps) => (
  <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-6 text-left">
    <h3 className="mb-3 font-semibold text-blue-800 flex items-center gap-2">
      <span>🔧</span>
      Development Tools Error Details
    </h3>

    <div className="space-y-3">
      <div>
        <span className="text-sm font-medium text-blue-700">
          Error Message:
        </span>
        <p className="text-sm text-blue-800 font-mono break-all mt-1 bg-blue-100 p-2 rounded">
          {error.message}
        </p>
      </div>

      {error.digest && (
        <div>
          <span className="text-sm font-medium text-blue-700">
            Error Digest:
          </span>
          <p className="text-sm text-blue-800 font-mono mt-1 bg-blue-100 p-2 rounded">
            {error.digest}
          </p>
        </div>
      )}

      {error.stack && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-blue-700 hover:text-blue-900 font-medium">
            Show Stack Trace
          </summary>
          <pre className="mt-2 text-xs text-blue-800 bg-blue-100 p-3 rounded overflow-auto max-h-32 border border-blue-300">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

/**
 * Dev Tools Action Button Component
 * Specialized button for dev tools error recovery actions
 */
interface DevToolsActionButtonProps {
  onClick: () => void;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

const DevToolsActionButton = ({
  onClick,
  variant,
  children,
}: DevToolsActionButtonProps) => {
  const baseClasses =
    "w-full rounded-lg px-4 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

/**
 * Dev Tools Error Boundary Component
 *
 * This component handles errors that occur specifically in the dev-tools route.
 * It provides a specialized error recovery experience for development tools
 * with additional debugging information and appropriate recovery options.
 *
 * Features:
 * - Development-focused error logging
 * - Specialized recovery options for dev tools
 * - Enhanced error details for debugging
 * - Navigation back to safe areas
 */
export default function DevToolsError({
  error,
  reset,
}: DevToolsErrorProps): React.JSX.Element {
  useEffect(() => {
    // Log dev tools specific error
    console.error("Development Tools Error:", error);

    // In development, we want detailed logging for dev tools errors
    if (process.env.NODE_ENV === "development") {
      console.group("🔧 Dev Tools Error Details");
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
      if (error.digest) {
        console.error("Error Digest:", error.digest);
      }
      console.groupEnd();
    }
  }, [error]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleRefreshTools = () => {
    window.location.href = "/dev-tools";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-2xl text-center">
        <DevToolsErrorIcon />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-blue-900">
            Development Tools Error
          </h1>

          <p className="text-lg text-blue-700">
            An error occurred in the development tools. This is likely due to an
            intentional error test.
          </p>

          <div className="bg-white bg-opacity-80 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-800">
              <strong>This error is expected</strong> if you were testing error
              boundaries. Use the options below to recover or navigate away.
            </p>
          </div>
        </div>

        <DevToolsErrorDetails error={error} />

        <div className="space-y-3">
          <DevToolsActionButton onClick={reset} variant="primary">
            🔄 Reset Development Tools
          </DevToolsActionButton>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DevToolsActionButton
              onClick={handleRefreshTools}
              variant="secondary"
            >
              🔧 Reload Dev Tools
            </DevToolsActionButton>

            <DevToolsActionButton onClick={handleGoHome} variant="secondary">
              🏠 Go to Homepage
            </DevToolsActionButton>
          </div>
        </div>

        <footer className="mt-8 p-4 bg-white bg-opacity-60 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-700 space-y-2">
            <p className="font-medium">💡 Development Tools Information</p>
            <p>
              This error boundary is specific to the development tools route. It
              provides enhanced debugging information for development purposes.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to safe area
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
