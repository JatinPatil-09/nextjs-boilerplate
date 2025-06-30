/**
 * Centralized Configuration Module
 *
 * This module provides type-safe access to environment variables
 * and application configuration. Import from here instead of
 * accessing process.env directly.
 *
 * Usage:
 * - Server components: import { getServerConfig, serverUtils } from "@/lib/config"
 * - Client components: import { clientConfig, clientUtils } from "@/lib/config"
 */

import { env } from "@/env";

/**
 * Client-Side Configuration
 * Only contains environment variables that are safe to access on the client
 * Use this in client components
 */
export const clientConfig = {
  // Application Info (client-safe)
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    environment: env.NEXT_PUBLIC_APP_ENV,
    isMaintenanceMode: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  },

  // API Configuration (client-safe)
  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    jsonPlaceholder: {
      baseUrl: env.NEXT_PUBLIC_JSONPLACEHOLDER_API_URL,
    },
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

  // Monitoring Configuration (client-safe)
  monitoring: {
    sentry: {
      enabled: env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
    },
  },

  // Payment Configuration (client-safe)
  payments: {
    stripe: {
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
 * Server-Side Configuration (Lazy-loaded)
 * Contains both server-side and client-side environment variables
 * Only use this in server components or API routes
 * Lazy evaluation prevents server env vars from being accessed on client
 */
export const getServerConfig = () => {
  return {
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
      jsonPlaceholder: {
        baseUrl: env.NEXT_PUBLIC_JSONPLACEHOLDER_API_URL,
      },
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
};

/**
 * Legacy config export (for backward compatibility)
 * @deprecated Use getServerConfig() instead to avoid client-side environment variable issues
 * NOTE: This is commented out to prevent server env vars from being accessed on the client
 * Uncomment only if you're sure it's only used in server components
 */
// export const config = getServerConfig();

/**
 * Server-Side Helper Functions
 * These access server-side environment variables - use only in server components
 */
export const serverUtils = {
  isProduction: () => getServerConfig().app.isProduction,
  isDevelopment: () => getServerConfig().app.isDevelopment,
  isMaintenanceMode: () => getServerConfig().app.isMaintenanceMode,
  getAppName: () => getServerConfig().app.name,
  getAppVersion: () => getServerConfig().app.version,
} as const;

/**
 * Client-Side Helper Functions
 * These only use client-side environment variables - safe for client components
 */
export const clientUtils = {
  isProduction: () => env.NEXT_PUBLIC_APP_ENV === "production",
  isDevelopment: () => env.NEXT_PUBLIC_APP_ENV === "development",
  isMaintenanceMode: () => clientConfig.app.isMaintenanceMode,
  getAppName: () => clientConfig.app.name,
  getAppVersion: () => clientConfig.app.version,
} as const;

/**
 * Server-Side URL Builders
 * Use these in server components
 */
export const urls = {
  api: (path: string) => {
    const config = getServerConfig();
    return `${config.api.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  },
  jsonPlaceholder: (path: string) => {
    const config = getServerConfig();
    return `${config.api.jsonPlaceholder.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  },
  cdn: (path: string) => {
    const config = getServerConfig();
    return config.services.cdn.url
      ? `${config.services.cdn.url}${path.startsWith("/") ? path : `/${path}`}`
      : path;
  },
  upload: (path: string) => {
    const config = getServerConfig();
    return config.services.uploads.url
      ? `${config.services.uploads.url}${path.startsWith("/") ? path : `/${path}`}`
      : path;
  },
} as const;

/**
 * Client-Side URL Builders
 * Use these in client components
 */
export const clientUrls = {
  api: (path: string) =>
    `${clientConfig.api.baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
  jsonPlaceholder: (path: string) =>
    `${clientConfig.api.jsonPlaceholder.baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
  cdn: (path: string) =>
    clientConfig.services.cdn.url
      ? `${clientConfig.services.cdn.url}${path.startsWith("/") ? path : `/${path}`}`
      : path,
  upload: (path: string) =>
    clientConfig.services.uploads.url
      ? `${clientConfig.services.uploads.url}${path.startsWith("/") ? path : `/${path}`}`
      : path,
} as const;

/**
 * Server-Side Feature Flags
 * Use these in server components
 */
export const features = {
  get analytics() {
    return getServerConfig().analytics.posthog.enabled;
  },
  get payments() {
    return Boolean(getServerConfig().payments.stripe.publishableKey);
  },
  get maps() {
    return Boolean(getServerConfig().services.mapbox.accessToken);
  },
  get maintenance() {
    return getServerConfig().app.isMaintenanceMode;
  },
} as const;

/**
 * Client-Side Feature Flags
 * Use these in client components
 */
export const clientFeatures = {
  analytics: clientConfig.analytics.posthog.enabled,
  payments: Boolean(clientConfig.payments.stripe.publishableKey),
  maps: Boolean(clientConfig.services.mapbox.accessToken),
  maintenance: clientConfig.app.isMaintenanceMode,
} as const;

/**
 * Legacy Helper Functions (Deprecated - use serverUtils instead)
 * @deprecated Use serverUtils.isProduction() instead
 */
export const isProduction = () => getServerConfig().app.isProduction;
/** @deprecated Use serverUtils.isDevelopment() instead */
export const isDevelopment = () => getServerConfig().app.isDevelopment;
/** @deprecated Use serverUtils.isMaintenanceMode() instead */
export const isMaintenanceMode = () => getServerConfig().app.isMaintenanceMode;

/**
 * Type exports for use in other modules
 */
export type Config = ReturnType<typeof getServerConfig>;
export type ClientConfig = typeof clientConfig;
export type Features = typeof features;
export type ClientFeatures = typeof clientFeatures;
