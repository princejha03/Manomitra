import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore specific warnings from face-api.js and node-fetch
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false,
    };

    // Suppress specific warnings
    config.module.exprContextCritical = false;

    return config;
  },
  // Ignore TypeScript errors for now
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
