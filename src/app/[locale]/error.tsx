"use client";

import { useEffect } from "react";

/**
 * Error Props Interface
 * Props passed to the error boundary component by Next.js
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Icon Component
 * Displays a warning icon in a styled container
 */
const ErrorIcon = () => (
  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
    <svg
      className="h-8 w-8 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  </div>
);

/**
 * Error Details Component
 * Shows detailed error information in development mode
 */
interface ErrorDetailsProps {
  error: Error & { digest?: string };
}

const ErrorDetails = ({ error }: ErrorDetailsProps) => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-left">
      <h3 className="mb-2 font-semibold text-red-800">
        Development Error Details:
      </h3>
      <div className="space-y-2">
        <div>
          <span className="text-xs font-medium text-red-600">Message:</span>
          <p className="text-sm text-red-700 font-mono break-all mt-1">
            {error.message}
          </p>
        </div>
        {error.digest && (
          <div>
            <span className="text-xs font-medium text-red-600">Error ID:</span>
            <p className="text-sm text-red-700 font-mono mt-1">
              {error.digest}
            </p>
          </div>
        )}
        {error.stack && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800 font-medium">
              Show Stack Trace
            </summary>
            <pre className="mt-2 text-xs text-red-700 bg-red-25 p-2 rounded overflow-auto max-h-32 border border-red-200">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

/**
 * Action Button Component
 * Reusable button component for error page actions
 */
interface ActionButtonProps {
  onClick: () => void;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

const ActionButton = ({ onClick, variant, children }: ActionButtonProps) => {
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
 * Root Error Boundary Component
 *
 * This component handles errors that occur in route segments.
 * It provides users with options to recover from errors and
 * shows detailed error information in development mode.
 *
 * Features:
 * - Error logging to console
 * - Recovery options (retry, go home)
 * - Development error details
 * - User-friendly error messages
 */
export default function ErrorBoundary({
  error,
  reset,
}: ErrorProps): React.JSX.Element {
  useEffect(() => {
    // Log error details for debugging
    console.error("Application Error:", error);

    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="mx-auto max-w-lg text-center">
        <ErrorIcon />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Something went wrong!
          </h1>

          <p className="text-lg text-gray-600">
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </p>
        </div>

        <ErrorDetails error={error} />

        <div className="space-y-3">
          <ActionButton onClick={reset} variant="primary">
            Try Again
          </ActionButton>

          <ActionButton onClick={handleGoHome} variant="secondary">
            Go to Homepage
          </ActionButton>
        </div>

        <footer className="mt-8 text-sm text-gray-500">
          <p>If this problem continues, please contact our support team.</p>
        </footer>
      </div>
    </div>
  );
}
