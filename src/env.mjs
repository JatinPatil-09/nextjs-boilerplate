import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        // Database
        DATABASE_URL: z
            .string()
            .url()
            .describe("PostgreSQL database connection URL"),

        // Authentication
        NEXTAUTH_SECRET: z
            .string()
            .min(32)
            .describe("NextAuth.js secret for JWT signing"),
        NEXTAUTH_URL: z
            .string()
            .url()
            .describe("Canonical URL of your site"),

        // External APIs
        API_SECRET_KEY: z
            .string()
            .min(16)
            .describe("Secret key for external API authentication"),

        // Email Configuration
        EMAIL_SERVER_HOST: z
            .string()
            .describe("SMTP server host")
            .optional(),
        EMAIL_SERVER_PORT: z
            .coerce
            .number()
            .int()
            .positive()
            .describe("SMTP server port")
            .optional(),
        EMAIL_SERVER_USER: z
            .string()
            .describe("SMTP server username")
            .optional(),
        EMAIL_SERVER_PASSWORD: z
            .string()
            .describe("SMTP server password")
            .optional(),
        EMAIL_FROM: z
            .string()
            .email()
            .describe("Default email sender address")
            .optional(),

        // External Services
        STRIPE_SECRET_KEY: z
            .string()
            .startsWith("sk_")
            .describe("Stripe secret key for payments")
            .optional(),

        // Logging & Monitoring
        LOGTAIL_SOURCE_TOKEN: z
            .string()
            .describe("Logtail source token for log aggregation")
            .optional(),
        SENTRY_DSN: z
            .string()
            .url()
            .describe("Sentry DSN for error tracking")
            .optional(),

        // Node Environment
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development")
            .describe("Node.js environment"),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // API Configuration
        NEXT_PUBLIC_API_BASE_URL: z
            .string()
            .url()
            .describe("Base URL for API calls"),

        // Application Configuration
        NEXT_PUBLIC_APP_NAME: z
            .string()
            .min(1)
            .default("NextJS Boilerplate")
            .describe("Application name"),
        NEXT_PUBLIC_APP_VERSION: z
            .string()
            .regex(/^\d+\.\d+\.\d+$/)
            .default("1.0.0")
            .describe("Application version (semver format)"),
        NEXT_PUBLIC_APP_ENV: z
            .enum(["development", "staging", "production"])
            .default("development")
            .describe("Application environment"),

        // Analytics & Monitoring
        NEXT_PUBLIC_POSTHOG_KEY: z
            .string()
            .describe("PostHog project API key for analytics")
            .optional(),
        NEXT_PUBLIC_POSTHOG_HOST: z
            .string()
            .url()
            .default("https://app.posthog.com")
            .describe("PostHog instance URL"),
        NEXT_PUBLIC_GA_MEASUREMENT_ID: z
            .string()
            .startsWith("G-")
            .describe("Google Analytics measurement ID")
            .optional(),

        // External Services (Public Keys)
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
            .string()
            .startsWith("pk_")
            .describe("Stripe publishable key for payments")
            .optional(),
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z
            .string()
            .describe("Mapbox access token for maps")
            .optional(),

        // Feature Flags
        NEXT_PUBLIC_ENABLE_ANALYTICS: z
            .string()
            .transform((val) => val === "true")
            .default("false")
            .describe("Enable analytics tracking"),
        NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z
            .string()
            .transform((val) => val === "true")
            .default("false")
            .describe("Enable error reporting to Sentry"),
        NEXT_PUBLIC_MAINTENANCE_MODE: z
            .string()
            .transform((val) => val === "true")
            .default("false")
            .describe("Enable maintenance mode"),

        // CDN & Assets
        NEXT_PUBLIC_CDN_URL: z
            .string()
            .url()
            .describe("CDN URL for static assets")
            .optional(),
        NEXT_PUBLIC_UPLOAD_URL: z
            .string()
            .url()
            .describe("URL for file uploads")
            .optional(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        // Server-side environment variables
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        API_SECRET_KEY: process.env.API_SECRET_KEY,
        EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
        EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
        EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
        SENTRY_DSN: process.env.SENTRY_DSN,
        NODE_ENV: process.env.NODE_ENV,

        // Client-side environment variables
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
        NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
        NEXT_PUBLIC_ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
        NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
        NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
        NEXT_PUBLIC_UPLOAD_URL: process.env.NEXT_PUBLIC_UPLOAD_URL,
    },

    /**
     * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    /**
     * Makes it so that empty strings are treated as undefined.
     * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
}); 