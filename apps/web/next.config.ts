import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; Next compiles them with the app.
  transpilePackages: ["@ledgerly/ui", "@ledgerly/tokens"],
};

export default nextConfig;
