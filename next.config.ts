import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@vercel/og', '@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      'node_modules/.prisma/client/**/*',
      'node_modules/@prisma/client/**/*',
    ],
  },
};

export default nextConfig;
