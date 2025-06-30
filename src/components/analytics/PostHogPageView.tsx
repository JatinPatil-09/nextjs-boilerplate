"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

/**
 * PostHog Page View Tracker
 *
 * Tracks page views automatically when routes change.
 * Features:
 * - Tracks pathname changes
 * - Includes query parameters in tracking
 * - Builds complete URL for accurate analytics
 * - Optimized with useEffect dependencies
 */
function PostHogPageView(): React.JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    // Only track if PostHog is available and pathname exists
    if (pathname && posthog) {
      let url = window.origin + pathname;

      // Include query parameters if they exist
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }

      // Track the pageview with PostHog
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, posthog]);

  // This component doesn't render anything
  return null;
}

/**
 * Suspended PostHog Page View Tracker
 *
 * Wraps the PostHogPageView component in a Suspense boundary
 * to prevent blocking during SSR and improve performance.
 */
export function SuspendedPostHogPageView(): React.JSX.Element {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
