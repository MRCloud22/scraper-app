import type { NextConfig } from "next";

const isGithubPages = process.env.NEXT_PUBLIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Use static export only when building for production/IONOS
  output: isGithubPages ? 'export' : undefined,
  // GitHub Pages hosting happens under /repo-name/
  basePath: isGithubPages ? '/scraper-app' : '',
  assetPrefix: isGithubPages ? '/scraper-app/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
