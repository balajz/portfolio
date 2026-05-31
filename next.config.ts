import type { NextConfig } from "next";

/**
 * NEXT_TELEMETRY_DISABLED=1
 * Set this environment variable to 1 in your .env file to disable anonymous usage data collection.
 */

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
