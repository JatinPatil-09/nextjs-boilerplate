"use client";

import { useEffect } from "react";

/**
 * Global Error Props Interface
 * Props passed to the global error boundary component by Next.js
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Critical Error Icon Component
 * Displays a critical error icon for global errors
 */
const CriticalErrorIcon = () => (
  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
    <svg
      className="h-10 w-10 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
);

/**
 * Global Error Details Component
 * Shows detailed error information in development mode for global errors
 */
interface GlobalErrorDetailsProps {
  error: Error & { digest?: string };
}

const GlobalErrorDetails = ({ error }: GlobalErrorDetailsProps) => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg bg-red-50 border-2 border-red-200 p-6 text-left">
      <h3 className="mb-3 font-bold text-red-800 flex items-center gap-2">
        <span>🔥</span>
        Critical Error Details (Development)
      </h3>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-semibold text-red-700">
            Error Message:
          </span>
          <p className="text-sm text-red-800 font-mono break-all mt-1 bg-red-100 p-2 rounded">
            {error.message}
          </p>
        </div>

        {error.digest && (
          <div>
            <span className="text-sm font-semibold text-red-700">
              Error Digest:
            </span>
            <p className="text-sm text-red-800 font-mono mt-1 bg-red-100 p-2 rounded">
              {error.digest}
            </p>
          </div>
        )}

        {error.stack && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-red-700 hover:text-red-900 font-semibold">
              Show Full Stack Trace
            </summary>
            <pre className="mt-3 text-xs text-red-800 bg-red-100 p-3 rounded overflow-auto max-h-40 border border-red-300">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

/**
 * Global Action Button Component
 * Specialized button for global error recovery actions
 */
interface GlobalActionButtonProps {
  onClick: () => void;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

const GlobalActionButton = ({
  onClick,
  variant,
  children,
}: GlobalActionButtonProps) => {
  const baseClasses =
    "w-full rounded-lg px-6 py-4 font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
    secondary:
      "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

/**
 * Global Error Boundary Component
 *
 * This component handles critical errors that occur at the root level
 * of the application, including errors in the root layout. It provides
 * its own HTML structure since the root layout may be compromised.
 *
 * Features:
 * - Complete HTML structure (html, body tags)
 * - Critical error logging
 * - Recovery options specific to global errors
 * - Development error details with stack traces
 * - Robust styling that doesn't depend on external CSS
 *
 * Note: This component only catches errors in the root layout.
 * Page-level errors are handled by error.tsx components.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error details
    console.error("Critical Application Error:", error);

    // In production, send critical errors to monitoring service immediately
    // Example: Sentry.captureException(error, { tags: { errorBoundary: 'global' } });
  }, [error]);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <html lang="en">
      <head>
        <title>Critical Error - Application Failed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-red-50 to-red-100">
          <div className="mx-auto max-w-2xl text-center">
            <CriticalErrorIcon />

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-red-900 mb-2">
                  Critical Application Error
                </h1>
                <p className="text-xl text-red-800">
                  The application has encountered a serious error and cannot
                  continue.
                </p>
              </div>

              <div className="bg-white bg-opacity-80 rounded-lg p-6 border border-red-200">
                <p className="text-lg text-red-700 leading-relaxed">
                  A critical error occurred in the application&apos;s core
                  system. This type of error typically requires immediate
                  attention.
                </p>
              </div>
            </div>

            <GlobalErrorDetails error={error} />

            <div className="space-y-4">
              <GlobalActionButton onClick={reset} variant="primary">
                🔄 Try to Recover Application
              </GlobalActionButton>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <GlobalActionButton
                  onClick={handleRefreshPage}
                  variant="secondary"
                >
                  🔃 Refresh Page
                </GlobalActionButton>

                <GlobalActionButton onClick={handleGoHome} variant="secondary">
                  🏠 Go to Homepage
                </GlobalActionButton>
              </div>
            </div>

            <footer className="mt-10 p-6 bg-white bg-opacity-60 rounded-lg border border-red-200">
              <div className="text-sm text-red-700 space-y-2">
                <p className="font-semibold">
                  ⚠️ This is a critical system error
                </p>
                <p>
                  If this error persists, please contact technical support
                  immediately and provide the error details shown above.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
