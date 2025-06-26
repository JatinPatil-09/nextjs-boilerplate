/**
 * Centralized Configuration Module
 *
 * This module provides type-safe access to environment variables
 * and application configuration. Import from here instead of
 * accessing process.env directly.
 *
 * Usage: import { config } from "@/lib/config"
 */

import { env } from "@/env.mjs";

/**
 * Application Configuration
 * Type-safe access to all environment variables
 */
export const config = {
  // Application Info
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    environment: env.NEXT_PUBLIC_APP_ENV,
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development",
    isMaintenanceMode: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  },

  // API Configuration
  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    secretKey: env.API_SECRET_KEY, // Server-side only
  },

  // Database Configuration (Server-side only)
  database: {
    url: env.DATABASE_URL,
  },

  // Authentication Configuration
  auth: {
    secret: env.NEXTAUTH_SECRET, // Server-side only
    url: env.NEXTAUTH_URL, // Server-side only
  },

  // Analytics Configuration
  analytics: {
    posthog: {
      key: env.NEXT_PUBLIC_POSTHOG_KEY,
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
      enabled: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    },
    googleAnalytics: {
      measurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
  },

  // Monitoring Configuration
  monitoring: {
    sentry: {
      dsn: env.SENTRY_DSN, // Server-side only
      enabled: env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
    },
    logtail: {
      sourceToken: env.LOGTAIL_SOURCE_TOKEN, // Server-side only
    },
  },

  // Email Configuration (Server-side only)
  email: {
    server: {
      host: env.EMAIL_SERVER_HOST,
      port: env.EMAIL_SERVER_PORT,
      user: env.EMAIL_SERVER_USER,
      password: env.EMAIL_SERVER_PASSWORD,
    },
    from: env.EMAIL_FROM,
  },

  // Payment Configuration
  payments: {
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY, // Server-side only
      publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  },

  // External Services
  services: {
    mapbox: {
      accessToken: env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    },
    cdn: {
      url: env.NEXT_PUBLIC_CDN_URL,
    },
    uploads: {
      url: env.NEXT_PUBLIC_UPLOAD_URL,
    },
  },
} as const;

/**
 * Helper functions for environment checks
 */
export const isProduction = () => config.app.isProduction;
export const isDevelopment = () => config.app.isDevelopment;
export const isMaintenanceMode = () => config.app.isMaintenanceMode;

/**
 * URL Builders
 * Use these instead of hardcoding URLs
 */
export const urls = {
  api: (path: string) =>
    `${config.api.baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
  cdn: (path: string) =>
    config.services.cdn.url
      ? `${config.services.cdn.url}${path.startsWith("/") ? path : `/${path}`}`
      : path,
  upload: (path: string) =>
    config.services.uploads.url
      ? `${config.services.uploads.url}${path.startsWith("/") ? path : `/${path}`}`
      : path,
} as const;

/**
 * Feature Flags
 * Centralized feature flag management
 */
export const features = {
  analytics: config.analytics.posthog.enabled,
  errorReporting: config.monitoring.sentry.enabled,
  payments: Boolean(config.payments.stripe.publishableKey),
  maps: Boolean(config.services.mapbox.accessToken),
  maintenance: config.app.isMaintenanceMode,
} as const;

/**
 * Type exports for use in other modules
 */
export type Config = typeof config;
export type Features = typeof features;
