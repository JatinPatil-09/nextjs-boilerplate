"use client";

import { useEffect } from "react";

import { useAnalytics } from "@/hooks";

interface PostsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostsError({ error, reset }: PostsErrorProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    // Track error occurrence
    track("posts_page_error", {
      page: "posts",
      error_message: error.message,
      error_digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [track, error.message, error.digest]);

  const handleRetryClick = () => {
    track("posts_error_retry_clicked", {
      page: "posts",
      error_message: error.message,
      timestamp: new Date().toISOString(),
    });
    reset();
  };

  const handleGoHomeClick = () => {
    track("posts_error_home_clicked", {
      page: "posts",
      error_message: error.message,
      timestamp: new Date().toISOString(),
    });
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="mt-2 text-gray-600">
            Browse all posts from JSONPlaceholder API
          </p>
        </header>

        {/* Error Content */}
        <div className="mx-auto max-w-md">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="mb-2 text-lg font-semibold text-red-900">
              Something went wrong!
            </h2>
            <p className="mb-6 text-sm text-red-700">
              {error.message || "Failed to load posts. Please try again."}
            </p>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === "development" && error.digest && (
              <div className="mb-6 rounded bg-red-100 p-3 text-left">
                <p className="text-xs font-mono text-red-800">
                  Error ID: {error.digest}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRetryClick}
                className="rounded-lg bg-red-600 px-4 py-2 text-white font-medium transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              <button
                onClick={handleGoHomeClick}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-red-700 font-medium transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
