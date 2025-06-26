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

// Configuration
export {
  config,
  features,
  isDevelopment,
  isMaintenanceMode,
  isProduction,
  urls,
} from "./config";
export type { Config, Features } from "./config";

// API Configuration
// export { api } from "./api-client";
// export { createApiClient } from "./api-client";

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
export {};
