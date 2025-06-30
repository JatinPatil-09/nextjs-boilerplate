/**
 * Loading Spinner Component
 * Displays an animated spinner
 */
const LoadingSpinner = () => (
  <div className="mb-4 flex justify-center">
    <div
      className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

/**
 * Loading Page Component
 *
 * This component is displayed during page transitions and data loading.
 * It provides visual feedback to users that content is being loaded.
 *
 * Features:
 * - Animated loading spinner
 * - Accessible loading state
 * - Consistent design
 * - Centered layout
 */
export default function LoadingPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center">
        <LoadingSpinner />

        <h2 className="mb-2 text-lg font-medium text-gray-900">Loading...</h2>

        <p className="text-sm text-gray-600">
          Please wait while we load the page.
        </p>
      </div>
    </div>
  );
}
