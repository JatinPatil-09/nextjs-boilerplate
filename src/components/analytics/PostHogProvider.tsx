"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

import { clientConfig } from "@/lib/config";

import { SuspendedPostHogPageView } from "./PostHogPageView";

/**
 * PostHog Provider Component Props
 */
interface PostHogProviderProps {
  readonly children: React.ReactNode;
}

/**
 * PostHog Analytics Provider
 *
 * Initializes PostHog analytics client and provides context to child components.
 * Uses centralized configuration system for better maintainability.
 * Features:
 * - Conditional initialization based on configuration
 * - Graceful degradation when PostHog is not configured
 * - Manual pageview control for custom tracking logic
 * - Automatic page leave tracking
 *
 * Configuration Required:
 * - clientConfig.analytics.posthog.key: PostHog project API key
 * - clientConfig.analytics.posthog.host: PostHog instance URL
 * - clientConfig.analytics.posthog.enabled: Feature flag to enable/disable analytics
 */
export function PostHogProvider({
  children,
}: PostHogProviderProps): React.JSX.Element {
  useEffect(() => {
    // Only initialize if PostHog key is provided and analytics is enabled
    if (
      clientConfig.analytics.posthog.key &&
      clientConfig.analytics.posthog.enabled
    ) {
      posthog.init(clientConfig.analytics.posthog.key, {
        api_host: clientConfig.analytics.posthog.host,
        capture_pageview: false, // Manual pageview control
        capture_pageleave: true, // Track when users leave pages
        disable_session_recording: false, // Enable session recordings
        enable_recording_console_log: false, // Disable console log recording
      });
    }
  }, []);

  // Return children without provider if PostHog is not configured
  if (
    !clientConfig.analytics.posthog.key ||
    !clientConfig.analytics.posthog.enabled
  ) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}
