"use client";

import { usePostHog } from "posthog-js/react";
import { useCallback, useMemo } from "react";

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
 *
 * @returns Analytics operations and status
 *
 * @example
 * ```tsx
 * const { track, identify, isEnabled } = useAnalytics();
 *
 * // Track an event
 * track('button_clicked', { button_name: 'cta', page: 'home' });
 *
 * // Identify a user
 * identify('user-123', { email: 'user@example.com', plan: 'premium' });
 * ```
 */
export function useAnalytics(): UseAnalyticsReturn {
  const posthog = usePostHog();

  /**
   * Track Custom Events
   * Captures custom events with optional properties
   */
  const track = useCallback(
    (eventName: string, properties?: AnalyticsEventProperties): void => {
      if (posthog) {
        posthog.capture(eventName, properties);
      }
    },
    [posthog]
  );

  /**
   * Identify Users
   * Associates events with a specific user ID and properties
   */
  const identify = useCallback(
    (userId: string, properties?: AnalyticsUserProperties): void => {
      if (posthog) {
        posthog.identify(userId, properties);
      }
    },
    [posthog]
  );

  /**
   * Reset User Session
   * Clears the current user identification and starts a new session
   */
  const reset = useCallback((): void => {
    if (posthog) {
      posthog.reset();
    }
  }, [posthog]);

  /**
   * Set User Properties
   * Updates properties for the current user
   */
  const setUserProperties = useCallback(
    (properties: AnalyticsUserProperties): void => {
      if (posthog) {
        posthog.setPersonProperties(properties);
      }
    },
    [posthog]
  );

  /**
   * Analytics Status
   * Indicates whether analytics is available and enabled
   */
  const isEnabled = useMemo((): boolean => Boolean(posthog), [posthog]);

  return {
    track,
    identify,
    reset,
    setUserProperties,
    isEnabled,
  };
}
