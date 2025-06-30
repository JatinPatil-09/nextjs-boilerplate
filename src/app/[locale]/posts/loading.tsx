export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header Skeleton */}
        <header className="mb-8 text-center">
          <div className="mx-auto h-8 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="mx-auto mt-2 h-4 w-64 animate-pulse rounded bg-gray-200"></div>
        </header>

        {/* Posts Count Skeleton */}
        <div className="mb-6">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => index + 1).map((id) => (
            <div
              key={`skeleton-${id}`}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Post meta skeleton */}
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>

              {/* Title skeleton */}
              <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>

              {/* Body skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
