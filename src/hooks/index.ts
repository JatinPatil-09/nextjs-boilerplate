/**
 * Hooks Barrel Export
 *
 * Export all custom React hooks from this file for clean imports.
 * Usage: import { useAuth, useLocalStorage, useDebounce } from "@/hooks"
 *
 * Naming Convention:
 * - Hook files: kebab-case (e.g., use-auth.ts, use-local-storage.ts)
 * - Hook names: camelCase starting with "use" (e.g., useAuth, useLocalStorage)
 */

// Authentication Hooks
// export { useAuth } from "./use-auth";
// export { usePermissions } from "./use-permissions";

// Storage Hooks
// export { useLocalStorage } from "./use-local-storage";
// export { useSessionStorage } from "./use-session-storage";

// API Hooks
// export { useApi } from "./use-api";
// export { useMutation } from "./use-mutation";

// UI Hooks
// export { useToggle } from "./use-toggle";
// export { useModal } from "./use-modal";
// export { useForm } from "./use-form";

// Performance Hooks
// export { useDebounce } from "./use-debounce";
// export { useThrottle } from "./use-throttle";
// export { useMemoized } from "./use-memoized";

// Browser Hooks
// export { useMediaQuery } from "./use-media-query";
// export { useOnlineStatus } from "./use-online-status";
// export { useGeolocation } from "./use-geolocation";

// Analytics Hooks
export { useAnalytics } from "./use-analytics";
export type {
  AnalyticsEventProperties,
  AnalyticsUserProperties,
  UseAnalyticsReturn,
} from "./use-analytics";

// Note: Uncomment and update exports as custom hooks are added
