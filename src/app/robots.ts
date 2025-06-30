import type { MetadataRoute } from "next";

import { getServerConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const config = getServerConfig();
  const baseUrl = config.auth.url || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dev-tools", "/_next/", "/analytics-test"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
