/**
 * TypeScript declarations for environment configuration
 */

declare module "@/env.mjs" {
  export const env: {
    // Server-side environment variables
    readonly DATABASE_URL: string;
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_URL: string;
    readonly API_SECRET_KEY: string;
    readonly EMAIL_SERVER_HOST?: string;
    readonly EMAIL_SERVER_PORT?: number;
    readonly EMAIL_SERVER_USER?: string;
    readonly EMAIL_SERVER_PASSWORD?: string;
    readonly EMAIL_FROM?: string;
    readonly STRIPE_SECRET_KEY?: string;
    readonly LOGTAIL_SOURCE_TOKEN?: string;
    readonly SENTRY_DSN?: string;
    readonly NODE_ENV: "development" | "test" | "production";

    // Client-side environment variables
    readonly NEXT_PUBLIC_API_BASE_URL: string;
    readonly NEXT_PUBLIC_APP_NAME: string;
    readonly NEXT_PUBLIC_APP_VERSION: string;
    readonly NEXT_PUBLIC_APP_ENV: "development" | "staging" | "production";
    readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
    readonly NEXT_PUBLIC_POSTHOG_HOST: string;
    readonly NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
    readonly NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    readonly NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?: string;
    readonly NEXT_PUBLIC_ENABLE_ANALYTICS: boolean;
    readonly NEXT_PUBLIC_ENABLE_ERROR_REPORTING: boolean;
    readonly NEXT_PUBLIC_MAINTENANCE_MODE: boolean;
    readonly NEXT_PUBLIC_CDN_URL?: string;
    readonly NEXT_PUBLIC_UPLOAD_URL?: string;
  };
}
