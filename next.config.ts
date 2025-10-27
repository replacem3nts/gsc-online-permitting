import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      'node_modules/.prisma/client/**/*',
      'node_modules/@prisma/client/**/*',
      'node_modules/next/dist/compiled/@vercel/og/**/*',
    ],
  },
};

export default nextConfig;
