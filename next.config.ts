import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use static export only when building for production/IONOS
  output: process.env.NEXT_PUBLIC_EXPORT === 'true' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
