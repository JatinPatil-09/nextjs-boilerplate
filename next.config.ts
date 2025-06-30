import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Import environment validation at build time
import "./src/env";

const withNextIntl = createNextIntlPlugin("./src/lib/I18n.ts");

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: true,
  },
};

export default withNextIntl(nextConfig);
