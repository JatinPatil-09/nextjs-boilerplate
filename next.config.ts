import type { NextConfig } from "next";

// Import environment validation at build time
import "./src/env";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;
