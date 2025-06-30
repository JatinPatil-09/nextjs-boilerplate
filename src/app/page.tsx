import { redirect } from "next/navigation";

/**
 * Root Page Component
 *
 * This page is handled by middleware which will automatically redirect
 * to the appropriate locale-specific page based on user preferences.
 */
export default function RootPage(): never {
  // The middleware handles locale detection and routing
  // If we reach here, redirect to English as fallback
  redirect("/en");
}
