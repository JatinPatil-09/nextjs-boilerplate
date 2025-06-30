/**
 * Library Barrel Export
 *
 * Export all library functions and configurations from this file for clean imports.
 * Usage: import { api, auth, db, config } from "@/lib"
 *
 * Naming Convention:
 * - Library files: kebab-case (e.g., api-client.ts, auth-config.ts)
 * - Function names: camelCase (e.g., createApiClient, validateAuth)
 */

/**
 * Library Module Exports
 *
 * Central export point for all library utilities.
 * This file provides a clean interface for importing library functions
 * and prevents deep import paths throughout the application.
 *
 * Usage Examples:
 * - Server components: import { getServerConfig, serverUtils } from "@/lib"
 * - Client components: import { clientConfig, clientUtils } from "@/lib"
 * - Error handling: import { errorLogger, logError } from "@/lib"
 */

// Configuration modules (all from single config file)
export {
  clientConfig,
  clientFeatures,
  clientUrls,
  clientUtils,
  features,
  getServerConfig,
  isDevelopment,
  isMaintenanceMode,
  // Legacy exports (deprecated)
  isProduction,
  serverUtils,
  urls,
} from "./config";

// Type exports
export type { ClientConfig, ClientFeatures, Config, Features } from "./config";

// API Configuration
export {
  ApiClient,
  BaseApiFactory,
  PostsService,
  UsersService,
  apiClient,
} from "./api";

// Authentication
// export { auth } from "./auth-config";
// export { validateToken } from "./auth-utils";

// Database
// export { db } from "./database";
// export { createConnection } from "./database";

// Utilities
// export { logger } from "./logger";

// Validation
// export { schemas } from "./validation-schemas";
// export { validateData } from "./validation-utils";

// Note: Uncomment and update exports as library modules are added
