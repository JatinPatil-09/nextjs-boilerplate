"use client";

import Link from "next/link";

/**
 * 404 Icon Component
 * Displays a document icon for the 404 page
 */
const NotFoundIcon = () => (
  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
    <svg
      className="h-8 w-8 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  </div>
);

/**
 * Action Link Component
 * Reusable link component for navigation actions
 */
interface ActionLinkProps {
  href?: string;
  onClick?: () => void;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

const ActionLink = ({ href, onClick, variant, children }: ActionLinkProps) => {
  const baseClasses =
    "inline-block w-full rounded-lg px-6 py-3 font-medium text-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${variants[variant]}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} w-full`}
    >
      {children}
    </button>
  );
};

/**
 * Not Found Page Component
 *
 * This page is displayed when a user navigates to a non-existent route.
 * It provides helpful navigation options and maintains a consistent
 * design with the rest of the application.
 *
 * Features:
 * - Clean, user-friendly 404 message
 * - Navigation options (home, back)
 * - Responsive design
 * - Accessibility considerations
 */
export default function NotFoundPage(): React.JSX.Element {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="mx-auto max-w-lg text-center">
        <NotFoundIcon />

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>

          <h2 className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <ActionLink href="/" variant="primary">
            Go to Homepage
          </ActionLink>

          <ActionLink onClick={handleGoBack} variant="secondary">
            Go Back
          </ActionLink>
        </div>

        <footer className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </footer>
      </div>
    </div>
  );
}
