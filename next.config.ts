import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@vercel/og', '@prisma/client', 'prisma'],
};

export default nextConfig;
