"use client";

import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { clientConfig } from "@/lib/config";

/**
 * Analytics Event Properties
 * Type definition for event properties that can be sent with analytics events
 */
export interface AnalyticsEventProperties {
  readonly [key: string]: string | number | boolean | null | undefined;
}

/**
 * User Properties
 * Type definition for user properties that can be set for identification
 */
export interface AnalyticsUserProperties {
  readonly [key: string]: string | number | boolean | null | undefined;
}

/**
 * Analytics Hook Return Type
 * Defines the interface for the analytics hook
 */
export interface UseAnalyticsReturn {
  readonly track: (
    eventName: string,
    properties?: AnalyticsEventProperties
  ) => void;
  readonly identify: (
    userId: string,
    properties?: AnalyticsUserProperties
  ) => void;
  readonly reset: () => void;
  readonly setUserProperties: (properties: AnalyticsUserProperties) => void;
  readonly isEnabled: boolean;
  readonly isReady: boolean;
}

/**
 * Custom Analytics Hook
 *
 * Provides a clean, type-safe interface for PostHog analytics operations.
 * Features:
 * - Type-safe event and user properties
 * - Null safety checks for PostHog client
 * - Memoized callback functions for performance
 * - Status indicator for analytics availability
 * - Client-side only execution to prevent hydration issues
 * - Respects the NEXT_PUBLIC_ENABLE_ANALYTICS environment variable
 *
 * @returns Analytics operations and status
 *
 * @example
 * ```tsx
 * const { track, identify, isEnabled, isReady } = useAnalytics();
 *
 * // Check if analytics is ready before using
 * if (isReady && isEnabled) {
 *   // Track an event
 *   track('button_clicked', { button_name: 'cta', page: 'home' });
 *
 *   // Identify a user
 *   identify('user-123', { email: 'user@example.com', plan: 'premium' });
 * }
 * ```
 */
export function useAnalytics(): UseAnalyticsReturn {
  const posthog = usePostHog();
  const [isClient, setIsClient] = useState(false);

  // Mark as client-side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if analytics is enabled from configuration (only on client)
  const analyticsEnabled = isClient && clientConfig.analytics.posthog.enabled;
  const hasValidKey = isClient && Boolean(clientConfig.analytics.posthog.key);

  /**
   * Track Custom Events
   * Captures custom events with optional properties
   */
  const track = useCallback(
    (eventName: string, properties?: AnalyticsEventProperties): void => {
      if (posthog && analyticsEnabled && hasValidKey) {
        posthog.capture(eventName, properties);
      }
    },
    [posthog, analyticsEnabled, hasValidKey]
  );

  /**
   * Identify Users
   * Associates events with a specific user ID and properties
   */
  const identify = useCallback(
    (userId: string, properties?: AnalyticsUserProperties): void => {
      if (posthog && analyticsEnabled && hasValidKey) {
        posthog.identify(userId, properties);
      }
    },
    [posthog, analyticsEnabled, hasValidKey]
  );

  /**
   * Reset User Session
   * Clears the current user identification and starts a new session
   */
  const reset = useCallback((): void => {
    if (posthog && analyticsEnabled && hasValidKey) {
      posthog.reset();
    }
  }, [posthog, analyticsEnabled, hasValidKey]);

  /**
   * Set User Properties
   * Updates properties for the current user
   */
  const setUserProperties = useCallback(
    (properties: AnalyticsUserProperties): void => {
      if (posthog && analyticsEnabled && hasValidKey) {
        posthog.setPersonProperties(properties);
      }
    },
    [posthog, analyticsEnabled, hasValidKey]
  );

  /**
   * Analytics Status
   * Indicates whether analytics is available and enabled
   */
  const isEnabled = useMemo(
    (): boolean => Boolean(posthog) && analyticsEnabled && hasValidKey,
    [posthog, analyticsEnabled, hasValidKey]
  );

  /**
   * Ready Status
   * Indicates whether the hook has completed client-side initialization
   */
  const isReady = useMemo((): boolean => isClient, [isClient]);

  return {
    track,
    identify,
    reset,
    setUserProperties,
    isEnabled,
    isReady,
  };
}
