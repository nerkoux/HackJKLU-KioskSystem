import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Remove appDir as it's now the default in Next.js 15
    serverComponentsExternalPackages: ['mongoose'],
  },
  typescript: {
    // Ensure TypeScript checking is enabled
    // This will prevent production builds from completing if there are type errors
    ignoreBuildErrors: false,
  },
};

export default withPWA(nextConfig);