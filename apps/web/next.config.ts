import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile TypeScript sources from workspace packages.
  // Without this, Next.js would expect compiled JS in node_modules.
  transpilePackages: ['@template/ui', '@template/shared'],
};

export default nextConfig;
